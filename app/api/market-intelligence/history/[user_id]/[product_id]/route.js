export async function GET(request, { params }) {
  try {
    const { user_id, product_id } = params;

    const response = await fetch(
      `https://market-intelligence-agent-194429268019.us-central1.run.app/api/v1/history/${user_id}/${product_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

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

