export async function GET(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Call the external API to export user data
    const response = await fetch('https://northstar-backend-194429268019.us-central1.run.app/user/export', {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    })

    if (!response.ok) {
      console.log('DEBUG - External API response not OK:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      let errorData
      try {
        errorData = await response.json()
        console.log('DEBUG - External API error data (JSON):', errorData)
      } catch (jsonError) {
        console.log('DEBUG - External API response not JSON, trying text:', jsonError)
        const textData = await response.text()
        console.log('DEBUG - External API raw text response:', textData)
        errorData = { error: textData }
      }
      
      console.log('DEBUG - Returning error response:', {
        error: 'Failed to export user data',
        details: errorData.error || 'Unknown error',
        originalStatus: response.status,
        originalData: errorData
      })
      
      return new Response(JSON.stringify({ 
        error: 'Failed to export user data',
        details: errorData.error || 'Unknown error',
        originalStatus: response.status,
        originalData: errorData
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log('DEBUG - External API success response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    // Get the zip file as a blob
    const zipBlob = await response.blob()
    console.log('DEBUG - Blob created successfully, size:', zipBlob.size, 'bytes')
    
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