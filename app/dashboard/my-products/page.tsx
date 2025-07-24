"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, Pencil } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, DocumentData, serverTimestamp, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { useAuthStore } from "@/lib/store"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

interface Product {
  id: string; // Firestore doc id
  ownerId: string;
  name: string;
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
    const q = query(collection(db, "products"), where("ownerId", "==", user.uid));
    const snap = await getDocs(q);
    const loaded: Product[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Product, "id">),
    }));
    setProducts(loaded);
  }

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError(null)
    setAdding(true)
    if (!name || !trlLevel) {
      setAddError('Name and TRL Level are required.')
      setAdding(false)
      return
    }
    if (!user) {
      setAddError('You must be signed in to add a product.')
      setAdding(false)
      return
    }
    let techSheetUrl = undefined;
    if (techSheetFile) {
      // Upload PDF to Firebase Storage
      const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${techSheetFile.name}`);
      await uploadBytes(storageRef, techSheetFile);
      techSheetUrl = await getDownloadURL(storageRef);
    }
    const productData = {
      ownerId: user.uid,
      name,
      trlLevel,
      description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(techSheetUrl ? { techSheetUrl } : {}),
    }
    console.log('Saving product to Firestore:', productData)
    try {
      await addDoc(collection(db, "products"), productData)
      await fetchProducts()
      setName("")
      setTrlLevel("")
      setDescription("")
      setTechSheetFile(undefined)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setShowModal(false)
    } catch (err: any) {
      console.error('Firestore addDoc error:', err)
      setAddError(err.message || 'Failed to add product.')
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
    let techSheetUrl = modalProduct.techSheetUrl
    if (techSheetFile) {
      // If a new file is uploaded, delete the old one (if exists) and upload new
      if (modalProduct.techSheetUrl) {
        try {
          const oldRef = ref(storage, modalProduct.techSheetUrl)
          await deleteObject(oldRef)
        } catch (err) {
          // Ignore if file doesn't exist
        }
      }
      const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${techSheetFile.name}`)
      await uploadBytes(storageRef, techSheetFile)
      techSheetUrl = await getDownloadURL(storageRef)
    }
    const productRef = doc(db, "products", modalProduct.id)
    try {
      await updateDoc(productRef, {
        name,
        trlLevel,
        description,
        updatedAt: serverTimestamp(),
        ...(techSheetUrl ? { techSheetUrl } : {}),
      })
      await fetchProducts()
      setShowModal(false)
      setModalProduct(null)
      setEditMode(false)
    } catch (err: any) {
      setEditError(err.message || 'Failed to update product.')
    } finally {
      setEditing(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!user || !modalProduct) return
    setDeleting(true)
    try {
      // Delete tech sheet file if present
      if (modalProduct.techSheetUrl) {
        try {
          const fileRef = ref(storage, modalProduct.techSheetUrl)
          await deleteObject(fileRef)
        } catch (err) {
          // Ignore if file doesn't exist
        }
      }
      const productRef = doc(db, "products", modalProduct.id)
      await deleteDoc(productRef)
      await fetchProducts()
      setShowModal(false)
      setModalProduct(null)
    } catch (err) {
      // Optionally show error
    } finally {
      setDeleting(false)
    }
  }

  const openAddModal = () => {
    setName("")
    setTrlLevel("")
    setDescription("")
    setTechSheetFile(undefined)
    setShowModal(true)
    setModalProduct(null)
  }

  const openProductModal = (product: Product) => {
    setModalProduct(product)
    setShowModal(true)
    setEditMode(false)
    setEditError(null)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalProduct(null)
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* + Card */}
        <button
          onClick={openAddModal}
          className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 rounded-xl h-48 hover:bg-emerald-50 transition group focus:outline-none"
        >
          <Plus className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition" />
          <span className="mt-2 text-emerald-700 font-medium">Add Product</span>
        </button>
        {/* Product Cards */}
        {products.map((prod, idx) => (
          <button
            key={idx}
            onClick={() => openProductModal(prod)}
            className="text-left border rounded-xl bg-white/10 backdrop-blur-md shadow-lg hover:shadow-emerald-200/40 transition flex flex-col h-48 p-4 focus:outline-none overflow-hidden relative group"
            style={{ boxShadow: '0 8px 32px 0 rgba(16,185,129,0.15)' }}
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-emerald-700 text-lg mb-1 truncate" title={prod.name}>{prod.name}</div>
              <div className="text-sm text-gray-700 mb-1 truncate">TRL Level: {prod.trlLevel}</div>
              <div className="text-xs text-gray-500 line-clamp-3 break-words overflow-hidden max-h-12">{prod.description}</div>
            </div>
            {prod.techSheetFile && (
              <div className="flex items-center mt-2 text-xs text-gray-600 truncate">
                <FileText className="w-4 h-4 mr-1" /> {prod.techSheetFile.name}
              </div>
            )}
            <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-2 group-hover:ring-emerald-300 transition" style={{boxShadow: '0 4px 24px 0 rgba(16,185,129,0.10)'}} />
          </button>
        ))}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            {modalProduct ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">{modalProduct.name}</h2>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-gray-100 ml-2"
                    onClick={() => {
                      setEditMode(true)
                      setName(modalProduct.name)
                      setTrlLevel(modalProduct.trlLevel)
                      setDescription(modalProduct.description)
                      setTechSheetFile(undefined)
                    }}
                    aria-label="Edit"
                  >
                    <Pencil className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="mb-2 text-gray-700">TRL Level: {modalProduct.trlLevel}</div>
                <div className="mb-4 text-gray-700">{modalProduct.description}</div>
                {modalProduct.techSheetUrl && (
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <FileText className="w-4 h-4 mr-1" />
                    <a href={modalProduct.techSheetUrl} target="_blank" rel="noopener noreferrer" className="underline">View Tech Sheet PDF</a>
                  </div>
                )}
                {/* Example insights section */}
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Product Insights</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>TRL Level distribution: Coming soon</li>
                    <li>Recent activity: Coming soon</li>
                    <li>Performance metrics: Coming soon</li>
                  </ul>
                </div>
                {/* Edit form */}
                {editMode && (
                  <form onSubmit={handleEditProduct} className="space-y-6 mt-6">
                    <h2 className="text-xl font-bold mb-2">Edit Product</h2>
                    {editError && <div className="text-red-600 text-sm mb-2">{editError}</div>}
                    <div>
                      <label className="block mb-1 font-medium">Product Name</label>
                      <Input value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">TRL Level</label>
                      <Input value={trlLevel} onChange={e => setTrlLevel(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Tech Sheet (PDF)</label>
                      <Input type="file" accept="application/pdf" ref={fileInputRef} onChange={e => setTechSheetFile(e.target.files?.[0])} />
                      {techSheetFile && <span className="text-xs text-gray-600 mt-1 block">{techSheetFile.name}</span>}
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Description</label>
                      <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button type="submit" className="flex-1" disabled={editing}>{editing ? 'Saving...' : 'Save Changes'}</Button>
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setEditMode(false)}>Cancel</Button>
                      <Button type="button" variant="destructive" className="flex-1" onClick={handleDeleteProduct} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleAddProduct} className="space-y-6">
                <h2 className="text-xl font-bold mb-2">Add Product</h2>
                {addError && <div className="text-red-600 text-sm mb-2">{addError}</div>}
                <div>
                  <label className="block mb-1 font-medium">Product Name</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">TRL Level</label>
                  <Input value={trlLevel} onChange={e => setTrlLevel(e.target.value)} placeholder="e.g. 4, 5, 6..." required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tech Sheet (PDF)</label>
                  <Input type="file" accept="application/pdf" ref={fileInputRef} onChange={e => setTechSheetFile(e.target.files?.[0])} />
                  {techSheetFile && <span className="text-xs text-gray-600 mt-1 block">{techSheetFile.name}</span>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this product" />
                </div>
                <Button type="submit" className="w-full" disabled={adding}>{adding ? 'Adding...' : 'Add Product'}</Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 