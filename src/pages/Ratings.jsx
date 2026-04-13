import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function Ratings() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
    projectId: '',
  });

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUserAndReviews();
  }, [userId]);

  const fetchUserAndReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch user
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(userResponse.data);

      // Fetch reviews for this user
      const reviewsResponse = await axios.get(
        `http://localhost:5000/api/reviews/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!formData.review.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // This would need a backend endpoint
      await axios.post(
        `http://localhost:5000/api/reviews`,
        {
          ratedUser: userId,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setFormData({ rating: 5, review: '', projectId: '' });
      fetchUserAndReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ratings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-700 mb-4"
        >
          ← Back
        </button>

        {/* Rating Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-indigo-600">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < Math.round(user.average_rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {user.average_rating?.toFixed(1) || 'No rating'}
                  </span>
                </div>
              </div>
            </div>

            {currentUser?._id !== userId && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
              >
                Leave Review
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{user.total_reviews || 0}</p>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{user.total_projects_completed || 0}</p>
              <p className="text-sm text-gray-600">Projects Done</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {user.role === 'freelancer' ? `₹${user.hourly_rate || 0}/hr` : 'Client'}
              </p>
              <p className="text-sm text-gray-600">
                {user.role === 'freelancer' ? 'Hourly Rate' : 'Account Type'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className={`text-2xl font-bold ${user.is_verified ? 'text-green-600' : 'text-gray-600'}`}>
                {user.is_verified ? '✓' : '○'}
              </p>
              <p className="text-sm text-gray-600">
                {user.is_verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-semibold">
                        {review.reviewer?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{review.reviewer?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Leave a Review</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-4xl transition ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={formData.review}
                  onChange={(e) =>
                    setFormData({ ...formData, review: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows="5"
                  placeholder="Share your experience with this freelancer..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
