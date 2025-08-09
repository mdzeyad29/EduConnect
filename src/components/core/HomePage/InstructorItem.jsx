import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import { Highlighted } from './Highlighted'
import { Button } from './Button'
import { FaArrowRight } from 'react-icons/fa6'
export const InstructorItem = () => {
  return (
    <div className='flex flex-col justify-center'>
      <div className='flex justify-between gap-6 mt-16'>
      {
        // image [left]
      }
        <div className='w-[50%]'>
         <img src={Instructor} alt='Not Available' className='shadow-white'/>
        </div>
        {
          // written content [right]
        }
        <div className='w-[50%] flex flex-col gap-5 justify-center px-5'> 
           <div className='gap-5 text-4xl font-semibold'> 
            Become an
            <Highlighted text={"Instructor"}/>
           </div>
           <p className='font-medium text-[16px] text-richblack-300  w-[9 0%] '>Instructor From around the world teach millions of Student on Edtech Platform.We Provide tools and skills what you love</p>
            <div className='w-fit'>
            <Button active={true} linkto={"/signup"} className="flex justify-start">
            <div className='flex flex-row items-center gap-4'>
            Start Teaching Today
            <FaArrowRight/>
            </div>
            </Button>
            </div>
          
            
          
        </div>
      </div>
      {
        //for review
      }
     
    </div>
  )
}
