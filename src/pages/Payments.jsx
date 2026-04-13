import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Payments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    amount: '',
    dueDate: '',
    description: 'Project completion payment',
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch invoices from backend
      const invoicesResponse = await axios.get('/invoices');
      setInvoices(invoicesResponse.data);

      // Also fetch projects for creating new invoices
      if (user?.role === 'client') {
        const projectsResponse = await axios.get('/projects');
        setProjects(projectsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedProject || !invoiceData.amount || !invoiceData.dueDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Create invoice with the selected project's freelancer
      await axios.post('/invoices', {
        project: selectedProject._id,
        freelancer: selectedProject.freelancer?._id,
        amount: parseFloat(invoiceData.amount),
        dueDate: invoiceData.dueDate,
        description: invoiceData.description || 'Project completion payment',
      });

      alert('Invoice created successfully!');
      setShowInvoiceModal(false);
      setSelectedProject(null);
      setInvoiceData({ amount: '', dueDate: '', description: 'Project completion payment' });
      fetchData();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert(error.response?.data?.message || 'Failed to create invoice');
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    try {
      // Mark invoice as paid
      await axios.post(`/invoices/${invoiceId}/mark-paid`, {});

      alert('Payment processed successfully!');
      fetchData();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(error.response?.data?.message || 'Failed to process payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payments & Invoices</h1>
          <p className="text-gray-600">Manage your payments and invoices</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Earned</p>
            <p className="text-3xl font-bold text-green-600">₹{invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Pending Payment</p>
            <p className="text-3xl font-bold text-yellow-600">₹{invoices.reduce((sum, inv) => sum + (inv.status === 'pending' ? inv.amount : 0), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">₹{invoices.reduce((sum, inv) => sum + (inv.status === 'overdue' ? inv.amount : 0), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Invoices</p>
            <p className="text-3xl font-bold text-indigo-600">{invoices.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 font-medium rounded-lg transition ${
              activeTab === 'invoices'
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Invoices ({invoices.length})
          </button>
          {user?.role === 'client' && (
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 font-medium rounded-lg transition ${
                activeTab === 'projects'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Create Invoice
            </button>
          )}
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Payment History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map(invoice => (
                  <div
                    key={invoice._id}
                    className="border rounded-lg p-6 hover:bg-gray-50 transition flex justify-between items-start"
                  >
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 mb-2">{invoice.project?.title || 'Project'}</h3>
                      <p className="text-sm text-gray-600 mb-2">From: {invoice.freelancer?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600 mb-3">₹{invoice.amount.toLocaleString()}</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                      {invoice.status !== 'paid' && user?.role === 'client' && (
                        <button
                          onClick={() => handlePayInvoice(invoice._id)}
                          className="block w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && user?.role === 'client' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Invoice</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Project
                </label>
                <select
                  onChange={(e) => {
                    const proj = projects.find(p => p._id === e.target.value);
                    setSelectedProject(proj);
                    if (proj) {
                      setInvoiceData({ ...invoiceData, amount: proj.budget });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select a project --</option>
                  {projects
                    .filter(p => p.status === 'in-progress' || p.status === 'completed')
                    .map(p => (
                      <option key={p._id} value={p._id}>
                        {p.title} - ₹{p.budget?.toLocaleString()}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={invoiceData.amount}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, amount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={invoiceData.description}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows="4"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setInvoiceData({
                      amount: '',
                      dueDate: '',
                      description: 'Project completion payment',
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={handleCreateInvoice}
                  className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
            
            {invoices.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No payment history</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Project</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(invoice => (
                      <tr key={invoice._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(invoice.paidDate || invoice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900">{invoice.project?.title || 'Project'}</td>
                        <td className="py-3 px-4 font-semibold text-indigo-600">
                          ₹{invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
