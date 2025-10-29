import React, { useState } from 'react'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sidebarLinks } from '../../../data/dashboard-links'
import { VscSignOut } from 'react-icons/vsc'
import { HiMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import ConfirmationModal from '../../common/ConfirmationModal'
import SidebarLink from './SidebarLink'

export const Sidebar = () => {
  
    const {user, loading :profileLoading } = useSelector((state)=>state.profile);
    const { loading :authLoading } = useSelector((state)=>state.auth);
     // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const dispatch = useDispatch()
  const navigate = useNavigate()

   if (profileLoading || authLoading) {
    return (
      <div className="grid lg:h-[calc(100vh-3.5rem)] h-auto min-w-full lg:min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }
  return (
    <>
    {/* Mobile Menu Button */}
    <div className="lg:hidden bg-richblack-800 border-b border-richblack-700">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-4 text-white"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <IoMdClose size={24} /> : <HiMenuAlt3 size={24} />}
      </button>
    </div>

    {/* Sidebar */}
    <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 flex lg:h-[calc(100vh-3.5rem)] h-auto min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10 transition-transform duration-300 lg:transition-none`}>
    <div  className="flex flex-col">
    {
        sidebarLinks.map((links,index)=>{
           
         if(links.type && user.accountType !== links.type){
                return null;
            }
             return (
              <SidebarLink key={links.id} link={links} iconName={links.icon} />
            )
    })
    }
    </div>
    <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
    
    {/* Mobile Overlay */}
    {mobileMenuOpen && (
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setMobileMenuOpen(false)}
      />
    )}
    </>
  )
}
