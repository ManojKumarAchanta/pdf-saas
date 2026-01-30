import React, { useState } from "react";
import FileItem from "./FileItem";
import ViewToggle from "./shared/ViewToggle";
import { strings } from "../config/appStrings";

const FileList = ({ files, onRemove, handleContinueToReorder, isMerging }) => {
  const [viewMode, setViewMode] = useState("grid");

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          Selected Files ({files.length})
        </h2>
        <div className="flex items-center gap-2">
          {files.length >= 2 && !isMerging && (
            <div className="sticky bottom-4 bg-white rounded-lg">
              <div className="flex justify-center">
                <button
                  onClick={handleContinueToReorder}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md w-full max-w-xs bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                  type="button"
                  aria-label="Continue to reorder PDF files"
                >
                  {strings.merge.reorder.continueToReorder}
                </button>
              </div>
            </div>
          )}
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
      </div>
      <ul
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            : "space-y-2"
        }
        role="list"
        aria-label="Selected PDF files"
      >
        {files.map((file, index) => (
          <li key={`${file.name}-${index}`}>
            <FileItem
              file={file}
              index={index}
              onRemove={onRemove}
              viewMode={viewMode}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
