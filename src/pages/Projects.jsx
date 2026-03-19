import { useEffect, useState } from "react";
import api from "../api/axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState({});
  const [deliverables, setDeliverables] = useState({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const [showDeliverForm, setShowDeliverForm] = useState(false);
  const [deliverProjectId, setDeliverProjectId] = useState(null);
  const [deliverMessage, setDeliverMessage] = useState("");
  const [deliverLink, setDeliverLink] = useState("");
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState("");


  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // CREATE PROJECT
  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/projects", { title, description, budget });
    setTitle("");
    setDescription("");
    setBudget("");
    fetchProjects();
  };
  const fetchTasks = async (projectId) => {
  const res = await api.get(`/tasks/${projectId}`);

  setTasks((prev) => ({
    ...prev,
    [projectId]: res.data,
  }));
  };

  const createTask = async (projectId) => {
  await api.post("/tasks", {
    projectId,
    title: taskInput,
  });

  setTaskInput("");
  fetchTasks(projectId);
  };

 const updateTask = async (id, status, projectId) => {
  await api.put(`/tasks/${id}`, { status });
  fetchTasks(projectId);
};
  
  // FETCH PROPOSALS
  const fetchProposals = async (projectId) => {
    const res = await api.get(`/proposals/${projectId}`);
    setProposals((prev) => ({
      ...prev,
      [projectId]: res.data,
    }));
  };

  // ACCEPT PROPOSAL
  const handleAccept = async (proposalId, projectId) => {
    await api.put(`/proposals/accept/${proposalId}`);
    fetchProjects();
    fetchProposals(projectId);
  };

  // DELIVERABLE FUNCTIONS
  const fetchDeliverables = async (projectId) => {
    const res = await api.get(`/deliverables/${projectId}`);
    setDeliverables((prev) => ({
      ...prev,
      [projectId]: res.data,
    }));
  };

  const submitDeliverable = async () => {
    await api.post("/deliverables", {
      projectId: deliverProjectId,
      message: deliverMessage,
      fileUrl: deliverLink,
    });

    setShowDeliverForm(false);
    setDeliverMessage("");
    setDeliverLink("");
    fetchProjects();
  };

  const approveDeliverable = async (id, projectId) => {
    await api.put(`/deliverables/approve/${id}`);
    fetchProjects();
    fetchDeliverables(projectId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {user?.role === "client" ? "Manage Projects" : "Browse Projects"}
          </h1>
          <p className="text-gray-600 font-medium">
            {user?.role === "client"
              ? "Create and manage your freelance projects"
              : "Find exciting opportunities and submit proposals"}
          </p>
        </div>

        {/* CREATE PROJECT */}
        {user?.role === "client" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Project
            </h2>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Build a React Dashboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Project Description
                </label>
                <textarea
                  placeholder="Describe your project, requirements, and expectations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Budget (₹)
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Create Project
              </button>
            </form>
          </div>
        )}

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* PROJECT HEADER */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
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

              {/* PROJECT DETAILS */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Budget:</span>
                  <span className="text-gray-900 font-bold">₹{project.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Posted by:</span>
                  <span className="text-gray-900 font-bold">{project.client?.name}</span>
                </div>
              </div>

              {/* FREELANCER - SUBMIT PROPOSAL */}
              {user?.role === "freelancer" && project.status === "open" && (
                <button
                  onClick={() => {
                    setSelectedProject(project._id);
                    setShowForm(true);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all mb-2"
                >
                  Submit Proposal
                </button>
              )}

              {/* FREELANCER - DELIVERY */}
              {user?.role === "freelancer" && project.status === "in-progress" && (
                <button
                  onClick={() => {
                    setDeliverProjectId(project._id);
                    setShowDeliverForm(true);
                  }}
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all mb-2"
                >
                  Deliver Work
                </button>
              )}
              <div className="mt-4">

  <h4 className="font-bold mb-2">Tasks</h4>

  <button onClick={() => fetchTasks(project._id)}>
    Load Tasks
  </button>

  <input
    value={taskInput}
    onChange={(e) => setTaskInput(e.target.value)}
    placeholder="New task"
  />

  <button onClick={() => createTask(project._id)}>
    Add
  </button>

  {tasks[project._id]?.map((t) => (
    <div key={t._id}>
      <p>{t.title}</p>
      <p>{t.status}</p>

      <button onClick={() => updateTask(t._id, "in-progress", project._id)}>
        Start
      </button>

      <button onClick={() => updateTask(t._id, "done", project._id)}>
        Done
      </button>
    </div>
  ))}

</div>
              {/* CLIENT - VIEW PROPOSALS */}
              {user?.role === "client" && (
                <button
                  onClick={() => fetchProposals(project._id)}
                  className="w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg transition-all mb-3"
                >
                  {proposals[project._id]
                    ? `View Proposals (${proposals[project._id].length})`
                    : "View Proposals"}
                </button>
              )}

              {/* PROPOSALS LIST */}
              {proposals[project._id] && proposals[project._id].length > 0 && (
                <div className="space-y-3 mb-4">
                  {proposals[project._id].map((p) => (
                    <div
                      key={p._id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-gray-900 font-bold text-lg">
                            {p.freelancer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Bid: <span className="font-bold">₹{p.bidAmount}</span>
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            p.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">
                        {p.coverLetter}
                      </p>

                      {p.status === "pending" && (
                        <button
                          onClick={() => handleAccept(p._id, project._id)}
                          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all text-sm"
                        >
                          Accept Proposal
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW DELIVERABLES */}
              {user?.role === "client" && (
                <button
                  onClick={() => fetchDeliverables(project._id)}
                  className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition-all mb-2"
                >
                  {deliverables[project._id]
                    ? `View Deliverables (${deliverables[project._id].length})`
                    : "View Deliverables"}
                </button>
              )}

              {/* DELIVERABLES */}
              {deliverables[project._id] && deliverables[project._id].length > 0 && (
                <div className="space-y-3 mb-4">
                  {deliverables[project._id].map((d) => (
                    <div
                      key={d._id}
                      className="border border-green-200 rounded-lg p-4 bg-green-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-900 font-bold">
                          {d.freelancer.name}
                        </p>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                          {d.status}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{d.message}</p>
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-sm block mb-3"
                      >
                        View Work →
                      </a>

                      {user?.role === "client" && d.status === "pending" && (
                        <button
                          onClick={() => approveDeliverable(d._id, project._id)}
                          className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all text-sm"
                        >
                          ✓ Approve Work
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 font-medium">
              No projects found. {user?.role === "client" && "Create one to get started!"}
            </p>
          </div>
        )}
      </div>

      {/* PROPOSAL MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Submit Proposal
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Cover Letter
                </label>
                <textarea
                  placeholder="Tell the client why you're the perfect fit for this project..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Bid Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={async () => {
                  try {
                    await api.post("/proposals", {
                      projectId: selectedProject,
                      coverLetter,
                      bidAmount,
                    });

                    alert("Proposal submitted successfully!");
                    setShowForm(false);
                    setCoverLetter("");
                    setBidAmount("");
                    fetchProjects();
                  } catch (err) {
                    alert("Failed to submit proposal: " + err.response?.data?.message);
                  }
                }}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all"
              >
                Submit
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  setCoverLetter("");
                  setBidAmount("");
                }}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY MODAL */}
      {showDeliverForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Submit Deliverable
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Delivery Message
                </label>
                <textarea
                  placeholder="Describe what you've delivered..."
                  value={deliverMessage}
                  onChange={(e) => setDeliverMessage(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  GitHub / Drive Link
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/... or https://drive.google.com/..."
                  value={deliverLink}
                  onChange={(e) => setDeliverLink(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitDeliverable}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all"
              >
                Submit Deliverable
              </button>

              <button
                onClick={() => {
                  setShowDeliverForm(false);
                  setDeliverMessage("");
                  setDeliverLink("");
                }}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;