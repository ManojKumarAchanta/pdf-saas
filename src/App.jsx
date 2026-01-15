import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import MergeTool from './components/tools/MergeTool'
import ArrangePages from './components/tools/ArrangePages'
import { usePdf } from './context/pdfContext'
import { useDocumentHead } from './utils/useDocumentHead'

const App = () => {
  const { currentModule, showReorder } = usePdf()

  useDocumentHead(currentModule, showReorder ? 'reorder' : null)

  const toolComponentMap = {
    merge: MergeTool,
    arrange: ArrangePages
  }

  const ToolComponent = toolComponentMap[currentModule] || MergeTool

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto transition-all duration-200">
          <ToolComponent />
          <section
            aria-label="About PDFTangler tools"
            className="px-4 pb-8 bg-white text-gray-700 text-sm"
          >
            <div className="max-w-4xl mx-auto border-t border-gray-100 pt-6 mt-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                Free in‑browser PDF merger and page reorder
              </h2>
              <p className="max-w-3xl">
                PDFTangler lets you quickly merge multiple PDF files and rearrange pages directly in your browser.
                There&apos;s no sign‑up, no watermarks, and no upload to external servers – your documents stay
                on your device while you combine or reorder them and download the final PDF instantly.
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
