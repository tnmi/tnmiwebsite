// Secure POST endpoint for Market Intelligence History API
// Replaces GET endpoint to prevent IDs from appearing in URLs/logs

// Market Intelligence backend URL
const MARKET_INTELLIGENCE_API_URL = process.env.MARKET_INTELLIGENCE_API_URL || 'https://northstar-backend-194429268019.us-central1.run.app';

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
      console.warn('[Security] Unauthorized request to market-intelligence/history/query');
      return new Response(
        JSON.stringify({ error: 'Authorization required', error_id: 'AUTH_MISSING' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }

    // 2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', error_id: 'INVALID_JSON' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }

    const { product_id, user_id, limit = 10, production = false } = body;

    if (!product_id) {
      return new Response(
        JSON.stringify({ error: 'product_id is required', error_id: 'MISSING_PRODUCT_ID' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }

    // 3. Forward to backend (this backend exposes history via POST /api/market-intelligence/history/query)
    const response = await fetch(`${MARKET_INTELLIGENCE_API_URL}/api/market-intelligence/history/query`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader, // Forward the auth token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id, user_id, limit, production }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Error] Backend history API error:', {
        status: response.status,
        body: errorText.substring(0, 200),
      });
      
      // Try to parse error response
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Failed to fetch history' };
      }
      
      return new Response(
        JSON.stringify(errorData),
        {
          status: response.status,
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
      },
    });

  } catch (error) {
    console.error('[API Error] Market Intelligence history query proxy error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        error_id: 'PROXY_ERROR',
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
