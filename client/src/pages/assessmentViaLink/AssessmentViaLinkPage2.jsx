import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronDown } from 'lucide-react'
import assessmentLinkImg from '../../assets/images/Assesment-link.png'
import assLink1 from '../../assets/images/ass-link-1.png'

const AssessmentViaLinkPage2 = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    consent: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleContinue = () => {
    navigate('/assessment-link/test')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Background Image */}
      <div 
        className="w-full lg:w-1/2 h-64 lg:h-auto flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assessmentLinkImg})` }}
      >
        <img 
          src={assLink1} 
          alt="Assessment" 
          className="max-w-xs lg:max-w-md w-full h-auto object-contain"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center px-6 lg:px-12 py-8 lg:py-0">
        <div className="max-w-lg w-full">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
            Before You Begin
          </h1>
          
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your Email"
              className="w-full px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Date of Birth and Gender */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
            <div className="flex-1 mb-4 sm:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 py-3 pl-12 bg-gray-200 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-10 bg-gray-200 border-0 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start space-x-3 mb-8">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                className="custom-checkbox"
              />
            </div>
            <label className="text-sm text-gray-600 leading-relaxed">
              I agree to participate in this assessment and understand how my data will be used.
            </label>
          </div>

          {/* Continue Button */}
          <button 
            onClick={handleContinue}
            disabled={!formData.consent}
            className="w-full bg-mh-gradient disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200 text-base"
          >
            Continue to Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentViaLinkPage2