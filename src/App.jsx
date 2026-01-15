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
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
