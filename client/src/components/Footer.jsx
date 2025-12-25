import { Link } from 'react-router-dom';

function Footer({ isLoggedIn = false }) {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MentalHealth</h3>
            <p className="text-gray-300">
              Your trusted partner for mental health assessments and support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {isLoggedIn ? (
                // User Links
                <>
                  <li><Link to="/user-home" className="text-gray-300 hover:text-white">Home</Link></li>
                  <li><Link to="/my-assessments" className="text-gray-300 hover:text-white">My Assessments</Link></li>
                  <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                </>
              ) : (
                // Visitor Links
                <>
                  <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                  <li><Link to="/assessments" className="text-gray-300 hover:text-white">Assessments</Link></li>
                  <li><Link to="/testimonials" className="text-gray-300 hover:text-white">Testimonials</Link></li>
                  <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="text-gray-300 space-y-2">
              <p>Email: info@mentalhealth.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Health St, Wellness City</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 MentalHealth Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;