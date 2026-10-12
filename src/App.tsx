import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { PublicBioPage } from './components/public/PublicBioPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [searchParams, setSearchParams] = useState(() => window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine if viewing public profile
  // Supports /u/:username, /user/:username, or ?u=:username
  const searchUrl = new URLSearchParams(searchParams);
  const queryUser = searchUrl.get('u') || searchUrl.get('user');

  let publicUsername: string | null = null;

  if (queryUser) {
    publicUsername = queryUser;
  } else if (currentPath.startsWith('/u/')) {
    publicUsername = currentPath.replace('/u/', '').split('/')[0];
  } else if (currentPath.startsWith('/user/')) {
    publicUsername = currentPath.replace('/user/', '').split('/')[0];
  }

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    setSearchParams('');
  };

  return (
    <AuthProvider>
      <AppProvider>
        {publicUsername ? (
          <PublicBioPage username={publicUsername} onNavigateHome={navigateToHome} />
        ) : (
          <Dashboard />
        )}
      </AppProvider>
    </AuthProvider>
  );
}
