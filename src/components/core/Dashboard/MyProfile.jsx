import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


import IconBtn from "../../common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
   <>
  <div className="w-full px-4 sm:px-8">
    <h1 className="mb-12 text-4xl font-bold text-richblack-5">My Profile</h1>

    {/* Profile Card */}
    <div className="flex flex-col items-center justify-between gap-6 p-6 border shadow-md sm:flex-row rounded-2xl border-richblack-700 bg-richblack-800 sm:p-10">
      <div className="flex items-center gap-6">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="object-cover w-20 h-20 border-2 rounded-full border-richblack-600"
        />
        <div>
          <h2 className="text-xl font-semibold text-richblack-5">
            {user?.firstName + " " + user?.lastName}
          </h2>
          <p className="text-sm text-richblack-300">{user?.email}</p>
        </div>
      </div>
      <IconBtn
        text="Edit"
        onclick={() => navigate("/dashboard/settings")}
        className="w-full sm:w-auto"
      >
        <RiEditBoxLine />
      </IconBtn>
    </div>

    {/* About Section */}
    <div className="p-6 mt-10 border shadow-md rounded-2xl border-richblack-700 bg-richblack-800 sm:p-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-richblack-5">About</h3>
        <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <p
        className={`${
          user?.additionalDetails?.about
            ? "text-richblack-5"
            : "text-richblack-400 italic"
        } text-sm font-medium leading-relaxed`}
      >
        {user?.additionalDetails?.about ?? "Write something about yourself."}
      </p>
    </div>

    {/* Personal Details */}
    <div className="p-6 mt-10 border shadow-md rounded-2xl border-richblack-700 bg-richblack-800 sm:p-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-richblack-5">
          Personal Details
        </h3>
        <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
          <RiEditBoxLine />
        </IconBtn>
      </div>

      <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 text-richblack-5">
        <div>
          <p className="mb-1 text-richblack-400">First Name</p>
          <p className="font-medium">{user?.firstName}</p>
        </div>
        <div>
          <p className="mb-1 text-richblack-400">Last Name</p>
          <p className="font-medium">{user?.lastName}</p>
        </div>
        <div>
          <p className="mb-1 text-richblack-400">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="mb-1 text-richblack-400">Phone Number</p>
          <p className="font-medium">
            {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
          </p>
        </div>
        <div>
          <p className="mb-1 text-richblack-400">Gender</p>
          <p className="font-medium">
            {user?.additionalDetails?.gender ?? "Add Gender"}
          </p>
        </div>
        <div>
          <p className="mb-1 text-richblack-400">Date of Birth</p>
         
        </div>
      </div>
    </div>
  </div>
</>

  )
}