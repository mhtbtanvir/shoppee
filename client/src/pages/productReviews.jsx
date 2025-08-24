import React, { useState } from "react";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const ProductReviews = ({ product, setProduct }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // ✅ success message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) {
      setError("Please provide a comment and rating.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${product._id}/review`,
        { comment, rating },
        { withCredentials: true }
      );

      setProduct({
        ...product,
        review: res.data.review || [],
        ratings: res.data.ratings || { average: 0, count: 0 },
      });

      setComment("");
      setRating(0);

      setSuccess("Your review has been submitted successfully!"); // ✅ set success message
      setTimeout(() => setSuccess(null), 4000); // ✅ hide after 4 seconds
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 px-10 space-y-12">
      {/* Header */}
      <h3 className="text-4xl font-bold text-gray-900 text-center tracking-wide">
        Submit a Review..
      </h3>

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-3xl mx-auto"
      >
        {/* Star Rating */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer transform transition duration-200 hover:scale-125"
            >
              {star <= (hoverRating || rating) ? (
                <AiFillStar className="text-yellow-400 w-7 h-7 drop-shadow-md" />
              ) : (
                <AiOutlineStar className="text-gray-300 w-7 h-7" />
              )}
            </span>
          ))}
        </div>

        <textarea
          className="w-full p-5 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 placeholder-gray-400 placeholder-opacity-80 resize-none transition-shadow duration-200 shadow-sm hover:shadow-md"
          placeholder="Share your thoughts about the product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium">{success}</p>} {/* ✅ success message */}

        <button
          type="submit"
          disabled={loading}
          className="self-center px-8 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-semibold rounded-2xl hover:from-gray-800 hover:to-gray-900 transition duration-300 shadow-lg hover:shadow-xl"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Existing Reviews */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <h4 className="text-3xl font-semibold text-gray-900 border-b border-gray-200 pb-2 text-center">
          User Reviews
        </h4>

        {product.review?.length > 0 ? (
          product.review.map((r, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-900">{r.name}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <AiFillStar
                      key={star}
                      className={`w-5 h-5 transition-colors duration-200 ${
                        star <= r.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center">
            No reviews yet. Be the first to share your experience!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
