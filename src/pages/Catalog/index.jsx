import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { getAllCourses, fetchCourseCategories, fetchCourseDetails } from "../../services/operations/courseDetailsAPI";
import { apiConnector } from "../../services/apiconnector";
import { catalogData } from "../../services/apis";
import { FaStar } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

const Catalog = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Check if data was passed from Navbar via navigation state
        if (location.state?.category) {
          console.log("Using data from navigation state");
          setCategory(location.state.category);
          const passedCourses = location.state.courses || [];
          
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
              const categoryCourses = response.data.data.selectedCategory.courses || [];
              
              if (Array.isArray(categoryCourses) && categoryCourses.length > 0) {
                console.log("Courses found:", categoryCourses.length);
                setCourses(categoryCourses);
              } else {
                console.log("No courses found in this category");
                setCourses([]);
              }
            } else {
              console.log("Invalid response structure, using fallback");
              // Fallback: Fetch all courses and filter by category
              const allCourses = await getAllCourses();
              const filteredCourses = allCourses.filter(
                (course) => {
                  const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                  const matchedCategoryId = matchedCategory._id.toString();
                  return courseCategoryId === matchedCategoryId;
                }
              );
              console.log(`Filtered ${filteredCourses.length} courses for category ${matchedCategory.name}`);
              setCourses(filteredCourses);
            }
          } catch (error) {
            console.error("Error fetching category page details:", error);
            // Fallback: Fetch all courses and filter
            const allCourses = await getAllCourses();
            const filteredCourses = allCourses.filter(
              (course) => {
                const courseCategoryId = course.category?._id?.toString() || course.category?.toString();
                const matchedCategoryId = matchedCategory._id.toString();
                return courseCategoryId === matchedCategoryId;
              }
            );
            console.log(`Fallback: Filtered ${filteredCourses.length} courses for category ${matchedCategory.name}`);
            setCourses(filteredCourses);
          }
        } else {
          // Category not found - fetch all courses as fallback
          const allCourses = await getAllCourses();
          setCourses(allCourses);
        }
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName, location.state]);

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
          <h1 className="text-4xl font-bold text-richblack-5 mb-2">
            {category.name}
          </h1>
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
                onClick={async () => {
                  setSelectedCourse(course);
                  setLoadingDetails(true);
                  try {
                    const details = await fetchCourseDetails(course._id);
                    console.log("Course Details:", details);
                    if (details?.success && details?.data) {
                      setCourseDetails(details.data);
                    }
                  } catch (error) {
                    console.error("Error fetching course details:", error);
                  } finally {
                    setLoadingDetails(false);
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

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-richblack-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-richblack-800 rounded-xl border border-richblack-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-richblack-800 border-b border-richblack-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-richblack-5">Course Details</h2>
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  setCourseDetails(null);
                }}
                className="text-richblack-300 hover:text-richblack-5 transition-colors"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
                </div>
              ) : courseDetails ? (
                <div className="space-y-6">
                  {/* Course Image and Basic Info */}
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={courseDetails.thumbnails || courseDetails.thumbnail || selectedCourse?.thumbnails}
                        alt={courseDetails.courseName}
                        className="w-full md:w-1/2 h-64 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-richblack-5 mb-2">
                          {courseDetails.courseName}
                        </h3>
                        <p className="text-richblack-300 mb-4">
                          {courseDetails.courseDescription}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-2xl font-bold text-yellow-50">
                            ₹{courseDetails.price}
                          </div>
                          <div className="flex items-center gap-2">
                            <FaStar className="text-yellow-50" size={20} />
                            <span className="text-richblack-300">
                              {courseDetails.ratingAndReviews?.length || 0} Ratings
                            </span>
                          </div>
                        </div>
                        {courseDetails.Instructor && (
                          <div className="mb-4">
                            <p className="text-richblack-400 text-sm mb-1">Instructor</p>
                            <p className="text-richblack-5 font-medium">
                              {typeof courseDetails.Instructor === 'object'
                                ? `${courseDetails.Instructor.firstName || ''} ${courseDetails.Instructor.lastName || ''}`
                                : 'N/A'}
                            </p>
                            {courseDetails.Instructor?.additionalDetails && (
                              <p className="text-richblack-400 text-sm mt-1">
                                {courseDetails.Instructor.additionalDetails?.about || ''}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* What You Will Learn */}
                    {courseDetails.whatYouWillLearn && (
                      <div className="border-t border-richblack-700 pt-6">
                        <h4 className="text-xl font-semibold text-richblack-5 mb-3">
                          What You'll Learn
                        </h4>
                        <p className="text-richblack-300">{courseDetails.whatYouWillLearn}</p>
                      </div>
                    )}

                    {/* Course Content */}
                    {courseDetails.courseContent && courseDetails.courseContent.length > 0 && (
                      <div className="border-t border-richblack-700 pt-6">
                        <h4 className="text-xl font-semibold text-richblack-5 mb-4">
                          Course Content ({courseDetails.courseContent.length} sections)
                        </h4>
                        <div className="space-y-4">
                          {courseDetails.courseContent.map((section, sectionIdx) => (
                            <div
                              key={section._id || sectionIdx}
                              className="bg-richblack-900 rounded-lg p-4 border border-richblack-700"
                            >
                              <h5 className="text-lg font-medium text-richblack-5 mb-2">
                                Section {sectionIdx + 1}: {section.sectionName || 'Untitled Section'}
                              </h5>
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
                                      {subSection.title || `Lecture ${subIdx + 1}`}
                                      {subSection.timeDuration && (
                                        <span className="text-richblack-500">
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
                    {courseDetails.instructions && courseDetails.instructions.length > 0 && (
                      <div className="border-t border-richblack-700 pt-6">
                        <h4 className="text-xl font-semibold text-richblack-5 mb-3">
                          Instructions
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-richblack-300">
                          {courseDetails.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {courseDetails.tags && courseDetails.tags.length > 0 && (
                      <div className="border-t border-richblack-700 pt-6">
                        <h4 className="text-xl font-semibold text-richblack-5 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {courseDetails.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-richblack-900 border border-richblack-700 rounded-full text-sm text-richblack-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12 text-richblack-300">
                  <p>Failed to load course details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
