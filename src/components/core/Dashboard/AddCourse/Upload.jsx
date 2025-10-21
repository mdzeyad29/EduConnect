import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/*": [] }  // ✅ Correct format for v14+
      : { "image/*": [] },
    multiple: false,
    onDrop,
    noClick: true, // Disable default click behavior
  });
  

  const previewFile = (file) => {
    // console.log(file)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
        onClick={() => {
          if (!viewData) {
            inputRef.current?.click()
          }
        }}
      >
        <input {...getInputProps()} ref={inputRef} />
        {previewSource ? (
          <div className="flex flex-col w-full p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="object-cover w-full h-full rounded-md"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    inputRef.current?.click()
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Change Video
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewSource("")
                    setSelectedFile(null)
                    setValue(name, null)
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            )}
            {!viewData && (
              <p className="mt-2 text-xs text-center text-richblack-300">
                Click anywhere to change video
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full p-6">
            <div className="grid rounded-full aspect-square w-14 place-items-center bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a file
            </p>
            <ul className="flex justify-between mt-10 space-x-12 text-xs text-center list-disc text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}