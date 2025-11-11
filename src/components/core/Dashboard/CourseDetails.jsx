import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseDetails } from "../../../services/operations/courseDetailsAPI";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { HiClock } from "react-icons/hi";
import { MdLock, MdPhoneAndroid } from "react-icons/md";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { HiInformationCircle, HiGlobeAlt } from "react-icons/hi";
import { addToCart } from "../../../slice/cartSlice";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalDurationFromAPI, setTotalDurationFromAPI] = useState(null);
const dispatch = useDispatch();
  useEffect(() => {
    const getCourseDetails = async () => {
      setLoading(true);
      try {
        const result = await fetchCourseDetails(courseId);
        if (result?.success && result?.data) {
          // API returns { data: { courseDetails: {...}, totalDuration: "..." } }
          const courseData = result.data.courseDetails || result.data;
          setCourse(courseData);
          // Store totalDuration if provided by API
          if (result.data.totalDuration) {
            setTotalDurationFromAPI(result.data.totalDuration);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      getCourseDetails();
    }
  }, [courseId]);


  const HandleAddToCart = (course) => {
    dispatch(addToCart(course));

  }
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!course?.ratingAndReviews || course.ratingAndReviews.length === 0) {
      return 0;
    }
    // If ratingAndReviews is an array of objects with rating property
    if (course.ratingAndReviews[0]?.rating !== undefined) {
      const sum = course.ratingAndReviews.reduce(
        (acc, review) => acc + (review.rating || 0),
        0
      );
      return sum / course.ratingAndReviews.length;
    }
    // If it's just an array of IDs, return a default
    return 4.5;
  };

  // Calculate total duration from course content
  const calculateTotalDuration = () => {
    // Use API-provided duration if available
    if (totalDurationFromAPI) {
      return totalDurationFromAPI;
    }

    if (!course?.courseContent || course.courseContent.length === 0) {
      return "0 hours";
    }

    let totalSeconds = 0;
    course.courseContent.forEach((section) => {
      if (section.subSection && Array.isArray(section.subSection)) {
        section.subSection.forEach((subSection) => {
          if (subSection.timeDuration) {
            // Handle different time duration formats
            // Could be "HH:MM:SS", "MM:SS", or a number (seconds)
            if (typeof subSection.timeDuration === "number") {
              totalSeconds += subSection.timeDuration;
            } else if (typeof subSection.timeDuration === "string") {
              // Parse time duration (format: "HH:MM:SS" or "MM:SS")
              const timeParts = subSection.timeDuration.split(":");
              if (timeParts.length === 3) {
                // HH:MM:SS
                totalSeconds +=
                  parseInt(timeParts[0]) * 3600 +
                  parseInt(timeParts[1]) * 60 +
                  parseInt(timeParts[2]);
              } else if (timeParts.length === 2) {
                // MM:SS
                totalSeconds += parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
              } else {
                // Try parsing as seconds
                const seconds = parseInt(subSection.timeDuration);
                if (!isNaN(seconds)) {
                  totalSeconds += seconds;
                }
              }
            }
          }
        });
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}${minutes > 0 ? ` ${minutes} minute${minutes > 1 ? "s" : ""}` : ""}`;
    }
    return `${minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : "0 hours"}`;
  };

  // Format date for display
  const formatCourseDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "2-digit" });
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  // Get instructor name
  const getInstructorName = () => {
    if (!course?.Instructor) return "Instructor Name";
    if (typeof course.Instructor === "object") {
      const firstName = course.Instructor.firstName || "";
      const lastName = course.Instructor.lastName || "";
      return `${firstName} ${lastName}`.trim() || "Instructor Name";
    }
    return "Instructor Name";
  };

  // Get category name for breadcrumbs
  const getCategoryName = () => {
    if (!course?.category) return "Learning";
    if (typeof course.category === "object") {
      return course.category.name || "Learning";
    }
    return "Learning";
  };

  // Parse what you'll learn into bullet points
  const parseWhatYouWillLearn = () => {
    if (!course?.whatYouWillLearn) return [];
    // Split by newlines or bullet points
    const lines = course.whatYouWillLearn
      .split(/\n|•|-\s+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    return lines.length > 0 ? lines : [course.whatYouWillLearn];
  };

  // Render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" size={20} />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt className="text-yellow-400" size={20} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-richblack-500" size={20} />
        ))}
      </div>
    );
  };

  const averageRating = calculateAverageRating();
  const totalDuration = calculateTotalDuration();
  const learnItems = parseWhatYouWillLearn();
  const instructorName = getInstructorName();
  const categoryName = getCategoryName();
  const ratingCount = course?.ratingAndReviews?.length || 0;
  // Students enrolled might be an array of IDs or objects
  const studentCount = Array.isArray(course?.studentsEnrolled) 
    ? course.studentsEnrolled.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
      </div>
    );
  }

  if (!course) {
    // Determine where to navigate back based on the current path
    const isFromCatalog = window.location.pathname.includes('/course/');
    const isFromMyCourses = window.location.pathname.includes('/dashboard/my-courses');
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-richblack-300 text-xl mb-4">Course not found</p>
          <button
            onClick={() => {
              if (isFromMyCourses) {
                navigate("/dashboard/my-courses");
              } else {
                navigate(-1); // Go back to previous page
              }
            }}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            {isFromMyCourses ? "Back to My Courses" : "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-richblack-400">
          <Link to="/" className="hover:text-yellow-50 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-richblack-300">{categoryName}</span>
          <span className="mx-2">/</span>
          <span className="text-richblack-300">{course.courseName}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Course Details */}
          <div className="flex-1 space-y-6">
            {/* Course Title */}
            <h1 className="text-4xl font-bold text-richblack-5">
              {course.courseName}
            </h1>

            {/* Description */}
            <p className="text-richblack-300 text-lg">
              {course.courseDescription}
            </p>

            {/* Rating and Stats */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {renderStars(averageRating)}
                <span className="text-richblack-300">
                  {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} ({ratingCount} ratings)
                  {studentCount > 0 && ` ${studentCount.toLocaleString()} students`}
                </span>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="text-richblack-300">
              Created by <span className="text-richblack-5 font-medium">{instructorName}</span>
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-richblack-300">
                <HiInformationCircle size={20} />
                <span>Created at {formatCourseDate(course.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-richblack-300">
                <HiGlobeAlt size={20} />
                <span>English</span>
              </div>
            </div>

            {/* What You'll Learn */}
            {learnItems.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-richblack-5">
                  What you'll learn
                </h2>
                <ul className="space-y-2">
                  {learnItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-richblack-300">
                      <span className="text-yellow-50 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content */}
            {course?.courseContent && course.courseContent.length > 0 && (
              <div className="space-y-4 border-t border-richblack-700 pt-6">
                <h2 className="text-2xl font-bold text-richblack-5">
                  Course Content
                </h2>
                <div className="space-y-4">
                  {course.courseContent.map((section, sectionIdx) => (
                    <div
                      key={section._id || sectionIdx}
                      className="bg-richblack-800 rounded-lg p-4 border border-richblack-700"
                    >
                      <h3 className="text-lg font-semibold text-richblack-5 mb-2">
                        Section {sectionIdx + 1}: {section.sectionName || "Untitled Section"}
                      </h3>
                      {section.sectionDescription && (
                        <p className="text-richblack-400 text-sm mb-3">
                          {section.sectionDescription}
                        </p>
                      )}
                      {section.subSection && section.subSection.length > 0 && (
                        <div className="ml-4 space-y-2">
                          {section.subSection.map((subSection, subIdx) => (
                            <div
                              key={subSection._id || subIdx}
                              className="text-richblack-300 text-sm flex items-center gap-2"
                            >
                              <span className="w-2 h-2 bg-yellow-50 rounded-full"></span>
                              <span>{subSection.title || `Lecture ${subIdx + 1}`}</span>
                              {subSection.timeDuration && (
                                <span className="text-richblack-500 text-xs">
                                  ({subSection.timeDuration})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {course?.instructions && course.instructions.length > 0 && (
              <div className="space-y-4 border-t border-richblack-700 pt-6">
                <h2 className="text-2xl font-bold text-richblack-5">
                  Instructions
                </h2>
                <ul className="list-disc list-inside space-y-2 text-richblack-300">
                  {course.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {course?.tags && course.tags.length > 0 && (
              <div className="space-y-4 border-t border-richblack-700 pt-6">
                <h2 className="text-2xl font-bold text-richblack-5">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-richblack-800 border border-richblack-700 rounded-full text-sm text-richblack-300 hover:border-yellow-50 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Course Status */}
            {course?.status && (
              <div className="border-t border-richblack-700 pt-6">
                <div className="flex items-center gap-2">
                  <span className="text-richblack-300">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.status === "Published"
                        ? "bg-yellow-100 text-richblack-900"
                        : "bg-richblack-700 text-pink-100"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              </div>
            )}

            {/* Reviews and Ratings */}
            {course?.ratingAndReviews && course.ratingAndReviews.length > 0 && (
              <div className="space-y-4 border-t border-richblack-700 pt-6">
                <h2 className="text-2xl font-bold text-richblack-5">
                  Reviews and Ratings ({course.ratingAndReviews.length})
                </h2>
                <div className="space-y-4">
                  {course.ratingAndReviews.map((review, idx) => (
                    <div
                      key={review._id || idx}
                      className="bg-richblack-800 rounded-lg p-4 border border-richblack-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {review.user && typeof review.user === "object" ? (
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-richblack-900 font-semibold">
                                {review.user.firstName?.[0] || "U"}
                              </div>
                              <div>
                                <p className="text-richblack-5 font-medium">
                                  {review.user.firstName} {review.user.lastName}
                                </p>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating || 0)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-richblack-900 font-semibold">
                                U
                              </div>
                              <div>
                                <p className="text-richblack-5 font-medium">Anonymous User</p>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating || 0)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-richblack-300 mt-2">{review.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Purchase Section */}
          <div className="lg:w-96 w-full">
            <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 sticky top-6">
              {/* Course Image */}
              <div className="w-full h-48 bg-richblack-700">
                <img
                  src={course.thumbnails}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price and Actions */}
              <div className="p-6 space-y-4">
                <div className="text-3xl font-bold text-richblack-5">
                  Rs. {course.price?.toLocaleString() || "1,200"}
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-yellow-50 text-richblack-900 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-colors" 
                  onClick={() => HandleAddToCart(course)}>
                    Add to Cart
                  </button>
                  <button className="w-full bg-richblack-700 text-richblack-5 py-3 rounded-lg font-semibold hover:bg-richblack-600 transition-colors border border-richblack-600">
                    Buy now
                  </button>
                </div>

                {/* Money Back Guarantee */}
                <p className="text-center text-richblack-300 text-sm">
                  30-Day Money-Back Guarantee
                </p>

                {/* Course Includes */}
                <div className="pt-4 border-t border-richblack-700">
                  <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                    This course includes:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-richblack-300">
                      <HiClock className="text-yellow-50" size={20} />
                      <span>{totalDuration || "0 hours"} on-demand video</span>
                    </li>
                    <li className="flex items-center gap-3 text-richblack-300">
                      <MdLock className="text-yellow-50" size={20} />
                      <span>Full Lifetime access</span>
                    </li>
                    <li className="flex items-center gap-3 text-richblack-300">
                      <MdPhoneAndroid className="text-yellow-50" size={20} />
                      <span>Access on Mobile and TV</span>
                    </li>
                    <li className="flex items-center gap-3 text-richblack-300">
                      <AiOutlineSafetyCertificate className="text-yellow-50" size={20} />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
