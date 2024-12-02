'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireSubscription = false 
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      // Check admin role if required
      if (requireAdmin) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!roleData || roleData.role !== 'admin') {
          router.push('/unauthorized');
          return;
        }
      }

      // Check subscription if required
      if (requireSubscription) {
        const { data: hasSubscription } = await supabase
          .rpc('has_active_subscription', { user_id: user.id });

        if (!hasSubscription) {
          router.push('/subscription');
          return;
        }
      }

      setHasAccess(true);
    } catch (error) {
      console.error('Error checking access:', error);
      router.push('/unauthorized');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
}
