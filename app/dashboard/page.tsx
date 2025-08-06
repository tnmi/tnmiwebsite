"use client"
// This will be the My Products Dashboard (Main View)

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, Pencil, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, DocumentData, serverTimestamp, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { useAuthStore } from "@/lib/store"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

interface Product {
  id: string; // Firestore doc id
  ownerId: string;
  name: string;
  product_name?: string; // From API response
  trlLevel: string;
  description: string;
  techSheetFile?: File; // UI-only, not stored in Firestore
  techSheetUrl?: string; // URL of the uploaded PDF
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [trlLevel, setTrlLevel] = useState("")
  const [description, setDescription] = useState("")
  const [techSheetFile, setTechSheetFile] = useState<File | undefined>()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [addError, setAddError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const user = useAuthStore((state) => state.user)

  const fetchProducts = async () => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      
      const data = await response.json()
      // Ensure products is always an array
      const productsArray = Array.isArray(data) ? data : (data.products || data.data || [])
      setProducts(productsArray)
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([]) // Set empty array on error
    }
  }

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  // Add backdrop to body when modal is open
  useEffect(() => {
    if (showModal) {
      // Create backdrop element
      const backdrop = document.createElement('div');
      backdrop.id = 'modal-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        z-index: 999998;
        width: 100vw;
        height: 100vh;
      `;
      
      // Add to body
      document.body.appendChild(backdrop);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup function
      return () => {
        const existingBackdrop = document.getElementById('modal-backdrop');
        if (existingBackdrop) {
          document.body.removeChild(existingBackdrop);
        }
        document.body.style.overflow = 'auto';
      };
    }
  }, [showModal]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError(null)
    setAdding(true)
    
    if (selectedFiles.length === 0) {
      setAddError('Please select a file to upload.')
      setAdding(false)
      return
    }
    
    if (!user) {
      setAddError('You must be signed in to upload a file.')
      setAdding(false)
      return
    }
    
    try {
      // Get Firebase JWT token
      const token = await user.getIdToken()
      
      // Upload all selected files to the new endpoint
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('product_name', name) // Add product name to form data
        if (description) {
          formData.append('description', description) // Add description if provided
        }
        
        const response = await fetch('/api/upload-file', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('Upload successful:', result)
      }
      
      // Reset form
      setName("")
      setDescription("")
      setSelectedFiles([])
      setTechSheetFile(undefined)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
      // Refresh product list
      await fetchProducts()
      
      // Close modal
      setShowModal(false)
      setModalProduct(null)
    } catch (err: any) {
      console.error('Upload error:', err)
      setAddError(`Failed to upload file: ${err.message}`)
    } finally {
      setAdding(false)
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError(null)
    setEditing(true)
    if (!name || !trlLevel) {
      setEditError('Name and TRL Level are required.')
      setEditing(false)
      return
    }
    if (!user || !modalProduct) {
      setEditError('You must be signed in to edit a product.')
      setEditing(false)
      return
    }
    
    try {
      // Get Firebase JWT token
      const token = await user.getIdToken()
      
      // Prepare update data with all form fields
      const updateData: any = {
        product_name: name,
        trl_level: trlLevel,
        description: description || ''
      }
      
      // Handle file upload if new file is selected
      if (techSheetFile) {
        try {
          const formData = new FormData()
          formData.append('file', techSheetFile)
          
          const uploadResponse = await fetch('/api/upload-file', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })
          
          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`)
          }
          
          const uploadResult = await uploadResponse.json()
          updateData.tech_sheet_url = uploadResult.url || uploadResult.fileUrl
        } catch (err: any) {
          console.error('File upload error:', err)
          setEditError(`Failed to upload file: ${err.message}`)
          setEditing(false)
          return
        }
      } else if (modalProduct.techSheetUrl) {
        // Keep existing tech sheet URL if no new file is uploaded
        updateData.tech_sheet_url = modalProduct.techSheetUrl
      }
      
      // Log the data being sent for debugging
      console.log('Sending update data:', updateData)
      
      // Update product using external API
      const response = await fetch(`/api/product/${modalProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Failed to update product: ${response.statusText} - ${errorData.error || ''}`)
      }
      
      const result = await response.json()
      console.log('Update successful:', result)
      
      await fetchProducts()
      setShowModal(false)
      setModalProduct(null)
      setEditMode(false)
    } catch (err: any) {
      console.error('Edit error:', err)
      setEditError(err.message || 'Failed to update product.')
    } finally {
      setEditing(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!user || !modalProduct) return
    setDeleting(true)
    
    try {
      // Get Firebase JWT token
      const token = await user.getIdToken()
      
      // Delete product using external API
      const response = await fetch(`/api/product/${modalProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`)
      }
      
      await fetchProducts()
      setShowModal(false)
      setModalProduct(null)
    } catch (err: any) {
      console.error('Delete error:', err)
      // Optionally show error to user
    } finally {
      setDeleting(false)
    }
  }

  const openAddModal = () => {
    setName("")
    setTrlLevel("")
    setDescription("")
    setTechSheetFile(undefined)
    setSelectedFiles([])
    setShowModal(true)
    setModalProduct(null)
  }

  const openProductModal = (product: Product) => {
    setModalProduct(product)
    setShowModal(true)
    setEditMode(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalProduct(null)
    setEditMode(false)
  }

  return (
    <div className="space-y-6 font-satoshi">
      <Card className="bg-gradient-to-r from-tn-primary-blue/20 via-tn-deep-blue/20 to-tn-dark-bg/20 text-white backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-light tracking-wide">My Products</CardTitle>
          <CardDescription className="text-white/80 font-light tracking-wide">
            Upload and manage your product files
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* + Card */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 cursor-pointer group shadow-xl hover:shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center h-48 p-6" onClick={openAddModal}>
            <Plus className="w-12 h-12 text-tn-primary-green/90 mb-3 group-hover:text-tn-primary-green group-hover:scale-110 transition-all duration-300" />
            <span className="text-gray-800 font-light tracking-wide text-center drop-shadow-sm">Upload Product</span>
          </CardContent>
        </Card>
        
        {/* Product Cards */}
        {Array.isArray(products) && products.map((prod, idx) => (
          <Card key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 cursor-pointer group shadow-xl hover:shadow-2xl" onClick={() => openProductModal(prod)}>
            <CardContent className="p-6 h-48 flex flex-col">
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-3 text-gray-800 truncate tracking-wide drop-shadow-sm" title={prod.name || prod.product_name}>
                  {prod.name || prod.product_name || 'Unnamed Product'}
                </h3>
                <p className="text-sm text-gray-700 mb-2 font-light tracking-wide drop-shadow-sm">
                  {prod.trlLevel && `TRL Level: ${prod.trlLevel}`}
                </p>
                <p className="text-xs text-gray-600 line-clamp-3 font-light tracking-wide leading-relaxed drop-shadow-sm">
                  {prod.description || 'No description available'}
                </p>
              </div>
              {prod.techSheetUrl && (
                <div className="flex items-center mt-3 text-xs text-gray-700">
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="font-light tracking-wide drop-shadow-sm">Tech Sheet Available</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl font-satoshi relative z-[999999]">
            <CardHeader className="relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200">
                &times;
              </button>
              {modalProduct ? (
                <div>
                  <CardTitle className="text-xl mb-2 font-medium text-gray-800 tracking-wide">{modalProduct.name || modalProduct.product_name || 'Unnamed Product'}</CardTitle>
                  <CardDescription className="text-gray-600 font-light tracking-wide">
                    {modalProduct.trlLevel && `TRL Level: ${modalProduct.trlLevel}`}
                  </CardDescription>
                </div>
              ) : (
                <CardTitle className="text-xl font-medium text-gray-800 tracking-wide">Upload File</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {modalProduct ? (
                <div className="space-y-4">
                  <div className="text-gray-700 font-light tracking-wide leading-relaxed">
                    {modalProduct.description || 'No description available'}
                  </div>
                  {modalProduct.techSheetUrl && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <a href={modalProduct.techSheetUrl} target="_blank" rel="noopener noreferrer" className="underline font-light hover:text-tn-primary-blue transition-colors duration-200 tracking-wide">
                        View Tech Sheet PDF
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-300 text-white font-light tracking-wide transition-all duration-200" onClick={() => {
                      setEditMode(true)
                      setName(modalProduct.name || modalProduct.product_name || '')
                      setTrlLevel(modalProduct.trlLevel || '')
                      setDescription(modalProduct.description || '')
                      setTechSheetFile(undefined)
                    }}>
                      <Pencil className="w-4 h-4 mr-1 text-white" />
                      Edit
                    </Button>
                  </div>
                  
                  {/* Edit form */}
                  {editMode && (
                    <form onSubmit={handleEditProduct} className="space-y-4 mt-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">Product Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">TRL Level</label>
                        <input
                          type="text"
                          value={trlLevel}
                          onChange={e => setTrlLevel(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-black placeholder-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">Tech Sheet (PDF)</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          ref={fileInputRef}
                          onChange={e => setTechSheetFile(e.target.files?.[0])}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                        />
                        {techSheetFile && <span className="text-xs text-gray-500 mt-2 block font-light tracking-wide">{techSheetFile.name}</span>}
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">Description</label>
                        <textarea
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 resize-none font-light tracking-wide leading-relaxed text-gray-800 placeholder-gray-500"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1 bg-tn-primary-blue hover:bg-tn-primary-blue/90 text-white font-medium tracking-wide transition-all duration-200" disabled={editing}>
                          {editing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 border-gray-300 text-white font-medium tracking-wide transition-all duration-200" onClick={() => setEditMode(false)}>
                          <X className="w-4 h-4 mr-1 text-white" />
                          Cancel
                        </Button>
                        <Button type="button" variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium tracking-wide transition-all duration-200" onClick={handleDeleteProduct} disabled={deleting}>
                          {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  {addError && <div className="text-red-600 text-sm font-light tracking-wide">{addError}</div>}
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter product description (optional)"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 resize-none font-light tracking-wide leading-relaxed text-gray-800 placeholder-gray-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">File</label>
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      multiple
                      ref={fileInputRef} 
                      onChange={e => {
                        const files = Array.from(e.target.files || [])
                        setSelectedFiles(files)
                        setTechSheetFile(files[0])
                      }}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                    />
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="text-xs text-gray-500 flex items-center font-light tracking-wide">
                            <FileText className="w-3 h-3 mr-1" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full bg-tn-primary-blue hover:bg-tn-primary-blue/90 text-white font-medium tracking-wide transition-all duration-200" disabled={adding}>
                    {adding ? 'Uploading...' : 'Upload File'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
