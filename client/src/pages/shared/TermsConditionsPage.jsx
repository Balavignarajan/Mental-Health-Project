import { useLocation } from 'react-router-dom';
import { FileText, AlertTriangle, Scale, Shield, Users, Clock } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';

function TermsConditionsPage() {
  const location = useLocation();
  const isLoggedIn = location.pathname.startsWith('/user');
  
  return (
    <div className="bg-mh-white">
      {/* HERO SECTION */}
      <section className="bg-mh-gradient pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-24 relative overflow-hidden">
        <Breadcrumb isLoggedIn={isLoggedIn} variant="light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-mh-white pt-6 sm:pt-8 md:pt-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 sm:mb-6 leading-tight">
            Terms & Conditions
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base opacity-90 mb-8 sm:mb-12 lg:mb-14 px-2">
            Please read these terms carefully before using our mental health assessment platform. 
            These terms govern your use of our services and protect both you and our platform.
          </p>
          <div className="text-sm opacity-75">
            Last updated: January 2025
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Important Notice */}
          <div className="mb-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 sm:p-8 mb-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                <h2 className="text-xl sm:text-2xl font-semibold text-yellow-800">Important Medical Disclaimer</h2>
              </div>
              <p className="text-yellow-700 leading-relaxed">
                Our mental health assessments are for informational and educational purposes only. 
                They do not constitute medical advice, diagnosis, or treatment. Always consult with 
                qualified healthcare professionals for medical concerns.
              </p>
            </div>
          </div>

          {/* Acceptance of Terms */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Scale className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Acceptance of Terms</h2>
            </div>
            
            <div className="bg-mh-light rounded-xl p-6 sm:p-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing and using our Mental Health Assessment Platform, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These terms apply to all users, including visitors, registered users, and assessment participants.
              </p>
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Our Services</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-lg">Assessment Platform</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Research-based mental health assessments</li>
                  <li>• Personalized result reports and insights</li>
                  <li>• Progress tracking and history</li>
                  <li>• Educational resources and information</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-lg">Assessment Links</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Shareable assessment links for professionals</li>
                  <li>• Secure participant data collection</li>
                  <li>• Payment processing for paid assessments</li>
                  <li>• Result delivery and notifications</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">User Responsibilities</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-mh-green pl-6 py-4">
                <h3 className="font-semibold mb-2">Accurate Information</h3>
                <p className="text-gray-600">You must provide accurate and truthful information when taking assessments or creating accounts.</p>
              </div>
              
              <div className="border-l-4 border-mh-green pl-6 py-4">
                <h3 className="font-semibold mb-2">Account Security</h3>
                <p className="text-gray-600">You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
              </div>
              
              <div className="border-l-4 border-mh-green pl-6 py-4">
                <h3 className="font-semibold mb-2">Appropriate Use</h3>
                <p className="text-gray-600">Use our platform only for its intended purpose and in compliance with all applicable laws and regulations.</p>
              </div>

              <div className="border-l-4 border-mh-green pl-6 py-4">
                <h3 className="font-semibold mb-2">Professional Consultation</h3>
                <p className="text-gray-600">Seek professional medical advice for any mental health concerns. Our assessments supplement but do not replace professional care.</p>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Prohibited Activities</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-4">You may not:</h3>
              <ul className="text-red-700 space-y-2">
                <li>• Share or distribute assessment content without permission</li>
                <li>• Attempt to reverse-engineer or copy our assessments</li>
                <li>• Use the platform for commercial purposes without authorization</li>
                <li>• Provide false or misleading information</li>
                <li>• Interfere with platform security or functionality</li>
                <li>• Access other users' accounts or data</li>
                <li>• Use automated tools to access or interact with the platform</li>
              </ul>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Payment Terms</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-mh-light rounded-lg p-6">
                <h3 className="font-semibold mb-3">Paid Assessments</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Payment required before assessment access</li>
                  <li>• Secure payment processing via Razorpay</li>
                  <li>• All prices displayed in Indian Rupees (₹)</li>
                  <li>• No refunds after assessment completion</li>
                </ul>
              </div>
              
              <div className="bg-mh-light rounded-lg p-6">
                <h3 className="font-semibold mb-3">Refund Policy</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Refunds available before assessment start</li>
                  <li>• Technical issues may qualify for refunds</li>
                  <li>• Refund requests processed within 7 days</li>
                  <li>• Contact support for refund requests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Intellectual Property</h2>
            </div>
            
            <div className="bg-mh-light rounded-xl p-6 sm:p-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                All content, assessments, algorithms, and materials on our platform are protected by intellectual property laws. 
                This includes but is not limited to:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Assessment questions and scoring methods</li>
                <li>• Platform design and user interface</li>
                <li>• Educational content and resources</li>
                <li>• Logos, trademarks, and branding</li>
                <li>• Software code and algorithms</li>
              </ul>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-mh-green mr-3" />
              <h2 className="text-xl sm:text-2xl font-semibold">Limitation of Liability</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 leading-relaxed mb-4">
                Our platform provides educational and informational services only. We are not liable for:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Medical decisions based on assessment results</li>
                <li>• Indirect or consequential damages</li>
                <li>• Service interruptions or technical issues</li>
                <li>• Third-party actions or content</li>
                <li>• Data loss or security breaches beyond our control</li>
              </ul>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Changes to These Terms</h3>
              <p className="text-blue-700 leading-relaxed">
                We may update these Terms and Conditions periodically. We will notify users of significant changes 
                via email or platform notifications. Continued use of our services after changes constitutes acceptance 
                of the updated terms.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-mh-gradient text-mh-white rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4">Questions About These Terms?</h2>
            <p className="mb-4 opacity-90">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-sm opacity-90">
              <p>Email: legal@mentalhealthplatform.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Legal Street, Terms City, TC 12345</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default TermsConditionsPage;