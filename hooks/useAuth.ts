// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getCookie } from '@/utils/cookies';

export function useAuth() {
  const [authState, setAuthState] = useState<{
    authenticated: boolean;
    username: string | null;
    accountType: string | null;
    email: string | null;
    loading: boolean;
  }>({
    authenticated: false,
    username: null,
    accountType: null,
    email: null,
    loading: true,
  });
  const csrftoken=getCookie('csrftoken'); // Ensure CSRF token is set for requests

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!csrftoken) {
          console.error('CSRF token not found');
          setAuthState({
            authenticated: false,
            username: null,
            accountType: null,
            email: null,
            loading: false,
          });
          return;
        }
        const response = await fetch('http://127.0.0.1:8000/user/check-auth/', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken, // Include CSRF token in the request
          },
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