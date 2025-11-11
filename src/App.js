import "./App.css";
import {Route, Routes, useSearchParams } from "react-router-dom";
import{ Home} from "./pages/Home"
import{ Navbar }from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import LoginForm from "./components/core/Auth/LoginForm"
import SignupForm from "./components/core/Auth/SignupForm"
import  ForgotPassword  from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Dashboard } from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Settings from "./components/core/Dashboard/Setting/Setting";
import Enroll from "./components/core/Dashboard/EnrolledCourses/enrolled";
import AddCourse from "./components/core/Dashboard/AddCourse";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import MyCourses from "./components/core/Dashboard/MyCourse";
import Catalog from "./pages/Catalog";
import Social from "./components/core/Social";
import CourseDetails from "./components/core/Dashboard/CourseDetails";


function App() {
  const {user} = useSelector((state)=>state.profile)
  return (
   <div className="flex flex-col w-full min-h-screen bg-richblack-900 font-inter overflow-x-hidden">
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/catalog/:categoryName" element={<Catalog/>} />
    <Route path="/course/:courseId" element={<CourseDetails />} />
      <Route
          path="signup"
          element={
            <OpenRoute>
              <SignupForm/>
            </OpenRoute>
          }
        />
        <Route
        path="forgot-password"
        element={
          <OpenRoute>
            <ForgotPassword/>
          </OpenRoute>
        }
      />


        <Route
          path="login"
          element={
            <OpenRoute>
              <LoginForm/>
            </OpenRoute>
          }
        />

        <Route
        path="update-password/:token"
        element={
          <OpenRoute>
            <UpdatePassword/>
          </OpenRoute>
        }
      />
      <Route
        path="verify-email"
        element={
          <OpenRoute>
            <VerifyEmail/>
          </OpenRoute>
        }
      />
      <Route
        path="About"
        element={
          <OpenRoute>
            <About/>
          </OpenRoute>
        }
      />
      <Route
      path="Contact"
      element={
        <OpenRoute>
          <Contact/>
        </OpenRoute>
      }
    />

    <Route path="/socials" element={<Social />} />

    
    <Route 
      element={
        <PrivateRoute>
          <Dashboard />
          </PrivateRoute>
      }
    >

     {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="dashboard/my-courses" element={<MyCourses />} />
          <Route path="dashboard/my-courses/:courseId" element={<CourseDetails />} />
           <Route path="/dashboard/add-course" element={<AddCourse />}  />
          
          </>
        )
      }
      <Route path="dashboard/my-profile" element={<MyProfile />} />
       <Route path="dashboard/Settings" element={<Settings />} />
       <Route path="/dashboard/enrolled-courses" element={<Enroll />} />
       
     </Route>

    </Routes>

   </div>
  );
}

export default App;
