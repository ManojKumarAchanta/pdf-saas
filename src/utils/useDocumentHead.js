import { useEffect } from 'react'
import { seoConfig } from '../config/seoConfig'

export const useDocumentHead = (toolId, screen = null) => {
  useEffect(() => {
    let config = seoConfig[toolId] || seoConfig.default

    if (screen === 'reorder' && toolId === 'merge') {
      config = seoConfig.reorder
    }

    document.title = config.title

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', config.description)

    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    if (config.keywords) {
      metaKeywords.setAttribute('content', config.keywords)
    }
  }, [toolId, screen])
}

