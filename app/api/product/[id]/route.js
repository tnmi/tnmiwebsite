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
    
    const response = await fetch(`https://upload-file-194429268019.northamerica-northeast2.run.app/product/${id}`, {
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
    console.log('PATCH request received for product ID:', id);
    
    // Validate authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const token = authHeader.split(' ')[1]
    console.log('Token extracted successfully');

    // NOTE: No need to fetch current product first since the external PATCH endpoint
    // handles merging new files with existing ones automatically

    // STEP 2: Parse the incoming data (handle both FormData and JSON)
    console.log('Parsing request data...');
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    let productName, description, files = [];
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with files)
      console.log('Processing as FormData...');
      const formData = await request.formData();
      productName = formData.get('product_name');
      description = formData.get('description');
      files = formData.getAll('file');
    } else {
      // Handle JSON (without files)
      console.log('Processing as JSON...');
      const jsonData = await request.json();
      productName = jsonData.product_name;
      description = jsonData.description;
      files = []; // No files in JSON requests
    }
    
    console.log('Request data parsed:', {
      productName,
      description: description ? 'provided' : 'not provided',
      filesCount: files.length
    });

    // STEP 3: Send data directly to external PATCH endpoint
    // FIXED: Use the correct endpoint that updates existing products instead of creating new ones
    console.log('Sending data to external PATCH endpoint...');
    
    let updateResponse;
    
    if (files.length > 0) {
      // Send FormData with files directly to the PATCH endpoint
      console.log('Sending FormData with files to external PATCH endpoint...');
      const patchFormData = new FormData();
      patchFormData.append('product_name', productName);
      patchFormData.append('description', description || '');
      
      // Add all files to the FormData
      files.forEach((file, index) => {
        if (file && file.size > 0 && file.name) {
          patchFormData.append('file', file);
          console.log(`Adding file ${index + 1}/${files.length}: ${file.name} (${file.size} bytes)`);
        }
      });
      
      // Send to external PATCH endpoint that handles file uploads for existing products
      updateResponse = await fetch(`https://upload-file-194429268019.northamerica-northeast2.run.app/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: patchFormData,
      });
    } else {
      // Send JSON for metadata-only updates
      console.log('Sending JSON for metadata-only update...');
      const updatedProduct = {
        product_name: productName,
        description: description || '',
      };
      
      updateResponse = await fetch(`https://upload-file-194429268019.northamerica-northeast2.run.app/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
    }

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Product update failed:', updateResponse.status, errorText);
      throw new Error(`Failed to update product: ${updateResponse.status} ${updateResponse.statusText} - ${errorText}`);
    }

    const finalData = await updateResponse.json();
    console.log('Product updated successfully');

    return new Response(JSON.stringify(finalData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('PATCH error details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to update product',
      details: error.message,
      timestamp: new Date().toISOString()
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
    
    const response = await fetch(`https://upload-file-194429268019.northamerica-northeast2.run.app/product/${id}`, {
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