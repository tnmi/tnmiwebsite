// Market Intelligence backend URL
const MARKET_INTELLIGENCE_API_URL = process.env.MARKET_INTELLIGENCE_API_URL || 'https://northstar-backend-194429268019.us-central1.run.app';

export async function GET(request, { params }) {
  try {
    const { user_id, product_id } = await params;

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization required', error_id: 'AUTH_MISSING' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Backend does not expose a path-param history endpoint; use history/query instead.
    const response = await fetch(`${MARKET_INTELLIGENCE_API_URL}/api/market-intelligence/history/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ user_id, product_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Market Intelligence History API error:', response.status, errorText);
      return new Response(
        JSON.stringify({
          error: `API error: ${response.status}`,
          details: errorText
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Market Intelligence history proxy error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

