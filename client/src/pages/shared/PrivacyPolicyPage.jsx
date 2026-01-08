import { useLocation } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, Users, Database } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';

function PrivacyPolicyPage() {
  const location = useLocation();
  const isLoggedIn = location.pathname.startsWith('/user');
  
  return (
    <div className="bg-mh-white">
      {/* HERO SECTION */}
      <section className="bg-mh-gradient pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-24 relative overflow-hidden">
        <Breadcrumb isLoggedIn={isLoggedIn} variant="light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-mh-white pt-6 sm:pt-8 md:pt-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 sm:mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base opacity-90 mb-8 sm:mb-12 lg:mb-14 px-2">
            Your privacy and data security are fundamental to our mental health assessment platform. 
            Learn how we protect and handle your sensitive information.
          </p>
          <div className="text-sm opacity-75">
            Last updated: January 2025
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Introduction */}
          <div className="mb-12">
            <div className="bg-mh-light rounded-xl p-6 sm:p-8 mb-8">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-mh-green mr-3" />
                <h2 className="text-xl sm:text-2xl font-semibold">Our Commitment to Your Privacy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                This Privacy Policy explains how our Mental Health Assessment Platform collects, uses, 
                and protects your personal information when you use our services. We are committed to 
                maintaining the highest standards of privacy and security for all mental health data.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Database className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-lg">Personal Information</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Full name and email address</li>
                  <li>• Date of birth and gender</li>
                  <li>• Contact information when provided</li>
                  <li>• Account credentials and preferences</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-lg">Assessment Data</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Mental health assessment responses</li>
                  <li>• Test results and scoring data</li>
                  <li>• Assessment completion timestamps</li>
                  <li>• Progress tracking information</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-lg">Technical Information</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Device and browser information</li>
                  <li>• IP address and location data</li>
                  <li>• Usage patterns and session data</li>
                  <li>• Performance and error logs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">How We Use Your Information</h2>
            </div>
            
            <div className="bg-mh-light rounded-xl p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Service Delivery</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Provide mental health assessments</li>
                    <li>• Generate personalized results</li>
                    <li>• Track assessment progress</li>
                    <li>• Send result notifications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Platform Improvement</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Enhance user experience</li>
                    <li>• Improve assessment accuracy</li>
                    <li>• Develop new features</li>
                    <li>• Ensure platform security</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Data Protection & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-mh-green pl-6 py-4">
                <h3 className="font-semibold mb-2">Encryption</h3>
                <p className="text-gray-600">All sensitive data is encrypted both in transit and at rest using industry-standard encryption protocols.</p>
              </div>
              
              <div className="border-l-4 border-mh-green pl-6 py-4">
                <h3 className="font-semibold mb-2">Access Controls</h3>
                <p className="text-gray-600">Strict access controls ensure only authorized personnel can access your data on a need-to-know basis.</p>
              </div>
              
              <div className="border-l-4 border-mh-green pl-6 py-4">
                <h3 className="font-semibold mb-2">Data Minimization</h3>
                <p className="text-gray-600">We collect only the minimum data necessary to provide our mental health assessment services.</p>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Data Sharing & Disclosure</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">We Do NOT Share Your Mental Health Data</h3>
              <p className="text-red-700">Your assessment results and mental health information are never shared with third parties, advertisers, or external organizations without your explicit consent.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Limited Exceptions:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• When required by law or legal process</li>
                <li>• To protect safety in emergency situations</li>
                <li>• With your explicit written consent</li>
                <li>• Anonymized data for research (no personal identifiers)</li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Your Privacy Rights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-mh-light rounded-lg p-6">
                <h3 className="font-semibold mb-3">Access & Control</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• View your personal data</li>
                  <li>• Download your information</li>
                  <li>• Update or correct data</li>
                  <li>• Delete your account</li>
                </ul>
              </div>
              
              <div className="bg-mh-light rounded-lg p-6">
                <h3 className="font-semibold mb-3">Privacy Controls</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Opt-out of communications</li>
                  <li>• Restrict data processing</li>
                  <li>• Object to data use</li>
                  <li>• Data portability rights</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-mh-gradient text-mh-white rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4">Questions About Privacy?</h2>
            <p className="mb-4 opacity-90">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="space-y-2 text-sm opacity-90">
              <p>Email: privacy@mentalhealthplatform.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Privacy Street, Secure City, SC 12345</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;