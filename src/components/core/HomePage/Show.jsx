import React from 'react'
import { Button } from './Button'
import { Highlighted } from './Highlighted'
export const Show = () => {
  return (
    <div>
    <div className='flex '>
       <div className='gap-5 p-6 text-4xl font-semibold w-6/11 '>
        Get The Skill You Need For <Highlighted text={"job that is in demand"}/>
       </div>
       <div className='flex flex-col items-start w-6/12 text-[16px] gap-5 p-6'>
      The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
     <div className='mt-5'> <Button active={true} linkto={"./signup"}>
       <div>Learn More</div> 
        </Button>
        </div>  
       </div>
    </div>
</div> 
  )
}
