import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projectsCount, setProjectsCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: '',
    hourly_rate: '',
    portfolio_link: '',
    company_name: '',
    company_size: '',
    availability: 'full-time',
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isOwnProfile = !userId || userId === currentUser._id;

  useEffect(() => {
    fetchUserData();
  }, [userId]);


 const fetchUserData = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const endpoint = userId
      ? `users/${userId}`
      : `users/profile`; // ✅ FIXED

    // 🔹 1. Fetch user
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(response.data);

    // 🔹 2. Fetch projects
    const projectsRes = await axios.get("projects", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let completedCount = 0;

    if (response.data.role === "freelancer") {
      completedCount = projectsRes.data.filter(
        (p) =>
          p.freelancer?._id === response.data._id &&
          p.status === "completed"
      ).length;
    } else {
      completedCount = projectsRes.data.filter(
        (p) =>
          p.client?._id === response.data._id &&
          p.status === "completed"
      ).length;
    }

    // 🔹 3. Save to state
    setProjectsCount(completedCount);

    // 🔹 4. Keep your existing form logic
    if (isOwnProfile) {
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        bio: response.data.bio || "",
        skills: (response.data.skills || []).join(", "),
        hourly_rate: response.data.hourly_rate || "",
        portfolio_link: response.data.portfolio_link || "",
        company_name: response.data.company_name || "",
        company_size: response.data.company_size || "",
        availability: response.data.availability || "full-time",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  } finally {
    setLoading(false);
  }
};
  const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      "/users/profile",
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ update UI
    setUser(res.data);

    // ✅ update localStorage
    localStorage.setItem("user", JSON.stringify(res.data));

    alert("Profile updated successfully");

  } catch (error) {
    console.log(error);
    alert("Error updating profile");
  }
};

  
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      setUploadingAvatar(true);
      console.log("Starting avatar upload:", file.name, file.size);

      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "users/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload response:", response.data);

      // Update UI with new image from response
      if (response.data && response.data.profile_picture_url) {
        console.log("Avatar URL updated to:", response.data.profile_picture_url);
        
        // Force React to re-render by creating a new object
        setUser({ ...response.data });
        
        // Update localStorage user data
        const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert("Avatar uploaded successfully!");
      } else {
        console.warn("No profile_picture_url in response");
        alert("Upload completed but image URL not updated");
      }

    } catch (error) {
      console.error("Error uploading avatar:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

    const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-700 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-pink-500"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-8">
              <div className="flex-shrink-0">
                {isOwnProfile ? (
                  <label className="cursor-pointer">
                    <div className="relative">
                      <img
                        key={user.profile_picture_url}
                        src={user.profile_picture_url ? `${user.profile_picture_url}?t=${Date.now()}` : 'https://via.placeholder.com/120'}
                        alt={user.name}
                        className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                      {!uploadingAvatar && (
                        <div className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2 text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                ) : (
                  <img
                    key={user.profile_picture_url}
                    src={user.profile_picture_url ? `${user.profile_picture_url}?t=${Date.now()}` : 'https://via.placeholder.com/120'}
                    alt={user.name}
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                )}
              </div>

              <div className="flex-grow pt-4">
                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 mt-1">{user.email}</p>

                {/* Role Badge */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    user.role === 'freelancer'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {user.role === 'freelancer' ? '💼 Freelancer' : '🏢 Client'}
                  </span>
                  {user.is_verified && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                {isOwnProfile && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                    {isEditing && (
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Save Changes
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/update-password')}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      🔐 Change Password
                    </button>
                  </div>
                )}
                {!isOwnProfile && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => navigate('/chat', { state: { startConversationWith: user._id } })}
                      className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2"
                    >
                      <span>💬</span> Message
                    </button>
                    {user.role === 'freelancer' && (
                      <button
                        onClick={() => navigate('/projects/new', { state: { freelancerId: user._id } })}
                        className="px-6 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                      >
                        Hire
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Section */}
            {user.role === 'freelancer' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{projectsCount}</p>
                <p className="text-sm text-gray-600">Projects Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">{user.average_rating || 0}</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{user.total_reviews || 0}</p>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
              {user.hourly_rate && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">₹{user.hourly_rate}/hr</p>
                  <p className="text-sm text-gray-600">Rate</p>
                </div>
              )}
            </div>
            )}
            {/* Bio Section */}
            {!isEditing ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">
                  {user.bio || 'No bio added yet.'}
                </p>
              </div>
            ) : (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            )}

            {/* Freelancer Specific Info */}
            {user.role === 'freelancer' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>

                {!isEditing ? (
                  <div className="space-y-4">
                    {user.skills && user.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.hourly_rate && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                        <p className="text-lg text-gray-900">₹{user.hourly_rate}/hour</p>
                      </div>
                    )}

                    {user.availability && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Availability</p>
                        <p className="text-lg text-gray-900 capitalize">{user.availability}</p>
                      </div>
                    )}

                    {user.portfolio_link && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Portfolio</p>
                        <a
                          href={user.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          View Portfolio →
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="React, Node.js, MongoDB, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        name="hourly_rate"
                        value={formData.hourly_rate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="available-soon">Available Soon</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Link
                      </label>
                      <input
                        type="url"
                        name="portfolio_link"
                        value={formData.portfolio_link}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Client Specific Info */}
            {user.role === 'client' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>

                {!isEditing ? (
                  <div className="space-y-4">
                    {user.company_name && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Company</p>
                        <p className="text-lg text-gray-900">{user.company_name}</p>
                      </div>
                    )}
                    {user.company_size && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Company Size</p>
                        <p className="text-lg text-gray-900">{user.company_size}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your Company"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <select
                        name="company_size"
                        value={formData.company_size}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="200+">200+</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact Info */}
            {!isEditing ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">📧 {user.email}</p>
                  {user.phone && (
                    <p className="text-gray-700">📱 {user.phone}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
