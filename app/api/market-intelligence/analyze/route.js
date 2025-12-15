// Proxy for Market Intelligence API - Forwards to secure backend wrapper

// Market Intelligence backend URL
const MARKET_INTELLIGENCE_API_URL = process.env.MARKET_INTELLIGENCE_API_URL || 'https://northstar-backend-194429268019.us-central1.run.app';

// Configure max duration for long-running requests (market intelligence takes 60+ seconds)
// This is required for Vercel serverless functions
export const maxDuration = 120; // 2 minutes timeout
export const runtime = 'nodejs';

// Helper function to validate request body
function validateAnalyzeRequest(body) {
  const { product_id, session_id } = body;
  
  // Validate required fields
  if (!product_id || typeof product_id !== 'string' || product_id.trim() === '') {
    return { valid: false, error: 'product_id is required and must be a non-empty string' };
  }
  
  // session_id is optional but if provided, must be a string
  if (session_id !== undefined && typeof session_id !== 'string') {
    return { valid: false, error: 'session_id must be a string if provided' };
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
      console.warn('[Security] Unauthorized request to market-intelligence/analyze');
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
    
    // 2. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[Security] Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid request body', error_id: 'INVALID_JSON' }),
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
    const validation = validateAnalyzeRequest(body);
    if (!validation.valid) {
      console.warn('[Security] Invalid request parameters:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error, error_id: 'VALIDATION_FAILED' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }
    
    // 4. Forward to backend. Do NOT validate/decode tokens here; backend handles auth.
    // Use AbortController with 90 second timeout (market intelligence takes ~60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout
    
    let response;
    try {
      response = await fetch(
        `${MARKET_INTELLIGENCE_API_URL}/api/market-intelligence/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader, // Forward the auth token
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      // Log detailed error server-side only
      const errorText = await response.text();
      console.error('[API Error] Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 200), // Log first 200 chars only
      });
      
      // Try to parse error response
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Failed to process analysis request' };
      }
      
      // Return error to client
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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    // Log detailed error server-side only
    console.error('[API Error] Market Intelligence proxy error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(
        JSON.stringify({ 
          error: 'Request timed out. Market intelligence analysis may take up to 90 seconds.',
          error_id: 'TIMEOUT_ERROR',
        }),
        { 
          status: 504,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
          },
        }
      );
    }
    
    // Return generic error to client
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
