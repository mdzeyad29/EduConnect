import { Sidebar } from '../components/core/Dashboard/Sidebar'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

export const Dashboard = () => {
    const {loading : authloading } = useSelector((state) => state.auth)
    const {loading : profileloading } = useSelector((state)=>state.profile)

    if(profileloading || authloading){
      return (
        <div className='mt-10'>loading....</div>
      )
    }
  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
     <Sidebar/>
    <div className="flex-1 h-screen overflow-auto bg-richblack-900">
  <div className="w-full px-4 py-10 sm:px-8">
    <Outlet />
  </div>
</div>
    </div>
  )
}
