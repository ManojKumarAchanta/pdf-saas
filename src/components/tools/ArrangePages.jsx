import React, { useRef, useState } from "react";
import { arrangePdfPages } from "../../utils/arrangePages";
import { strings } from "../../config/appStrings";
import { icons } from "../../config/iconConfig";
import ViewToggle from "../shared/ViewToggle";
import {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} from "../../utils/dragDrop";

const ArrangePages = () => {
  const fileInputRef = useRef(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pageOrder, setPageOrder] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      setError(strings.arrange.errors.invalidFile);
      return;
    }

    setError(null);
    setPdfFile(file);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      setPageOrder(Array.from({ length: totalPages }, (_, i) => i + 1));
    } catch (err) {
      setError(err.message || strings.arrange.errors.loadFailed);
      setPdfFile(null);
      console.error(err);
    }

    e.target.value = "";
  };

  const movePage = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === pageOrder.length - 1) return;

    const newOrder = [...pageOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newOrder[index], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[index],
    ];
    setPageOrder(newOrder);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newOrder = [...pageOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setPageOrder(newOrder);
    setDraggedIndex(null);
  };

  const handleDownload = async () => {
    if (!pdfFile || pageOrder.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const pdfBytes = await arrangePdfPages(pdfFile, pageOrder);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfFile.name.replace(".pdf", "_arranged.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || strings.arrange.errors.arrangeFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setPageOrder([]);
    setError(null);
  };

  return (
    <section
      className="max-w-4xl mx-auto px-4 py-8"
      aria-labelledby="arrange-title"
    >
      <div className="space-y-6">
        <header className="space-y-4 text-center">
          <h1
            id="arrange-title"
            className="text-2xl font-semibold text-gray-900"
          >
            {strings.arrange.title}
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {strings.arrange.intro}
          </p>
          <div className="grid gap-4 text-left text-xs text-gray-600 max-w-2xl mx-auto sm:grid-cols-2">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Organize pages exactly how you need
              </h2>
              <ul className="space-y-1 list-disc list-inside">
                <li>Reorder any page in your PDF with drag and drop.</li>
                <li>Switch between grid and list views for large documents.</li>
                <li>
                  Perfect for splitting, restructuring and cleaning up PDFs.
                </li>
              </ul>
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Fast, private page arranger
              </h2>
              <ul className="space-y-1 list-disc list-inside">
                <li>All page processing happens locally in your browser.</li>
                <li>No uploads, no accounts, no watermarks added.</li>
                <li>
                  Download your rearranged PDF instantly when you&apos;re done.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 max-w-2xl mx-auto">
            {strings.arrange.privacy}
          </p>
        </header>

        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 rounded-md"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {!pdfFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 text-gray-400" aria-hidden="true">
                  {icons.pdf}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {strings.arrange.emptyState.title}
                </p>
                <p className="text-xs text-gray-500">
                  {strings.arrange.emptyState.subtitle}
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                type="button"
                aria-label="Select a PDF file to rearrange pages"
              >
                {strings.common.selectFiles}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Select a PDF file to rearrange pages"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="w-5 h-5 text-gray-600">{icons.pdf}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pageOrder.length} {strings.arrange.fileInfo.pages}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                type="button"
                aria-label="Change PDF file"
              >
                {strings.common.changeFile}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  {strings.arrange.pageOrder.title}
                </h2>
                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
              </div>

              {viewMode === "grid" ? (
                <ul
                  className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                  role="list"
                  aria-label="PDF pages order"
                >
                  {pageOrder.map((pageNum, index) => (
                    <li
                      key={index}
                      draggable
                      data-drag-index={index}
                      onDragStart={(e) =>
                        handleDragStart(e, index, setDraggedIndex)
                      }
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
                      className={`flex flex-col items-center p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-all cursor-move touch-none ${
                        draggedIndex === index ? "opacity-50" : ""
                      }`}
                      aria-label={`Page ${pageNum}, position ${index + 1} of ${pageOrder.length}. Drag to reorder.`}
                    >
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        #{index + 1}
                      </div>
                      <div className="w-full aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-md flex items-center justify-center mb-2 shadow-sm">
                        <div className="text-sm font-bold text-blue-700">
                          {pageNum}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {strings.arrange.pageOrder.pageLabel} {pageNum}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul
                  className="space-y-2"
                  role="list"
                  aria-label="PDF pages order"
                >
                  {pageOrder.map((pageNum, index) => (
                    <li
                      key={index}
                      draggable
                      data-drag-index={index}
                      onDragStart={(e) =>
                        handleDragStart(e, index, setDraggedIndex)
                      }
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
                      aria-label={`${strings.arrange.pageOrder.pageLabel} ${pageNum}, position ${index + 1} of ${pageOrder.length}. Drag to reorder.`}
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
                      <div className="flex-1 text-sm text-gray-900 font-medium">
                        {strings.arrange.pageOrder.pageLabel} {pageNum}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => movePage(index, "up")}
                          disabled={index === 0}
                          className={`p-1.5 rounded transition-colors ${
                            index === 0
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                          }`}
                          aria-label={`Move ${strings.arrange.pageOrder.pageLabel} ${pageNum} up`}
                          type="button"
                        >
                          <div className="w-4 h-4" aria-hidden="true">
                            {icons.arrowUp}
                          </div>
                        </button>
                        <button
                          onClick={() => movePage(index, "down")}
                          disabled={index === pageOrder.length - 1}
                          className={`p-1.5 rounded transition-colors ${
                            index === pageOrder.length - 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                          }`}
                          aria-label={`Move ${strings.arrange.pageOrder.pageLabel} ${pageNum} down`}
                          type="button"
                        >
                          <div className="w-4 h-4" aria-hidden="true">
                            {icons.arrowDown}
                          </div>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  isProcessing
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                }`}
                type="button"
                aria-label={
                  isProcessing ? "Processing PDF" : "Download rearranged PDF"
                }
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4" aria-hidden="true">
                      {icons.spinner}
                    </div>
                    <span>{strings.arrange.download.processing}</span>
                  </span>
                ) : (
                  strings.arrange.download.label
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArrangePages;
