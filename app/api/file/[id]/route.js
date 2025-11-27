export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { id } = await params
    const fileId = id
    if (!fileId) {
      return new Response(JSON.stringify({ error: 'File ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Forward the request to the external API
    const response = await fetch(`https://northstar-backend-194429268019.us-central1.run.app/file/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('External API error:', errorData)
      return new Response(JSON.stringify({ 
        error: `Failed to delete file: ${response.status} ${response.statusText}`,
        details: errorData 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const result = await response.json()
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('File deletion error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}