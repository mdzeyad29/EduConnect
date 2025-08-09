import React from 'react'
import { ContactUsForm } from "../../ContactUsForm/ContactUsForm"
export const ContactFormSection = () => {

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className='flex flex-col items-center p-8 rounded-md bg-richblack-100 text-richblack-900'>
        <h1 className='text-4xl'>Get In Touch</h1>
        <p className='p-5 text-xl'>We’d love to here for you, Please fill out this form.</p>
        <ContactUsForm />
      </div>
      
     
    </div>

  )
}
