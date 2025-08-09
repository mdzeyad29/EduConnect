import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import TimelineImage from "../../../assets/Images/TimelineImage.png"
const timeline = [
    {
        Logo:Logo1,
        Heading:"Leadership",
        Description:"Fully Committed to the success Company"
        
    },
    {
        Logo:Logo2,
        Heading:"Responsibility",
        Description:" Student will always be our top  priority",
        dot:"'",
       
    },
    {
        Logo:Logo3,
        Heading:"Flexibility",
        Description:"The ability to switch is an important skill",
        dot:"'",
       
    },
    {
        Logo:Logo4,
        Heading:"Solve the Problem",
        Description:"Code you way to a solution "
        
    }
    
]
export const Timelines = () => {
  return (
    <div className='w-11/12'>
         <div className='flex flex-row items-center gap-10'>
         {
            // left part
         }
          <div className='flex flex-col w-[45%]  gap-7  py-9  px-3 shadow-green-300 shadow-xl'>
           {
            timeline.map((element,index)=>{
                return(
                    <div className='flex flex-row gap-6' key={index}>
                         <div className='flex items-center bg-white w-[50px] h-[50px]  justify-center'>
                            <img src={element.Logo} alt='not'/>
                         </div>
                         <div>
                          <h2 className='font-semibold text-[18px]'>{element.Heading}</h2>
                          <p className='text-base'>{element.Description}</p>
                         </div>
                         {
                            // add dot line between the data
                         }
                    </div>
                )
            })
           }
          </div>
          {
          //  right part
          }
          <div className='relative shadow-blue-500'> 
          <img src={TimelineImage}
          alt='TimelineImage'
          className='shadow-lg'/>

          
            <div className='absolute flex flex-row py-5 text-white uppercase bg-caribbeangreen-700 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            <div className='flex flex-row items-center gap-3 px-5 border-r border-caribbeangreen-300'>
            <strong className='text-3xl'>10</strong>
            <p className='text-caribbeangreen-300'>Years Of Experience</p>
            </div>
            <div className='flex flex-row items-center gap-3 px-5'>
            <strong className='text-3xl'>250</strong>
            <p className='text-caribbeangreen-300'>TYpes of courses</p>
            </div>
            </div>
          </div>
         </div>
    </div>
  )
}
