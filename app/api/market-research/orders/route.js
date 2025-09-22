export async function POST(request) {
  try {
    const body = await request.json();
    
    // The frontend should pass user_id in the body which we extract for the X-User-ID header
    // But the backend doesn't want user_id in the request body itself
    const userId = body.user_id || 'unknown';
    
    // Remove user_id from body since backend extracts it from X-User-ID header
    const { user_id, ...requestBody } = body;
    
    const response = await fetch(`https://market-research-api-26pkzuizfq-uc.a.run.app/api/v1/orders`, {
      method: 'POST',
      headers: {
        'X-User-ID': userId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
