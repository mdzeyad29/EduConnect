import React, { useState } from 'react'
import { Highlighted } from './Highlighted'
import {HomePageExplore} from '../../../data/homepage-explore'

const tabs = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

export const ExplorerMore = () => {
  const [currentTabs, setCurrentTab] =useState(tabs[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
    console.log(courses[0].heading);
  const [currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0])
   console.log(currentCard)
  const  setMyCard = (value)=>{
      setCurrentTab(value);
      const result = HomePageExplore.filter((course)=>course.tag===value);
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
  }
  return (
    <div>
    <div className='flex flex-col items-center justify-center gap-4 md:gap-6 p-6 md:p-12 text-white'>
      <div className='flex flex-wrap justify-center text-2xl md:text-4xl font-semibold px-4'>
      Unlock The <Highlighted  text={"Power Of Code"} />
      </div>
      <p className="text-center px-4 text-sm md:text-base">Learn to Build AnyThing That you can imagine</p>
    </div>
    {
        //tabs
    }
    <div className='flex items-center justify-center rounded-full bg-richblack-800 w-full md:w-[55%] m-auto mb-4 px-2 md:px-0 overflow-x-auto'>
     {
      tabs.map((element,index)=>{
        return(
          <div className={`flex flex-row items-center justify-center
             text-white gap-2 md:gap-4 text-xs md:text-sm lg:text-[17px] whitespace-nowrap
             ${currentTabs=== element?"bg-richblack-900 text-richblack-5 font-medium"
             :"text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 py-2 md:py-4 px-2 md:px-4`}
             key={index}
              onClick={()=>{setMyCard(element)}}>
          {element}
          </div>
        )
      })
     }
      {
        //show cards
         }
    
    </div>
      <div className='flex bg-white '>
       { 
      //   <div className='flex flex-col w-50'>
      //   <div>
      //   {currentCard.heading}
      //   </div>
      //   <div>
      //   {currentCard.description}
      //   </div>
      //  <div> {currentCard.lessionNumber} </div>
      //  <div> {currentCard.level}</div>
       
      //   </div>
      }
      </div>
    </div>
  )
}
