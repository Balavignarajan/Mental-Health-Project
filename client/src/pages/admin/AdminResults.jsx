import { useState, useEffect } from 'react';
import { getAdminResults, getAdminResultById } from '../../api/adminApi';
import { showToast } from '../../utils/toast';

function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [selectedResult, setSelectedResult] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [page, search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(search && { search })
      };
      const response = await getAdminResults(params);
      if (response.success && response.data) {
        setResults(response.data.results || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
      showToast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (resultId) => {
    try {
      const response = await getAdminResultById(resultId);
      if (response.success && response.data) {
        setSelectedResult(response.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Failed to load result:', error);
      showToast.error('Failed to load result details');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchResults();
  };

  const getBandColorClass = (band) => {
    if (!band) return 'bg-gray-100 text-gray-700';
    const bandLower = band.toLowerCase();
    if (bandLower.includes('low') || bandLower.includes('minimal') || bandLower.includes('mild')) {
      return 'bg-green-100 text-green-700';
    }
    if (bandLower.includes('moderate') || bandLower.includes('medium')) {
      return 'bg-orange-100 text-orange-700';
    }
    if (bandLower.includes('high') || bandLower.includes('severe')) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  if (loading && results.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mh-green mb-4"></div>
          <p className="text-mh-dark">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-mh-dark">Assessment Results</h1>
          <p className="text-gray-600 mt-1">View all assessment results (read-only)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user email or test title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-mh-gradient text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Band</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Flags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.userId?.email || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.userId?.firstName || ''} {result.userId?.lastName || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.testId?.title || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{result.testId?.category || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-mh-dark">{result.score || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.band ? (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBandColorClass(result.band)}`}>
                          {result.band}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.riskFlags && Object.keys(result.riskFlags).length > 0 ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {Object.keys(result.riskFlags).length} flag(s)
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewResult(result._id)}
                        className="text-mh-green hover:text-[#027a4f]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * pagination.limit, pagination.total)}</span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                    const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                    if (pageNum > pagination.pages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pageNum
                            ? 'z-10 bg-mh-gradient border-mh-green text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white mb-10">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-mh-dark">Result Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm text-gray-900">
                      {selectedResult.userId?.email || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedResult.userId?.firstName || ''} {selectedResult.userId?.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Test</label>
                    <p className="text-sm text-gray-900">{selectedResult.testId?.title || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{selectedResult.testId?.category || ''}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Score</label>
                    <p className="text-lg font-semibold text-mh-dark">{selectedResult.score || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Band</label>
                    {selectedResult.band ? (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBandColorClass(selectedResult.band)}`}>
                        {selectedResult.band}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Completed</label>
                    <p className="text-sm text-gray-900">
                      {selectedResult.createdAt ? new Date(selectedResult.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Started At</label>
                    <p className="text-sm text-gray-900">
                      {selectedResult.attemptId?.startedAt ? new Date(selectedResult.attemptId.startedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedResult.subscales && Object.keys(selectedResult.subscales).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Subscales</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedResult.subscales).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-2 rounded">
                          <span className="text-xs font-medium text-gray-700">{key}:</span>
                          <span className="text-sm font-semibold text-mh-dark ml-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResult.riskFlags && Object.keys(selectedResult.riskFlags).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Risk Flags</label>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="space-y-1">
                        {Object.keys(selectedResult.riskFlags).map((flag) => (
                          <div key={flag} className="text-sm text-red-800">
                            <span className="font-semibold">{flag}:</span> Triggered
                          </div>
                        ))}
                      </div>
                      {selectedResult.interpretation?.riskHelpText && (
                        <p className="text-sm text-red-700 mt-2 italic">
                          {selectedResult.interpretation.riskHelpText}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedResult.interpretation && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Interpretation</label>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                      <p>Answered: {selectedResult.interpretation.answeredCount || 0} / {selectedResult.interpretation.totalItems || 0} questions</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResults;

