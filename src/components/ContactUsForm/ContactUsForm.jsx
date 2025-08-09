import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import  CountryCode from "../../data/countrycode.json"
export const ContactUsForm = () => {
  const [loading,setLoading] = useState(false);
    const {register,handleSubmit,reset,formState:{errors,isSubmitSuccessful}}= useForm();
    const submitContactForm = async(data)=>{
     console.log(data);
     try{
      setLoading(true);
      const response = {status:"ok"};
      console.log("logging response",response);
      setLoading(false)
     }catch(err){
      console.log("Error",err.message);
      setLoading(false);
     }
    }
    useEffect(()=>{
     if(isSubmitSuccessful){
        reset({
            firstname:"",
            lastname:"",
            email:"",
            message:"",
            phoneNo:""
        })
     }
    },[reset,isSubmitSuccessful])
  
  return (
<div>
<form onSubmit={handleSubmit(submitContactForm)} className="flex flex-col gap-8">

{/* Name Section */}
<div className="flex flex-col gap-5 md:flex-row md:gap-4">

<div className="flex flex-col w-full">
<label htmlFor="firstname" className="mb-1 text-gray-700">First Name</label>
<input
  type="text"
  id="firstname"
  placeholder="Enter first name"
  className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  {...register("firstname", { required: true })}
/>
{errors.firstname && <span className="mt-1 text-sm text-red-500">Please enter your name</span>}
</div>

<div className="flex flex-col w-full">
<label htmlFor="lastname" className="mb-1 text-gray-700">Last Name</label>
<input
  type="text"
  id="lastname"
  placeholder="Enter last name"
  className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  {...register("lastname")}
/>
</div>

</div>

{/* Email */}
<div className="flex flex-col">
<label htmlFor="email" className="mb-1 text-gray-700">Email Address</label>
<input
type="email"
id="email"
placeholder="Enter email address"
className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
{...register("email", { required: true })}
/>
{errors.email && <span className="mt-1 text-sm text-red-500">Please enter your email address</span>}
</div>

{/* Phone No */}
<div className="flex flex-col">
<label htmlFor="phonenumber" className="mb-1 text-gray-700">Phone Number</label>
<div className="flex gap-2">

<select
  className="border border-gray-300 rounded-md px-2 py-2 bg-white focus:outline-none text-black w-[90px]"
  {...register("countrycode", { required: true })}
>
  {CountryCode.map((element, index) => (
    <option key={index} value={element.code}>
      {element.code} - {element.country}
    </option>
  ))}
</select>

<input
  type="number"
  id="phonenumber"
  placeholder="1234567890"
  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  {...register("phoneNo", {
    required: { value: true, message: "Please enter phone number" },
    maxLength: { value: 10, message: "Invalid phone number" },
    minLength: { value: 8, message: "Invalid phone number" },
  })}
/>
</div>
{errors.phoneNo && <span className="mt-1 text-sm text-red-500">{errors.phoneNo.message}</span>}
</div>

{/* Message */}
<div className="flex flex-col">
<label htmlFor="message" className="mb-1 text-gray-700">Message</label>
<textarea
id="message"
rows="5"
placeholder="Enter your message here"
className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
{...register("message", { required: true })}
/>
{errors.message && <span className="mt-1 text-sm text-red-500">Please enter your message</span>}
</div>

{/* Submit Button */}
<button
type="submit"
className="px-6 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-md hover:bg-blue-700"
>
Send Message
</button>

</form>
</div>
  )}
