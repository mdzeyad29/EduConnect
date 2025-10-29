import React from 'react'
import { ContactUsForm } from '../components/ContactUsForm/ContactUsForm'
import {ContactDetails} from '../components/ContactUsForm/ContactDetails'
export const Contact = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between px-4 md:px-8 py-6 md:py-10 gap-6 md:gap-8">
    {/* Left Part */}
    <div className="flex flex-col justify-between w-full lg:w-[40%] gap-6 md:gap-10 mx-auto mt-16 md:mt-20 text-white">
      {/* Contact Details */}
      <div className="w-full rounded-md">
        <ContactDetails />
      </div>    
    </div>
    
    {/* Right Part */}
    <div className="flex flex-col justify-center items-center p-4 md:p-6 rounded-md w-full lg:w-[45%] text-white bg-pure-greys-700">
      <h1 className="text-2xl md:text-3xl font-semibold text-center">Got a Idea? We've got the skills. Let's team up</h1>
      <p className="p-2 md:p-3 text-base md:text-lg text-center">Tell us more about yourself and what you're got in mind.</p>
      <ContactUsForm />
    </div>
  </div>
  
  ) 
}