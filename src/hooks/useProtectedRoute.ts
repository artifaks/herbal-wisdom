import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export function useProtectedRoute(requireSubscription = false) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  return { user, loading }
}

export function useSubscriptionRoute() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/signin')
      } else {
        // Check subscription status
        const checkSubscription = async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user.id)
            .single()

          if (!profile || profile.subscription_status !== 'active') {
            router.push('/subscribe')
          }
        }

        checkSubscription()
      }
    }
  }, [user, loading, router])

  return { user, loading }
}
