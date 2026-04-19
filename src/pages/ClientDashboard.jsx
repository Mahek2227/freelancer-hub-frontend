import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ClientDashboard() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomingProposals, setIncomingProposals] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all client projects
      const projectsRes = await api.get("/projects");
      const clientProjects = projectsRes.data.filter(p => p.client?._id === user._id);
      setProjects(clientProjects);

      // Fetch incoming proposals for client's projects
      const allProposals = [];
      for (const project of clientProjects) {
        try {
          const propRes = await api.get(`/proposals/${project._id}`);
          allProposals.push(...propRes.data);
        } catch (err) {
          console.log(`No proposals for project ${project._id}`);
        }
      }
      setIncomingProposals(allProposals.filter(p => p.status === "pending"));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading...</p>
      </div>
    );
  }

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const spentBudget = projects
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        {/* HEADER + BELL */}
          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 font-medium">
                Manage your projects and collaborate with freelancers
              </p>
            </div>

            

          </div>
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium mb-2">Total Projects</p>
                <p className="text-4xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium mb-2">In Progress</p>
                <p className="text-4xl font-bold text-gray-900">
                  {projects.filter(p => p.status === "in-progress").length}
                </p>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium mb-2">Completed</p>
                <p className="text-4xl font-bold text-gray-900">
                  {projects.filter(p => p.status === "completed").length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          {/* Incoming Proposals */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium mb-2">New Proposals</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {incomingProposals.length}
                </p>
              </div>
              <div className="text-4xl">✉️</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* ALL PROJECTS */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
                <a
                  href="/projects"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  + New Project
                </a>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">No projects yet</p>
                  <a
                    href="/projects"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Create your first project →
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {project.description.substring(0, 100)}...
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                            project.status === "open"
                              ? "bg-green-100 text-green-700"
                              : project.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="flex gap-6">
                          <div>
                            <p className="text-xs text-gray-600">Budget</p>
                            <p className="text-lg font-bold text-gray-900">₹{project.budget}</p>
                          </div>
                          {project.freelancer && (
                            <div>
                              <p className="text-xs text-gray-600">Assigned to</p>
                              <p className="text-sm font-bold text-gray-900">
                                {project.freelancer?.name || "Freelancer"}
                              </p>
                            </div>
                          )}
                        </div>
                        <a
                          href={`/projects/${project._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          View →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* BUDGET OVERVIEW */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Overview</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="font-bold text-gray-900">₹{totalBudget}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-600">Amount Spent</p>
                    <p className="font-bold text-gray-900">₹{spentBudget}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: spentBudget > 0 ? `${(spentBudget / totalBudget) * 100}%` : "0%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{totalBudget - spentBudget}
                  </p>
                </div>
              </div>
            </div>

            {/* INCOMING PROPOSALS */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pending Proposals
              </h3>

              {incomingProposals.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending proposals</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {incomingProposals.slice(0, 5).map((proposal) => (
                    <div
                      key={proposal._id}
                      className="border border-yellow-200 rounded-lg p-3 bg-yellow-50"
                    >
                      <p className="font-semibold text-gray-900 text-sm">
                        {proposal.freelancer?.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Bid: <span className="font-bold">₹{proposal.bidAmount}</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`/projects`}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-block"
                        >
                          Review →
                        </a>
                        {proposal.freelancer && (
                          <button
                            onClick={() => navigate('/chat', { state: { startConversationWith: proposal.freelancer._id } })}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            💬 Message
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-2">
                <a
                  href="/projects"
                  className="block w-full py-2 text-left px-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-lg font-medium transition-colors text-center"
                >
                  Create Project
                </a>
                <a
                  href="/projects"
                  className="block w-full py-2 text-left px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium transition-colors text-center"
                >
                  View All Projects
                </a>
                <a
                  href="/profile"
                  className="block w-full py-2 text-left px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium transition-colors text-center"
                >
                  Company Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
