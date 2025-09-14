export async function GET(request) {
  try {
    // Get the authorization header from the original request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // Forward the request to the external endpoint
    const response = await fetch('https://northstar-backend-194429268019.us-central1.run.app/products', {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    })
    
    
    if (!response.ok) {
      console.error('External API error:', response.status)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch products'
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const products = await response.json()

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Proxy products fetch error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 