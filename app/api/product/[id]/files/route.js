export async function GET(request, { params }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    
    // Backend paths have historically varied between /product/:id and /products/:id.
    // We try /product first, and fall back to /products only if we get a 404.
    const backendBase = 'https://northstar-backend-194429268019.us-central1.run.app'
    const primaryUrl = `${backendBase}/product/${id}/files`
    const fallbackUrl = `${backendBase}/products/${id}/files`

    let response = await fetch(primaryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 404) {
      response = await fetch(fallbackUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    }
    
    if (!response.ok) {
      console.error('Backend files fetch error:', response.status)
      return new Response(JSON.stringify({ error: 'Failed to fetch product files' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const data = await response.json()
    
    // Auth-scoped data: never allow intermediates/browsers to reuse across sessions/users.
    const responseHeaders = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Vary': 'Authorization',
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Error fetching product files:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
