import React from 'react'
import { icons } from '../../config/iconConfig'
import { strings } from '../../config/appStrings'

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      <button
        onClick={() => onViewChange('list')}
        className={`p-1.5 rounded transition-colors cursor-pointer ${
          viewMode === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label={strings.viewToggle.list}
        title={strings.viewToggle.list}
        type="button"
        aria-pressed={viewMode === 'list'}
      >
        <div className="w-4 h-4" aria-hidden="true">{icons.list}</div>
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className={`p-1.5 rounded transition-colors cursor-pointer ${
          viewMode === 'grid'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label={strings.viewToggle.grid}
        title={strings.viewToggle.grid}
        type="button"
        aria-pressed={viewMode === 'grid'}
      >
        <div className="w-4 h-4" aria-hidden="true">{icons.grid}</div>
      </button>
    </div>
  )
}

export default ViewToggle

