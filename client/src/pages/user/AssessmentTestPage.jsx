import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AssessmentTestPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const totalQuestions = 26;

  const questions = [
    {
      id: 1,
      text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
      options: [  
        { value: "0", text: "Not at all" },
        { value: "1", text: "Several days" },
        { value: "2", text: "More than half the days" },
        { value: "3", text: "Nearly every day" }
      ]
    }
  ];

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/my-assessments')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="text-sm text-gray-500">
          Question {currentQuestion} of {totalQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-mh-gradient h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {questions[0].text}
        </h2>

        <div className="space-y-4">
          {questions[0].options.map((option) => (
            <label 
              key={option.value}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedAnswer === option.value
                  ? 'border-mh-green bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={option.value}
                checked={selectedAnswer === option.value}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                selectedAnswer === option.value
                  ? 'border-mh-green bg-mh-green'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-gray-700">{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 1}
          className={`px-6 py-3 rounded-full font-medium transition-colors ${
            currentQuestion === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`px-6 py-3 rounded-full font-medium transition-colors ${
            !selectedAnswer
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-mh-gradient text-white hover:bg-green-700'
          }`}
        >
          {currentQuestion === totalQuestions ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default AssessmentTestPage;