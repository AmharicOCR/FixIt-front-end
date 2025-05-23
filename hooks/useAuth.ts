// hooks/useAuth.ts
import { useState, useEffect } from 'react';

export function useAuth() {
  const [authState, setAuthState] = useState<{
    authenticated: boolean;
    username: string | null;
    accountType: string | null;
    loading: boolean;
  }>({
    authenticated: false,
    username: null,
    accountType: null,
    loading: true,
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
            loading: false,
          });
        } else {
          setAuthState({
            authenticated: false,
            username: null,
            accountType: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState({
          authenticated: false,
          username: null,
          accountType: null,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}