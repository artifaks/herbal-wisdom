import { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { SubscriptionModal } from './SubscriptionModal'

type PremiumFeaturePromptProps = {
  title?: string
  description?: string
  className?: string
}

export function PremiumFeaturePrompt({
  title = 'Premium Feature',
  description = 'Subscribe to unlock this feature and many more!',
  className = '',
}: PremiumFeaturePromptProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        className={`relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}
      >
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
        <div className="relative flex flex-col items-center text-center">
          <LockClosedIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Unlock Now
          </button>
        </div>
      </div>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
