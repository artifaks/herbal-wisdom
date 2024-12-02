import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'

export function useSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastAttemptedPath, setLastAttemptedPath] = useState<string | null>(null)
  const router = useRouter()

  const showSubscriptionPrompt = useCallback((redirectPath?: string) => {
    if (redirectPath) {
      setLastAttemptedPath(redirectPath)
    }
    setIsModalOpen(true)
  }, [])

  const hideSubscriptionPrompt = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleSubscriptionSuccess = useCallback(() => {
    setIsModalOpen(false)
    if (lastAttemptedPath) {
      router.push(lastAttemptedPath)
      setLastAttemptedPath(null)
    }
  }, [lastAttemptedPath, router])

  return {
    isModalOpen,
    showSubscriptionPrompt,
    hideSubscriptionPrompt,
    handleSubscriptionSuccess,
  }
}
