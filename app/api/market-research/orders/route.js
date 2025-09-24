export async function GET(request) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get auth token from headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Make request to agent service
    const agentResponse = await fetch(`https://market-finder-agent-194429268019.us-central1.run.app/user/${userId}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text()
      console.error('Agent API error:', agentResponse.status, errorText)
      return new Response(JSON.stringify({ error: `Agent API error: ${agentResponse.status}` }), {
        status: agentResponse.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await agentResponse.json()
    
    // Transform the response to match expected format
    const transformedData = {
      data: {
        items: data.orders || []
      }
    }

    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
