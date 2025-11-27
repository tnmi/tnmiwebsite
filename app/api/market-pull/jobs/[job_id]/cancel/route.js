// Proxy for Market Pull API - Cancel Job

export async function POST(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const jobId = await params.job_id;
    
    if (!userId || !jobId) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id or job_id' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch(
      `https://market-pull-agent-194429268019.us-central1.run.app/api/jobs/${jobId}/cancel?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cancel job API error:', response.status, errorText);
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Cancel job proxy error:', error);
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


