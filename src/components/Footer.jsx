import React from 'react'
import { strings } from '../config/appStrings'
import { seoConfig } from '../config/seoConfig'

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-600">
            {seoConfig.default.description}
          </p>
          <p className="text-xs text-gray-500">
            {strings.app.name} - Free PDF tools. No registration required. All processing happens in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

