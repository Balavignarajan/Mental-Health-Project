import { useState, useEffect } from 'react';
import { getAssessmentLinks, createAssessmentLink, getAdminTests, getLinkResults } from '../../api/adminApi';
import { showToast } from '../../utils/toast';

function AdminAssessmentLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActiveFilter, setIsActiveFilter] = useState('true');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({
    testId: '',
    campaignName: '',
    expiresAt: '',
    maxAttempts: ''
  });
  const [createdLink, setCreatedLink] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkResults, setLinkResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsPagination, setResultsPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  useEffect(() => {
    fetchLinks();
    fetchTests();
  }, [page, isActiveFilter]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        isActive: isActiveFilter
      };
      const response = await getAssessmentLinks(params);
      if (response.success && response.data) {
        setLinks(response.data.links || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
      showToast.error('Failed to load assessment links');
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await getAdminTests({ isActive: 'true', limit: 100 });
      if (response.success && response.data) {
        setTests(response.data.tests || []);
      }
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    
    if (!formData.testId) {
      showToast.error('Please select a test');
      return;
    }

    try {
      setCreating(true);
      const linkData = {
        testId: formData.testId,
        campaignName: formData.campaignName || '',
        expiresAt: formData.expiresAt || null,
        maxAttempts: formData.maxAttempts ? parseInt(formData.maxAttempts) : null
      };

      const response = await createAssessmentLink(linkData);
      if (response.success && response.data) {
        showToast.success('Assessment link created successfully!');
        setCreatedLink(response.data);
        setFormData({ testId: '', campaignName: '', expiresAt: '', maxAttempts: '' });
        fetchLinks();
      } else {
        showToast.error(response.message || 'Failed to create link');
      }
    } catch (error) {
      console.error('Failed to create link:', error);
      showToast.error(error.response?.data?.message || 'Failed to create assessment link');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = (token) => {
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}/assessment-link/${token}`;
    navigator.clipboard.writeText(fullLink).then(() => {
      showToast.success('Link copied to clipboard!');
    }).catch(() => {
      showToast.error('Failed to copy link');
    });
  };

  const handleViewResults = async (link) => {
    try {
      setSelectedLink(link);
      setShowResultsModal(true);
      setLoadingResults(true);
      setResultsPage(1);
      
      const response = await getLinkResults(link._id, { page: 1, limit: 20 });
      if (response.success && response.data) {
        setLinkResults(response.data.results || []);
        setResultsPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch link results:', error);
      showToast.error('Failed to load results');
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchLinkResults = async (linkId, pageNum) => {
    try {
      setLoadingResults(true);
      const response = await getLinkResults(linkId, { page: pageNum, limit: 20 });
      if (response.success && response.data) {
        setLinkResults(response.data.results || []);
        setResultsPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch link results:', error);
      showToast.error('Failed to load results');
    } finally {
      setLoadingResults(false);
    }
  };

  const getBandColorClass = (band) => {
    if (!band) return 'bg-gray-100 text-gray-700';
    const bandLower = band.toLowerCase();
    if (bandLower.includes('low')) return 'bg-green-100 text-green-700';
    if (bandLower.includes('moderate') || bandLower.includes('medium')) return 'bg-orange-100 text-orange-700';
    if (bandLower.includes('high') || bandLower.includes('severe')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiration';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (link) => {
    if (!link.isActive) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Inactive</span>;
    }
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Expired</span>;
    }
    if (link.maxAttempts && link.currentAttempts >= link.maxAttempts) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Max Reached</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span>;
  };

  if (loading && links.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mh-green mb-4"></div>
          <p className="text-mh-dark">Loading assessment links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-mh-dark">Assessment Links</h1>
          <p className="text-gray-600 mt-1">Create and manage shareable assessment links</p>
        </div>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setCreatedLink(null);
          }}
          className="px-4 py-2 bg-mh-gradient text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          Create New Link
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            <select
              value={isActiveFilter}
              onChange={(e) => {
                setIsActiveFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent"
            >
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
              <option value="all">All Links</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {links.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No assessment links found
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {link.campaignName || 'No campaign name'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {link.testId?.title || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(link)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {link.currentAttempts || 0}
                        {link.maxAttempts ? ` / ${link.maxAttempts}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(link.expiresAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewResults(link)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Results
                        </button>
                        <button
                          onClick={() => handleCopyLink(link.linkToken)}
                          className="text-mh-green hover:text-green-700 font-medium"
                        >
                          Copy Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} links
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-mh-dark">Create Assessment Link</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreatedLink(null);
                    setFormData({ testId: '', campaignName: '', expiresAt: '', maxAttempts: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {createdLink ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold mb-2">Link Created Successfully!</p>
                    <div className="bg-white rounded p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">Shareable Link:</p>
                      <p className="text-sm font-mono break-all">{window.location.origin}/assessment-link/{createdLink.linkToken}</p>
                    </div>
                    <button
                      onClick={() => handleCopyLink(createdLink.linkToken)}
                      className="w-full px-4 py-2 bg-mh-gradient text-white rounded-lg font-medium hover:opacity-90"
                    >
                      Copy Link
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreatedLink(null);
                      setFormData({ testId: '', campaignName: '', expiresAt: '', maxAttempts: '' });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.testId}
                      onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent"
                    >
                      <option value="">Select a test</option>
                      {tests.map((test) => (
                        <option key={test._id} value={test._id}>
                          {test.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={formData.campaignName}
                      onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                      placeholder="e.g., Mental Health Awareness Week 2025"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Attempts (Optional)
                    </label>
                    <input
                      type="number"
                      value={formData.maxAttempts}
                      onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value })}
                      placeholder="e.g., 1000"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setFormData({ testId: '', campaignName: '', expiresAt: '', maxAttempts: '' });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 px-4 py-2 bg-mh-gradient text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {creating ? 'Creating...' : 'Create Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResultsModal && selectedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-mh-dark">Assessment Link Results</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedLink.campaignName || 'No campaign name'} - {selectedLink.testId?.title || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Participants: {selectedLink.currentAttempts || 0} | 
                    Completed: {linkResults.length > 0 ? resultsPagination.total : 0}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowResultsModal(false);
                    setSelectedLink(null);
                    setLinkResults([]);
                    setResultsPage(1);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingResults ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-mh-green mb-4"></div>
                    <p className="text-gray-600">Loading results...</p>
                  </div>
                </div>
              ) : linkResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No results found for this assessment link</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Band</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Flags</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {linkResults.map((result) => {
                          const participantInfo = result.attemptId?.participantInfo || {};
                          return (
                            <tr key={result._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {participantInfo.name || 'Anonymous'}
                                </div>
                                {participantInfo.email && (
                                  <div className="text-xs text-gray-500">{participantInfo.email}</div>
                                )}
                                <div className="text-xs text-gray-500">
                                  {participantInfo.gender && `${participantInfo.gender}`}
                                  {participantInfo.dateOfBirth && ` • ${participantInfo.dateOfBirth}`}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-semibold text-mh-dark">{result.score || 0}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {result.band ? (
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBandColorClass(result.band)}`}>
                                    {result.band}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {result.riskFlags && Object.keys(result.riskFlags).length > 0 ? (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                    {Object.keys(result.riskFlags).length} flag(s)
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">None</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {result.createdAt ? new Date(result.createdAt).toLocaleString() : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {resultsPagination.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="text-sm text-gray-700">
                        Showing {((resultsPagination.page - 1) * resultsPagination.limit) + 1} to {Math.min(resultsPagination.page * resultsPagination.limit, resultsPagination.total)} of {resultsPagination.total} results
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newPage = resultsPage - 1;
                            setResultsPage(newPage);
                            fetchLinkResults(selectedLink._id, newPage);
                          }}
                          disabled={resultsPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            const newPage = resultsPage + 1;
                            setResultsPage(newPage);
                            fetchLinkResults(selectedLink._id, newPage);
                          }}
                          disabled={resultsPage >= resultsPagination.pages}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowResultsModal(false);
                  setSelectedLink(null);
                  setLinkResults([]);
                  setResultsPage(1);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAssessmentLinks;

