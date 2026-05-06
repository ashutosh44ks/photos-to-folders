import type { FC } from 'react'

type ImageViewerProps = {
  imageName?: string
  imageIndex: number
  totalImages: number
}

const ImageViewer: FC<ImageViewerProps> = ({ imageName, imageIndex, totalImages }) => {
  if (!imageName) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-stone-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm font-medium text-stone-500">No images to display</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-stone-100">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <img
          src={`/api/images/${imageName}`}
          alt={imageName}
          className="h-full w-full object-contain p-4 sm:p-8"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E'
          }}
        />
      </div>
    </div>
  )
}

export default ImageViewer
