import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRightLong } from "react-icons/fa6";
import { Highlighted } from '../components/core/HomePage/Highlighted';
import { Button } from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4"
import { Codeblock } from '../components/core/HomePage/Codeblock';
import  Footer  from '../components/common/Footer';
import { Show } from '../components/core/HomePage/Show';
import { Timelines } from '../components/core/HomePage/Timelines';
import { LearningSection } from '../components/core/HomePage/LearningSection';
import { InstructorItem } from '../components/core/HomePage/InstructorItem';
import { ExplorerMore } from '../components/core/HomePage/ExplorerMore';
import { Review } from '../components/core/HomePage/Review';
export const Home = () => {
  return (
    <div className='overflow-x-hidden'>
      {
        // section 1
      }
      <div className='relative flex flex-col items-center justify-between w-11/12 mx-auto text-white max-w-maxContent bg-richblack-900'>
        <Link to={"/signup"}>
          <div className='p-1 mx-auto mt-6 mb-4 md:mt-10 md:mb-5 font-bold transition-all duration-200 rounded-full group bg-richblack-800 text-richblack-200 hover:scale-95 w-fit'>
            <div className='flex flex-row items-center gap-2 rounded-full px-6 py-[5px] md:px-10
          transition-all duration-200 group-hover:bg-richblack-900' >
              <p className="text-sm md:text-base">Become an Instructor</p>
              <FaArrowRightLong className="hidden md:block" />
            </div>
          </div>
        </Link>
        <div className='flex flex-wrap justify-center text-xl md:text-3xl font-semibold text-center px-4'>
          Empower Your Future with
          <Highlighted text={"Coding Skills"} />
        </div>
        <div className='mt-4 w-full md:w-[90%] text-center text-base md:text-lg font-bold text-richblack-300 px-4'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </div>

        <div className='flex flex-col sm:flex-row gap-3 md:gap-5 mt-6 md:mt-8'>
          <Button active={true} linkto={"/signup"} >Learn More</Button>
          <Button active={false} linkto={"/login"}>Book a Demo</Button>
        </div>

        <div className='w-full md:w-9/12 mx-auto my-8 md:my-12 shadow-blue-200 px-2'>
          <video
            muted
            autoPlay
            loop
            controls
            className="w-full rounded-lg"
          >
            <source src={Banner} />
          </video>
        </div>
        {
          // code section
        }
        <div className='flex flex-col lg:flex-row px-4'>
          <Codeblock
            position={"lg:flex-row"}
            heading={
              <div className='text-2xl md:text-3xl font-semibold '>
                Unlock your <Highlighted text={"Coding Potential"} />  with our online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionateabout sharing their knowledge with you."
            }
            Button1={
              {
                btnText: "Try it YourSelf",
                linkto: "/signup",
                active: true
              }
            }
            Button2={
              {
                btnText: "Learn More",
                linkto: "/login",
                active: false
              }

            }
            codePart={` <!DOCTYPE html>
            <html>
         <head><title>Example</
         title><linkrel="stylesheet"href="styles.css">
         /head>
         body>
         h1><ahref="/">Header</a>/h1>
         nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>
         /nav>`}
            codeColor={"text-black"}
          ></Codeblock>
        </div>
        {
          // section 
        }
        <div className="px-4">
          <Codeblock
            position={"lg:flex-row-reverse"}
            heading={
              <div className='text-2xl md:text-3xl font-semibold'>
                Start <Highlighted text={"Coding in Seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."

            }
            Button1={
              {
                btnText: "Continue Lesson",
                linkto: "/signup",
                active: true
              }
            }
            Button2={
              {
                btnText: "Learn More",
                linkto: "/login",
                active: false
              }

            }
            codePart={` <!DOCTYPE html>
          <html>
       <head><title>Example</
       title><linkrel="stylesheet"href="styles.css">
       /head>
       body>
       h1><ahref="/">Header</a>/h1>
       nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>
       /nav>`}
            codeColor={"text-black"}
          ></Codeblock>
        </div>
      </div>
      <div>
       <ExplorerMore/>
      </div>

      
      {
        //section 2
      }
      <div>
      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepage_bg h-auto md:h-[310px] py-10 md:py-0'>
          <div className='flex items-center justify-center gap-3 md:gap-5 mx-auto max-w-maxContent min-h-[300px] flex-col  w-11/12 px-4'>
            <div className='flex flex-col sm:flex-row gap-3 md:gap-5 text-white'>
              <Button active={true} linkto={"./signup"}>
                <div className='flex items-center gap-3'>
                  Explore Full Catalog <FaArrowRightLong />
                </div>
              </Button>
              <Button active={false} linkto={"./signup"}>
                <div className='flex items-center gap-2'>Learn More <FaArrowRightLong /></div>
              </Button>
            </div>

          </div>

        </div>
        <div className='flex flex-col items-center justify-between w-11/12 gap-6 p-5 mx-auto max-w-maxContent mt-7'>
          <Show />
          <Timelines />
        </div>
      </div>
      <div className='flex bg-white'>
      <LearningSection/>
     </div>
     </div>
      {
        //section 3
      }
             <div className='items-center justify-between w-11/12 gap-4 mx-auto text-white max-w-maxContent'>
             <InstructorItem/>
             </div>
      {
        //Review
      }
      <div className='p-4 text-white'>
    <Review/>
    </div>
      {
        //footer
      }
      <div className='bg-richblack-800'>
      <Footer />
      </div>
    </div>
  )
}
