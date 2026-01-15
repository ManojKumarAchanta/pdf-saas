import { PDFDocument } from 'pdf-lib'

export async function arrangePdfPages(file, pageOrder) {
  if (!file || pageOrder.length === 0) {
    throw new Error('Invalid file or page order')
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)
  const totalPages = pdfDoc.getPageCount()

  if (pageOrder.length !== totalPages) {
    throw new Error('Page order must match total pages')
  }

  if (pageOrder.some(pageNum => pageNum < 1 || pageNum > totalPages)) {
    throw new Error('Invalid page numbers in order')
  }

  const newPdf = await PDFDocument.create()

  for (const pageNum of pageOrder) {
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1])
    newPdf.addPage(copiedPage)
  }

  const pdfBytes = await newPdf.save()
  return pdfBytes
}

