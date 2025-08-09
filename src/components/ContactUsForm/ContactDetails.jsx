import React from 'react'
// import * as Icon1 from "react-icons/bi"
// import * as Icon3 from "react-icons/hi2"
// import * as Icon2 from "react-icons/io5"
import * as Icon1 from "react-icons/bi"
const contactDetails = [
    {
      icon: "HiChatBubbleLeftRight",
      heading: "Chat on us",
      description: "Our friendly team is here to help.",
      details: "info@studynotion.com",
    },
    {
      icon: "BiWorld",
      heading: "Visit us",
      description: "Come and say hello at our office HQ.",
      details:
        "Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
    },
    {
      icon: "IoCall",
      heading: "Call us",
      description: "Mon - Fri From 8am to 5pm",
      details: "+123 456 7869",
    },
  ]
  

export const ContactDetails = () => {
  return (
    <div>
       {
        contactDetails.map((element,index)=>{
            return(
                <div key={index} className='gap-5 p-4 bg-richblack-600'>
                <div>
                <span>{element.Icon1}</span>
                <span>{element.heading}</span>
                </div>
                <span>{element.description}</span>
                <span>{element.details}</span>
                </div>
            )  
        })
       }
    </div>
  )
}
