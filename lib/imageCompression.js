export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.78,
    outputType = "image/webp",
  } = options

  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("Please choose a valid image file.")
  }

  const bitmap = await createImageBitmap(file)
  const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1)
  const width = Math.round(bitmap.width * ratio)
  const height = Math.round(bitmap.height * ratio)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  ctx.drawImage(bitmap, 0, 0, width, height)

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, outputType, quality)
  })

  bitmap.close?.()
  if (!blob) throw new Error("Could not prepare image for upload.")

  const name = file.name.replace(/\.[^.]+$/, "") || "image"
  return new File([blob], `${name}.webp`, { type: outputType })
}

export async function fileToBase64(file, includePrefix = true) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      resolve(includePrefix ? result : result.split(",")[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
