import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../../services/operations/profileApi";

function Enroll(){
  const {token } = useSelector((state)=> state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const getAllenrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      getAllenrolledCourses();
    }
  }, [token]);

  // Filter courses based on active tab
  const filteredCourses = enrolledCourses ? 
    activeTab === "All" ? enrolledCourses :
    activeTab === "Pending" ? enrolledCourses.filter(course => course.progressPercentage < 100) :
    enrolledCourses.filter(course => course.progressPercentage === 100) : [];

  return(
    <div className='text-richblack-5 px-4 sm:px-8 py-8'>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center gap-2 text-sm mb-6'>
        <Link to="/" className='text-richblack-300 hover:text-richblack-5 transition-colors'>
          Home
        </Link>
        <span className='text-richblack-300'>/</span>
        <Link to="/dashboard/my-profile" className='text-richblack-300 hover:text-richblack-5 transition-colors'>
          Dashboard
        </Link>
        <span className='text-richblack-300'>/</span>
        <span className='text-yellow-50'>
          Enrolled Courses
        </span>
      </div>

      {/* Main Title */}
      <h1 className='text-3xl font-semibold text-richblack-5 mb-8'>
        Enrolled Courses
      </h1>

      {/* Filter Tabs */}
      <div className='flex gap-1 p-2 rounded-full bg-richblack-800 max-w-max mb-8'>
        <button
          onClick={() => setActiveTab("All")}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            activeTab === "All"
              ? "bg-richblack-900 text-richblack-5"
              : "text-richblack-300 hover:text-richblack-5"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("Pending")}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            activeTab === "Pending"
              ? "bg-richblack-900 text-richblack-5"
              : "text-richblack-300 hover:text-richblack-5"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("Completed")}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            activeTab === "Completed"
              ? "bg-richblack-900 text-richblack-5"
              : "text-richblack-300 hover:text-richblack-5"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Divider */}
      <div className='h-[1px] w-full bg-richblack-700 mb-8'></div>

      {/* Course List */}
      {
        !enrolledCourses ? (
          <div className='text-center py-12 text-richblack-300'>
            Loading...
          </div>
        ) : !enrolledCourses.length ? (
          <p className='text-richblack-300 text-center py-12'>
            You have not enrolled in any course yet
          </p>
        ) : filteredCourses.length === 0 ? (
          <p className='text-richblack-300 text-center py-12'>
            No {activeTab.toLowerCase()} courses found
          </p>
        ) : (
          <div className='space-y-4'>
            {/* Course Cards */}
            {
              filteredCourses.map((course, index) => (
                <div key={index} className='flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-richblack-700 bg-richblack-800'>
                  <div className='flex items-start gap-4 flex-1'>
                    <img 
                      src={course.thumbnail} 
                      alt={course.courseName}
                      className='w-32 h-20 object-cover rounded-lg'
                    />
                    <div className='flex-1'>
                      <p className='text-lg font-medium text-richblack-5 mb-1'>
                        {course.courseName}
                      </p>
                      <p className='text-sm text-richblack-300 line-clamp-2'>
                        {course.courseDescription}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center'>
                    <div className='text-sm text-richblack-300'>
                      <span className='text-richblack-400'>Duration: </span>
                      {course?.totalDuration || "N/A"}
                    </div>
                    {course?.progressPercentage !== undefined && (
                      <div className='text-sm text-richblack-300'>
                        <span className='text-richblack-400'>Progress: </span>
                        {course.progressPercentage}%
                      </div>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default Enroll;
