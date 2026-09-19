import type { FC } from 'react'

type ImageViewerProps = {
  imageName?: string
  imageIndex: number
  totalImages: number
  /** Why the queue is empty: finished sorting vs inbox was empty. */
  emptyReason?: 'complete' | 'empty'
}

const EMPTY_COPY = {
  complete: {
    title: 'Every photo found a home.',
    subtitle: 'Come back when you have more to organise.',
  },
  empty: {
    title: 'Nothing here yet.',
    subtitle: 'Add photos to the root folder to start sorting.',
  },
} as const

const ImageViewer: FC<ImageViewerProps> = ({
  imageName,
  emptyReason = 'empty',
}) => {
  if (!imageName) {
    const copy = EMPTY_COPY[emptyReason]
    return (
      <div className="relative h-full w-full overflow-hidden bg-stone-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-base font-semibold text-stone-800">{copy.title}</p>
          <p className="text-sm font-medium text-stone-500">{copy.subtitle}</p>
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
          className="h-full w-full object-contain"
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
