import { useState } from 'react'

export default function ImagePreview({ src, alt, className }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer`}
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full text-white text-2xl flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}