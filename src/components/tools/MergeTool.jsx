import React, { useRef } from 'react'
import { usePdf } from '../../context/pdfContext'
import FileList from '../FileList'
import MergeReorder from './MergeReorder'
import { mergePdfs } from '../../utils/mergePdfs'
import { strings } from '../../config/appStrings'
import { icons } from '../../config/iconConfig'

const MergeTool = () => {
  const fileInputRef = useRef(null)
  const { files, isMerging, error, showReorder, addFiles, removeFile, setMerging, setErrorState, setShowReorder } = usePdf()

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleContinueToReorder = () => {
    if (files.length < 2) {
      setErrorState(strings.merge.errors.minFiles)
      return
    }
    setShowReorder(true)
    setErrorState(null)
  }

  const handleMerge = async () => {
    setMerging(true)
    setErrorState(null)

    try {
      const mergedPdfBytes = await mergePdfs(files)
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'merged.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setShowReorder(false)
    } catch (err) {
      setErrorState(err.message || strings.merge.errors.mergeFailed)
    } finally {
      setMerging(false)
    }
  }

  const handleCancelReorder = () => {
    setShowReorder(false)
    setErrorState(null)
  }

  if (showReorder) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-8" aria-labelledby="reorder-title">
        <MergeReorder onConfirm={handleMerge} onCancel={handleCancelReorder} isMerging={isMerging} />
      </section>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8" aria-labelledby="merge-title">
      <div className="space-y-6">
        <header className="space-y-4 text-center">
          <h1 id="merge-title" className="text-2xl font-semibold text-gray-900">
            {strings.merge.title}
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {strings.merge.intro}
          </p>
          <div className="grid gap-4 text-left text-xs text-gray-600 max-w-2xl mx-auto sm:grid-cols-2">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Why use this PDF merge tool
              </h2>
              <ul className="space-y-1 list-disc list-inside">
                <li>Merge multiple PDF files into a single clean document.</li>
                <li>No sign‑up, no watermark, completely free to use.</li>
                <li>Works in the browser on desktop and mobile.</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Private & secure in‑browser processing
              </h2>
              <ul className="space-y-1 list-disc list-inside">
                <li>Files never leave your device – no server upload.</li>
                <li>Ideal for contracts, invoices and confidential PDFs.</li>
                <li>Download the merged PDF instantly after processing.</li>
              </ul>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 max-w-2xl mx-auto">
            {strings.merge.privacy}
          </p>
        </header>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert" aria-live="polite">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {files.length > 0 && (
          <FileList files={files} onRemove={removeFile} handleContinueToReorder={handleContinueToReorder} isMerging={isMerging} />
        )}

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors bg-white"
          role="region"
          aria-label="File upload area"
        >
          {files.length === 0 ? (
            <div className="space-y-4">
              <div className="flex justify-center" aria-hidden="true">
                <div className="w-12 h-12 text-gray-400">{icons.pdf}</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {strings.merge.emptyState.title}
                </p>
                <p className="text-xs text-gray-500">
                  {strings.merge.emptyState.subtitle}
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                type="button"
              >
                {strings.common.selectFiles}
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              type="button"
            >
              {strings.common.addMoreFiles}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Select PDF files to merge"
          />
        </div>


      </div>
    </section>
  )
}

export default MergeTool

