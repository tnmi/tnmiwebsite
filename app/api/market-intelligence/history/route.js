// Proxy for Market Intelligence History API - Forwards to secure backend wrapper

// Market Intelligence uses a different backend than Market Research
const MARKET_INTELLIGENCE_API_URL = process.env.MARKET_INTELLIGENCE_API_URL || 'https://market-intelligence-agent-194429268019.us-central1.run.app';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(request) {
  try {
    // 1. Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Security] Unauthorized request to market-intelligence/history');
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

    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    const limit = searchParams.get('limit') || '10';

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

    // 3. Forward to secure backend wrapper
    // Note: This endpoint uses query params but market-intelligence-agent may not support it
    const backendUrl = `${MARKET_INTELLIGENCE_API_URL}/api/v1/history?product_id=${encodeURIComponent(product_id)}&limit=${encodeURIComponent(limit)}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader, // Forward the auth token
      },
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
    console.error('[API Error] Market Intelligence history proxy error:', {
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


