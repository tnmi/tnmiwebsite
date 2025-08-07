import { auth } from '@/lib/firebase'
import { getIdToken } from 'firebase/auth'

export async function GET(request) {
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

    // Call the external API to export user data
    const response = await fetch('https://upload-file-194429268019.northamerica-northeast2.run.app/user/export', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Export API error:', errorData)
      return new Response(JSON.stringify({ 
        error: 'Failed to export user data',
        details: errorData.error || 'Unknown error'
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get the zip file as a blob
    const zipBlob = await response.blob()
    
    // Return the zip file with proper headers
    return new Response(zipBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="user-data-export.zip"',
        'Content-Length': zipBlob.size.toString(),
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 