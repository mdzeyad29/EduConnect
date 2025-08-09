import React from 'react'
import { Highlighted } from "../HomePage/Highlighted"
import photo1 from "../../../assets/Images/Know_your_progress.png"
import photo2 from "../../../assets/Images/Compare_with_others.png"
import photo3 from "../../../assets/Images/Plan_your_lessons.png"
import { Button } from "./Button"
export const LearningSection = () => {
  return (
    <div className='flex items-center gap-3 p-10'>
      <div className='flex flex-col mt-[90px]'>
        <div className='flex justify-center gap-5 text-3xl font-semibold text-center'>
          <div className=''>Your Swiss Knife for</div>
          <Highlighted text={"learning any language"} />
        </div>
        <div className='flex font-medium  mx-auto  w-[55%] text-center gap-6 mt-2 '>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>
        <div className="flex items-center justify-center">
          <img src={photo1} alt='Not available' className='object-contain -mr-32'></img>
          <img src={photo2} alt='Not available' className='object-contain '></img>
          <img src={photo3} alt='Not available' className='object-contain -ml-36'></img>
        </div>

        <div className='flex items-center justify-center'>
          <Button active={true}><div>Learn more</div></Button>
        </div>

      </div>
    </div>
  )
}





