import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero min-h-screen flex items-center">
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Discover the Power of Natural Healing
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12">
            Explore our comprehensive database of medicinal herbs and connect with local herbal stores
          </p>
          <div className="space-x-4">
            <Link
              href="/herbs"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Explore Herbs
            </Link>
            <Link
              href="/subscribe"
              className="bg-white hover:bg-gray-100 text-primary-600 font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Herbal Wisdom?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Extensive Herb Database</h3>
              <p className="text-gray-600">Access detailed information about hundreds of medicinal herbs and their benefits</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Local Stores</h3>
              <p className="text-gray-600">Discover trusted herbal stores in your area with reviews and ratings</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Knowledge</h3>
              <p className="text-gray-600">Access premium content and expert insights for just $1.99/week</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Start Your Herbal Journey Today</h2>
          <p className="text-xl text-white mb-12">
            Subscribe now for just $1.99/week and unlock premium herbal knowledge
          </p>
          <Link
            href="/subscribe"
            className="bg-white hover:bg-gray-100 text-primary-600 font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  )
}
