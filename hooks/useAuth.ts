// hooks/useAuth.ts
import { useState, useEffect } from 'react';

export function useAuth() {
  const [authState, setAuthState] = useState<{
    authenticated: boolean;
    username: string | null;
    accountType: string | null;
    email: string | null;
    loading: boolean;
    is_admin?: boolean;
  }>({
    authenticated: false,
    username: null,
    accountType: null,
    email: null,
    loading: true,
    is_admin: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/user/check-auth/', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Auth check response:', data); // Debugging line
          setAuthState({
            authenticated: data.authenticated,
            username: data.username || null,
            accountType: data.accountType || null,
            email: data.email || null,
            loading: false,
            is_admin: data.is_admin || false,
          });
        } else {
          setAuthState({
            authenticated: false,
            username: null,
            accountType: null,
            email: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState({
          authenticated: false,
          username: null,
          accountType: null,
            email: null,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}