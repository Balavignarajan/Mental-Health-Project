import { Link } from 'react-router-dom';

function Header({ isLoggedIn = false }) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={isLoggedIn ? "/user-home" : "/"} className="text-xl font-bold text-gray-800">
              MentalHealth
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isLoggedIn ? (
              // User Navigation
              <>
                <Link to="/user-home" className="text-gray-600 hover:text-gray-900">Home</Link>
                <Link to="/my-assessments" className="text-gray-600 hover:text-gray-900">My Assessments</Link>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              </>
            ) : (
              // Visitor Navigation
              <>
                <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                <Link to="/assessments" className="text-gray-600 hover:text-gray-900">Assessments</Link>
                <Link to="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;