import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import formSubmissionService from '@/services/api/formSubmissionService';
import formService from '@/services/api/formService';
import { format } from 'date-fns';

function AdminPanel() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [forms, setForms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Expanded submission details
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedForm, startDate, endDate]);

const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load services individually to provide better error handling
      let submissionsData = [];
      let formsData = [];
      let statsData = { total: 0, today: 0, lastWeek: 0, lastMonth: 0 };
      
      try {
        submissionsData = await formSubmissionService.getAll();
      } catch (submissionError) {
        console.warn('Failed to load submissions:', submissionError);
        toast.error('Failed to load form submissions');
      }
      
      try {
        formsData = await formService.getAll();
      } catch (formError) {
        console.warn('Failed to load forms:', formError);
        toast.error('Failed to load forms data');
      }
      
      try {
        statsData = await formSubmissionService.getSubmissionStats();
      } catch (statsError) {
        console.warn('Failed to load stats:', statsError);
        toast.error('Failed to load statistics');
      }
      
      setSubmissions(submissionsData || []);
      setForms(formsData || []);
      setStats(statsData || { total: 0, today: 0, lastWeek: 0, lastMonth: 0 });
      
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Some admin data could not be loaded. Please try again.');
      toast.error('Error loading admin panel data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters = {};
      if (selectedForm) filters.formId = selectedForm;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      
      const filteredData = await formSubmissionService.searchSubmissions(searchTerm, filters);
      setSubmissions(filteredData);
      setCurrentPage(1);
      
    } catch (err) {
      console.error('Error applying filters:', err);
      toast.error('Failed to apply filters');
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      await formSubmissionService.delete(submissionId);
      setSubmissions(prev => prev.filter(sub => sub.Id !== submissionId));
      toast.success('Submission deleted successfully');
      
      // Reload stats
      const newStats = await formSubmissionService.getSubmissionStats();
      setStats(newStats);
      
    } catch (err) {
      console.error('Error deleting submission:', err);
      toast.error('Failed to delete submission');
    }
  };

  const handleExportSubmissions = async () => {
    try {
      const exportData = await formSubmissionService.exportSubmissions(selectedForm || null);
      const blob = new Blob([JSON.stringify(exportData.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Exported ${exportData.totalRecords} submissions`);
      
    } catch (err) {
      console.error('Error exporting submissions:', err);
      toast.error('Failed to export submissions');
    }
  };

  const toggleSubmissionDetails = (submissionId) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedForm('');
    setStartDate('');
    setEndDate('');
  };

  // Pagination calculations
  const totalPages = Math.ceil(submissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = submissions.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInitialData} />;

  return (
<div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ApperIcon name="ArrowLeft" size={20} />
                <span className="ml-2">Back to Form Builder</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
            <Button onClick={handleExportSubmissions} className="bg-primary-500 hover:bg-primary-600">
              <ApperIcon name="Download" size={16} />
              <span className="ml-2">Export Data</span>
            </Button>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and review all form submissions
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <ApperIcon name="FileText" size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ApperIcon name="Calendar" size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.today}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <ApperIcon name="TrendingUp" size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lastWeek}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <ApperIcon name="BarChart3" size={24} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lastMonth}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Forms</option>
              {forms.map((form) => (
                <option key={form.Id} value={form.Id}>
                  {form.title}
                </option>
              ))}
            </select>
            
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full lg:w-auto"
            />
            
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full lg:w-auto"
            />
            
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full lg:w-auto"
            >
              <ApperIcon name="X" size={16} />
              <span className="ml-2">Clear</span>
            </Button>
          </div>
        </Card>

        {/* Submissions Table */}
        <Card className="overflow-hidden">
          {currentSubmissions.length === 0 ? (
            <Empty 
              message="No submissions found"
              description="No form submissions match your current filters."
              icon="FileText"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Form & Submission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Respondent Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentSubmissions.map((submission) => (
                      <React.Fragment key={submission.Id}>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {submission.formTitle}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {submission.Id} • {submission.metadata.fieldCount} fields
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {submission.data.name || submission.data.email || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {submission.ipAddress}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {format(new Date(submission.submittedAt), 'MMM dd, yyyy HH:mm')}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSubmissionDetails(submission.Id)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <ApperIcon 
                                  name={expandedSubmission === submission.Id ? "ChevronUp" : "ChevronDown"} 
                                  size={16} 
                                />
                                <span className="ml-1">
                                  {expandedSubmission === submission.Id ? "Hide" : "View"}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSubmission(submission.Id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <ApperIcon name="Trash2" size={16} />
                                <span className="ml-1">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Details */}
                        {expandedSubmission === submission.Id && (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 dark:text-white">Submission Details</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Object.entries(submission.data).map(([key, value]) => (
                                    <div key={key} className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </div>
                                      <div className="text-sm text-gray-900 dark:text-white mt-1">
                                        {Array.isArray(value) ? value.join(', ') : String(value)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {submission.metadata && (
                                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metadata</h5>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                      <div>Processing Time: {submission.metadata.processingTime}ms</div>
                                      <div>Source: {submission.metadata.submissionSource}</div>
                                      <div>User Agent: {submission.userAgent}</div>
                                      {submission.referrer && <div>Referrer: {submission.referrer}</div>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                      Showing {startIndex + 1} to {Math.min(endIndex, submissions.length)} of {submissions.length} submissions
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ApperIcon name="ChevronLeft" size={16} />
                        Previous
                      </Button>
                      
                      <span className="text-sm text-gray-700 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ApperIcon name="ChevronRight" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminPanel;