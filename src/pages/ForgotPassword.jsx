import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!email) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      const response = await api.post("/auth/forgot-password", { email });

      setSuccess("✓ Reset link sent! Check your email (or use the token below)");
      setEmail("");
      
      // Show reset token for testing (in production, token comes via email)
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600 mb-6">
            Enter your email and we'll send you a link to reset your password
          </p>

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
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {resetToken && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 mb-2">
                🔐 Reset Token (for testing):
              </p>
              <div className="bg-white p-2 rounded border border-yellow-300 break-all text-xs font-mono">
                {resetToken}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resetToken);
                  alert("Token copied to clipboard!");
                }}
                className="mt-2 w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded transition-colors"
              >
                📋 Copy Token
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <button
              onClick={() => navigate("/login")}
              className="w-full text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full text-gray-600 hover:text-gray-700 font-semibold"
            >
              Create new account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
