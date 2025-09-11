import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { setCourse, setStep } from "../../../../../slice/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import { MuiChipsInput } from "mui-chips-input";
import RequirementsField from "./RequirementField"
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories.length > 0) {
        // console.log("categories", categories)
        setCourseCategories(categories)
      }
      setLoading(false)
    }


const handleImageUpload = (event)=>{
const imageupload =  event.target.files
}
    // if form is in edit mode
    if (editCourse) {
      // console.log("data populated", editCourse)
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log(data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form
  onSubmit={handleSubmit(onSubmit)}
  className="max-w-4xl p-8 mx-auto space-y-10 border rounded-lg shadow-lg border-richblack-700 bg-richblack-800"
>
  <h2 className="mb-8 text-2xl font-bold text-center text-richblack-5">
    Add Course
  </h2>

  {/* Course Title */}
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-richblack-5" htmlFor="courseTitle">
      Course Title <sup className="text-pink-400">*</sup>
    </label>
    <input
      id="courseTitle"
      placeholder="Enter Course Title"
      {...register("courseTitle", { required: true })}
      className="w-full p-3 border rounded-md border-richblack-600 bg-richblack-900 text-richblack-5 placeholder-richblack-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
    />
    {errors.courseTitle && (
      <span className="text-xs text-pink-400">Course title is required</span>
    )}
  </div>

  {/* Course Short Description */}
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-richblack-5" htmlFor="courseShortDesc">
      Course Short Description <sup className="text-pink-400">*</sup>
    </label>
    <textarea
      id="courseShortDesc"
      placeholder="Enter Description"
      {...register("courseShortDesc", { required: true })}
      className="w-full min-h-[120px] rounded-md border border-richblack-600 bg-richblack-900 p-3 text-richblack-5 placeholder-richblack-400 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
    />
    {errors.courseShortDesc && (
      <span className="text-xs text-pink-400">Course description is required</span>
    )}
  </div>

  {/* Course Price */}
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-richblack-5" htmlFor="coursePrice">
      Course Price <sup className="text-pink-400">*</sup>
    </label>
    <div className="relative">
      <input
        id="coursePrice"
        placeholder="Enter Course Price"
        {...register("coursePrice", {
          required: true,
          valueAsNumber: true,
          pattern: { value: /^(0|[1-9]\d*)(\.\d+)?$/ },
        })}
        className="w-full p-3 pl-12 border rounded-md border-richblack-600 bg-richblack-900 text-richblack-5 placeholder-richblack-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
      />
      <HiOutlineCurrencyRupee className="absolute text-lg left-3 top-3 text-richblack-400" />
    </div>
    {errors.coursePrice && (
      <span className="text-xs text-pink-400">Course price is required</span>
    )}
  </div>

  {/* Course Category */}
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-richblack-5" htmlFor="courseCategory">
      Course Category <sup className="text-pink-400">*</sup>
    </label>
    <select
      id="courseCategory"
      defaultValue=""
      {...register("courseCategory", { required: true })}
      className="w-full p-3 border rounded-md border-richblack-600 bg-richblack-900 text-richblack-5 placeholder-richblack-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
    >
      <option value="" disabled>
        Choose a Category
      </option>
      {!loading &&
        courseCategories?.map((category, indx) => (
          <option key={indx} value={category?._id}>
            {category?.name}
          </option>
        ))}
    </select>
    {errors.courseCategory && (
      <span className="text-xs text-pink-400">Course category is required</span>
    )}
  </div>

  {/* Course Tags */}
<div >
  <div >
    <MuiChipsInput
      label="Tags"
      name="courseTags"
      placeholder="Enter Tags and press Enter"
      register={register}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
      className="w-full p-3 transition-all duration-200 border rounded-md border-richblack-600 bg-richblack-900 text-richblack-5 placeholder-richblack-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300"
    />
  </div>
  {errors.courseTags && (
    <span className="text-xs text-pink-400">
      Please enter at least one tag
    </span>
  )}
</div>


  {/* Course Thumbnail Image */}
  <div>
    <input
  type="file"
  onChange={handleImageUpload}
  accept="image/jpeg,image/jpg,image/png"
/>
  </div>

  {/* Benefits of the course */}
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-richblack-5" htmlFor="courseBenefits">
      Benefits of the Course <sup className="text-pink-400">*</sup>
    </label>
    <textarea
      id="courseBenefits"
      placeholder="Enter benefits of the course"
      {...register("courseBenefits", { required: true })}
      className="w-full min-h-[120px] rounded-md border border-richblack-600 bg-richblack-900 p-3 text-richblack-5 placeholder-richblack-400 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
    />
    {errors.courseBenefits && (
      <span className="text-xs text-pink-400">Benefits of the course is required</span>
    )}
  </div>

  {/* Requirements/Instructions */}
  <div>
    <RequirementsField
      name="courseRequirements"
      label="Requirements/Instructions"
      register={register}
      setValue={setValue}
      errors={errors}
      getValues={getValues}
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-x-4">
    {editCourse && (
      <button
        onClick={() => dispatch(setStep(2))}
        disabled={loading}
        className="px-6 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50"
      >
        Continue Without Saving
      </button>
    )}
    <IconBtn
      disabled={loading}
      text={!editCourse ? "Next" : "Save Changes"}
    >
      <MdNavigateNext />
    </IconBtn>
  </div>
</form>

  )
}