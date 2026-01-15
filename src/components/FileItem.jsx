import React from 'react'
import { formatFileSize } from '../utils/formatters'
import { icons } from '../config/iconConfig'
import { strings } from '../config/appStrings'

const FileItem = ({ file, index, onRemove, viewMode = 'list', className = '' }) => {
  if (viewMode === 'grid') {
    return (
      <div className={`flex flex-col p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors ${className}`}>
      <div className="w-full aspect-[3/4] bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-md flex items-center justify-center mb-2 shadow-sm" aria-hidden="true">
        <div className="w-10 h-10 text-red-600">{icons.pdf}</div>
      </div>
        <p className="text-xs font-medium text-gray-900 truncate mb-1">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        {onRemove && (
          <button
            onClick={() => onRemove(index)}
            className="mt-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors self-start cursor-pointer"
            aria-label={`${strings.common.remove} ${file.name}`}
            type="button"
          >
            <div className="w-3.5 h-3.5" aria-hidden="true">{icons.close}</div>
          </button>
        )}
      </div>
    )
  }

  if (viewMode === 'list' && className.includes('no-container')) {
    return (
      <>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <div className="w-4 h-4 text-gray-600">{icons.pdf}</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(index)}
            className="flex-shrink-0 ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
            aria-label={`${strings.common.remove} ${file.name}`}
            type="button"
          >
            <div className="w-4 h-4" aria-hidden="true">{icons.close}</div>
          </button>
        )}
      </>
    )
  }

  return (
    <div className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors group ${className}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center" aria-hidden="true">
          <div className="w-4 h-4 text-gray-600">{icons.pdf}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(index)}
          className="flex-shrink-0 ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
          aria-label={`${strings.common.remove} ${file.name}`}
          type="button"
        >
          <div className="w-4 h-4" aria-hidden="true">{icons.close}</div>
        </button>
      )}
    </div>
  )
}

export default FileItem

