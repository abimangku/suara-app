import { useCallback, useRef } from 'react'

export function usePhotoCapture() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const pickPhoto = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      // Create a hidden file input
      if (inputRef.current) {
        document.body.removeChild(inputRef.current)
      }
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.style.display = 'none'
      document.body.appendChild(input)
      inputRef.current = input

      input.onchange = () => {
        const file = input.files?.[0]
        if (file) {
          resolve(file)
        } else {
          resolve(null)
        }
        document.body.removeChild(input)
        inputRef.current = null
      }

      // Handle cancel
      input.addEventListener('cancel', () => {
        resolve(null)
        if (inputRef.current) {
          document.body.removeChild(inputRef.current)
          inputRef.current = null
        }
      })

      input.click()
    })
  }, [])

  const cropToSquare = useCallback(
    (imageBlob: Blob, size: number = 200): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(imageBlob)
        const img = new Image()
        img.onload = () => {
          URL.revokeObjectURL(url)

          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          // Center-crop to square
          const minDim = Math.min(img.width, img.height)
          const sx = (img.width - minDim) / 2
          const sy = (img.height - minDim) / 2

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to create blob from canvas'))
              }
            },
            'image/jpeg',
            0.85
          )
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('Failed to load image'))
        }
        img.src = url
      })
    },
    []
  )

  const pickAndCrop = useCallback(
    async (size: number = 200): Promise<Blob | null> => {
      const photo = await pickPhoto()
      if (!photo) return null
      return cropToSquare(photo, size)
    },
    [pickPhoto, cropToSquare]
  )

  return { pickPhoto, cropToSquare, pickAndCrop }
}
