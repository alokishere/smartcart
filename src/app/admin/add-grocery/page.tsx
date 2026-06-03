"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload, X, Package, DollarSign, Grid3X3, Ruler,
  Loader2, CheckCircle2, AlertCircle, ArrowLeft, Save, RotateCcw,
  ChevronDown, Search, ImageIcon,
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { span } from "framer-motion/client"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Name is too long"),
  price: z.string().min(1, "Price is required").regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
  category: z.string().min(1, "Please select a category"),
  unit: z.string().min(1, "Please select a unit"),
  image: z.instanceof(File).refine((f) => f.size > 0, "Product image is required"),
})

type ProductFormData = z.infer<typeof productSchema>

const categories = [
  { value: "Fruits & Vegetables", emoji: "🥬" },
  { value: "Dairy & Eggs", emoji: "🥛" },
  { value: "Rice, Atta & Grains", emoji: "🌾" },
  { value: "Biscuits, Snacks & Chocolate", emoji: "🍪" },
  { value: "Beverages", emoji: "☕" },
  { value: "Personal Care", emoji: "🧴" },
  { value: "Household", emoji: "🧹" },
  { value: "Instant & Packaged Food", emoji: "📦" },
  { value: "Baby & Pet Care", emoji: "🐾" },
  { value: "Foods & Drinks", emoji: "🍽" },
]

const units = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "ltr", label: "Litre (ltr)" },
  { value: "ml", label: "Millilitre (ml)" },
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "pack", label: "Pack" },
]

const inputBase = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
const inputError = "border-red-300 focus:ring-red-500/30 focus:border-red-500"
const labelBase = "block text-sm font-semibold text-gray-700 mb-1.5"
const errorBase = "text-xs text-red-500 mt-1"

interface Toast {
  type: "success" | "error"
  message: string
}

const AddGrocery = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [catOpen, setCatOpen] = useState(false)
  const [catSearch, setCatSearch] = useState("")
  const [unitOpen, setUnitOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const unitRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, control, watch, setValue, getValues, trigger, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: "", category: "", unit: "" },
  })

  const watchedName = watch("name")
  const watchedPrice = watch("price")
  const watchedCategory = watch("category")
  const watchedUnit = watch("unit")

  const showToast = useCallback((t: Toast) => {
    setToast(t)
    setTimeout(() => setToast(null), 4000)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
      if (unitRef.current && !unitRef.current.contains(e.target as Node)) setUnitOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
      setValue("image", file, { shouldValidate: true })
      setImagePreview(URL.createObjectURL(file))
    }
  }, [setValue])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("image", file, { shouldValidate: true })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setValue("image", undefined as unknown as File, { shouldValidate: true })
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const filteredCategories = categories.filter((c) =>
    c.value.toLowerCase().includes(catSearch.toLowerCase())
  )

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true)
    const fd = new FormData()
    fd.append("name", data.name)
    fd.append("price", data.price)
    fd.append("category", data.category)
    fd.append("unit", data.unit)
    fd.append("image", data.image)

    try {
      const res = await axios.post("/api/admin/add-grocery", fd)
      if (res.data.success) {
        showToast({ type: "success", message: res.data.message || "Product added successfully!" })
        reset()
        setImagePreview(null)
      } else {
        showToast({ type: "error", message: res.data.message || "Failed to add product" })
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Something went wrong"
      showToast({ type: "error", message: msg })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFormSubmit = () => {
    handleSubmit(onSubmit)()
  }

  const handleReset = () => {
    reset()
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const getCategoryEmoji = (val: string) => categories.find((c) => c.value === val)?.emoji || "📦"

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/dashboard" className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to add a new grocery item to your store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Product Information</h2>

            <div>
              <label className={labelBase}>Product Image</label>
              <div
                ref={dropRef}
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                  imagePreview
                    ? "border-green-400 bg-green-50/50"
                    : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-44 object-cover rounded-xl shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage() }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        Drag & drop or <span className="text-green-600">browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP up to 5MB</p>
                    </div>
                  </>
                )}
              </div>
              {errors.image && <p className={errorBase}>{errors.image.message}</p>}
            </div>

            <div>
              <label htmlFor="name" className={labelBase}>Product Name</label>
              <input
                id="name"
                {...register("name")}
                placeholder="e.g. Fresh Organic Bananas"
                className={`${inputBase} ${errors.name ? inputError : ""}`}
              />
              {errors.name && <p className={errorBase}>{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelBase}>Price ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="price"
                    {...register("price")}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className={`${inputBase} pl-9 ${errors.price ? inputError : ""}`}
                  />
                </div>
                {errors.price && <p className={errorBase}>{errors.price.message}</p>}
              </div>

              <div ref={unitRef} className="relative">
                <label className={labelBase}>Unit</label>
                <Controller
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <>
                      <button
                        type="button"
                        onClick={() => { setUnitOpen((p) => !p); setCatOpen(false) }}
                        className={`${inputBase} flex items-center justify-between gap-2 text-left ${errors.unit ? inputError : ""} ${!field.value ? "text-gray-400" : ""}`}
                      >
                        <span className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-gray-400 shrink-0" />
                          {field.value ? units.find((u) => u.value === field.value)?.label : "Select unit"}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${unitOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {unitOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.96 }}
                            className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
                          >
                            {units.map((unit) => (
                              <button
                                key={unit.value}
                                type="button"
                                onClick={() => { field.onChange(unit.value); setUnitOpen(false) }}
                                className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors ${
                                  field.value === unit.value
                                    ? "bg-green-50 text-green-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {unit.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                />
                {errors.unit && <p className={errorBase}>{errors.unit.message}</p>}
              </div>
            </div>

            <div ref={catRef} className="relative">
              <label className={labelBase}>Category</label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => { setCatOpen((p) => !p); setUnitOpen(false) }}
                      className={`${inputBase} flex items-center justify-between gap-2 text-left ${errors.category ? inputError : ""} ${!field.value ? "text-gray-400" : ""}`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {field.value ? (
                          <>{getCategoryEmoji(field.value)} <span className="text-gray-900">{field.value}</span></>
                        ) : (
                          <>
                            <Grid3X3 className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>Select a category</span>
                          </>
                        )}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {catOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.96 }}
                          className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
                        >
                          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-gray-100">
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                              type="text"
                              placeholder="Search categories..."
                              value={catSearch}
                              onChange={(e) => setCatSearch(e.target.value)}
                              className="bg-transparent text-sm text-gray-900 placeholder-gray-400 w-full focus:outline-none"
                              autoFocus
                            />
                            {catSearch && (
                              <button onClick={() => setCatSearch("")} className="text-gray-400 hover:text-gray-600">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="max-h-56 overflow-y-auto">
                            {filteredCategories.length === 0 ? (
                              <p className="px-3.5 py-3 text-sm text-gray-400 text-center">No categories found</p>
                            ) : (
                              filteredCategories.map((cat) => (
                                <button
                                  key={cat.value}
                                  type="button"
                                  onClick={() => { field.onChange(cat.value); setCatOpen(false); setCatSearch("") }}
                                  className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                                    field.value === cat.value
                                      ? "bg-green-50 text-green-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="text-base">{cat.emoji}</span>
                                  {cat.value}
                                  {field.value === cat.value && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto text-green-500 shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              />
              {errors.category && <p className={errorBase}>{errors.category.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-300 disabled:to-emerald-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {submitting ? "Saving..." : "Save Product"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Product Preview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Live preview as customers will see it</p>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="aspect-4/3 bg-gray-50 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <ImageIcon className="w-10 h-10" />
                      <p className="text-xs">No image selected</p>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2.5">
                  <h4 className="font-semibold text-gray-900 text-sm leading-snug min-h-10">
                    {watchedName || <span className="text-gray-300 font-normal">Product Name</span>}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {watchedPrice ? `$${watchedPrice}` : <span className="text-gray-300 font-normal text-sm">$0.00</span>}
                    </span>
                    {watchedUnit && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">per {watchedUnit}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1 border-t border-gray-50">
                    {watchedCategory ? (
                      <span className="flex items-center gap-1">
                        {getCategoryEmoji(watchedCategory)} <span className="text-gray-500">{watchedCategory}</span>
                      </span>
                    ) : (
                      <span className="text-gray-300">Select a category</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddGrocery
