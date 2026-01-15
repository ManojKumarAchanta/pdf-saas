import { createContext, useContext } from 'react'

export const PdfContext = createContext(null)

export function usePdf() {
  const context = useContext(PdfContext)
  if (!context) {
    throw new Error("usePdf must be used inside PdfProvider")
  }
  return context
}
