import React from 'react'
import CustomLabel from './CustomLabel'

function Error({backendError}: {backendError: string}) {
  return <p className="text-xs mb-4 text-red-600">{backendError}</p>
}

export default Error
