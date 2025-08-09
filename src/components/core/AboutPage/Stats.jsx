import React from 'react'
const Statss = [
    {count:"5K", label:"Active Student"},
    {count:"20+",label:"Mentors"},
    {count:"200+",label :"Coures"},
    {count:"50+",label:"Awards"}
  ];
export const StatsComponents = () => {
      
  return (
    <div className='flex justify-center py-10'>
    <div className='grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4'>
   {
    Statss.map((data, index) => (
        <div key={index} className="p-6 text-center transition-all duration-300 ease-in-out rounded-lg shadow-lg hover:shadow-2xl hover:translate-y-2 bg-richblack-800">
          <div className="text-3xl font-semibold text-white">{data.count}</div>
          <div className="text-lg text-richblack-600">{data.label}</div>
        </div>
      ))
   }
   
    </div>
    </div>
  )
}
