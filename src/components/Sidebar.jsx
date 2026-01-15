import React from 'react'
import { usePdf } from '../context/pdfContext'
import { appConfig } from '../config/appConfig'
import { toolIcons } from '../config/iconConfig'
import { strings } from '../config/appStrings'
import { icons } from '../config/iconConfig'
const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, currentModule, setCurrentModule, clearFiles, setShowReorder, setErrorState } = usePdf()

  const handleItemClick = (moduleId) => {
    if (currentModule !== moduleId) {
      clearFiles()
      setShowReorder(false)
      setErrorState(null)
    }
    setCurrentModule(moduleId)
    setSidebarOpen(false)
  }

  const width = sidebarCollapsed ? appConfig.sidebar.collapsedWidth : appConfig.sidebar.width

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:z-auto md:h-auto`}
        style={{ width: `${width}px` }}
        aria-label="Main navigation"
      >
        <div className="h-full flex flex-col md:min-h-[calc(100vh-56px)]">
          <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200 md:hidden">
            <div className="text-sm font-semibold text-gray-900">{strings.sidebar.title}</div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              aria-label="Close navigation menu"
              type="button"
            >
              <div className="w-4 h-4" aria-hidden="true">{icons.close}</div>
            </button>
          </div>
          <ul className="flex-1 p-3 space-y-1" role="list">
            {appConfig.tools.map((tool) => (
              <li key={tool.id} role="none">
                <button
                  onClick={() => handleItemClick(tool.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-sm cursor-pointer ${currentModule === tool.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  title={tool.name}
                  aria-current={currentModule === tool.id ? 'page' : undefined}
                  type="button"
                >
                  <span className="text-base flex-shrink-0" aria-hidden="true">{toolIcons[tool.id]}</span>
                  {!sidebarCollapsed && <span>{tool.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Sidebar

