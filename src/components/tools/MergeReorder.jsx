import React, { useState } from "react";
import { usePdf } from "../../context/pdfContext";
import {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} from "../../utils/dragDrop";
import { strings } from "../../config/appStrings";
import { icons } from "../../config/iconConfig";
import ViewToggle from "../shared/ViewToggle";
import FileItem from "../FileItem";

const MergeReorder = ({ onConfirm, onCancel }) => {
  const { files, removeFile, reorderFile } = usePdf();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const handleReorder = (fromIndex, toIndex) => {
    reorderFile(fromIndex, toIndex);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      <header className="text-center space-y-2">
        <h1 id="reorder-title" className="text-xl font-semibold text-gray-900">
          {strings.merge.reorder.title}
        </h1>
        <p className="text-sm text-gray-600">
          {strings.merge.reorder.description}
        </p>
      </header>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Selected Files ({files.length})
          </h2>
          <div className="flex items-center gap-2">
            {files.length >= 2 && (
              <div className="sticky bottom-4 bg-white rounded-lg">
                <div className="flex justify-center">
                  <button
                    onClick={onConfirm}
                    className="px-6 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors font-medium cursor-pointer"
                    type="button"
                    aria-label="Merge PDF files and download"
                  >
                    {strings.merge.reorder.confirm}
                  </button>
                </div>
              </div>
            )}
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {viewMode === "grid" ? (
          <ul
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            role="list"
            aria-label="PDF files to merge"
          >
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                draggable
                data-drag-index={index}
                onDragStart={(e) => handleDragStart(e, index, setDraggedIndex)}
                onDragEnd={(e) => handleDragEnd(e, setDraggedIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  handleDrop(e, index, draggedIndex, handleReorder)
                }
                onTouchStart={(e) =>
                  handleTouchStart(e, index, setDraggedIndex)
                }
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) =>
                  handleTouchEnd(e, setDraggedIndex, handleReorder)
                }
                className={`relative touch-none ${draggedIndex === index ? "opacity-50" : ""}`}
                aria-label={`File ${index + 1} of ${files.length}: ${file.name}. Drag to reorder.`}
              >
                <div
                  className="flex items-center justify-center mb-2 text-xs font-medium text-gray-500"
                  aria-hidden="true"
                >
                  #{index + 1}
                </div>
                <FileItem
                  file={file}
                  index={index}
                  onRemove={removeFile}
                  viewMode="grid"
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2" role="list" aria-label="PDF files to merge">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                draggable
                data-drag-index={index}
                onDragStart={(e) => handleDragStart(e, index, setDraggedIndex)}
                onDragEnd={(e) => handleDragEnd(e, setDraggedIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  handleDrop(e, index, draggedIndex, handleReorder)
                }
                onTouchStart={(e) =>
                  handleTouchStart(e, index, setDraggedIndex)
                }
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) =>
                  handleTouchEnd(e, setDraggedIndex, handleReorder)
                }
                className={`flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-all cursor-move group touch-none ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
                aria-label={`File ${index + 1} of ${files.length}: ${file.name}. Drag to reorder.`}
              >
                <div
                  className="flex-shrink-0 w-6 text-xs font-medium text-gray-500"
                  aria-hidden="true"
                >
                  #{index + 1}
                </div>
                <div
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"
                  aria-hidden="true"
                >
                  <div className="w-4 h-4">{icons.dragHandle}</div>
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="w-4 h-4 text-gray-600">{icons.pdf}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                  </div>
                  {removeFile && (
                    <button
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      aria-label={`Remove ${file.name}`}
                      type="button"
                    >
                      <div className="w-4 h-4" aria-hidden="true">
                        {icons.close}
                      </div>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium cursor-pointer"
          type="button"
          aria-label="Go back to file selection"
        >
          {strings.common.back}
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors font-medium cursor-pointer"
          type="button"
          aria-label="Merge PDF files and download"
        >
          {strings.merge.reorder.confirm}
        </button>
      </div>
    </div>
  );
};

export default MergeReorder;
