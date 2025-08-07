import { auth } from '@/lib/firebase'

export async function POST(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Verify the token with Firebase
    try {
      await auth.verifyIdToken(token)
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Call the external API to delete user data
    const response = await fetch('https://upload-file-194429268019.northamerica-northeast2.run.app/user/delete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Delete API error:', errorData)
      return new Response(JSON.stringify({ 
        error: 'Failed to delete user data',
        details: errorData.error || 'Unknown error'
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = await response.json()
    
    return new Response(JSON.stringify({
      success: true,
      message: 'User data deleted successfully',
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Delete error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 