import React from 'react'
import { ContactUsForm } from '../components/ContactUsForm/ContactUsForm'
import {ContactDetails} from '../components/ContactUsForm/ContactDetails'
export const Contact = () => {
  return (
    <div className="flex items-start justify-between px-8 py-10">
    {/* Left Part */}
    <div className="flex flex-col justify-between w-full lg:w-[40%] gap-10 mx-auto mt-20 text-white max-w-full lg:flex-row">
      {/* Contact Details */}
      <div className="lg:w-[100%] rounded-md">
        <ContactDetails />
      </div>    
    </div>
    
    {/* Right Part */}
    <div className="flex flex-col justify-center items-center p-2  rounded-md  w-full lg:w-[45%]  text-white bg-pure-greys-700">
      <h1 className="text-3xl font-semibold text-center">Got a Idea? We’ve got the skills. Let’s team up</h1>
      <p className="p-3 text-lg text-center">Tell us more about yourself and what you’re got in mind.</p>
      <ContactUsForm />
    </div>
  </div>
  
  ) 
}