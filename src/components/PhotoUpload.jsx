import { useState } from 'react'
import { supabase, STORAGE_BUCKET } from '../lib/supabase'
import ImagePreview from './ImagePreview'

export default function PhotoUpload({
  photos = [],
  onChange,
  maxPhotos = 3,
  ownerId,
}) {
  const [uploading, setUploading] = useState(false)

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          const maxSize = 1024

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width
              width = maxSize
            } else {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            0.8
          )
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !ownerId) return

    if (photos.length >= maxPhotos) {
      alert(`最多上传${maxPhotos}张照片`)
      return
    }

    setUploading(true)
    try {
      const compressedBlob = await compressImage(file)
      const fileName = `${ownerId}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, compressedBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)

      onChange?.([...photos, publicUrl])
    } catch (err) {
      console.error('Upload error:', err)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (index) => {
    if (!window.confirm('确定删除这张照片吗？')) return

    const photoUrl = photos[index]
    try {
      const urlParts = photoUrl.split('/')
      const fileName = urlParts.slice(-2).join('/')

      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([fileName])
    } catch (e) {
      console.log('Delete storage error:', e)
    }

    const newPhotos = photos.filter((_, i) => i !== index)
    onChange?.(newPhotos)
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="relative aspect-square rounded-xl overflow-hidden bg-surface-hover"
        >
          <ImagePreview
            src={photo}
            alt={`照片${index + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
      {photos.length < maxPhotos && (
        <label className="aspect-square rounded-xl border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all">
          <span className="text-2xl text-text-light mb-1">+</span>
          <span className="text-xs text-text-muted">上传照片</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
