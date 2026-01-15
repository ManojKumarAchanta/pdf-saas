// Mouse drag handlers (for desktop)
export const handleDragStart = (e, index, setDraggedIndex) => {
  setDraggedIndex(index)
  e.dataTransfer.effectAllowed = 'move'
  e.currentTarget.style.opacity = '0.5'
}

export const handleDragEnd = (e, setDraggedIndex) => {
  setDraggedIndex(null)
  e.currentTarget.style.opacity = '1'
}

export const handleDragOver = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

export const handleDrop = (e, targetIndex, draggedIndex, reorderFn) => {
  e.preventDefault()
  if (draggedIndex === null || draggedIndex === targetIndex) return
  reorderFn(draggedIndex, targetIndex)
}

// Touch handlers for mobile devices
let touchStartIndex = null
let touchStartY = null
let touchStartX = null
let touchElement = null
let isDragging = false
let lastHighlightedElement = null

export const handleTouchStart = (e, index, setDraggedIndex) => {
  const touch = e.touches[0]
  touchStartIndex = index
  touchStartY = touch.clientY
  touchStartX = touch.clientX
  touchElement = e.currentTarget
  isDragging = false

  setDraggedIndex(index)
  touchElement.style.opacity = '0.5'
  touchElement.style.transition = 'none'
}

export const handleTouchMove = (e) => {
  if (touchStartIndex === null || !touchElement) return

  const touch = e.touches[0]
  const currentY = touch.clientY
  const currentX = touch.clientX

  // Calculate movement
  const deltaY = currentY - touchStartY
  const deltaX = currentX - touchStartX
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // Only start dragging if moved more than 10px (to distinguish from scrolling)
  if (!isDragging && distance < 10) {
    return
  }

  // Mark as dragging and prevent scrolling
  if (!isDragging) {
    isDragging = true
  }
  e.preventDefault()

  // Move the element visually
  touchElement.style.transform = `translateY(${deltaY}px)`
  touchElement.style.zIndex = '1000'

  // Find the element under the touch point
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)

  // Reset previous highlight
  if (lastHighlightedElement && lastHighlightedElement !== touchElement) {
    lastHighlightedElement.style.borderColor = ''
    lastHighlightedElement.style.backgroundColor = ''
  }

  if (elementBelow) {
    // Find the closest draggable parent
    let targetElement = elementBelow
    while (targetElement && !targetElement.hasAttribute('data-drag-index')) {
      targetElement = targetElement.parentElement
    }

    if (targetElement && targetElement.hasAttribute('data-drag-index') && targetElement !== touchElement) {
      const targetIndex = parseInt(targetElement.getAttribute('data-drag-index'), 10)
      if (targetIndex !== touchStartIndex) {
        // Highlight the drop target
        targetElement.style.borderColor = '#3b82f6'
        targetElement.style.backgroundColor = '#eff6ff'
        lastHighlightedElement = targetElement
      }
    }
  }
}

export const handleTouchEnd = (e, setDraggedIndex, reorderFn) => {
  if (touchStartIndex === null || !touchElement) {
    // Reset state
    touchStartIndex = null
    touchElement = null
    isDragging = false
    lastHighlightedElement = null
    return
  }

  let targetIndex = null

  // Only process drop if we were actually dragging
  if (isDragging) {
    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)

    // Find the target index
    if (elementBelow) {
      let targetElement = elementBelow
      while (targetElement && !targetElement.hasAttribute('data-drag-index')) {
        targetElement = targetElement.parentElement
      }

      if (targetElement && targetElement.hasAttribute('data-drag-index')) {
        targetIndex = parseInt(targetElement.getAttribute('data-drag-index'), 10)
      }
    }

    // Perform reorder if valid target
    if (targetIndex !== null && touchStartIndex !== null && touchStartIndex !== targetIndex) {
      reorderFn(touchStartIndex, targetIndex)
    }
  }

  // Reset visual styles
  touchElement.style.opacity = '1'
  touchElement.style.transform = ''
  touchElement.style.zIndex = ''
  touchElement.style.transition = ''

  // Reset all drop target highlights
  document.querySelectorAll('[data-drag-index]').forEach(el => {
    el.style.borderColor = ''
    el.style.backgroundColor = ''
  })

  setDraggedIndex(null)
  touchStartIndex = null
  touchElement = null
  touchStartY = null
  touchStartX = null
  isDragging = false
  lastHighlightedElement = null
}
