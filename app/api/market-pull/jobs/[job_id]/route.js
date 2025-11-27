// Proxy for Market Pull API - Get Job Status

export async function GET(request, { params }) {
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
      `https://market-pull-agent-194429268019.us-central1.run.app/api/jobs/${jobId}?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Job status API error:', response.status, errorText);
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
    console.error('Job status proxy error:', error);
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


