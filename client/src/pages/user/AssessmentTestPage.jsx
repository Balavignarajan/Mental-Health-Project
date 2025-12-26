import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AssessmentTestPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-16 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <span>Home</span>
          <span className="mx-2"></span>
          <span>My Assessments</span>
          <span className="mx-2"></span>
          <span className="text-mh-green">Strengths and Difficulties Questionnaire</span>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: 15 Dec 2025
        </div>
      </div>

      {/* Title Section */}
      <div className="bg-[#D5DCEE] rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Strengths and Difficulties Questionnaire</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          For each item, please mark the box for Not True, Somewhat True or Certainly True. It would help us if you
          answered all items as best you can even if you are not absolutely certain. Please give your answers on
          the basis of how things have been for you over the last six months.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress: 64%</span>
          <span className="text-sm text-gray-500">16/25 Questions</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-mh-gradient h-2 rounded-full" style={{ width: '64%' }}></div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {/* Question 15 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            15. I am easily distracted, I find it hard to concentrate
          </h3>
          <div className="flex gap-8">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="q15" 
                value="not-true"
                onChange={(e) => handleAnswerChange(15, e.target.value)}
                className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
              />
              <span className="ml-2 text-gray-700">Not True</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="q15" 
                value="somewhat-true"
                onChange={(e) => handleAnswerChange(15, e.target.value)}
                className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
              />
              <span className="ml-2 text-gray-700">Somewhat True</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="q15" 
                value="certainly-true"
                onChange={(e) => handleAnswerChange(15, e.target.value)}
                className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
              />
              <span className="ml-2 text-gray-700">Certainly True</span>
            </label>
          </div>
        </div>

        {/* Question 16 with sub-questions */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            17. Overall, do you think that your child has difficulties in one or more of the following areas: emotions, concentration, behaviour or being able to get on with other people?
          </h3>
          <div className="flex gap-8 mb-6">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="q17" 
                value="no"
                className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="q17" 
                value="yes-minor"
                className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
              />
              <span className="ml-2 text-gray-700">Yes minor difficulties</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="q17" 
                value="yes-definite"
                defaultChecked
                className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
              />
              <span className="ml-2 text-gray-700">Yes definite difficulties</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="q17" 
                value="yes-severe"
                className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
              />
              <span className="ml-2 text-gray-700">Yes severe difficulties</span>
            </label>
          </div>

          {/* Sub-questions in gray background */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">
              • How long have these difficulties been present?
            </h4>
            <div className="flex gap-8 mb-6">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="duration" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Less than a month</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="duration" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">1-5 months</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="duration" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">6-12 months</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="duration" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Over a year</span>
              </label>
            </div>

            <h4 className="text-base font-medium text-gray-900 mb-4">
              • Do the difficulties upset or distress your child?
            </h4>
            <div className="flex gap-8 mb-6">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="distress" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Not at all</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="distress" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Only a little</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="distress" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Quite a lot</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="distress" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">A great deal</span>
              </label>
            </div>

            <h4 className="text-base font-medium text-gray-900 mb-4">
              • Do the difficulties interfere with your child's everyday life in the following areas?
            </h4>
            
            <div className="space-y-3">
              {[
                'Home Life',
                'Friendships',
                'Classroom Learning',
                'Leisure Activities'
              ].map((area, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-700 w-40">{area}</span>
                  <div className="flex gap-8">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name={`area-${index}`} className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                      <span className="ml-2 text-gray-700">Not at all</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name={`area-${index}`} className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                      <span className="ml-2 text-gray-700">Only a little</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name={`area-${index}`} className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                      <span className="ml-2 text-gray-700">Quite a lot</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name={`area-${index}`} className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                      <span className="ml-2 text-gray-700">A great deal</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-base font-medium text-gray-900 mb-4 mt-6">
              • Do the difficulties put a burden on you or the family as a whole?
            </h4>
            <div className="flex gap-8">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="burden" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Not at all</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="burden" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Only a little</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="burden" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">Quite a lot</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="burden" className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green" />
                <span className="ml-2 text-gray-700">A great deal</span>
              </label>
            </div>
          </div>
        </div>

        {/* Remaining Questions */}
        {[
          { num: 18, text: "Helpful if someone is hurt, upset or feeling ill" },
          { num: 19, text: "Helpful if someone is hurt, upset or feeling ill" },
          { num: 20, text: "Helpful if someone is hurt, upset or feeling ill" }
        ].map((question) => (
          <div key={question.num} className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {question.num}. {question.text}
            </h3>
            <div className="flex gap-8">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name={`q${question.num}`} 
                  value="not-true"
                  className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
                />
                <span className="ml-2 text-gray-700">Not True</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name={`q${question.num}`} 
                  value="somewhat-true"
                  className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
                />
                <span className="ml-2 text-gray-700">Somewhat True</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name={`q${question.num}`} 
                  value="certainly-true"
                  className="w-4 h-4 text-mh-green border-gray-300 focus:ring-mh-green"
                />
                <span className="ml-2 text-gray-700">Certainly True</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button 
          onClick={() => navigate('/my-assessments')}
          className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 rounded-full border border-gray-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Page
        </button>
        
        <button className="flex items-center bg-mh-gradient hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
          Next Page
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center mt-8">
        <button className="text-mh-green hover:text-green-700 px-4 py-2 rounded-full border border-mh-green font-medium transition-colors">
          Save & Do Later
        </button>
        
        <button className="bg-mh-gradient hover:bg-green-700 text-white px-8 py-2 rounded-full font-medium transition-colors">
          Submit
        </button>
      </div>
    </div>
  );
}

export default AssessmentTestPage;