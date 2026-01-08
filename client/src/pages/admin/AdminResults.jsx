import { useState, useEffect } from 'react';
import { getAdminResults, getAdminResultById } from '../../api/adminApi';
import { showToast } from '../../utils/toast';

function AdminResults() {
  const [results, setResults] = useState([]);
  const [allResults, setAllResults] = useState([]); // Store all results for filtering/export
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [selectedResult, setSelectedResult] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [filters, setFilters] = useState({ 
    riskFlags: 'all', 
    band: 'all', 
    testCategory: 'all',
    sortBy: 'date', 
    sortOrder: 'desc' 
  });

  useEffect(() => {
    fetchResults();
  }, [page, search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 1000, // Fetch more for filtering/statistics
        ...(search && { search })
      };
      const response = await getAdminResults(params);
      if (response.success && response.data) {
        const allResultsData = response.data.results || [];
        setAllResults(allResultsData);
        applyFiltersAndSort(allResultsData);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
      showToast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const calculateStatistics = (results) => {
    if (!results || results.length === 0) {
      return {
        total: 0,
        avgScore: 0,
        bandDistribution: {},
        riskFlagCount: 0,
        avgTimeTaken: 0,
        avgCompletion: 0,
        registeredUsers: 0,
        anonymousUsers: 0
      };
    }

    const scores = results.map(r => r.score || 0).filter(s => s > 0);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;

    const bandDistribution = {};
    results.forEach(r => {
      const band = r.band || 'Unknown';
      bandDistribution[band] = (bandDistribution[band] || 0) + 1;
    });

    const riskFlagCount = results.filter(r => r.riskFlags && Object.keys(r.riskFlags).length > 0).length;

    const timeTaken = results
      .map(r => {
        if (r.attemptId?.startedAt && r.attemptId?.submittedAt) {
          return (new Date(r.attemptId.submittedAt) - new Date(r.attemptId.startedAt)) / 1000 / 60; // minutes
        }
        return null;
      })
      .filter(t => t !== null);
    const avgTimeTaken = timeTaken.length > 0 
      ? (timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length).toFixed(1) 
      : 0;

    const completions = results
      .map(r => {
        if (r.interpretation?.answeredCount && r.interpretation?.totalItems) {
          return (r.interpretation.answeredCount / r.interpretation.totalItems) * 100;
        }
        return null;
      })
      .filter(c => c !== null);
    const avgCompletion = completions.length > 0
      ? (completions.reduce((a, b) => a + b, 0) / completions.length).toFixed(1)
      : 0;

    const registeredUsers = results.filter(r => r.userId).length;
    const anonymousUsers = results.filter(r => !r.userId).length;

    return {
      total: results.length,
      avgScore: parseFloat(avgScore),
      bandDistribution,
      riskFlagCount,
      avgTimeTaken: parseFloat(avgTimeTaken),
      avgCompletion: parseFloat(avgCompletion),
      registeredUsers,
      anonymousUsers
    };
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (results, filterState = filters) => {
    let filtered = [...results];

    // Filter by search (if any)
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r => {
        const email = r.userId?.email?.toLowerCase() || '';
        const name = `${r.userId?.firstName || ''} ${r.userId?.lastName || ''}`.toLowerCase();
        const testTitle = r.testId?.title?.toLowerCase() || '';
        return email.includes(searchLower) || name.includes(searchLower) || testTitle.includes(searchLower);
      });
    }

    // Filter by risk flags
    if (filterState.riskFlags === 'with') {
      filtered = filtered.filter(r => r.riskFlags && Object.keys(r.riskFlags).length > 0);
    } else if (filterState.riskFlags === 'without') {
      filtered = filtered.filter(r => !r.riskFlags || Object.keys(r.riskFlags).length === 0);
    }

    // Filter by band
    if (filterState.band !== 'all') {
      filtered = filtered.filter(r => {
        const band = (r.band || '').toLowerCase();
        return band.includes(filterState.band.toLowerCase());
      });
    }

    // Filter by test category
    if (filterState.testCategory !== 'all') {
      filtered = filtered.filter(r => {
        const category = (r.testId?.category || '').toLowerCase();
        return category === filterState.testCategory.toLowerCase();
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (filterState.sortBy) {
        case 'score':
          aVal = a.score || 0;
          bVal = b.score || 0;
          break;
        case 'date':
          aVal = new Date(a.createdAt || 0).getTime();
          bVal = new Date(b.createdAt || 0).getTime();
          break;
        case 'time':
          aVal = a.attemptId?.startedAt && a.attemptId?.submittedAt
            ? (new Date(a.attemptId.submittedAt) - new Date(a.attemptId.startedAt))
            : 0;
          bVal = b.attemptId?.startedAt && b.attemptId?.submittedAt
            ? (new Date(b.attemptId.submittedAt) - new Date(b.attemptId.startedAt))
            : 0;
          break;
        default:
          aVal = new Date(a.createdAt || 0).getTime();
          bVal = new Date(b.createdAt || 0).getTime();
      }
      return filterState.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    setResults(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setTimeout(() => {
      applyFiltersAndSort(allResults, newFilters);
    }, 0);
  };

  // Toggle row expansion
  const toggleRowExpansion = (resultId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedRows(newExpanded);
  };

  // Calculate time taken in minutes
  const getTimeTaken = (result) => {
    if (result.attemptId?.startedAt && result.attemptId?.submittedAt) {
      const minutes = (new Date(result.attemptId.submittedAt) - new Date(result.attemptId.startedAt)) / 1000 / 60;
      return minutes.toFixed(1);
    }
    return '-';
  };

  // Calculate completion percentage
  const getCompletionPercentage = (result) => {
    if (result.interpretation?.answeredCount && result.interpretation?.totalItems) {
      return ((result.interpretation.answeredCount / result.interpretation.totalItems) * 100).toFixed(0);
    }
    return '-';
  };

  // Get unique test categories
  const getUniqueCategories = () => {
    const categories = new Set();
    allResults.forEach(r => {
      if (r.testId?.category) {
        categories.add(r.testId.category);
      }
    });
    return Array.from(categories).sort();
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (results.length === 0) {
      showToast.error('No results to export');
      return;
    }

    const headers = [
      'User Email',
      'User Name',
      'Test Title',
      'Test Category',
      'Score',
      'Band',
      'Band Description',
      'Risk Flags',
      'Risk Flag Details',
      'Time Taken (minutes)',
      'Completion %',
      'Answered Questions',
      'Total Questions',
      'Started At',
      'Completed At',
      'Link Token'
    ];

    const rows = results.map(result => {
      const riskFlags = result.riskFlags || {};
      const riskFlagKeys = Object.keys(riskFlags);
      const riskFlagDetails = riskFlagKeys.length > 0 
        ? riskFlagKeys.map(k => `${k}: ${typeof riskFlags[k] === 'object' && riskFlags[k].helpText ? riskFlags[k].helpText : 'Triggered'}`).join('; ')
        : 'None';

      return [
        result.userId?.email || '',
        `${result.userId?.firstName || ''} ${result.userId?.lastName || ''}`.trim() || 'Anonymous',
        result.testId?.title || '',
        result.testId?.category || '',
        result.score || 0,
        result.band || '',
        result.bandDescription || '',
        riskFlagKeys.length > 0 ? `${riskFlagKeys.length} flag(s)` : 'None',
        riskFlagDetails,
        getTimeTaken(result),
        getCompletionPercentage(result),
        result.interpretation?.answeredCount || 0,
        result.interpretation?.totalItems || 0,
        result.attemptId?.startedAt ? new Date(result.attemptId.startedAt).toLocaleString() : '',
        result.createdAt ? new Date(result.createdAt).toLocaleString() : '',
        result.linkToken || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assessment-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success('Results exported successfully!');
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
    // Apply filters with current search term
    applyFiltersAndSort(allResults, filters);
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

  const stats = calculateStatistics(allResults);

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-mh-dark">Assessment Results</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View all assessment results (read-only)</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
          title="Export to CSV"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Summary Statistics */}
      {stats.total > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-mh-dark mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500">Total Results</div>
              <div className="text-xl font-bold text-mh-dark">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500">Avg Score</div>
              <div className="text-xl font-bold text-mh-dark">{stats.avgScore}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500">Avg Time</div>
              <div className="text-xl font-bold text-mh-dark">{stats.avgTimeTaken} min</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500">Avg Completion</div>
              <div className="text-xl font-bold text-mh-dark">{stats.avgCompletion}%</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500">With Risk Flags</div>
              <div className="text-xl font-bold text-red-600">{stats.riskFlagCount}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500">Registered Users</div>
              <div className="text-xl font-bold text-blue-600">{stats.registeredUsers}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500">Anonymous</div>
              <div className="text-xl font-bold text-gray-600">{stats.anonymousUsers}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user email, name, or test title..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mh-green focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-mh-gradient text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-colors text-sm sm:text-base"
            >
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">Filter:</label>
              <select
                value={filters.riskFlags}
                onChange={(e) => handleFilterChange('riskFlags', e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-mh-green focus:border-transparent"
              >
                <option value="all">All Results</option>
                <option value="with">With Risk Flags</option>
                <option value="without">Without Risk Flags</option>
              </select>
              <select
                value={filters.band}
                onChange={(e) => handleFilterChange('band', e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-mh-green focus:border-transparent"
              >
                <option value="all">All Bands</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
              <select
                value={filters.testCategory}
                onChange={(e) => handleFilterChange('testCategory', e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-mh-green focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs sm:text-sm text-gray-600 font-medium">Sort:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-mh-green focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="score">Score</option>
                <option value="time">Time Taken</option>
              </select>
              <button
                type="button"
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50"
                title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Showing {results.length} of {stats.total} results
            </div>
          </div>
        </form>
      </div>

      {/* Results Table - Desktop */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Band</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Flags</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((result) => {
                  const isExpanded = expandedRows.has(result._id);
                  const riskFlagCount = result.riskFlags ? Object.keys(result.riskFlags).length : 0;
                  return (
                    <>
                      <tr key={result._id} className="hover:bg-gray-50">
                        <td className="px-3 py-4">
                          <button
                            onClick={() => toggleRowExpansion(result._id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg 
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {result.userId?.email || (result.linkToken ? 'Anonymous (Link)' : 'Anonymous')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.userId ? (
                              `${result.userId.firstName || ''} ${result.userId.lastName || ''}`.trim() || 'N/A'
                            ) : (
                              result.linkToken ? `Link: ${result.linkToken.substring(0, 12)}...` : 'No user info'
                            )}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.testId?.title || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{result.testId?.category || ''}</div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-mh-dark">{result.score || 0}</div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          {result.band ? (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBandColorClass(result.band)}`}>
                              {result.band}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          {riskFlagCount > 0 ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {riskFlagCount} flag(s)
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {getTimeTaken(result)} min
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {getCompletionPercentage(result)}%
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewResult(result._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors whitespace-nowrap"
                              title="View Result"
                            >
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${result._id}-expanded`} className="bg-gray-50">
                          <td colSpan="10" className="px-4 xl:px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {result.bandDescription && (
                                <div>
                                  <div className="font-medium text-gray-700 mb-1">Band Description</div>
                                  <div className="text-gray-600 bg-blue-50 p-2 rounded">{result.bandDescription}</div>
                                </div>
                              )}
                              {result.subscales && Object.keys(result.subscales).length > 0 && (
                                <div>
                                  <div className="font-medium text-gray-700 mb-1">Subscales</div>
                                  <div className="space-y-1">
                                    {Object.entries(result.subscales).map(([key, value]) => (
                                      <div key={key} className="flex justify-between bg-gray-100 p-2 rounded">
                                        <span className="text-gray-700">{key}:</span>
                                        <span className="font-semibold text-mh-dark">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {riskFlagCount > 0 && (
                                <div className="md:col-span-2">
                                  <div className="font-medium text-gray-700 mb-1">Risk Flags</div>
                                  <div className="bg-red-50 border border-red-200 rounded p-3 space-y-2">
                                    {Object.entries(result.riskFlags).map(([flag, data]) => (
                                      <div key={flag} className="text-sm">
                                        <span className="font-semibold text-red-800">{flag}:</span>
                                        <span className="text-red-700 ml-2">
                                          {typeof data === 'object' && data.helpText ? data.helpText : 'Triggered'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {result.interpretation && (
                                <div className="md:col-span-2">
                                  <div className="font-medium text-gray-700 mb-1">Interpretation</div>
                                  <div className="bg-gray-100 p-2 rounded text-gray-700">
                                    <div className="text-xs mb-1">
                                      Answered: {result.interpretation.answeredCount || 0} / {result.interpretation.totalItems || 0} questions
                                    </div>
                                    {result.interpretation.text && (
                                      <div className="text-sm mt-1">{result.interpretation.text}</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          {results.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No results found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {results.map((result) => {
                const isExpanded = expandedRows.has(result._id);
                const riskFlagCount = result.riskFlags ? Object.keys(result.riskFlags).length : 0;
                return (
                  <div key={result._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {result.userId?.email || (result.linkToken ? 'Anonymous (Link)' : 'Anonymous')}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {result.userId ? (
                              `${result.userId.firstName || ''} ${result.userId.lastName || ''}`.trim() || 'N/A'
                            ) : (
                              result.linkToken ? `Link: ${result.linkToken.substring(0, 12)}...` : 'No user info'
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleRowExpansion(result._id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg 
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500">Test</div>
                        <div className="text-sm text-gray-900 mt-1">{result.testId?.title || 'N/A'}</div>
                        {result.testId?.category && (
                          <div className="text-xs text-gray-500">{result.testId.category}</div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500">Score</div>
                          <div className="text-sm font-semibold text-mh-dark mt-1">{result.score || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Band</div>
                          <div>
                            {result.band ? (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBandColorClass(result.band)}`}>
                                {result.band}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">-</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Risk Flags</div>
                          <div>
                            {riskFlagCount > 0 ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                {riskFlagCount} flag(s)
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">None</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="text-xs text-gray-600">{getTimeTaken(result)} min</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Completion</div>
                          <div className="text-xs text-gray-600">{getCompletionPercentage(result)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Date</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '-'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewResult(result._id)}
                        className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-2 border-t border-gray-100"
                      >
                        View Full Details →
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200 space-y-3">
                        {result.bandDescription && (
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Band Description</div>
                            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">{result.bandDescription}</div>
                          </div>
                        )}
                        {result.subscales && Object.keys(result.subscales).length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Subscales</div>
                            <div className="space-y-1">
                              {Object.entries(result.subscales).map(([key, value]) => (
                                <div key={key} className="flex justify-between bg-gray-100 p-2 rounded text-xs">
                                  <span className="text-gray-700">{key}:</span>
                                  <span className="font-semibold text-mh-dark">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {riskFlagCount > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Risk Flags</div>
                            <div className="bg-red-50 border border-red-200 rounded p-2 space-y-1">
                              {Object.entries(result.riskFlags).map(([flag, data]) => (
                                <div key={flag} className="text-xs">
                                  <span className="font-semibold text-red-800">{flag}:</span>
                                  <span className="text-red-700 ml-1">
                                    {typeof data === 'object' && data.helpText ? data.helpText : 'Triggered'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {result.interpretation && (
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Interpretation</div>
                            <div className="bg-gray-100 p-2 rounded text-xs text-gray-700">
                              <div className="mb-1">
                                Answered: {result.interpretation.answeredCount || 0} / {result.interpretation.totalItems || 0} questions
                              </div>
                              {result.interpretation.text && (
                                <div className="mt-1">{result.interpretation.text}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between w-full sm:hidden">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 mr-2"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 ml-2"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700">
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
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-medium ${
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-lg sm:text-xl font-bold text-mh-dark">Result Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {(() => {
                const riskFlagCount = selectedResult.riskFlags ? Object.keys(selectedResult.riskFlags).length : 0;
                return (
                  <>
                    {/* User Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">User Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedResult.userId?.email || (selectedResult.linkToken ? 'Anonymous (Link)' : 'Anonymous')}
                          </div>
                        </div>
                        {selectedResult.userId && (
                          <div>
                            <div className="text-xs text-gray-500">Name</div>
                            <div className="text-sm text-gray-900">
                              {`${selectedResult.userId.firstName || ''} ${selectedResult.userId.lastName || ''}`.trim() || 'N/A'}
                            </div>
                          </div>
                        )}
                        {selectedResult.linkToken && (
                          <div>
                            <div className="text-xs text-gray-500">Link Token</div>
                            <div className="text-sm text-gray-900 font-mono">{selectedResult.linkToken}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Test Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Test Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Test Title</div>
                          <div className="text-sm font-medium text-gray-900">{selectedResult.testId?.title || 'N/A'}</div>
                        </div>
                        {selectedResult.testId?.category && (
                          <div>
                            <div className="text-xs text-gray-500">Category</div>
                            <div className="text-sm text-gray-900">{selectedResult.testId.category}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assessment Results */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Assessment Results</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Score</div>
                          <div className="text-2xl font-bold text-mh-dark">{selectedResult.score || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Band</div>
                          <div className="mt-1">
                            {selectedResult.band ? (
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getBandColorClass(selectedResult.band)}`}>
                                {selectedResult.band}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </div>
                        </div>
                        {selectedResult.bandDescription && (
                          <div className="sm:col-span-2">
                            <div className="text-xs text-gray-500 mb-1">Band Description</div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                              {selectedResult.bandDescription}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-gray-500">Time Taken</div>
                          <div className="text-sm font-medium text-gray-900">{getTimeTaken(selectedResult)} minutes</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Completion</div>
                          <div className="text-sm font-medium text-gray-900">{getCompletionPercentage(selectedResult)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Started At</div>
                          <div className="text-sm text-gray-900">
                            {selectedResult.attemptId?.startedAt ? new Date(selectedResult.attemptId.startedAt).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Completed At</div>
                          <div className="text-sm text-gray-900">
                            {selectedResult.createdAt ? new Date(selectedResult.createdAt).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscales */}
                    {selectedResult.subscales && Object.keys(selectedResult.subscales).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Subscales</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(selectedResult.subscales).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <div className="text-xs text-gray-500 mb-1">{key}</div>
                              <div className="text-lg font-bold text-mh-dark">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Flags */}
                    {riskFlagCount > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-3">Risk Flags ({riskFlagCount})</h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                          {Object.entries(selectedResult.riskFlags).map(([flag, data]) => (
                            <div key={flag} className="border-b border-red-200 last:border-b-0 pb-2 last:pb-0">
                              <div className="font-semibold text-red-800 text-sm mb-1">{flag}</div>
                              <div className="text-sm text-red-700">
                                {typeof data === 'object' && data.helpText ? data.helpText : 'Risk flag triggered'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interpretation */}
                    {selectedResult.interpretation && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Interpretation</h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="text-xs text-gray-600 mb-2">
                            Answered: {selectedResult.interpretation.answeredCount || 0} / {selectedResult.interpretation.totalItems || 0} questions
                          </div>
                          {selectedResult.interpretation.text && (
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedResult.interpretation.text}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
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

export default AdminResults;

