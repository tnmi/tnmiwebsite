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
    
    // Extract pagination parameters from the request URL
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    
    // Build the backend URL with pagination params
    const backendUrl = new URL('https://northstar-backend-194429268019.us-central1.run.app/products')
    if (limit) backendUrl.searchParams.append('limit', limit)
    if (offset) backendUrl.searchParams.append('offset', offset)
    
    // Forward the request to the external endpoint
    const response = await fetch(backendUrl.toString(), {
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

    // Forward cache headers from backend if present
    const cacheControl = response.headers.get('cache-control')
    const responseHeaders = {
      'Content-Type': 'application/json',
    }
    if (cacheControl) {
      responseHeaders['Cache-Control'] = cacheControl
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: responseHeaders,
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