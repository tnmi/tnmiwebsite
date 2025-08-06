export async function POST(request) {
  try {
    const { token } = await request.json()
    console.log('JWT Token:', token)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error logging token:', error)
    return new Response(JSON.stringify({ error: 'Failed to log token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 