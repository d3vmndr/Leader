'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function ProtectedLink({ href, children, className, onClick }: ProtectedLinkProps) {
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    if (onClick) onClick(e);

    if (href.startsWith('/challenge') || href.includes('challenge')) {
      e.preventDefault();
      setIsChecking(true);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push(`/login?redirect=${href}`);
        } else {
          router.push(href);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push(`/login?redirect=${href}`);
      } finally {
        setIsChecking(false);
      }
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
