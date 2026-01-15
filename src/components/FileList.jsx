import React, { useState } from 'react'
import FileItem from './FileItem'
import ViewToggle from './shared/ViewToggle'
import { icons } from '../config/iconConfig'
import { strings } from '../config/appStrings'

const FileList = ({ files, onRemove, handleContinueToReorder, isMerging }) => {
  const [viewMode, setViewMode] = useState('grid')

  if (files.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          Selected Files ({files.length})
        </h2>
        <div className="flex items-center gap-2">
          {files.length >= 2 && (
            <div className="sticky bottom-4 bg-white rounded-lg">
              <div className="flex justify-center">
                <button
                  onClick={handleContinueToReorder}
                  disabled={isMerging}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md w-full max-w-xs ${isMerging
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
                    }`}
                  type="button"
                  aria-label="Continue to reorder PDF files"
                >
                  {isMerging ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4" aria-hidden="true">{icons.spinner}</div>
                      <span>{strings.merge.reorder.merging}</span>
                    </span>
                  ) : (
                    strings.merge.reorder.continueToReorder
                  )}
                </button>
              </div>
            </div>
          )}
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
      </div>
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'space-y-2'}>
        {files.map((file, index) => (
          <FileItem
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            onRemove={onRemove}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  )
}

export default FileList

