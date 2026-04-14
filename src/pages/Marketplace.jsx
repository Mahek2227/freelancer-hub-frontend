import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Marketplace() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budgetRange, setBudgetRange] = useState([0, 500000]);
  const [statusFilter, setStatusFilter] = useState('open');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalForm, setProposalForm] = useState({
    cover_letter: '',
    bid_amount: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isFreelancer = user?.role === 'freelancer';

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'design', name: 'Design' },
    { id: 'writing', name: 'Writing' },
    { id: 'marketing', name: 'Marketing' },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory, budgetRange, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('projects', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter to show only open projects for freelancers
      const availableProjects = isFreelancer
        ? response.data.filter(p => p.status === 'open')
        : response.data;

      setProjects(availableProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Budget filter
    filtered = filtered.filter(
      p => p.budget >= budgetRange[0] && p.budget <= budgetRange[1]
    );

    // Status filter
    filtered = filtered.filter(p => p.status === statusFilter);

    setFilteredProjects(filtered);
  };

  const handleSubmitProposal = async () => {
    if (!proposalForm.cover_letter.trim()) {
      alert('Please write a cover letter');
      return;
    }
    if (!proposalForm.bid_amount) {
      alert('Please enter a bid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'proposals',
        {
          project: selectedProposal._id,
          ...proposalForm,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Proposal submitted successfully!');
      setSelectedProposal(null);
      setProposalForm({ cover_letter: '', bid_amount: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit proposal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Freelance Marketplace</h1>
          <p className="text-gray-600">Browse and apply to projects posted by clients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Projects
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range: ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={budgetRange[1]}
                  onChange={(e) =>
                    setBudgetRange([budgetRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setBudgetRange([0, 500000]);
                  setStatusFilter('open');
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
                <p className="mt-2 text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map(project => (
                  <div
                    key={project._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                  >
                    {/* Project Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-pink-500 h-32"></div>

                    <div className="p-6 -mt-16 relative">
                      {/* Status Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status === 'open' ? '✓ Open' : project.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                        <span className="text-2xl font-bold text-indigo-600">₹{project.budget?.toLocaleString()}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Client Info */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {project.client?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {project.client?.name || 'Unknown Client'}
                          </p>
                          <p className="text-xs text-gray-500">Posted recently</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold text-gray-900">1-3 weeks</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Experience</p>
                          <p className="font-semibold text-gray-900">Intermediate</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Proposals</p>
                          <p className="font-semibold text-gray-900">2-5</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/projects/${project._id}`)}
                            className="flex-1 px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium"
                          >
                            View Details
                          </button>
                          {isFreelancer && project.status === 'open' && (
                            <button
                              onClick={() => setSelectedProposal(project)}
                              className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                        {isFreelancer && project.client && (
                          <button
                            onClick={() => navigate('/chat', { state: { startConversationWith: project.client._id } })}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                          >
                            💬 Message Client
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit Proposal</h2>
              <button
                onClick={() => setSelectedProposal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Project Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedProposal.title}</h3>
              <p className="text-sm text-gray-600">{selectedProposal.description}</p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">₹{selectedProposal.budget?.toLocaleString()}</p>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (₹)
                </label>
                <input
                  type="number"
                  value={proposalForm.bid_amount}
                  onChange={(e) =>
                    setProposalForm({ ...proposalForm, bid_amount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your bid amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={proposalForm.cover_letter}
                  onChange={(e) =>
                    setProposalForm({ ...proposalForm, cover_letter: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows="5"
                  placeholder="Tell the client why you're the best fit for this project..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProposal(null)}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProposal}
                className="flex-1 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
