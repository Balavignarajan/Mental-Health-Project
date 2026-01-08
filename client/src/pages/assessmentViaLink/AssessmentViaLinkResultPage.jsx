import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';

function AssessmentViaLinkResultPage() {
  const navigate = useNavigate();
  const { token, resultId } = useParams();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resultId && token) {
      // Get result from localStorage (stored when submitting)
      const storedResult = localStorage.getItem(`linkResult_${token}`);
      if (storedResult) {
        try {
          const parsedResult = JSON.parse(storedResult);
          setResult(parsedResult);
        } catch (err) {
          console.error('Error parsing stored result:', err);
          setError('Failed to load result data');
        }
      } else {
        setError('Result not found');
      }
      setLoading(false);
    } else {
      toast.error('Invalid result');
      setLoading(false);
    }
  }, [resultId, token]);

  const displayResult = result;

  // Get band color class
  const getBandColorClass = (band) => {
    if (!band) return 'bg-gray-100 text-gray-700';
    const bandLower = band.toLowerCase();
    if (bandLower.includes('low')) return 'bg-green-100 text-green-700';
    if (bandLower.includes('moderate') || bandLower.includes('medium')) return 'bg-orange-100 text-orange-700';
    if (bandLower.includes('high') || bandLower.includes('severe')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mh-green"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !displayResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load results'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-mh-gradient text-white rounded-full"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const interpretation = displayResult.interpretation || {};
  const riskFlags = displayResult.riskFlags || {};

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 lg:px-20 xl:px-40 py-6">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb isLoggedIn={false} customLabel="Assessment Results" />
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Assessment Completed!</h2>
        <p className="text-green-700">Thank you for completing the assessment. Your results are below.</p>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Results</h3>
        
        {/* Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Score</span>
            <span className="text-2xl font-bold text-mh-green">{displayResult.score || 'N/A'}</span>
          </div>
        </div>

        {/* Band */}
        {displayResult.band && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Category</span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getBandColorClass(displayResult.band)}`}>
                {displayResult.band}
              </span>
            </div>
            {displayResult.bandDescription && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm leading-relaxed">{displayResult.bandDescription}</p>
              </div>
            )}
          </div>
        )}

        {/* Interpretation */}
        {interpretation.riskHelpText && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Interpretation</h4>
            <p className="text-gray-700 leading-relaxed">{interpretation.riskHelpText}</p>
          </div>
        )}

        {/* Risk Flags */}
        {Object.keys(riskFlags).length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Important Notice</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Based on your responses, we recommend consulting with a mental health professional for further evaluation.
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-sm text-gray-600">
            This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-mh-gradient text-white rounded-full font-medium hover:opacity-90 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default AssessmentViaLinkResultPage;

