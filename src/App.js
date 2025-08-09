import "./App.css";
import {Route, Routes } from "react-router-dom";
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
function App() {
  return (
   <div className="flex flex-col w-screen min-h-screen bg-richblack-900 font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
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

    
    <Route 
      element={
        <PrivateRoute>
          <Dashboard />
          </PrivateRoute>
      }
    >
      <Route path="dashboard/my-profile" element={<MyProfile />} />
       <Route path="dashboard/Settings" element={<Settings />} />
       <Route path="/dashboard/enrolled-courses" element={<Enroll />} />"
     </Route>

    </Routes>

   </div>
  );
}

export default App;
