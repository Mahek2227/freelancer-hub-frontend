import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Payments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
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

      const invoicesResponse = await axios.get('/invoices');
      setInvoices(invoicesResponse.data);

      if (user?.role === 'client') {
        const projectsResponse = await axios.get('/projects');
        setProjects(projectsResponse.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedProject || !invoiceData.amount || !invoiceData.dueDate) {
      alert('Fill all fields');
      return;
    }

    try {
      await axios.post('/invoices', {
        project: selectedProject._id,
        freelancer: selectedProject.freelancer?._id,
        amount: parseFloat(invoiceData.amount),
        dueDate: invoiceData.dueDate,
        description: invoiceData.description,
      });

      alert('Invoice created');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handlePayInvoice = async (id) => {
    await axios.post(`/invoices/${id}/mark-paid`);
    fetchData();
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payments & Invoices
          </h1>
          <p className="text-gray-600">
            {user?.role === 'client'
              ? 'Manage your payments and invoices'
              : 'Track your earnings and invoices'}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">
              {user?.role === 'client' ? 'Total Spent' : 'Total Earned'}
            </p>
            <p className="text-3xl font-bold text-green-600">
              ₹{invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Pending Payment</p>
            <p className="text-3xl font-bold text-yellow-600">
              ₹{invoices.reduce((sum, inv) => sum + (inv.status === 'pending' ? inv.amount : 0), 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{invoices.reduce((sum, inv) => sum + (inv.status === 'overdue' ? inv.amount : 0), 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Invoices</p>
            <p className="text-3xl font-bold text-indigo-600">
              {invoices.length}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'invoices'
                ? 'bg-indigo-500 text-white shadow'
                : 'bg-white border'
            }`}
          >
            Invoices ({invoices.length})
          </button>

          {user?.role === 'client' && (
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTab === 'projects'
                  ? 'bg-indigo-500 text-white shadow'
                  : 'bg-white border'
              }`}
            >
              Create Invoice
            </button>
          )}

          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'history'
                ? 'bg-indigo-500 text-white shadow'
                : 'bg-white border'
            }`}
          >
            Payment History
          </button>
        </div>

        {/* INVOICES */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {invoices.map(invoice => (
              <div
                key={invoice._id}
                className="border border-gray-200 rounded-xl p-6 mb-4 hover:bg-gray-50 transition flex justify-between items-start"
              >

                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {invoice.project?.title || 'Project'}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    {user?.role === 'client'
                      ? `Freelancer: ${invoice.freelancer?.name || 'Unknown'}`
                      : `Client: ${invoice.client?.name || 'Unknown'}`
                    }
                  </p>

                  <p className="text-sm text-gray-600">
                    Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600 mb-3">
                    ₹{invoice.amount}
                  </p>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {invoice.status}
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

        {/* CREATE INVOICE */}
        {activeTab === 'projects' && user?.role === 'client' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">

            <select
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => {
                const p = projects.find(p => p._id === e.target.value);
                setSelectedProject(p);
              }}
            >
              <option>Select Project</option>

              {projects
                .filter(p => !invoices.some(i => i.project?._id === p._id))
                .map(p => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
            </select>

            <input
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Amount"
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, amount: e.target.value })
              }
            />

            <input
              className="w-full px-4 py-2 border rounded-lg"
              type="date"
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, dueDate: e.target.value })
              }
            />

            <button
              onClick={handleCreateInvoice}
              className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
            >
              Create Invoice
            </button>
          </div>
        )}
        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Payment History
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left">

                {/* HEADER */}
                <thead>
                  <tr className="border-b text-gray-700 text-sm">
                    <th className="py-4">Date</th>
                    <th className="py-4">Project</th>
                    <th className="py-4 text-right">Amount</th>
                    <th className="py-4 text-center">Status</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="py-4 text-gray-700">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 text-gray-900">
                        {inv.project?.title || 'Project'}
                      </td>

                      <td className="py-4 text-right font-semibold text-indigo-600">
                        ₹{inv.amount}
                      </td>

                      <td className="py-4 text-center">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-semibold ${
                            inv.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : inv.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}







              </div>
            </div>
  );
}