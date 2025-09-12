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
import { useToast } from "@/components/ui/use-toast"

interface ProductFile {
  id: string;
  original_filename: string;
  category: string;
  download_url: string | null;
  content_type?: string;
  uploaded_at: string;
}

interface Product {
  id: string;
  product_name?: string;
  description?: string;
  sku?: string;
  trl_level?: string;
  files_by_category: Record<"general"|"sds"|"coa"|"lab_reports"|"analyzer_logs"|"calibration_docs", string[]>;
  files: Record<string, ProductFile[]>;
  created_at?: string;
  user_id?: string;
}

export default function MyProductsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)

  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [trlLevel, setTrlLevel] = useState("")
  const [description, setDescription] = useState("")
  
  // File state organized by category
  const [files, setFiles] = useState({
    general: [] as File[],
    sds: [] as File[],
    coa: [] as File[],
    lab: [] as File[],
    logs: [] as File[],
    calibration: [] as File[],
  })
  
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
    
    // Check if we have at least one file or a product name
    const totalFiles = Object.values(files).reduce((sum, fileArray) => sum + fileArray.length, 0)
    
    if (totalFiles === 0 && !name.trim()) {
      const errorMessage = 'Please provide a product name and select at least one file to upload.'
      setAddError(errorMessage)
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
      setAdding(false)
      return
    }
    
    if (!user) {
      const errorMessage = 'You must be signed in to upload a file.'
      setAddError(errorMessage)
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      })
      setAdding(false)
      return
    }
    
    // Check file sizes (limit to 10MB per file)
    const maxFileSize = 10 * 1024 * 1024 // 10MB in bytes
    const largeFiles = Object.values(files).flat().filter(file => file.size > maxFileSize)
    
    if (largeFiles.length > 0) {
      const errorMessage = `The following files are too large (max 10MB per file): ${largeFiles.map(f => f.name).join(', ')}`
      setAddError(errorMessage)
      toast({
        title: "File Size Error",
        description: errorMessage,
        variant: "destructive",
      })
      setAdding(false)
      return
    }
    
    try {
      // Get Firebase JWT token
      const token = await user.getIdToken()
      
      // Create FormData with new structure
      const formData = new FormData()
      
      // Add text fields
      if (name.trim()) formData.append('product_name', name.trim())
      if (description.trim()) formData.append('description', description.trim())
      if (sku.trim()) formData.append('sku', sku.trim())
      if (trlLevel.trim()) formData.append('trl_level', trlLevel.trim())
      
      // Add files by category with new naming convention
      files.general.forEach(file => formData.append('general_files[]', file))
      files.sds.forEach(file => formData.append('sds_files[]', file))
      files.coa.forEach(file => formData.append('coa_files[]', file))
      files.lab.forEach(file => formData.append('lab_reports[]', file))
      files.logs.forEach(file => formData.append('analyzer_logs[]', file))
      files.calibration.forEach(file => formData.append('calibration_docs[]', file))
      
      const response = await fetch('/api/upload-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle specific error cases
        if (response.status === 413) {
          throw new Error('Files are too large. Please ensure each file is under 10MB.')
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid request. Please check your input.')
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.')
        } else {
          throw new Error(`Upload failed: ${errorData.error || response.statusText}`)
        }
      }
      
      const result = await response.json()
      
      // Reset form
      setName("")
      setSku("")
      setTrlLevel("")
      setDescription("")
      setFiles({
        general: [],
        sds: [],
        coa: [],
        lab: [],
        logs: [],
        calibration: [],
      })
      
      // Clear all file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]')
      fileInputs.forEach(input => {
        if (input instanceof HTMLInputElement) {
          input.value = ""
        }
      })
      
      // Refresh product list
      await fetchProducts()
      
      // Close modal
      setShowModal(false)
      setModalProduct(null)
    } catch (err: any) {
      console.error('Upload error:', err)
      const errorMessage = `Failed to upload product: ${err.message}`
      setAddError(errorMessage)
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError(null)
    setEditing(true)
    
    if (!user || !modalProduct) {
      setEditError('You must be signed in to edit a product.')
      setEditing(false)
      return
    }
    
    // Check file sizes (limit to 10MB per file)
    const maxFileSize = 10 * 1024 * 1024 // 10MB in bytes
    const largeFiles = Object.values(files).flat().filter(file => file.size > maxFileSize)
    
    if (largeFiles.length > 0) {
      setEditError(`The following files are too large (max 10MB per file): ${largeFiles.map(f => f.name).join(', ')}`)
      setEditing(false)
      return
    }
    
    try {
      // Get Firebase JWT token
      const token = await user.getIdToken()
      
      // Check if we have new files to upload
      const totalFiles = Object.values(files).reduce((sum, fileArray) => sum + fileArray.length, 0)
      
      let response;
      
      if (totalFiles > 0) {
        // Handle file uploads for existing products using FormData
        const formData = new FormData()
        
        // Add product metadata
        if (name.trim()) formData.append('product_name', name.trim())
        if (description.trim()) formData.append('description', description.trim())
        if (sku.trim()) formData.append('sku', sku.trim())
        if (trlLevel.trim()) formData.append('trl_level', trlLevel.trim())
        
        // Add files by category with new naming convention
        files.general.forEach(file => formData.append('general_files[]', file))
        files.sds.forEach(file => formData.append('sds_files[]', file))
        files.coa.forEach(file => formData.append('coa_files[]', file))
        files.lab.forEach(file => formData.append('lab_reports[]', file))
        files.logs.forEach(file => formData.append('analyzer_logs[]', file))
        files.calibration.forEach(file => formData.append('calibration_docs[]', file))
        
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
        const updateData: any = {}
        if (name.trim()) updateData.product_name = name.trim()
        if (description.trim()) updateData.description = description.trim()
        if (sku.trim()) updateData.sku = sku.trim()
        if (trlLevel.trim()) updateData.trl_level = trlLevel.trim()
        
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
        
        // Handle specific error cases
        if (response.status === 413) {
          throw new Error('Files are too large. Please ensure each file is under 10MB.')
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid request. Please check your input.')
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.')
        } else {
        throw new Error(`Failed to update product: ${response.statusText} - ${errorData.error || JSON.stringify(errorData)}`)
        }
      }
      
      const result = await response.json()
      
      // Reset form
      setFiles({
        general: [],
        sds: [],
        coa: [],
        lab: [],
        logs: [],
        calibration: [],
      })
      
      // Clear all file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]')
      fileInputs.forEach(input => {
        if (input instanceof HTMLInputElement) {
          input.value = ""
        }
      })
      
      await fetchProducts()
      setShowModal(false)
      setModalProduct(null)
      setEditMode(false)
    } catch (err: any) {
      console.error('Edit error:', err)
      const errorMessage = err.message || 'Failed to update product.'
      setEditError(errorMessage)
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      })
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
    setSku("")
    setTrlLevel("")
    setDescription("")
    setFiles({
      general: [],
      sds: [],
      coa: [],
      lab: [],
      logs: [],
      calibration: [],
    })
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
      return productData
    } catch (err) {
      console.error('Error fetching product details:', err)
      return null
    }
  }

  const openProductModal = async (product: Product) => {
    // Fetch detailed product information including files
    const detailedProduct = await fetchProductDetails(product.id)
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

  const handleDownloadFile = async (file: ProductFile) => {
    if (!user) return
    
    try {
      // If we have a download_url, use it directly
      if (file.download_url) {
        const a = document.createElement('a')
        a.href = file.download_url
        a.download = file.original_filename
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return
      }
      
      // Fallback to API download if no direct URL
      const token = await user.getIdToken()
      
      const response = await fetch(`/api/file/${file.id}/download`, {
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
      a.download = file.original_filename
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
        {Array.isArray(products) && products.map((prod, idx) => {
          const totalFiles = Object.values(prod.files || {}).reduce((sum, fileArray) => sum + fileArray.length, 0)
          return (
          <Card key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 cursor-pointer group shadow-xl hover:shadow-2xl" onClick={() => openProductModal(prod)}>
            <CardContent className="p-4 sm:p-6 h-40 sm:h-48 flex flex-col">
              <div className="flex-1">
                  <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3 text-gray-800 truncate tracking-wide drop-shadow-sm" title={prod.product_name}>
                    {prod.product_name || 'Unnamed Product'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2 font-light tracking-wide drop-shadow-sm">
                    {prod.trl_level && `TRL Level: ${prod.trl_level}`}
                    {prod.sku && ` • SKU: ${prod.sku}`}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 sm:line-clamp-3 font-light tracking-wide leading-relaxed drop-shadow-sm">
                  {prod.description || t('noDescription')}
                </p>
              </div>
                {totalFiles > 0 && (
                <div className="flex items-center mt-2 sm:mt-3 text-xs text-gray-700">
                  <FileText className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    <span className="font-light tracking-wide drop-shadow-sm">{totalFiles} file{totalFiles > 1 ? 's' : ''} attached</span>
                </div>
              )}
            </CardContent>
          </Card>
          )
        })}
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
                  <CardTitle className="text-lg sm:text-xl mb-2 font-medium text-gray-800 tracking-wide pr-8">{modalProduct.product_name || 'Unnamed Product'}</CardTitle>
                  <CardDescription className="text-gray-600 font-light tracking-wide text-sm sm:text-base">
                    {modalProduct.trl_level && `TRL Level: ${modalProduct.trl_level}`}
                    {modalProduct.sku && ` • SKU: ${modalProduct.sku}`}
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
                  
                  {/* Attached Files Section - Hide when editing */}
                  {!editMode && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-800 tracking-wide">{t('attachedFiles')}</h4>
                      {(() => {
                        // Handle the new backend structure with files organized by category
                        if (modalProduct.files && typeof modalProduct.files === 'object') {
                          const categoryLabels = {
                            general: 'General Files',
                            sds: 'SDS/TDS/MSDS',
                            coa: 'COA (Certificate of Analysis)',
                            lab_reports: 'Lab Test Reports',
                            analyzer_logs: 'Analyzer Logs',
                            calibration_docs: 'Calibration Certificates & SOPs'
                          };
                          
                          // Get all categories that have files
                          const categoriesWithFiles = Object.entries(modalProduct.files).filter(([category, fileList]) => {
                            return Array.isArray(fileList) && fileList.length > 0;
                          });
                          
                          if (categoriesWithFiles.length === 0) {
                            return <p className="text-sm text-gray-500 font-light tracking-wide">{t('noFilesAttached')}</p>;
                          }
                          
                          return (
                            <div className="space-y-4">
                              {categoriesWithFiles.map(([category, fileList]) => (
                                <div key={category} className="space-y-2">
                                  <h5 className="text-xs font-medium text-gray-700 tracking-wide uppercase">
                                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                                  </h5>
                        <div className="space-y-2">
                                    {fileList.map((file) => (
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
                                            onClick={() => handleDownloadFile(file)}
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
                                </div>
                              ))}
                            </div>
                          );
                        }
                        
                        return <p className="text-sm text-gray-500 font-light tracking-wide">{t('noFilesAttached')}</p>;
                      })()}
                    </div>
                  )}
                  
                  {!editMode && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-300 text-white font-light tracking-wide transition-all duration-200 text-xs sm:text-sm" onClick={() => {
                        setEditMode(true)
                        setName(modalProduct.product_name || '')
                        setSku(modalProduct.sku || '')
                        setTrlLevel(modalProduct.trl_level || '')
                        setDescription(modalProduct.description || '')
                        setFiles({
                          general: [],
                          sds: [],
                          coa: [],
                          lab: [],
                          logs: [],
                          calibration: [],
                        })
                      }}>
                        <Pencil className="w-3 sm:w-4 h-3 sm:h-4 mr-1 text-white" />
                        {t('edit')}
                </Button>
              </div>
                  )}
                  
                  {/* Edit form */}
                  {editMode && (
                    <form onSubmit={handleEditProduct} className="space-y-4">
                      {editError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="text-red-600 text-sm font-medium tracking-wide">{editError}</div>
                        </div>
                      )}
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('productName')}</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">SKU</label>
                        <input
                          type="text"
                          value={sku}
                          onChange={e => setSku(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 tracking-wide">TRL Level</label>
                        <input
                          type="text"
                          value={trlLevel}
                          onChange={e => setTrlLevel(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                        />
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
                      
                      {/* Existing Files Display */}
                      {modalProduct.files && Object.keys(modalProduct.files).some(key => Array.isArray(modalProduct.files[key]) && modalProduct.files[key].length > 0) && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-800 tracking-wide border-b border-gray-200 pb-2">Current Files</h3>
                          {Object.entries(modalProduct.files).map(([category, fileList]) => {
                            if (!Array.isArray(fileList) || fileList.length === 0) return null;
                            
                            const categoryLabels = {
                              general: 'General Files',
                              sds: 'SDS/TDS/MSDS',
                              coa: 'COA (Certificate of Analysis)',
                              lab_reports: 'Lab Test Reports',
                              analyzer_logs: 'Analyzer Logs',
                              calibration_docs: 'Calibration Certificates & SOPs'
                            };
                            
                            return (
                              <div key={category} className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700 tracking-wide">
                                  {categoryLabels[category as keyof typeof categoryLabels] || category}
                                </h5>
                                <div className="space-y-1">
                                  {fileList.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        <FileText className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-xs text-gray-700 truncate">{file.original_filename}</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleDeleteFile(file.id)}
                                        disabled={deletingFileId === file.id}
                                        title="Delete file"
                                      >
                                        {deletingFileId === file.id ? (
                                          <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <Trash2 className="w-3 h-3 text-red-500" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* File Upload Categories for Editing */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 tracking-wide border-b border-gray-200 pb-2">Add New Files</h3>
                        
                        {/* General Product Files */}
                        <div>
                          <label className="block mb-2 font-medium text-gray-700 tracking-wide">General Product Files (max 10MB per file)</label>
                        <input
                          type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx" 
                          multiple
                          onChange={e => {
                              const newFiles = Array.from(e.target.files || [])
                              setFiles(prev => ({ ...prev, general: [...prev.general, ...newFiles] }))
                          }}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                        />
                          {files.general.length > 0 && (
                          <div className="mt-2 space-y-1">
                              {files.general.map((file, index) => (
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
                          <label className="block mb-2 font-medium text-gray-700 tracking-wide">SDS/TDS/MSDS Files (max 10MB per file)</label>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            multiple
                            onChange={e => {
                              const newFiles = Array.from(e.target.files || [])
                              setFiles(prev => ({ ...prev, sds: [...prev.sds, ...newFiles] }))
                            }}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                          />
                          {files.sds.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {files.sds.map((file, index) => (
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
                          <label className="block mb-2 font-medium text-gray-700 tracking-wide">COA (Certificate of Analysis) per lot/batch (max 10MB per file)</label>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            multiple
                            onChange={e => {
                              const newFiles = Array.from(e.target.files || [])
                              setFiles(prev => ({ ...prev, coa: [...prev.coa, ...newFiles] }))
                            }}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                          />
                          {files.coa.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {files.coa.map((file, index) => (
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
                          <label className="block mb-2 font-medium text-gray-700 tracking-wide">Lab Test Reports (PDF/CSV) from LIMS (max 10MB per file)</label>
                          <input 
                            type="file" 
                            accept=".pdf,.csv,.xls,.xlsx" 
                            multiple
                            onChange={e => {
                              const newFiles = Array.from(e.target.files || [])
                              setFiles(prev => ({ ...prev, lab: [...prev.lab, ...newFiles] }))
                            }}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                          />
                          {files.lab.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {files.lab.map((file, index) => (
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
                          <label className="block mb-2 font-medium text-gray-700 tracking-wide">On-line Analyzer Logs from DCS/SCADA or Historians (e.g., PI) (max 10MB per file)</label>
                          <input 
                            type="file" 
                            accept=".csv,.txt,.log,.pdf,.xls,.xlsx" 
                            multiple
                            onChange={e => {
                              const newFiles = Array.from(e.target.files || [])
                              setFiles(prev => ({ ...prev, logs: [...prev.logs, ...newFiles] }))
                            }}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                          />
                          {files.logs.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {files.logs.map((file, index) => (
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
                          <label className="block mb-2 font-medium text-gray-700 tracking-wide">Calibration Certificates and SOPs (Standard Operating Procedures) (max 10MB per file)</label>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            multiple
                            onChange={e => {
                              const newFiles = Array.from(e.target.files || [])
                              setFiles(prev => ({ ...prev, calibration: [...prev.calibration, ...newFiles] }))
                            }}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                          />
                          {files.calibration.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {files.calibration.map((file, index) => (
                                <div key={index} className="text-xs text-gray-500 flex items-center font-light tracking-wide">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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
                  {addError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="text-red-600 text-sm font-medium tracking-wide">{addError}</div>
                    </div>
                  )}
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('productName')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('productName')}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">SKU</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="Product SKU"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">TRL Level</label>
                    <input
                      type="text"
                      value={trlLevel}
                      onChange={(e) => setTrlLevel(e.target.value)}
                      placeholder="Technology Readiness Level"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 tracking-wide">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product description"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 resize-none font-light tracking-wide leading-relaxed text-gray-800 placeholder-gray-500"
                      rows={3}
                    />
                  </div>
                  
                  {/* File Upload Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 tracking-wide border-b border-gray-200 pb-2">Document Uploads</h3>
                    
                    {/* General Product Files */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">General Product Files (max 10MB per file)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.xls,.xlsx" 
                        multiple
                        onChange={e => {
                          const newFiles = Array.from(e.target.files || [])
                          setFiles(prev => ({ ...prev, general: [...prev.general, ...newFiles] }))
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {files.general.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {files.general.map((file, index) => (
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
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">SDS/TDS/MSDS Files (max 10MB per file)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        multiple
                        onChange={e => {
                          const newFiles = Array.from(e.target.files || [])
                          setFiles(prev => ({ ...prev, sds: [...prev.sds, ...newFiles] }))
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {files.sds.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {files.sds.map((file, index) => (
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
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">COA (Certificate of Analysis) per lot/batch (max 10MB per file)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        multiple
                        onChange={e => {
                          const newFiles = Array.from(e.target.files || [])
                          setFiles(prev => ({ ...prev, coa: [...prev.coa, ...newFiles] }))
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {files.coa.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {files.coa.map((file, index) => (
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
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">Lab Test Reports (PDF/CSV) from LIMS (max 10MB per file)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.csv,.xls,.xlsx" 
                        multiple
                        onChange={e => {
                          const newFiles = Array.from(e.target.files || [])
                          setFiles(prev => ({ ...prev, lab: [...prev.lab, ...newFiles] }))
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {files.lab.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {files.lab.map((file, index) => (
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
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">On-line Analyzer Logs from DCS/SCADA or Historians (e.g., PI) (max 10MB per file)</label>
                      <input 
                        type="file" 
                        accept=".csv,.txt,.log,.pdf,.xls,.xlsx" 
                        multiple
                        onChange={e => {
                          const newFiles = Array.from(e.target.files || [])
                          setFiles(prev => ({ ...prev, logs: [...prev.logs, ...newFiles] }))
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {files.logs.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {files.logs.map((file, index) => (
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
                      <label className="block mb-2 font-medium text-gray-700 tracking-wide">Calibration Certificates and SOPs (Standard Operating Procedures) (max 10MB per file)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        multiple
                        onChange={e => {
                          const newFiles = Array.from(e.target.files || [])
                          setFiles(prev => ({ ...prev, calibration: [...prev.calibration, ...newFiles] }))
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 file:text-gray-800"
                      />
                      {files.calibration.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {files.calibration.map((file, index) => (
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
