import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, ChevronDown, Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import assessmentLinkImg from '../../assets/images/Assesment-link.png'
import assLink1 from '../../assets/images/ass-link-1.png'
import { startLinkAttempt, validateAssessmentLink } from '../../api/publicAssessmentLinkApi'
import DatePicker from '../../components/DatePicker'

const AssessmentViaLinkPage2 = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    consent: false
  })
  const [loading, setLoading] = useState(false)
  const [linkData, setLinkData] = useState(null)

  useEffect(() => {
    if (!token) {
      toast.error('Invalid assessment link')
      navigate('/')
    } else {
      loadLinkData()
    }
  }, [token, navigate])

  const loadLinkData = async () => {
    try {
      const response = await validateAssessmentLink(token)
      if (response.success && response.data) {
        setLinkData(response.data.link)
      }
    } catch (err) {
      console.error('Error loading link data:', err)
    }
  }


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleContinue = async () => {
    if (!formData.consent) {
      toast.error('Please accept the consent to continue')
      return
    }

    if (!token) {
      toast.error('Invalid assessment link')
      return
    }

    // Store participant info for payment page
    const participantInfo = {
      name: formData.fullName,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender
    }
    localStorage.setItem(`linkParticipant_${token}`, JSON.stringify(participantInfo))

    // If payment is required, redirect to payment page
    if (linkData && linkData.linkType === 'paid' && linkData.price > 0) {
      navigate(`/assessment-link/${token}/payment`)
      return
    }

    // For free links, proceed directly
    try {
      setLoading(true)
      
      const response = await startLinkAttempt(token, participantInfo)
      
      if (response.success && response.data?.attempt) {
        const attemptId = response.data.attempt._id
        // Store attemptId in localStorage for the test page
        localStorage.setItem(`linkAttempt_${token}`, attemptId)
        // Navigate to test page with token and attemptId
        navigate(`/assessment-link/${token}/test/${attemptId}`)
      } else {
        toast.error(response.message || 'Failed to start assessment')
      }
    } catch (err) {
      console.error('Error starting attempt:', err)
      const errorMessage = err.response?.data?.message || 'Failed to start assessment'
      
      if (err.response?.status === 400 && errorMessage.toLowerCase().includes('eligible')) {
        toast.error(errorMessage, {
          duration: 6000
        })
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
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
              <DatePicker
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                placeholder="Select your date of birth"
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                name="dateOfBirth"
              />
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

          {/* Payment Section for Paid Links - UI Only */}
          {linkData && linkData.linkType === 'paid' && linkData.price > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Payment Required</h3>
                </div>
                <span className="text-xl font-bold text-blue-600">₹{linkData.price}</span>
              </div>
              <p className="text-sm text-gray-600">
                This assessment requires payment to proceed. Please complete the payment to continue.
              </p>
            </div>
          )}

          {/* Consent Checkbox */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="custom-checkbox"
                />
              </div>
              <div className="flex items-start space-x-2">
                <Lock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <label className="text-sm text-gray-800 font-medium leading-relaxed cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, consent: !prev.consent }))}>
                    I agree to participate in this assessment and consent to data collection
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Your information is secure and confidential. Read our{' '}
                    <a href="/privacy" target="_blank" className="text-mh-green hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button 
            onClick={handleContinue}
            disabled={!formData.consent || loading}
            className="w-full bg-mh-gradient disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200 text-base"
          >
            {loading ? 'Starting...' : 'Continue to Assessment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentViaLinkPage2