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
    
    // Call the new backend endpoint for files only
    const response = await fetch(`https://northstar-backend-194429268019.us-central1.run.app/product/${id}/files`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Backend files fetch error:', response.status)
      return new Response(JSON.stringify({ error: 'Failed to fetch product files' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const data = await response.json()
    
    // Forward cache headers from backend if present
    const cacheControl = response.headers.get('cache-control')
    const responseHeaders = {
      'Content-Type': 'application/json',
    }
    if (cacheControl) {
      responseHeaders['Cache-Control'] = cacheControl
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
