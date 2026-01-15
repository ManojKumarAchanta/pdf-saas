import { PDFDocument } from 'pdf-lib'

export async function mergePdfs(fileArray) {
  if (!fileArray || fileArray.length === 0) {
    throw new Error('No files provided')
  }

  if (fileArray.length < 2) {
    throw new Error('At least two PDF files are required')
  }

  const mergedPdf = await PDFDocument.create()

  for (const file of fileArray) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    } catch (error) {
      throw new Error(`Failed to process ${file.name}: ${error.message}`)
    }
  }

  const pdfBytes = await mergedPdf.save()
  return pdfBytes
}

