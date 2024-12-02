'use client'

import { useState } from 'react'
import ImageUpload from '@/components/common/ImageUpload'

export default function TestUpload() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [bucketInfo, setBucketInfo] = useState<any>(null)

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url)
  }

  const checkBucket = async () => {
    try {
      const response = await fetch('/api/storage/test')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check bucket')
      }
      
      setBucketInfo(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check bucket')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Image Upload</h1>
      
      <div className="mb-8">
        <button
          onClick={checkBucket}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check Storage Bucket
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {bucketInfo && (
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Bucket Info:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(bucketInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Upload Image</h2>
        <ImageUpload onUploadComplete={handleUploadComplete} />
      </div>

      {uploadedUrl && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Uploaded Image URL:</h2>
          <div className="p-4 bg-gray-100 rounded break-all">
            {uploadedUrl}
          </div>
        </div>
      )}
    </div>
  )
}
