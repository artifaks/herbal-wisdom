'use client'

import { useSubscriptionRoute } from '@/hooks/useProtectedRoute'

export default function PremiumHerbs() {
  const { loading } = useSubscriptionRoute()

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
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Premium Herbal Knowledge</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Expert Guides & Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Premium Content Cards */}
              <div className="border border-primary-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-700 mb-3">
                  Advanced Herbal Combinations
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn how to combine different herbs for maximum therapeutic benefits.
                  Our expert herbalists share their proven formulas and techniques.
                </p>
                <a
                  href="/guides/combinations"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More →
                </a>
              </div>

              <div className="border border-primary-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-700 mb-3">
                  Seasonal Wellness Protocols
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover how to adapt your herbal regimen throughout the year.
                  Includes detailed protocols for each season.
                </p>
                <a
                  href="/guides/seasonal"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More →
                </a>
              </div>

              <div className="border border-primary-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-700 mb-3">
                  Clinical Case Studies
                </h3>
                <p className="text-gray-600 mb-4">
                  Real-world examples of successful herbal protocols.
                  Learn from documented cases and expert analysis.
                </p>
                <a
                  href="/guides/cases"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More →
                </a>
              </div>

              <div className="border border-primary-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-700 mb-3">
                  Advanced Preparation Methods
                </h3>
                <p className="text-gray-600 mb-4">
                  Master the art of herbal preparation with detailed guides on
                  tinctures, decoctions, and other advanced methods.
                </p>
                <a
                  href="/guides/preparation"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
