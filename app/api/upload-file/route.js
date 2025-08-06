export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const product_name = formData.get('product_name')
    const description = formData.get('description') // Get description from form data
    
    // Validate required fields
    if (!file || !product_name) {
      return new Response(JSON.stringify({ error: 'File and product_name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    
    // Create new FormData for external API
    const externalFormData = new FormData()
    externalFormData.append('file', file)
    externalFormData.append('product_name', product_name)
    if (description) {
      externalFormData.append('description', description) // Add description if provided
    }
    
    // Forward to external endpoint
    const response = await fetch('https://upload-file-194429268019.northamerica-northeast2.run.app/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: externalFormData
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('External API error:', response.status, errorText)
      return new Response(JSON.stringify({ 
        error: `Upload failed: ${response.status} ${response.statusText}`,
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const result = await response.json()
    console.log('Upload successful:', result)
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Upload proxy error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 