import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import UserProfile from "./pages/UserProfile";
import Marketplace from "./pages/Marketplace";
import ProjectDetail from "./pages/ProjectDetail";
import Ratings from "./pages/Ratings";
import Payments from "./pages/Payments";
import Chat from "./pages/Chat";
import KanbanBoard from "./pages/KanbanBoard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [isRegistering, setIsRegistering] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // AUTH PAGES
  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route
            path="/login"
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
                <div className="w-full max-w-md px-4">
                  <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">FH</span>
                      </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Freelancer Hub
                    </h1>

                    <p className="text-gray-700 font-medium">
                      Connect, collaborate, and create amazing work
                    </p>
                  </div>

                  <Login onLogin={() => setIsLoggedIn(true)} />

                  <p className="text-center text-gray-900 font-bold mt-6">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      Register here
                    </a>
                  </p>
                </div>
              </div>
            }
          />

          <Route
            path="/register"
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
                <div className="w-full max-w-md px-4">
                  <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">FH</span>
                      </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Create Account
                    </h1>

                    <p className="text-gray-700 font-medium">
                      Join our community of creators
                    </p>
                  </div>

                  <Register onRegister={() => setIsLoggedIn(true)} />

                  <p className="text-center text-gray-900 font-bold mt-6">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  // LOGGED IN ROUTES
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* NAVBAR */}
        <nav className="bg-white shadow border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FH</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Freelancer Hub</h1>
            </a>

            <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-end">
              <a
                href={user?.role === "freelancer" ? "/freelancer-dashboard" : "/client-dashboard"}
                className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/projects"
                className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors"
              >
                Projects
              </a>
              {user?.role === "freelancer" && (
                <a
                  href="/marketplace"
                  className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors"
                >
                  Marketplace
                </a>
              )}
              <a
                href="/chat"
                className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors"
              >
                Messages
              </a>
              <a
                href="/payments"
                className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors"
              >
                Payments
              </a>
              <div className="flex items-center gap-3">
                <div className="dropdown">
                  <button className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors">
                    {user?.name}
                  </button>
                </div>
                <a
                  href={`/profile/${user?._id}`}
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                  title="View Profile"
                >
                  👤
                </a>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main>
          <Routes>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/ratings/:userId" element={<Ratings />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/kanban/:projectId" element={<KanbanBoard />} />
            <Route
              path="/freelancer-dashboard"
              element={
                user?.role === "freelancer" ? (
                  <FreelancerDashboard />
                ) : (
                  <Navigate to="/client-dashboard" />
                )
              }
            />
            <Route
              path="/client-dashboard"
              element={
                user?.role === "client" ? (
                  <ClientDashboard />
                ) : (
                  <Navigate to="/freelancer-dashboard" />
                )
              }
            />
            <Route path="/" element={<Navigate to={user?.role === "freelancer" ? "/freelancer-dashboard" : "/client-dashboard"} />} />
            <Route path="*" element={<Navigate to={user?.role === "freelancer" ? "/freelancer-dashboard" : "/client-dashboard"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;