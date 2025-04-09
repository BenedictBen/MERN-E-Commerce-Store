import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { FaStar } from "react-icons/fa";

interface ProductReviewFormProps {
  productId: string;
}

const ProductReviewForm: React.FC<ProductReviewFormProps> = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = `/api/auth/reviews/${productId}/create`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important to include cookies
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const data = await response.json();
      console.log("Review submitted:", data);
      setSuccessMessage("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit review";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="!border-t !border-gray-200 !pt-6">
      <h3 className="!text-lg !font-semibold !mb-4">Write a Review</h3>

      {!isAuthenticated ? (
        <div className="mb-4 p-4 bg-yellow-50 rounded-md">
          <p className="text-yellow-800">
            Please{" "}
            <button
              onClick={() => router.push("/signin")}
              className="!text-blue-600 hover:underline !font-medium"
            >
              login
            </button>{" "}
            to submit a review.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="!space-y-4">
          <div>
            <label className="block !text-sm !font-medium text-gray-700 !mb-2">
              Rating *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="!p-1 focus:outline-none"
                  aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                >
                  <FaStar
                    className={`h-6 w-6 ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block !text-sm !font-medium !text-gray-700 mb-2"
            >
              Review *
            </label>
            <textarea
              id="comment"
              rows={4}
              className="!w-full !px-3 !py-2 !border !border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your honest thoughts about this product..."
              required
              minLength={10}
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || comment.length < 10 || isSubmitting}
            className={`!px-4 !py-2 !bg-[#6e2eff] !text-white rounded-md hover:!bg-[#8144ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductReviewForm;
