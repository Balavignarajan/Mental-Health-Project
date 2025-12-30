import { useState, useEffect } from 'react';
import { getAssessmentLinks, createAssessmentLink, getAdminTests, getLinkResults, sendAssessmentLinkEmail, getLinkEmailHistory } from '../../api/adminApi';
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedLinkForEmail, setSelectedLinkForEmail] = useState(null);
  const [emailForm, setEmailForm] = useState({
    recipientEmails: '',
    customMessage: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResults, setEmailResults] = useState(null);
  const [showEmailHistoryModal, setShowEmailHistoryModal] = useState(false);
  const [selectedLinkForHistory, setSelectedLinkForHistory] = useState(null);
  const [emailHistory, setEmailHistory] = useState([]);
  const [loadingEmailHistory, setLoadingEmailHistory] = useState(false);
  const [emailHistoryPage, setEmailHistoryPage] = useState(1);
  const [emailHistoryPagination, setEmailHistoryPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [emailHistoryStatusFilter, setEmailHistoryStatusFilter] = useState('all');

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

  const handleSendEmail = (link) => {
    setSelectedLinkForEmail(link);
    setShowEmailModal(true);
    setEmailForm({ recipientEmails: '', customMessage: '' });
    setEmailResults(null);
  };

  const handleViewEmailHistory = async (link) => {
    try {
      setSelectedLinkForHistory(link);
      setShowEmailHistoryModal(true);
      setLoadingEmailHistory(true);
      setEmailHistoryPage(1);
      setEmailHistoryStatusFilter('all');
      
      const response = await getLinkEmailHistory(link._id, { page: 1, limit: 20 });
      if (response.success && response.data) {
        setEmailHistory(response.data.history || []);
        setEmailHistoryPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch email history:', error);
      showToast.error('Failed to load email history');
    } finally {
      setLoadingEmailHistory(false);
    }
  };

  const fetchEmailHistory = async (linkId, pageNum, status = 'all') => {
    try {
      setLoadingEmailHistory(true);
      const params = { page: pageNum, limit: 20 };
      if (status !== 'all') {
        params.status = status;
      }
      
      const response = await getLinkEmailHistory(linkId, params);
      if (response.success && response.data) {
        setEmailHistory(response.data.history || []);
        setEmailHistoryPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch email history:', error);
      showToast.error('Failed to load email history');
    } finally {
      setLoadingEmailHistory(false);
    }
  };

  const handleEmailHistoryFilterChange = (status) => {
    setEmailHistoryStatusFilter(status);
    setEmailHistoryPage(1);
    if (selectedLinkForHistory) {
      fetchEmailHistory(selectedLinkForHistory._id, 1, status);
    }
  };

  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
  };

  const parseEmails = (emailString) => {
    // Split by comma, semicolon, or newline, then trim and filter empty
    return emailString
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
  };

  const validateEmails = (emails) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emails.filter(email => !emailRegex.test(email));
    return { valid: invalid.length === 0, invalid };
  };

  const handleSendEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLinkForEmail) return;

    // Parse emails from input
    const emails = parseEmails(emailForm.recipientEmails);
    
    if (emails.length === 0) {
      showToast.error('Please enter at least one email address');
      return;
    }

    // Validate emails
    const validation = validateEmails(emails);
    if (!validation.valid) {
      showToast.error(`Invalid email addresses: ${validation.invalid.join(', ')}`);
      return;
    }

    try {
      setSendingEmail(true);
      setEmailResults(null);

      const response = await sendAssessmentLinkEmail(
        selectedLinkForEmail._id,
        emails.length === 1 ? emails[0] : emails, // Send as string if single, array if multiple
        emailForm.customMessage || ''
      );

      if (response.success && response.data) {
        setEmailResults(response.data);
        if (response.data.successful > 0) {
          showToast.success(`Successfully sent ${response.data.successful} email(s)!`);
        }
        if (response.data.failed > 0) {
          showToast.error(`Failed to send ${response.data.failed} email(s)`);
        }
      } else {
        showToast.error(response.message || 'Failed to send emails');
      }
    } catch (error) {
      console.error('Failed to send emails:', error);
      showToast.error(error.response?.data?.message || 'Failed to send emails');
    } finally {
      setSendingEmail(false);
    }
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
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewResults(link)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-left sm:text-center"
                        >
                          View Results
                        </button>
                        <button
                          onClick={() => handleSendEmail(link)}
                          className="text-purple-600 hover:text-purple-700 font-medium text-left sm:text-center"
                        >
                          Send Email
                        </button>
                        <button
                          onClick={() => handleViewEmailHistory(link)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-left sm:text-center"
                        >
                          Email History
                        </button>
                        <button
                          onClick={() => handleCopyLink(link.linkToken)}
                          className="text-mh-green hover:text-green-700 font-medium text-left sm:text-center"
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

      {/* Send Email Modal */}
      {showEmailModal && selectedLinkForEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-mh-dark">Send Assessment Link via Email</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedLinkForEmail.campaignName || 'No campaign name'} - {selectedLinkForEmail.testId?.title || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedLinkForEmail(null);
                    setEmailForm({ recipientEmails: '', customMessage: '' });
                    setEmailResults(null);
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
              {emailResults ? (
                <div className="space-y-4">
                  <div className={`rounded-lg p-4 ${
                    emailResults.successful > 0 && emailResults.failed === 0
                      ? 'bg-green-50 border border-green-200'
                      : emailResults.successful > 0 && emailResults.failed > 0
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <h3 className="font-semibold text-lg mb-2">
                      {emailResults.successful === emailResults.total
                        ? '✅ All emails sent successfully!'
                        : emailResults.successful > 0
                        ? `⚠️ ${emailResults.successful} sent, ${emailResults.failed} failed`
                        : '❌ Failed to send emails'}
                    </h3>
                    <p className="text-sm text-gray-700">
                      Total: {emailResults.total} | Successful: {emailResults.successful} | Failed: {emailResults.failed}
                    </p>
                  </div>

                  {emailResults.results && emailResults.results.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Email Status:</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {emailResults.results.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg text-sm ${
                              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{result.email}</span>
                              <span>{result.success ? '✅ Sent' : `❌ ${result.error || 'Failed'}`}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowEmailModal(false);
                        setSelectedLinkForEmail(null);
                        setEmailForm({ recipientEmails: '', customMessage: '' });
                        setEmailResults(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setEmailResults(null);
                        setEmailForm({ recipientEmails: '', customMessage: '' });
                      }}
                      className="flex-1 px-4 py-2 bg-mh-gradient text-white rounded-lg hover:opacity-90 transition"
                    >
                      Send Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email(s) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="recipientEmails"
                      value={emailForm.recipientEmails}
                      onChange={handleEmailFormChange}
                      placeholder="Enter email addresses separated by commas, semicolons, or new lines&#10;Example:&#10;email1@example.com&#10;email2@example.com&#10;email3@example.com"
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can enter multiple emails separated by commas, semicolons, or new lines
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Message (Optional)
                    </label>
                    <textarea
                      name="customMessage"
                      value={emailForm.customMessage}
                      onChange={handleEmailFormChange}
                      placeholder="Add a personal message that will appear in the email..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This message will be displayed prominently in the email
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-700 mb-1">Link Preview:</p>
                    <p className="text-xs text-gray-600 break-all">
                      {window.location.origin}/assessment-link/{selectedLinkForEmail.linkToken}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailModal(false);
                        setSelectedLinkForEmail(null);
                        setEmailForm({ recipientEmails: '', customMessage: '' });
                        setEmailResults(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingEmail || !emailForm.recipientEmails.trim()}
                      className="flex-1 px-4 py-2 bg-mh-gradient text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingEmail ? 'Sending...' : 'Send Email(s)'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email History Modal */}
      {showEmailHistoryModal && selectedLinkForHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-mh-dark">Email History</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedLinkForHistory.campaignName || 'No campaign name'} - {selectedLinkForHistory.testId?.title || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEmailHistoryModal(false);
                    setSelectedLinkForHistory(null);
                    setEmailHistory([]);
                    setEmailHistoryPage(1);
                    setEmailHistoryStatusFilter('all');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEmailHistoryFilterChange('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    emailHistoryStatusFilter === 'all'
                      ? 'bg-mh-gradient text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleEmailHistoryFilterChange('sent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    emailHistoryStatusFilter === 'sent'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sent
                </button>
                <button
                  onClick={() => handleEmailHistoryFilterChange('failed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    emailHistoryStatusFilter === 'failed'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Failed
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingEmailHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-mh-green mb-4"></div>
                    <p className="text-gray-600">Loading email history...</p>
                  </div>
                </div>
              ) : emailHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No email history found for this assessment link</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent By</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {emailHistory.map((email) => (
                          <tr key={email._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{email.recipientEmail}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900 max-w-xs truncate" title={email.subject}>
                                {email.subject}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {email.status === 'sent' ? (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  ✅ Sent
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  ❌ Failed
                                </span>
                              )}
                              {email.errorMessage && (
                                <div className="text-xs text-red-600 mt-1" title={email.errorMessage}>
                                  {email.errorMessage.length > 50 ? `${email.errorMessage.substring(0, 50)}...` : email.errorMessage}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900">
                                {email.sentBy?.firstName || ''} {email.sentBy?.lastName || ''}
                              </div>
                              <div className="text-xs text-gray-500">{email.sentBy?.email || ''}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {email.sentAt ? new Date(email.sentAt).toLocaleString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {emailHistoryPagination.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="text-sm text-gray-700">
                        Showing {((emailHistoryPagination.page - 1) * emailHistoryPagination.limit) + 1} to {Math.min(emailHistoryPagination.page * emailHistoryPagination.limit, emailHistoryPagination.total)} of {emailHistoryPagination.total} emails
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newPage = emailHistoryPage - 1;
                            setEmailHistoryPage(newPage);
                            fetchEmailHistory(selectedLinkForHistory._id, newPage, emailHistoryStatusFilter);
                          }}
                          disabled={emailHistoryPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            const newPage = emailHistoryPage + 1;
                            setEmailHistoryPage(newPage);
                            fetchEmailHistory(selectedLinkForHistory._id, newPage, emailHistoryStatusFilter);
                          }}
                          disabled={emailHistoryPage >= emailHistoryPagination.pages}
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
                  setShowEmailHistoryModal(false);
                  setSelectedLinkForHistory(null);
                  setEmailHistory([]);
                  setEmailHistoryPage(1);
                  setEmailHistoryStatusFilter('all');
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

