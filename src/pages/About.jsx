import React from 'react'
import { Highlighted } from '../components/core/HomePage/Highlighted'
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import {QuoteSection}from "../components/core/AboutPage/Quote"
import FoundingStory from "../assets/Images/FoundingStory.png"
import { StatsComponents } from '../components/core/AboutPage/Stats'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import { ContactFormSection } from '../components/core/AboutPage/ContactFormSection'
import { Review } from '../components/core/HomePage/Review'
import Footer from '../components/common/Footer'
export const About = () => {
  return (
    <div className='mx-auto mt-[100px] text-white'>
    { 
        // section 1
    }
    <section className="py-12 bg-gray-900">
    <div className="flex flex-col items-center justify-center max-w-4xl px-4 mx-auto text-center text-white">
      
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">
          Driving Innovation in Online Education For a{" "}
          <Highlighted text={"Brighter Future"} />
        </h1>
        <p className="text-lg text-gray-300">
          Study Notation is at the forefront of driving innovation in online education.
          We are passionate about creating a brighter future by offering
          cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
        </p>
      </header>
  
      <div className="flex flex-wrap justify-center gap-4">
        <img src={BannerImage1} alt="Banner 1" className="object-cover shadow-lg h-60 w-96 rounded-xl" />
        <img src={BannerImage2} alt="Banner 2" className="object-cover shadow-lg h-60 w-96 rounded-xl" />
        <img src={BannerImage3} alt="Banner 3" className="object-cover shadow-lg w-96 h-60 rounded-xl" />
      </div>
  
    </div>
  </section>
  
    {
        // section 2
    }
    <section>
   <QuoteSection/>
    </section>
    {
        // section 3
    }
    <section className="px-4 py-16 text-white bg-gray-950">
  <div className="max-w-6xl mx-auto space-y-20">

    {/* Founding Story - Full Width with Image */}
    <div className="grid items-center gap-10 md:grid-cols-2">
      <div>
      <h1 className="mb-4 text-4xl font-semibold text-pink-600">
      Our Founding Story
    </h1>
        <p className="text-lg text-gray-300">
          Our e-learning platform was born out of a shared vision and passion for
          transforming education. It all began with a group of educators, technologists...
        </p>
        <p className="text-lg text-gray-300">
          United by a common goal, we aimed to reimagine education using modern tools
          and community-powered learning.
        </p>
      </div>
      <div>
        <img
          src={FoundingStory}
          alt="Founding Story"
          className="w-full rounded-2xl shadow-lg object-cover max-h-[400px]"
        />
      </div>
    </div>

    {/* Vision and Mission - Side by Side Boxes */}
    <div className="grid gap-8 md:grid-cols-2">
      {/* Vision Box */}
      <div className="p-8 bg-gray-900 shadow-lg rounded-2xl">
        <h2 className="mb-4 text-3xl font-semibold text-teal-400 text-blue-25">Our Vision</h2>
        <p className="text-lg text-gray-300">
          With this vision in mind, we set out on a journey to create an e-learning platform
          that would revolutionize the way people learn. Our team of dedicated experts worked
          tirelessly to develop a robust and intuitive platform that combines cutting-edge
          technology with engaging content, fostering a dynamic and interactive learning experience.
        </p>
      </div>

      {/* Mission Box */}
      <div className="p-8 bg-gray-900 shadow-lg rounded-2xl">
        <h2 className="mb-4 text-3xl font-semibold text-pink-400">Our Mission</h2>
        <p className="text-lg text-gray-300">
          Our mission goes beyond just delivering courses online. We wanted to 
          create a vibrant community of learners, where individuals can connect, 
          collaborate, and learn from one another. We believe that knowledge thrives in an 
          environment of sharing and dialogue, and we foster this spirit of collaboration 
          through forums, live sessions, and networking opportunities.
        </p>
      </div>
    </div>

  </div>
</section>
{
  // section 4
}
<section className='text-white'>
<StatsComponents/>
</section>
{
  //section 5
}
<LearningGrid/>
<ContactFormSection/>
<Review/>
<Footer/>
    </div>
  )
}
