import React from "react";
import { BiWorld } from "react-icons/bi";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoCall } from "react-icons/io5";

const contactDetails = [
  {
    icon: HiChatBubbleLeftRight,
    heading: "Chat with us",
    description: "Our friendly team is here to help.",
    details: "info@studynotion.com",
  },
  {
    icon: BiWorld,
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details:
      "Akshya Nagar 1st Block 1st Cross, Rammurthy Nagar, Bangalore - 560016",
  },
  {
    icon: IoCall,
    heading: "Call us",
    description: "Mon – Fri from 8am to 5pm",
    details: "+123 456 7890",
  },
];

  

export const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-6">
      {contactDetails.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="flex gap-4 rounded-lg bg-richblack-600 p-6 text-richblack-5"
          >
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-xl">
              <Icon />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{item.heading}</h3>
              <p className="text-sm text-richblack-300">
                {item.description}
              </p>
              <p className="text-sm font-medium text-richblack-50">
                {item.details}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

