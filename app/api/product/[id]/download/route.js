export async function GET(request, { params }) {
  try {
    const { id } = await params // Get the product ID from params
    
    // Validate authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    console.log('Download request for product ID:', id)

    // Forward the download request to the external API
    const response = await fetch(`https://upload-file-194429268019.northamerica-northeast2.run.app/product/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Download failed:', response.status, errorText)
      return new Response(JSON.stringify({ 
        error: `Failed to download files: ${response.status} ${response.statusText}`,
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get the content type from the external response
    const contentType = response.headers.get('content-type') || 'application/zip'
    const contentDisposition = response.headers.get('content-disposition') || 'attachment; filename="product-files.zip"'
    
    console.log('Download successful, streaming file...')

    // Stream the zip file response back to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to download files',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}