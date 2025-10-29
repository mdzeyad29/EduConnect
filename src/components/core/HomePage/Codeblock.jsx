import React from 'react'
import { Button } from './Button'
import { FaArrowRightLong } from "react-icons/fa6";
import { TypeAnimation } from 'react-type-animation';
export const Codeblock = ({ position, heading, subheading, Button1, Button2, backgroundGradient, codePart, codeColor }) => {
  return (
    <div className={`flex flex-col lg:${position} my-10 md:my-20 justify-between gap-6 md:gap-10`}>

      {
        //section 1
      }
      <div className='flex flex-col w-full lg:w-[90%] gap-4'>
        {heading}
        <div>
          <div className="text-sm md:text-base">{subheading}</div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 md:gap-6 mt-4 md:mt-7'>
          <Button active={Button1.active} linkto={Button1.linkto}>
            <div className='flex items-center gap-2'>
             {Button1.btnText}
              <FaArrowRightLong />
            </div>
          </Button>

          <Button active={Button2.active} linkto={Button2.linkto}>
            {Button2.btnText}
          </Button>

        </div>
      </div>
      {
        //section 2
      }
      <div className='flex flex-row h-fit w-[100%] text-[10px] md:text-xs rounded-lg shadow-custom bg-circular-gradient overflow-hidden'>
        {
          // add gradient 
        }
        <div className='flex flex-col text-center w-[15%] md:w-[10%] text-richblack-400 font-inter font-bold text-xs md:text-sm'>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
          <p>12</p>
        </div>
        <div className={`w-[85%] md:w-[85%] flex flex-col gap-2 md:gap-3 font-bold font-mono ${codeColor} pr-2 text-xs md:text-sm`} >
          <TypeAnimation
            sequence={[codePart, 1000, ""]}
            repeat={Infinity}
            cursor={true}
            style={
              {
                whiteSpace: "pre-Line",
                display: "block"
              }
            }
            omitDeletionAnimation={true}
          />
        </div>

      </div>
    </div>
  )
}
