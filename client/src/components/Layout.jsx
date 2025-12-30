import { useState, useEffect } from 'react';
import VisitorHeader from './VisitorHeader';
import UserHeader from './UserHeader';
import Footer from './Footer';
import { isAuthenticated } from '../utils/auth';

function Layout({ children, isLoggedIn = null, showHeaderFooter = true }) {
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      setAuthStatus(isAuthenticated());
    };

    // Initial check
    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === null) {
        checkAuth();
      }
    };

    // Listen for custom auth change events (when user logs in/out in same tab)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    // Check on focus (in case token was set in another tab and user switches back)
    const handleFocus = () => {
      checkAuth();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (!showHeaderFooter) {
    return <>{children}</>;
  }

  // Use explicit isLoggedIn prop if provided, otherwise use actual auth status
  const showUserHeader = isLoggedIn !== null ? isLoggedIn : authStatus;

  return (
    <div className="min-h-screen flex flex-col">
      {showUserHeader ? <UserHeader /> : <VisitorHeader />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer isLoggedIn={showUserHeader} />
    </div>
  );
}

export default Layout;