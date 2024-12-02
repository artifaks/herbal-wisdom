'use client'

import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { useAuth } from '@/lib/auth'

export default function Dashboard() {
  const { loading } = useProtectedRoute()
  const { user, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Welcome back, {user?.email}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">My Favorite Herbs</h3>
                <p className="text-primary-600">View and manage your saved herbs</p>
                <a
                  href="/favorites"
                  className="mt-4 inline-block text-primary-600 hover:text-primary-700"
                >
                  View Favorites →
                </a>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">Local Stores</h3>
                <p className="text-primary-600">Find herbal stores near you</p>
                <a
                  href="/stores"
                  className="mt-4 inline-block text-primary-600 hover:text-primary-700"
                >
                  Find Stores →
                </a>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">Subscription</h3>
                <p className="text-primary-600">Manage your subscription settings</p>
                <a
                  href="/profile/subscription"
                  className="mt-4 inline-block text-primary-600 hover:text-primary-700"
                >
                  View Settings →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
