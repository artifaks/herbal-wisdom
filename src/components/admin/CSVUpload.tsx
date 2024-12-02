import { useState } from 'react'
import { uploadHerbsFromCSV } from '@/lib/services/admin'

type CSVUploadProps = {
  onSuccess: () => void
}

export function CSVUpload({ onSuccess }: CSVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setResults(null)

    try {
      const uploadResults = await uploadHerbsFromCSV(file)
      setResults(uploadResults)
      if (uploadResults.success > 0) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      alert('Error uploading CSV. Please check the file format and try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-700">
                {isUploading ? 'Uploading...' : 'Upload a CSV file'}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">CSV file up to 10MB</p>
        </div>
      </div>

      {results && (
        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              {results.success > 0 ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">
                Upload Results
              </h3>
              <div className="mt-2 text-sm text-gray-700">
                <p>Successfully uploaded {results.success} herbs</p>
                {results.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Errors:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {results.errors.map((error, index) => (
                        <li key={index} className="text-red-600">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
