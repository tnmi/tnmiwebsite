export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    
    // Create new FormData for external API with new structure
    const externalFormData = new FormData()
    
    // Add text fields
    const product_name = formData.get('product_name')
    const description = formData.get('description')
    const sku = formData.get('sku')
    const trl_level = formData.get('trl_level')
    
    if (product_name) externalFormData.append('product_name', product_name)
    if (description) externalFormData.append('description', description)
    if (sku) externalFormData.append('sku', sku)
    if (trl_level) externalFormData.append('trl_level', trl_level)
    
    // Add file arrays with exact API field names
    const generalFiles = formData.getAll('general_files[]')
    const sdsFiles = formData.getAll('sds_files[]')
    const coaFiles = formData.getAll('coa_files[]')
    const labReports = formData.getAll('lab_reports[]')
    const analyzerLogs = formData.getAll('analyzer_logs[]')
    const calibrationDocs = formData.getAll('calibration_docs[]')
    
    // Append each file to the appropriate array (exact API specification)
    generalFiles.forEach(file => {
      if (file && file.size > 0) {
        externalFormData.append('general_files[]', file)
      }
    })
    
    sdsFiles.forEach(file => {
      if (file && file.size > 0) {
        externalFormData.append('sds_files[]', file)
      }
    })
    
    coaFiles.forEach(file => {
      if (file && file.size > 0) {
        externalFormData.append('coa_files[]', file)
      }
    })
    
    labReports.forEach(file => {
      if (file && file.size > 0) {
        externalFormData.append('lab_reports[]', file)
      }
    })
    
    analyzerLogs.forEach(file => {
      if (file && file.size > 0) {
        externalFormData.append('analyzer_logs[]', file)
      }
    })
    
    calibrationDocs.forEach(file => {
      if (file && file.size > 0) {
        externalFormData.append('calibration_docs[]', file)
      }
    })
    
    const allFiles = [...generalFiles, ...sdsFiles, ...coaFiles, ...labReports, ...analyzerLogs, ...calibrationDocs]
      .filter(file => file && file.size > 0)
    
    // Validate that we have at least a product name
    if (!product_name) {
      return new Response(JSON.stringify({ error: 'Product name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    
    // Forward to /product endpoint with proper multipart format
    let response
    try {
      response = await fetch('https://northstar-backend-194429268019.us-central1.run.app/product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: externalFormData
      })
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      return new Response(JSON.stringify({ 
        error: 'Network error',
        details: fetchError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
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