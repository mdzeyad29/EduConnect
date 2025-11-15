import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { removeFromCart } from '../../slice/cartSlice'
import { captureMultiplePayment } from '../../services/operations/buynow'
import { FaStar } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { toast } from 'react-hot-toast'

const CartCourse = () => {
  const { cart, total, totalItems } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRemoveFromCart = (courseId) => {
    dispatch(removeFromCart(courseId))
  }

  const handleBuyNow = async () => {
    if (!token) {
      toast.error('Please login to purchase courses')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Prevent multiple clicks
    if (isProcessing || paymentLoading) {
      return
    }

    setIsProcessing(true)

    // Format courses for payment (array of course objects)
    // The captureMultiplePayment function accepts course objects directly
    const courses = cart
    
    try {
      const result = await captureMultiplePayment(token, courses, navigate, user, dispatch)
      
      // Reset processing state when modal opens or if there's an error
      // The paymentLoading state from Redux will handle the actual payment processing
      if (result?.success) {
        // Modal opened successfully, user can now interact with Razorpay
        // Reset local processing state as payment is now handled by Razorpay modal
        setIsProcessing(false)
      } else {
        // Error occurred before opening modal
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Buy now error:', error)
      toast.error('Failed to process payment. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-richblack-5 mb-8"> Cart Items</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-richblack-300 mb-4">Your cart is empty</p>
            <Link 
              to="/catalog/all"
              className="inline-block px-6 py-3 bg-yellow-50 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-100 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              <div className="pb-4 border-b border-richblack-700">
                <p className="text-richblack-300 font-semibold">
                  {totalItems} {totalItems === 1 ? 'Course' : 'Courses'} in Cart
                </p>
              </div>

              {cart.map((course, index) => (
                <div
                  key={course._id}
                  className={`flex flex-col md:flex-row gap-6 p-6 bg-richblack-800 rounded-lg border border-richblack-700 ${
                    index !== cart.length - 1 ? 'mb-6' : ''
                  }`}
                >
                  {/* Course Image */}
                  <div className="md:w-48 flex-shrink-0">
                    <img
                      src={course.thumbnails || course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-32 md:h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image'
                      }}
                    />
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/course/${course._id}`}>
                        <h3 className="text-xl font-semibold text-richblack-5 hover:text-yellow-50 transition-colors mb-2">
                          {course.courseName}
                        </h3>
                      </Link>
                      <p className="text-richblack-300 text-sm mb-2">
                        {course.category?.name || 'Uncategorized'}
                      </p>
                      {course.courseDescription && (
                        <p className="text-richblack-400 text-sm line-clamp-2 mb-3">
                          {course.courseDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-yellow-50">4.5</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${i < 4 ? 'text-yellow-400' : 'text-richblack-500'}`}
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="text-richblack-400 text-sm">
                          ({course.ratingAndReviews?.length || 0} ratings)
                        </span>
                      </div>
                    </div>

                    {/* Price and Remove Button */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-2xl font-bold text-yellow-50">
                        ₹ {course.price?.toLocaleString() || '0'}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(course._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-richblack-600 bg-richblack-700 text-pink-200 hover:bg-richblack-600 transition-colors"
                      >
                        <RiDeleteBin6Line />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-richblack-5 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-richblack-300">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'course' : 'courses'})</span>
                    <span>₹ {total?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="border-t border-richblack-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-richblack-5">Total</span>
                      <span className="text-2xl font-bold text-yellow-50">
                        ₹ {total?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={isProcessing || paymentLoading || cart.length === 0}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-4 ${
                    isProcessing || paymentLoading || cart.length === 0
                      ? 'bg-richblack-700 text-richblack-400 cursor-not-allowed'
                      : 'bg-yellow-50 text-richblack-900 hover:bg-yellow-100'
                  }`}
                >
                  {isProcessing || paymentLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Buy Now'
                  )}
                </button>

                <p className="text-center text-richblack-400 text-xs">
                  30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartCourse
