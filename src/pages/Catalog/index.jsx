import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllCourses, fetchCourseCategories, fetchInstructorCourses } from "../../services/operations/courseDetailsAPI";
import { apiConnector } from "../../services/apiconnector";
import { catalogData } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { FaStar } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

const Catalog = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR;
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Check if data was passed from Navbar via navigation state
        if (location.state?.category) {
          console.log("Using data from navigation state");
          setCategory(location.state.category);
          const passedCourses = location.state.courses || [];
          
          // If instructor, filter courses to show only their own courses
          if (isInstructor && token) {
            console.log("Instructor detected - filtering to show only their courses");
            const instructorCourses = await fetchInstructorCourses(token);
            const categoryId = location.state.category._id || location.state.category;
            const filteredCourses = instructorCourses.filter(
              (course) => {
                const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                const matchedCategoryId = categoryId.toString();
                return courseCategoryId === matchedCategoryId;
              }
            );
            console.log(`Filtered ${filteredCourses.length} instructor courses for category ${location.state.category.name}`);
            setCourses(filteredCourses);
          } else {
            // If courses array is empty, try to fetch all courses and filter
            if (passedCourses.length === 0) {
              console.log("No courses in navigation state, fetching all courses as fallback");
              const allCourses = await getAllCourses();
              const categoryId = location.state.category._id || location.state.category;
              const filteredCourses = allCourses.filter(
                (course) => {
                  const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                  const matchedCategoryId = categoryId.toString();
                  return courseCategoryId === matchedCategoryId;
                }
              );
              console.log(`Filtered ${filteredCourses.length} courses for category ${location.state.category.name}`);
              setCourses(filteredCourses);
            } else {
              setCourses(passedCourses);
            }
          }
          
          if (location.state.differentCategories) {
            setAllCategories(location.state.differentCategories);
          } else {
            const categories = await fetchCourseCategories();
            setAllCategories(categories);
          }
          setLoading(false);
          return;
        }

        // Convert URL format back to category name (e.g., "web-development" -> "Web Development")
        const formattedCategoryName = categoryName
          ?.split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        // Fetch all categories first
        const categories = await fetchCourseCategories();
        setAllCategories(categories);
        
        // Find the matching category - handle both URL format and original format
        const matchedCategory = categories.find(
          (cat) => {
            const catUrlName = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
            const catOriginalName = cat.name.toLowerCase();
            return catUrlName === categoryName?.toLowerCase() ||
                   catOriginalName === categoryName?.toLowerCase() ||
                   catOriginalName === formattedCategoryName?.toLowerCase();
          }
        );

        if (matchedCategory) {
          setCategory(matchedCategory);
          
          // Fetch category page details using CATALOGPAGEDATA_API
          try {
            console.log("Fetching category page details for categoryId:", matchedCategory._id);
            const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {
              categoryId: matchedCategory._id,
            });

            console.log("CATALOGPAGEDATA_API Response:", response);

            if (response?.data?.success && response?.data?.data?.selectedCategory) {
              // Courses are now properly fetched and included in selectedCategory.courses
              let categoryCourses = response.data.data.selectedCategory.courses || [];
              
              // If instructor, filter to show only their courses
              if (isInstructor && token) {
                console.log("Instructor detected - filtering to show only their courses");
                const instructorCourses = await fetchInstructorCourses(token);
                const instructorCourseIds = new Set(instructorCourses.map(c => c._id.toString()));
                categoryCourses = categoryCourses.filter(course => 
                  instructorCourseIds.has(course._id.toString())
                );
                console.log(`Filtered to ${categoryCourses.length} instructor courses`);
              }
              
              if (Array.isArray(categoryCourses) && categoryCourses.length > 0) {
                console.log("Courses found:", categoryCourses.length);
                setCourses(categoryCourses);
              } else {
                console.log("No courses found in this category");
                setCourses([]);
              }
            } else {
              console.log("Invalid response structure, using fallback");
              // Fallback: Fetch courses based on user type
              let filteredCourses;
              if (isInstructor && token) {
                // For instructors, fetch only their courses
                const instructorCourses = await fetchInstructorCourses(token);
                filteredCourses = instructorCourses.filter(
                  (course) => {
                    const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                    const matchedCategoryId = matchedCategory._id.toString();
                    return courseCategoryId === matchedCategoryId;
                  }
                );
                console.log(`Filtered ${filteredCourses.length} instructor courses for category ${matchedCategory.name}`);
              } else {
                // For non-instructors, fetch all published courses
                const allCourses = await getAllCourses();
                filteredCourses = allCourses.filter(
                  (course) => {
                    const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                    const matchedCategoryId = matchedCategory._id.toString();
                    return courseCategoryId === matchedCategoryId;
                  }
                );
                console.log(`Filtered ${filteredCourses.length} courses for category ${matchedCategory.name}`);
              }
              setCourses(filteredCourses);
            }
          } catch (error) {
            console.error("Error fetching category page details:", error);
            // Fallback: Fetch courses based on user type
            let filteredCourses;
            if (isInstructor && token) {
              // For instructors, fetch only their courses
              const instructorCourses = await fetchInstructorCourses(token);
              filteredCourses = instructorCourses.filter(
                (course) => {
                  const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                  const matchedCategoryId = matchedCategory._id.toString();
                  return courseCategoryId === matchedCategoryId;
                }
              );
              console.log(`Fallback: Filtered ${filteredCourses.length} instructor courses for category ${matchedCategory.name}`);
            } else {
              // For non-instructors, fetch all published courses
              const allCourses = await getAllCourses();
              filteredCourses = allCourses.filter(
                (course) => {
                  const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                  const matchedCategoryId = matchedCategory._id.toString();
                  return courseCategoryId === matchedCategoryId;
                }
              );
              console.log(`Fallback: Filtered ${filteredCourses.length} courses for category ${matchedCategory.name}`);
            }
            setCourses(filteredCourses);
          }
        } else {
          // Category not found - fetch courses based on user type
          if (isInstructor && token) {
            // For instructors, show only their courses
            const instructorCourses = await fetchInstructorCourses(token);
            setCourses(instructorCourses);
          } else {
            // For non-instructors, show all published courses
            const allCourses = await getAllCourses();
            setCourses(allCourses);
          }
        }
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName, location.state, isInstructor, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50 mx-auto mb-4"></div>
          <p className="text-richblack-300">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-richblack-5 px-4 sm:px-8 py-8 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link to="/" className="text-richblack-300 hover:text-richblack-5 transition-colors">
          Home
        </Link>
        <span className="text-richblack-300">/</span>
        <Link 
          to="/" 
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          className="text-richblack-300 hover:text-richblack-5 transition-colors"
        >
          Catalog
        </Link>
        {category && (
          <>
            <span className="text-richblack-300">/</span>
            <span className="text-yellow-50">{category.name}</span>
          </>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-richblack-300 hover:text-richblack-5 transition-colors mb-6"
      >
        <HiArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Category Header */}
      {category && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-richblack-5">
              {category.name}
            </h1>
            {isInstructor && (
              <span className="px-4 py-2 bg-yellow-50/10 border border-yellow-50/30 rounded-lg text-yellow-50 text-sm font-medium">
                Viewing Only Your Courses
              </span>
            )}
          </div>
          {category.description && (
            <p className="text-richblack-300 text-lg">{category.description}</p>
          )}
        </div>
      )}

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
              <div
                key={course._id}
                className="group bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 hover:border-yellow-50 transition-all duration-200 hover:shadow-xl cursor-pointer"
                onClick={() => {
                  // Navigate to course details page
                  if (isInstructor) {
                    navigate(`/dashboard/my-courses/${course._id}`);
                  } else {
                    navigate(`/course/${course._id}`);
                  }
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnails || course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-richblack-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-yellow-50 font-semibold">
                      ₹{course.price}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-richblack-5 mb-2 group-hover:text-yellow-50 transition-colors line-clamp-2">
                    {course.courseName}
                  </h3>
                  <p className="text-sm text-richblack-300 mb-4 line-clamp-3">
                    {course.courseDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-50" size={16} />
                      <span className="text-richblack-300 text-sm">
                        {course.ratingAndReviews?.length || 0} Ratings
                      </span>
                    </div>
                    {course.Instructor && (
                      <div className="text-richblack-400 text-sm">
                        {typeof course.Instructor === 'object' 
                          ? `${course.Instructor.firstName || ''} ${course.Instructor.lastName || ''}`
                          : 'Instructor'
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl font-semibold text-richblack-300 mb-4">
            No courses found in this category
          </p>
          <p className="text-richblack-400 mb-6">
            Check out other categories below
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {allCategories.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                to={`/catalog/${cat.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
                className="px-4 py-2 bg-richblack-800 border border-richblack-700 rounded-lg hover:border-yellow-50 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Catalog;
