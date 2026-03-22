import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [manualToken, setManualToken] = useState(token || "");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!manualToken) {
        setError("Reset token is required");
        setLoading(false);
        return;
      }

      if (!formData.newPassword || !formData.confirmPassword) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (formData.newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const response = await api.post("/auth/reset-password", {
        resetToken: manualToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess("✓ Password reset successfully! Redirecting to login...");
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600 mb-6">Enter your new password below</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Reset Token
              </label>
              <textarea
                value={manualToken}
                onChange={(e) => {
                  setManualToken(e.target.value);
                  setError("");
                }}
                placeholder="Paste the reset token from your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/login")}
              className="w-full text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
