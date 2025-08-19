import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUserEnrolledCourses } from "../../../../services/operations/profileApi";

function Enroll(){
  const {token } = useSelector((state)=> state.auth.token);
const [enrolledCourses, setEnrolledCourses] = useState(null);

const getAllenrolledCourses = async () => {
  try {
 const response = await getUserEnrolledCourses(token);
 setEnrolledCourses(response);
    
  }catch(error){
    console.log(error);
    
  }
}

useEffect(() => {
  if (token) {
    getAllenrolledCourses();
  }
}, [token]);

   
    return(
        <div className='text-white'>

        <div>Enrolled Courses</div>
        {
            !enrolledCourses ? (<div>
                Loading...
            </div>)
            : !enrolledCourses.length ? (<p>You have not enrolled in any course yet</p>)
            : (
                <div>
                    <div>
                        <p>Course Name</p>
                        <p>Durations</p>
                        <p>Progress</p>
                    </div>
                    {/* Cards shure hote h ab */}
                    {
                        enrolledCourses.map((course,index)=> (
                            <div>
                                <div>
                                    <img  src={course.thumbnail}/>
                                    <div>
                                        <p>{course.courseName}</p>
                                        <p>{course.courseDescription}</p>
                                    </div>
                                </div>

                                <div>
                                    {course?.totalDuration}
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