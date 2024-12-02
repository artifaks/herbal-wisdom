'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase().auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-green-100">
            Herbal Wisdom
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href="/herbs" className="hover:text-green-100">
              Herbs
            </Link>
            {user && (
              <Link href="/admin" className="hover:text-green-100">
                Admin
              </Link>
            )}
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
