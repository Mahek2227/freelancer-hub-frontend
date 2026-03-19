import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: '',
    bid_amount: '',
  });
  const [deliverableForm, setDeliverableForm] = useState({
    message: '',
    fileUrl: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';
  const isOwner = project?.client?._id === user?._id;

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch project details
      const projectResponse = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(projectResponse.data);

      // Fetch proposals
      const proposalsResponse = await axios.get(
        `http://localhost:5000/api/proposals?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProposals(proposalsResponse.data);

      // Fetch deliverables
      const deliverablesResponse = await axios.get(
        `http://localhost:5000/api/deliverables?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeliverables(deliverablesResponse.data);

      // Fetch tasks
      const tasksResponse = await axios.get(
        `http://localhost:5000/api/tasks/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
      alert('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/proposals',
        {
          project: projectId,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Proposal submitted successfully!');
      setShowProposalModal(false);
      setFormData({ cover_letter: '', bid_amount: '' });
      fetchProjectDetails();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit proposal');
    }
  };

  const handleSubmitDeliverable = async () => {
    try {
      const token = localStorage.getToken();
      await axios.post(
        'http://localhost:5000/api/deliverables',
        {
          project: projectId,
          ...deliverableForm,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Deliverable submitted successfully!');
      setShowDeliverableModal(false);
      setDeliverableForm({ message: '', fileUrl: '' });
      fetchProjectDetails();
    } catch (error) {
      console.error('Error submitting deliverable:', error);
      alert('Failed to submit deliverable');
    }
  };

  const handleApproveDeliverable = async (deliverableId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/deliverables/approve/${deliverableId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Deliverable approved!');
      fetchProjectDetails();
    } catch (error) {
      console.error('Error approving deliverable:', error);
      alert('Failed to approve deliverable');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-700 mb-4"
        >
          ← Back
        </button>

        {/* Project Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-pink-500"></div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <div className="flex gap-4 items-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    project.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'open' ? '✓ Open' : project.status === 'in-progress' ? 'In Progress' : 'Completed'}
                  </span>
                  {project.client?.average_rating && (
                    <span className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold text-gray-900">{project.client.average_rating}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm mb-1">Budget</p>
                <p className="text-4xl font-bold text-indigo-600">₹{project.budget?.toLocaleString()}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex items-center gap-4 py-4 border-y">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {project.client?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{project.client?.name}</p>
                <p className="text-sm text-gray-600">
                  {project.client?.company_name ? `${project.client.company_name} • ` : ''}
                  {project.client?.total_projects_completed || 0} projects completed
                </p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => navigate(`/profile/${project.client?._id}`)}
                  className="px-6 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {['overview', 'proposals', 'deliverables', 'tasks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'proposals' && `Proposals (${proposals.length})`}
              {tab === 'deliverables' && `Deliverables (${deliverables.length})`}
              {tab === 'tasks' && `Tasks (${tasks.length})`}
              {tab === 'overview' && 'Overview'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              {/* Description */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Description</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>

                {/* Timeline */}
                {project.delivery && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Status</h2>
                    <div className="space-y-4">
                      {project.delivery.submittedAt && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                          <span className="text-2xl">✓</span>
                          <div>
                            <p className="font-medium text-gray-900">Delivered</p>
                            <p className="text-sm text-gray-600">
                              {new Date(project.delivery.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {project.delivery.message && (
                        <p className="text-gray-700">{project.delivery.message}</p>
                      )}
                      {project.delivery.link && (
                        <a
                          href={project.delivery.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          View Delivery →
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Action Buttons */}
                {isFreelancer && project.status === 'open' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <button
                      onClick={() => setShowProposalModal(true)}
                      className="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
                    >
                      Submit Proposal
                    </button>
                  </div>
                )}

                {isFreelancer && project.status === 'in-progress' && project.freelancer?._id === user._id && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <button
                      onClick={() => setShowDeliverableModal(true)}
                      className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                    >
                      Submit Deliverable
                    </button>
                  </div>
                )}

                {/* Project Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                      <p className="text-2xl font-bold text-indigo-600">₹{project.budget?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="font-medium text-gray-900 capitalize">{project.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Posted</p>
                      <p className="font-medium text-gray-900">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === 'proposals' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {proposals.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No proposals yet</p>
              ) : (
                <div className="space-y-6">
                  {proposals.map(proposal => (
                    <div
                      key={proposal._id}
                      className="border rounded-lg p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {proposal.freelancer?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{proposal.freelancer?.name}</h4>
                            <p className="text-sm text-gray-600">{proposal.freelancer?.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-indigo-600">₹{proposal.bid_amount?.toLocaleString()}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                            proposal.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : proposal.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {proposal.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{proposal.cover_letter}</p>

                      {isOwner && proposal.status === 'pending' && (
                        <button
                          onClick={() => {
                            // Handle accept proposal
                            console.log('Accept proposal:', proposal._id);
                          }}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Accept Proposal
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Deliverables Tab */}
          {activeTab === 'deliverables' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {deliverables.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No deliverables yet</p>
              ) : (
                <div className="space-y-6">
                  {deliverables.map(deliverable => (
                    <div
                      key={deliverable._id}
                      className="border rounded-lg p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Deliverable from {deliverable.freelancer?.name}
                          </h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            deliverable.status === 'submitted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {deliverable.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(deliverable.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700 mb-4">{deliverable.message}</p>
                      {deliverable.fileUrl && (
                        <a
                          href={deliverable.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          View Deliverable →
                        </a>
                      )}

                      {isOwner && deliverable.status === 'submitted' && (
                        <button
                          onClick={() => handleApproveDeliverable(deliverable._id)}
                          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Approve Work
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {tasks.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No tasks yet</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div
                      key={task._id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <input type="checkbox" className="w-5 h-5 rounded" />
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'todo'
                          ? 'bg-gray-100 text-gray-800'
                          : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit Proposal</h2>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.bid_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, bid_amount: e.target.value })
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
                  value={formData.cover_letter}
                  onChange={(e) =>
                    setFormData({ ...formData, cover_letter: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows="5"
                  placeholder="Tell the client why you're the best fit..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowProposalModal(false)}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProposal}
                className="flex-1 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deliverable Modal */}
      {showDeliverableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit Deliverable</h2>
              <button
                onClick={() => setShowDeliverableModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={deliverableForm.message}
                  onChange={(e) =>
                    setDeliverableForm({ ...deliverableForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows="4"
                  placeholder="Describe what you delivered..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File/Link URL
                </label>
                <input
                  type="url"
                  value={deliverableForm.fileUrl}
                  onChange={(e) =>
                    setDeliverableForm({ ...deliverableForm, fileUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://github.com/... or Google Drive link"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeliverableModal(false)}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDeliverable}
                className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
