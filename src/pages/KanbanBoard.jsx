import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function KanbanBoard() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  const statuses = ['todo', 'in-progress', 'done'];
  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
  };
  const statusColors = {
    todo: 'bg-gray-100',
    'in-progress': 'bg-blue-100',
    done: 'bg-green-100',
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const projectResponse = await axios.get(
        `projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(projectResponse.data);

      const tasksResponse = await axios.get(
        `tasks/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'tasks',
        {
          project: projectId,
          title: newTaskTitle,
          status: 'todo',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setShowNewTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (status) => {
    if (!draggedTask) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `tasks/${draggedTask._id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(
        tasks.map(t => (t._id === draggedTask._id ? { ...t, status } : t))
      );
      setDraggedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading kanban board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-indigo-600 hover:text-indigo-700 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900">
              {project?.title} - Task Board
            </h1>
            <p className="text-gray-600 mt-2">Organize and manage your project tasks</p>
          </div>

          <button
            onClick={() => setShowNewTaskForm(true)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
          >
            + Add Task
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map(status => (
            <div
              key={status}
              className={`${statusColors[status]} rounded-2xl p-6 min-h-96 transition`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              {/* Column Header */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center justify-between">
                  {statusLabels[status]}
                  <span className="text-sm font-semibold bg-white px-3 py-1 rounded-full">
                    {tasks.filter(t => t.status === status).length}
                  </span>
                </h2>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {tasks
                  .filter(t => t.status === status)
                  .map(task => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition cursor-move"
                    >
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="font-medium text-gray-900 flex-1">{task.title}</h3>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-gray-400 hover:text-red-600 transition text-lg"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full font-semibold ${
                          status === 'todo'
                            ? 'bg-gray-200 text-gray-800'
                            : status === 'in-progress'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-green-200 text-green-800'
                        }`}>
                          {statusLabels[status]}
                        </span>
                        <span className="text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty State */}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">No tasks in this column</p>
                  <p className="text-gray-400 text-xs mt-1">Drag tasks here to move them</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">To Do</p>
            <p className="text-3xl font-bold text-gray-900">
              {tasks.filter(t => t.status === 'todo').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Done</p>
            <p className="text-3xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'done').length}
            </p>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>
              <button
                onClick={() => {
                  setShowNewTaskForm(false);
                  setNewTaskTitle('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTask();
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Design homepage layout"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewTaskForm(false);
                  setNewTaskTitle('');
                }}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
