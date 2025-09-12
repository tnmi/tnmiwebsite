export async function GET(request, { params }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    
    const response = await fetch(`https://northstar-backend-194429268019.us-central1.run.app/product/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params; // Get the product ID from params
    
    // Validate authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]

    // Parse the incoming data (handle both FormData and JSON)
    const contentType = request.headers.get('content-type') || '';
    
    let updateResponse;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with files) - new structure
      const formData = await request.formData();
      
      // Create new FormData for external API
      const externalFormData = new FormData();
      
      // Add text fields
      const product_name = formData.get('product_name');
      const description = formData.get('description');
      const trl_level = formData.get('trl_level');
      
      if (product_name) externalFormData.append('product_name', product_name);
      if (description) externalFormData.append('description', description);
      if (trl_level) externalFormData.append('trl_level', trl_level);
      
      // Add file arrays with new naming convention
      const generalFiles = formData.getAll('general_files[]');
      const sdsFiles = formData.getAll('sds_files[]');
      const coaFiles = formData.getAll('coa_files[]');
      const labReports = formData.getAll('lab_reports[]');
      const analyzerLogs = formData.getAll('analyzer_logs[]');
      const calibrationDocs = formData.getAll('calibration_docs[]');
      
      // Append each file to the appropriate array
      generalFiles.forEach(file => {
        if (file && file.size > 0) {
          externalFormData.append('general_files[]', file);
        }
      });
      
      sdsFiles.forEach(file => {
        if (file && file.size > 0) {
          externalFormData.append('sds_files[]', file);
        }
      });
      
      coaFiles.forEach(file => {
        if (file && file.size > 0) {
          externalFormData.append('coa_files[]', file);
        }
      });
      
      labReports.forEach(file => {
        if (file && file.size > 0) {
          externalFormData.append('lab_reports[]', file);
        }
      });
      
      analyzerLogs.forEach(file => {
        if (file && file.size > 0) {
          externalFormData.append('analyzer_logs[]', file);
        }
      });
      
      calibrationDocs.forEach(file => {
        if (file && file.size > 0) {
          externalFormData.append('calibration_docs[]', file);
        }
      });
      
      
      // Send to external PATCH endpoint
      updateResponse = await fetch(`https://northstar-backend-194429268019.us-central1.run.app/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: externalFormData,
      });
    } else {
      // Handle JSON (metadata-only updates)
      const jsonData = await request.json();
      
      updateResponse = await fetch(`https://northstar-backend-194429268019.us-central1.run.app/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
    }

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Product update failed:', updateResponse.status, errorText);
      throw new Error(`Failed to update product: ${updateResponse.status} ${updateResponse.statusText} - ${errorText}`);
    }

    const finalData = await updateResponse.json();

    return new Response(JSON.stringify(finalData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('PATCH error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to update product',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    
    const response = await fetch(`https://northstar-backend-194429268019.us-central1.run.app/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 