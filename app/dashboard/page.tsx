"use client"
// This will be the My Products Dashboard (Main View)

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, Pencil, X, Trash2, Download } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, DocumentData, serverTimestamp, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { useAuthStore } from "@/lib/store"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { useLanguage } from "@/lib/i18n"

interface ProductFile {
  id: string;
  user_id: string;
  bucket: string;
  filename: string;
  original_filename: string;
  file_url: string;
  uploaded_at: string;
}

interface Product {
  id: string; // Product doc id
  ownerId?: string;
  name?: string;
  product_name?: string; // From API response
  trlLevel?: string;
  trl_level?: string; // From API response
  description?: string;
  techSheetFile?: File; // UI-only, not stored in Firestore
  techSheetUrl?: string; // URL of the uploaded PDF
  filenames?: string[];
  files?: ProductFile[]; // Array of attached files from API
  created_at?: string;
  user_id?: string;
}

export default function MyProductsPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [trlLevel, setTrlLevel] = useState("")
  const [description, setDescription] = useState("")
  const [techSheetFile, setTechSheetFile] = useState<File | undefined>()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  // Specific file types for uploads
  const [sdsFiles, setSdsFiles] = useState<File[]>([])
  const [coaFiles, setCoaFiles] = useState<File[]>([])
  const [labTestFiles, setLabTestFiles] = useState<File[]>([])
  const [analyzerLogFiles, setAnalyzerLogFiles] = useState<File[]>([])
  const [calibrationFiles, setCalibrationFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [addError, setAddError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
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
    
    // Collect all files from different categories
    const allFiles = [
      ...selectedFiles,
      ...sdsFiles,
      ...coaFiles,
      ...labTestFiles,
      ...analyzerLogFiles,
      ...calibrationFiles
    ]
    
    if (allFiles.length === 0) {
      setAddError('Please select at least one file to upload.')
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
      
      // Upload only the first file to create the product
      // TODO: Need API endpoint to attach additional files to existing products
      const firstFile = allFiles[0]
      const formData = new FormData()
      formData.append('file', firstFile)
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
      
      // Log info about remaining files that weren't uploaded
      if (selectedFiles.length > 1) {
        console.log(`Note: Only uploaded the first file. ${selectedFiles.length - 1} additional files were not uploaded.`)
        console.log('Additional files:', selectedFiles.slice(1).map(f => f.name))
      }
      
      // Reset form
      setName("")
      setDescription("")
      setSelectedFiles([])
      setSdsFiles([])
      setCoaFiles([])
      setLabTestFiles([])
      setAnalyzerLogFiles([])
      setCalibrationFiles([])
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
    if (!name) {
      setEditError('Product name is required.')
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
      
      console.log('Updating product with files:', selectedFiles.length)
      console.log('Product ID:', modalProduct.id)
      
      let response;
      
      if (selectedFiles.length > 0) {
        // FIXED: Handle file uploads for existing products using FormData
        console.log('Updating product with files via FormData...')
        const formData = new FormData()
        
        // Add product metadata
        formData.append('product_name', name.trim())
        formData.append('description', description ? description.trim() : '')
        
        // Add all selected files
        selectedFiles.forEach((file) => {
          formData.append('file', file)
        })
        
        response = await fetch(`/api/product/${modalProduct.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
            // Note: Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData
        })
      } else {
        // Handle metadata-only updates via JSON
        console.log('Updating product metadata only via JSON...')
        const updateData = {
          product_name: name.trim(),
          description: description ? description.trim() : ''
        }
        
        response = await fetch(`/api/product/${modalProduct.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        })
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Update failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
        throw new Error(`Failed to update product: ${response.statusText} - ${errorData.error || JSON.stringify(errorData)}`)
      }
      
      const result = await response.json()
      console.log('Product updated successfully:', result)
      
      
      await fetchProducts()
      setSelectedFiles([])
      setTechSheetFile(undefined)
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

  const fetchProductDetails = async (productId: string): Promise<Product | null> => {
    if (!user) return null;
    
    try {
      const token = await user.getIdToken()
      const response = await fetch(`/api/product/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.status}`)
      }
      
      const productData = await response.json()
      console.log('Fetched product details:', productData)
      console.log('Files array:', productData.files)
      return productData
    } catch (err) {
      console.error('Error fetching product details:', err)
      return null
    }
  }

  const openProductModal = async (product: Product) => {
    console.log('Opening product modal for:', product)
    // Fetch detailed product information including files
    const detailedProduct = await fetchProductDetails(product.id)
    console.log('Setting modal product to:', detailedProduct || product)
    setModalProduct(detailedProduct || product)
    setShowModal(true)
    setEditMode(false)
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!user) return;
    
    setDeletingFileId(fileId)
    
    try {
      const token = await user.getIdToken()
      const response = await fetch(`/api/file/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.status}`)
      }
      
      // Refresh product details if modal is open
      if (modalProduct) {
        const updatedProduct = await fetchProductDetails(modalProduct.id)
        if (updatedProduct) {
          setModalProduct(updatedProduct)
        }
      }
      
      // Refresh product list
      await fetchProducts()
      
    } catch (err) {
      console.error('Error deleting file:', err)
      // Show error to user here if needed
    } finally {
      setDeletingFileId(null)
    }
  }

  const handleDownloadFile = async (fileId: string, filename: string) => {
    if (!user) return
    
    try {
      // Get Firebase JWT token
      const token = await user.getIdToken()
      
      // Call the single file download endpoint
      const response = await fetch(`/api/file/${fileId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`)
      }
      
      // Get the file as a blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename // Use the original filename
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (err) {
      console.error('Error downloading file:', err)
      // Show error to user here if needed
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setModalProduct(null)
    setEditMode(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6 font-satoshi px-4 sm:px-6">
      <Card className="bg-gradient-to-r from-tn-primary-blue/20 via-tn-deep-blue/20 to-tn-dark-bg/20 text-white backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-light tracking-wide">{t('myProducts')}</CardTitle>
          <CardDescription className="text-white/80 font-light tracking-wide text-sm sm:text-base">
            {t('manageProductFiles')}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* + Card */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 cursor-pointer group shadow-xl hover:shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center h-40 sm:h-48 p-4 sm:p-6" onClick={openAddModal}>
            <Plus className="w-10 sm:w-12 h-10 sm:h-12 text-tn-primary-green/90 mb-2 sm:mb-3 group-hover:text-tn-primary-green group-hover:scale-110 transition-all duration-300" />
            <span className="text-gray-800 font-light tracking-wide text-center drop-shadow-sm text-sm sm:text-base">{t('uploadProduct')}</span>
              </CardContent>
            </Card>
        
        {/* Product Cards */}
        {Array.isArray(products) && products.map((prod, idx) => (
          <Card key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 cursor-pointer group shadow-xl hover:shadow-2xl" onClick={() => openProductModal(prod)}>
            <CardContent className="p-4 sm:p-6 h-40 sm:h-48 flex flex-col">
              <div className="flex-1">
                <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3 text-gray-800 truncate tracking-wide drop-shadow-sm" title={prod.name || prod.product_name}>
                  {prod.name || prod.product_name || 'Unnamed Product'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2 font-light tracking-wide drop-shadow-sm">
                  {(prod.trlLevel || prod.trl_level) && `TRL Level: ${prod.trlLevel || prod.trl_level}`}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 sm:line-clamp-3 font-light tracking-wide leading-relaxed drop-shadow-sm">
                  {prod.description || t('noDescription')}
                </p>
              </div>
              {prod.techSheetUrl && (
                <div className="flex items-center mt-2 sm:mt-3 text-xs text-gray-700">
                  <FileText className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                  <span className="font-light tracking-wide drop-shadow-sm">{t('techSheetAvailable')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl font-satoshi relative z-[999999]">
            <CardHeader className="relative p-4 sm:p-6 border-b-0">
              <button onClick={closeModal} className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200">
                &times;
              </button>
              {modalProduct ? (
                <div>
                  <CardTitle className="text-lg sm:text-xl mb-2 font-medium text-gray-800 tracking-wide pr-8">{modalProduct.name || modalProduct.product_name || 'Unnamed Product'}</CardTitle>
                  <CardDescription className="text-gray-600 font-light tracking-wide text-sm sm:text-base">
                    {(modalProduct.trlLevel || modalProduct.trl_level) && `TRL Level: ${modalProduct.trlLevel || modalProduct.trl_level}`}
              </CardDescription>
                </div>
              ) : (
                <CardTitle className="text-lg sm:text-xl font-medium text-gray-800 tracking-wide pr-8">{t('uploadFile')}</CardTitle>
              )}
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
              {modalProduct ? (
                <div className={editMode ? "space-y-2" : "space-y-4"}>
                  {!editMode && (
                    <div className="text-gray-700 font-light tracking-wide leading-relaxed">
                      {modalProduct.description || t('noDescription')}
                    </div>
                  )}
                  {!editMode && modalProduct.techSheetUrl && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <a href={modalProduct.techSheetUrl} target="_blank" rel="noopener noreferrer" className="underline font-light hover:text-tn-primary-blue transition-colors duration-200 tracking-wide">
                        {t('viewTechSheet')}
                      </a>
                    </div>
                  )}
                  
                  {/* Attached Files Section - Hide when editing */}
                  {!editMode && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-800 tracking-wide">{t('attachedFiles')}</h4>
                      {console.log('Modal product files check:', modalProduct.files, modalProduct.files?.length)}
                      {modalProduct.files && modalProduct.files.length > 0 ? (
                        <div className="space-y-2">
                          {modalProduct.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.original_filename}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {t('uploadedAt')}: {new Date(file.uploaded_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                  onClick={() => handleDownloadFile(file.id, file.original_filename)}
                                  title={`Download ${file.original_filename}`}
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => handleDeleteFile(file.id)}
                                  disabled={deletingFileId === file.id}
                                >
                                  {deletingFileId === file.id ? (
                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 font-light tracking-wide">{t('noFilesAttached')}</p>
                      )}
                    </div>
                  )}
                  
                  {!editMode && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-300 text-white font-light tracking-wide transition-all duration-200 text-xs sm:text-sm" onClick={() => {
                        setEditMode(true)
                        setName(modalProduct.name || modalProduct.product_name || '')
                        setDescription(modalProduct.description || '')
                        setTechSheetFile(undefined)
                        setSelectedFiles([])
                      }}>
                        <Pencil className="w-3 sm:w-4 h-3 sm:h-4 mr-1 text-white" />
                        {t('edit')}
                </Button>
              </div>
                  )}
                  
                  {/* Edit form */}
                  {editMode && (
                    <form onSubmit={handleEditProduct} className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('productName')}</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('addFile')}</label>
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
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('description')}</label>
                        <textarea
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 resize-none font-light tracking-wide leading-relaxed text-gray-800 placeholder-gray-500"
                          rows={3}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit" className="flex-1 bg-tn-primary-blue hover:bg-tn-primary-blue/90 text-white font-medium tracking-wide transition-all duration-200 text-xs sm:text-sm" disabled={editing}>
                          {editing ? t('saving') : t('save')}
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 border-gray-300 text-white font-medium tracking-wide transition-all duration-200 text-xs sm:text-sm" onClick={() => setEditMode(false)}>
                          <X className="w-3 sm:w-4 h-3 sm:h-4 mr-1 text-white" />
                          {t('cancel')}
                        </Button>
                        <Button type="button" variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium tracking-wide transition-all duration-200 text-xs sm:text-sm" onClick={handleDeleteProduct} disabled={deleting}>
                          {deleting ? t('deleting') : t('delete')}
                </Button>
              </div>
                    </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  {addError && <div className="text-red-600 text-sm font-light tracking-wide">{addError}</div>}
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('productName')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('productName')}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('description')}</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('description')}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 resize-none font-light tracking-wide leading-relaxed text-gray-800 placeholder-gray-500"
                      rows={3}
                    />
                  </div>
                  {/* File Upload Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 tracking-wide border-b border-gray-200 pb-2">Document Uploads</h3>
                    
                    {/* General Product Files */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">General Product Files</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.xls,.xlsx" 
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

                    {/* SDS/TDS/MSDS */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">SDS/TDS/MSDS Files</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || [])
                          setSdsFiles(files)
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {sdsFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {sdsFiles.map((file, index) => (
                            <div key={index} className="text-xs text-gray-500 flex items-center font-light tracking-wide">
                              <FileText className="w-3 h-3 mr-1" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* COA (Certificate of Analysis) */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">COA (Certificate of Analysis) per lot/batch</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || [])
                          setCoaFiles(files)
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {coaFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {coaFiles.map((file, index) => (
                            <div key={index} className="text-xs text-gray-500 flex items-center font-light tracking-wide">
                              <FileText className="w-3 h-3 mr-1" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lab Test Reports */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">Lab Test Reports (PDF/CSV) from LIMS</label>
                      <input 
                        type="file" 
                        accept=".pdf,.csv,.xls,.xlsx" 
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || [])
                          setLabTestFiles(files)
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {labTestFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {labTestFiles.map((file, index) => (
                            <div key={index} className="text-xs text-gray-500 flex items-center font-light tracking-wide">
                              <FileText className="w-3 h-3 mr-1" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Analyzer Logs */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">On-line Analyzer Logs from DCS/SCADA or Historians (e.g., PI)</label>
                      <input 
                        type="file" 
                        accept=".csv,.txt,.log,.pdf,.xls,.xlsx" 
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || [])
                          setAnalyzerLogFiles(files)
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {analyzerLogFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {analyzerLogFiles.map((file, index) => (
                            <div key={index} className="text-xs text-gray-500 flex items-center font-light tracking-wide">
                              <FileText className="w-3 h-3 mr-1" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Calibration Certificates and SOPs */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">Calibration Certificates and SOPs (Standard Operating Procedures)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || [])
                          setCalibrationFiles(files)
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {calibrationFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {calibrationFiles.map((file, index) => (
                            <div key={index} className="text-xs text-gray-500 flex items-center font-light tracking-wide">
                              <FileText className="w-3 h-3 mr-1" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-tn-primary-blue hover:bg-tn-primary-blue/90 text-white font-medium tracking-wide transition-all duration-200 text-sm sm:text-base" disabled={adding}>
                    {adding ? t('uploading') : t('uploadFile')}
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
