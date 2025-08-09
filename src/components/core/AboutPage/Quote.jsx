import React from 'react'
import { Highlighted } from '../HomePage/Highlighted'
import { Quote } from 'lucide-react' // Optional quote icon from lucide (or any icon lib)

export const QuoteSection = () => {
  return (
    <section className="px-6 py-16 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl p-10 mx-auto text-center text-white bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl">
        <div className="flex justify-center mb-6">
          <Quote className="w-10 h-10 text-amber-400" />
        </div>

        <p className="text-2xl font-light leading-relaxed">
          We are passionate about revolutionizing the way we learn. Our innovation platform{" "}
          <Highlighted text="combines technology" className="font-medium text-cyan-400" />,{" "}
          <Highlighted text="expertise" className="font-medium text-purple-400" />, and community to create an{" "}.
          <Highlighted text="unparalleled education experience" className="font-medium text-pink-400" />
        </p>
        <div className="flex justify-center mb-6">
      <Quote className="w-10 h-10 text-amber-400" />
    </div>
      </div>
      
    </section>
  )
}
