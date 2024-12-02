# Herbal Wisdom

A comprehensive web application for exploring medicinal herbs, finding herbal stores, and accessing expert herbal knowledge.

## Features

- User authentication and subscription management
- Searchable herbal database with detailed information
- Directory of herbal stores with ratings and reviews
- Admin portal for content management
- User favorites and personalization
- Mobile-friendly interface

## Tech Stack

- Next.js 13 (React framework)
- Supabase (Authentication & Database)
- Stripe (Payment processing)
- TailwindCSS (Styling)
- TypeScript

## Prerequisites

- Node.js 16+
- Supabase account
- Stripe account

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `supabase/schema.sql`
3. Set up Row Level Security policies as defined in the schema

## Deployment

The application can be deployed to Vercel:

1. Push your code to GitHub
2. Import the repository to Vercel
3. Configure environment variables
4. Deploy

## License

MIT
