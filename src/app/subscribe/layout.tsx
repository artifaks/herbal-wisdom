import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscribe - Herbal Wisdom',
  description: 'Subscribe to Herbal Wisdom for premium access to all features and content.',
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      {children}
    </main>
  );
}
