import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface UseAuthRedirectOptions {
  redirectTo?: string;
}

export function useAuthRedirect({ redirectTo = '/login' }: UseAuthRedirectOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!mounted) return;

        if (user) {
          setIsAuthenticated(true);
        } else {
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          router.push(`${redirectTo}?redirect=${currentPath}`);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          router.push(`${redirectTo}?redirect=${currentPath}`);
        }
      } finally {
        if (mounted) setIsAuthChecked(true);
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router, redirectTo]);

  return { isAuthenticated, isAuthChecked };
}
