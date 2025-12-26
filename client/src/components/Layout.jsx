import VisitorHeader from './VisitorHeader';
import UserHeader from './UserHeader';
import Footer from './Footer';

function Layout({ children, isLoggedIn = false, showHeaderFooter = true }) {
  if (!showHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn ? <UserHeader /> : <VisitorHeader />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default Layout;