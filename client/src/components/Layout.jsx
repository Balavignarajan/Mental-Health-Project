import Header from './Header';
import Footer from './Footer';

function Layout({ children, isLoggedIn = false, showHeaderFooter = true }) {
  if (!showHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default Layout;