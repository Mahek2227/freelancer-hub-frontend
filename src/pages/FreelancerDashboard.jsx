
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  

  useEffect(() => {
  const fetchEarnings = async () => {
    try {
      const res = await api.get("/invoices");

      const total = res.data
        .filter(inv => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0);

      setEarnings(total);
    } catch (err) {
      console.error("Error fetching earnings:", err);
    }
  };

  fetchEarnings();
}, []);

   useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, []);

  useEffect(() => {
  if (user) {
    fetchDashboardData();
  }
}, [user]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects where freelancer is assigned
      const projectsRes = await api.get("/projects");
      const activeProjects = projectsRes.data.filter(p => p.freelancer?._id === (user?._id));
      setProjects(activeProjects);

      // Fetch proposals submitted by freelancer
      const proposalsRes = await api.get("/proposals");
      const myProposals = proposalsRes.data.filter(p => p.freelancer._id === user._id);
      setProposals(myProposals);

      // Calculate earnings (mock calculation based on completed projects)
      const totalEarnings = activeProjects
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + p.budget, 0);
      setEarnings(totalEarnings);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 font-medium">
            Here's your freelance work overview
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Active Projects */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium mb-2">Active Projects</p>
                <p className="text-4xl font-bold text-gray-900">
                  {projects.filter(p => p.status === "in-progress").length}
                </p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          {/* Pending Proposals */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium mb-2">Pending Proposals</p>
                <p className="text-4xl font-bold text-gray-900">
                  {proposals.filter(p => p.status === "pending").length}
                </p>
              </div>
              <div className="text-4xl">✉️</div>
            </div>
          </div>

          {/* Completed Projects */}
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

          {/* Total Earnings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 font-medium mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-green-600">₹{earnings}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* ACTIVE PROJECTS */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Active Projects
              </h2>

              {projects.filter(p => p.status === "in-progress").length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No active projects yet</p>
                  <p className="text-gray-400 mt-2">Start by browsing and bidding on projects</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.filter(p => p.status === "in-progress").map((project) => (
                    <div
                      key={project._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {project.description.substring(0, 100)}...
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          In Progress
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-gray-700 font-semibold">₹{project.budget}</p>
                        <a
                          href={`/projects/${project._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          View Project →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PENDING PROPOSALS */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Pending Proposals
              </h2>

              {proposals.filter(p => p.status === "pending").length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No pending proposals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.filter(p => p.status === "pending").map((proposal) => (
                    <div
                      key={proposal._id}
                      className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            Waiting for response...
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            Bid: <span className="font-semibold">₹{proposal.bidAmount}</span>
                          </p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Pending
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mt-3">{proposal.coverLetter}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Profile</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.name}</p>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Skills:</span> {user?.skills?.join(", ") || "Not set"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Rate:</span> ₹{user?.hourly_rate || "Not set"}/hr
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Status:</span>{" "}
                  <span className="text-green-600 font-semibold">{user?.availability || "Available"}</span>
                </p>
              </div>

              <a
                href="/profile"
                className="w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg transition-all text-center"
              >
                Edit Profile
              </a>
            </div>

            {/* QUICK STATS */}
            {/* QUICK STATS - ONLY FOR FREELANCER */}
            {user?.role === "freelancer" && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Stats</h3>

                <div className="space-y-4">

                  {/* ⭐ Rating */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    <p className="text-lg font-bold text-gray-900">
                      ⭐ {user.average_rating ? user.average_rating.toFixed(1) : "No ratings yet"}
                    </p>
                  </div>

                  {/* 📝 Reviews */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                    <p className="text-lg font-bold text-gray-900">
                      {user.total_reviews || 0} reviews
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* QUICK LINKS */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>

              <div className="space-y-2">
                <a
                  href="/projects"
                  className="block w-full py-2 text-left px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium transition-colors"
                >
                  Browse Projects
                </a>
                <a
                  href="/projects"
                  className="block w-full py-2 text-left px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium transition-colors"
                >
                  My Proposals
                </a>
                <a
                  href="/profile"
                  className="block w-full py-2 text-left px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium transition-colors"
                >
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
