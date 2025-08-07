export async function GET(request, { params }) {
  try {
    const { id } = await params // Get the file ID from params
    
    // Validate authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    console.log('Single file download request for file ID:', id)

    // Forward the download request to the external API
    const response = await fetch(`https://upload-file-194429268019.northamerica-northeast2.run.app/file/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('File download failed:', response.status, errorText)
      return new Response(JSON.stringify({ 
        error: `Failed to download file: ${response.status} ${response.statusText}`,
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get the content headers from the external response
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition') || 'attachment'
    const contentLength = response.headers.get('content-length')
    
    console.log('File download successful, streaming file...')

    // Prepare response headers
    const responseHeaders = {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
      'Cache-Control': 'no-cache',
    }

    // Add content length if available
    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength
    }

    // Stream the file response back to the client
    return new Response(response.body, {
      status: 200,
      headers: responseHeaders,
    })
    
  } catch (error) {
    console.error('File download error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to download file',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}