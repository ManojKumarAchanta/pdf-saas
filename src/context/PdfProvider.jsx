import { useState } from 'react'
import { defaultTool } from '../config/appConfig'
import { PdfContext } from './pdfContext'

export function PdfProvider({ children }) {
  const [files, setFiles] = useState([])
  const [isMerging, setIsMerging] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentModule, setCurrentModule] = useState(defaultTool)
  const [showReorder, setShowReorder] = useState(false)

  const addFiles = (fileList) => {
    const pdfFiles = Array.from(fileList).filter(file => {
      return file.type === 'application/pdf'
    })
    setFiles(prev => [...prev, ...pdfFiles])
    setError(null)
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setError(null)
  }

  const clearFiles = () => {
    setFiles([])
    setError(null)
  }

  const setMerging = (value) => setIsMerging(value)

  const setErrorState = (err) => setError(err)

  const reorderFile = (fromIndex, toIndex) => {
    setFiles(prev => {
      const newFiles = [...prev]
      const [moved] = newFiles.splice(fromIndex, 1)
      newFiles.splice(toIndex, 0, moved)
      return newFiles
    })
  }

  const value = {
    files,
    isMerging,
    error,
    sidebarOpen,
    sidebarCollapsed,
    currentModule,
    showReorder,
    addFiles,
    removeFile,
    clearFiles,
    reorderFile,
    setMerging,
    setErrorState,
    setSidebarOpen,
    setSidebarCollapsed,
    setCurrentModule,
    setShowReorder
  }

  return (
    <PdfContext.Provider value={value}>
      {children}
    </PdfContext.Provider>
  )
}

