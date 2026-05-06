import type { FC } from 'react'

type ImageViewerProps = {
  imageName?: string
  imageIndex: number
  totalImages: number
}

const ImageViewer: FC<ImageViewerProps> = ({ imageName, imageIndex, totalImages }) => {
  if (!imageName) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md h-96 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <p className="text-gray-600 text-lg">No images to display</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md h-96 flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={`/api/images/${imageName}`}
          alt={imageName}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E'
          }}
        />
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="font-semibold text-gray-900 break-all text-sm mb-2">{imageName}</p>
        <p className="text-xs text-gray-600">
          {imageIndex + 1} of {totalImages}
        </p>
      </div>
    </div>
  )
}

export default ImageViewer
