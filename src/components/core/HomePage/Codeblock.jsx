import React from 'react'
import { Button } from './Button'
import { FaArrowRightLong } from "react-icons/fa6";
import { TypeAnimation } from 'react-type-animation';
export const Codeblock = ({ position, heading, subheading, Button1, Button2, backgroundGradient, codePart, codeColor }) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>

      {
        //section 1
      }
      <div className='flex flex-col w-[90%]  gap-4'>
        {heading}
        <div>
          {subheading}
        </div>
        <div className='flex gap-6 mt-7'>
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
      <div className='flex flex-row h-fit w-[100%]  text-10[px]   rounded-lg  shadow-custom  bg-circular-gradient'>
        {
          // add gradient 
        }
        <div className='flex flex-col text-center w-[10%] text-richblack-400  font-inter font-bold '>
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
        <div className={`w-[50%] flex flex-col gap-3 font-bold font-mono  ${codeColor} pr-2`} >
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
