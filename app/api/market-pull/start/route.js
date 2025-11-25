// Proxy for Market Pull API - Start Job

// Helper function to validate request body
function validateMarketPullRequest(body) {
  const { user_id, product_id, segment_name, product_data, market_data } = body;
  
  // Validate required fields
  if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
    return { valid: false, error: 'user_id is required and must be a non-empty string' };
  }
  
  if (!product_id || typeof product_id !== 'string' || product_id.trim() === '') {
    return { valid: false, error: 'product_id is required and must be a non-empty string' };
  }
  
  if (!segment_name || typeof segment_name !== 'string' || segment_name.trim() === '') {
    return { valid: false, error: 'segment_name is required and must be a non-empty string' };
  }
  
  // Validate nested objects
  if (!product_data || typeof product_data !== 'object') {
    return { valid: false, error: 'product_data is required and must be an object' };
  }
  
  if (!product_data.product_name || typeof product_data.product_name !== 'string') {
    return { valid: false, error: 'product_data.product_name is required and must be a string' };
  }
  
  if (!market_data || typeof market_data !== 'object') {
    return { valid: false, error: 'market_data is required and must be an object' };
  }
  
  return { valid: true };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(request) {
  try {
    // 1. Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Security] Unauthorized request to market-pull/start');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Note: For production, verify the Firebase token here using Firebase Admin SDK
    // const decodedToken = await admin.auth().verifyIdToken(token);
    
    // 2. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[Security] Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }
    
    // 3. Validate request body parameters
    const validation = validateMarketPullRequest(body);
    if (!validation.valid) {
      console.warn('[Security] Invalid request parameters:', validation.error);
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }
    
    // 4. Call the external Market Pull API
    const response = await fetch(
      'https://market-pull-agent-194429268019.us-central1.run.app/api/market-pull/async',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      // Log detailed error server-side only
      const errorText = await response.text();
      console.error('[API Error] Market Pull API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 200), // Log first 200 chars only
      });
      
      // Return generic error to client
      return new Response(
        JSON.stringify({ 
          error: 'Failed to start market pull job',
          status: response.status
        }),
        { 
          status: response.status >= 500 ? 502 : response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    // Log detailed error server-side only
    console.error('[API Error] Market Pull start proxy error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return generic error to client
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        },
      }
    );
  }
}

