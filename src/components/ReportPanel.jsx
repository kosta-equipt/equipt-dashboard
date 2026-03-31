// ReportPanel — Slides open below header, shows formatted report, copyable

import { useState } from 'react'

export default function ReportPanel({ isOpen, reportText }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`report-panel${isOpen ? ' open' : ''}`}>
      <div className="report-panel-inner">
        <div className="report-panel-header">
          <span className="report-panel-title">Status Report — Equipt Marketing Ops</span>
          <button
            className={`report-copy-btn${copied ? ' copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied' : 'Copy Report'}
          </button>
        </div>
        <pre className="report-text">{reportText}</pre>
      </div>
    </div>
  )
}
