export async function POST(request) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Get request body
    const body = await request.json()
    const { user_id, product_id } = body

    if (!user_id || !product_id) {
      return new Response(JSON.stringify({ error: 'user_id and product_id are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log('Proxying invoke request:', { user_id, product_id })

    // Make request to agent service
    const agentResponse = await fetch(`https://market-finder-agent-194429268019.us-central1.run.app/invoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        product_id
      })
    })

    console.log('Agent invoke response status:', agentResponse.status)

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text()
      console.error('Agent invoke API error:', agentResponse.status, errorText)
      return new Response(JSON.stringify({ error: `Agent API error: ${agentResponse.status}`, details: errorText }), {
        status: agentResponse.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await agentResponse.json()
    console.log('Agent invoke response data:', data)

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Invoke proxy error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
