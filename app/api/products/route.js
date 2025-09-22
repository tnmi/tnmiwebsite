export async function GET(request) {
  try {
    // Get the authorization header from the original request
    const authHeader = request.headers.get('authorization')
    console.log('Products API - Auth header present:', !!authHeader)
    
    if (!authHeader) {
      console.log('Products API - No authorization header')
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // Forward the request to the external endpoint
    console.log('Products API - Forwarding to external API...')
    const response = await fetch('https://northstar-backend-194429268019.us-central1.run.app/products', {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    })
    
    console.log('Products API - External response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('External API error:', response.status, errorText)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch products'
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const products = await response.json()
    console.log('Products API - Products count:', Array.isArray(products) ? products.length : 'not array')

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