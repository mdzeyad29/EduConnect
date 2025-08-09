import React from 'react'
import { Link } from 'react-router-dom'

export const Button = ({ children, active, linkto}) => {
  return (
    <div >
      <Link to={linkto}>
        <div className={`text-center text-[16px] px-6   rounded-md font-bold
     ${active ?"bg-yellow-100 text-black p-3  shadow-2xl " : "bg-richblack-700 p-3"}
     `}
     
     >{children}</div>
     </Link >
    </div >
  )
}
