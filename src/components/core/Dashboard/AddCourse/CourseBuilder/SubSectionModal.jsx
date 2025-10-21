import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slice/courseSlice';
import { Form } from 'react-router-dom';
import {RxCross1} from "react-icons/rx"
import Upload from '../Upload';
import IconBtn from '../../../../common/IconBtn';
import { useSelector } from 'react-redux';

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false,
}) => {

    const {
        register, 
        handleSubmit, 
        setValue,
        formState: {errors},
        getValues,
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        if(view || edit) {
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoFile);
        }
    },[]);

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoFile ) {
                return true;
            }
        else {
            return false;
        }

    }
    const handleEditSubSection = async () => {

        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if(currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle);
        }

        if(currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc);
        }

        if(currentValues.lectureVideo !== modalData.videoFile) {
            formData.append("video", currentValues.lectureVideo);
        }

        setLoading(true);
        //API call
        const result  = await updateSubSection(formData, token);
        if(result) {
            //TODO: same check 
            dispatch(setCourse(result));
        }
        setModalData(null);
        setLoading(false);
    }

    const onSubmit = async (data) => {
        console.log("SubSectionModal onSubmit called with data:", data);
        console.log("Modal mode - add:", add, "edit:", edit, "view:", view);

        if(view)
            return;

        if(edit) {
            if(!isFormUpdated()) {
                toast.error("No changes made to the form")
            }
            else {
                //edit krdo store me 
                handleEditSubSection();
            }
            return;
        }

        //ADD

        const formData = new FormData();
        // modalData can be either an object from add flow or a subSection object from edit/view
        const sectionId = add ? modalData.sectionId : modalData.sectionId;
        formData.append("sectionId", sectionId);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        // backend expects timeduration; send empty or computed later
        formData.append("timeduration", "");
        // backend expects videoFile key
        formData.append("videoFile", data.lectureVideo);
        setLoading(true);
        //API CALL
        const result = await createSubSection(formData, token);

        if(result) {
            //TODO: check for updation
            dispatch(setCourse(result))
        }
        setModalData(null);
        setLoading(false);

    }


  return (
    <div>
      
        <div>
            <div>
                <p>{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
                {add && (
                  <p className="text-sm text-richblack-200">Section: {modalData.sectionName}</p>
                )}
                <button onClick={() => (!loading ? setModalData(null): {})}>
                    <RxCross1 />
                </button>
            </div>
            <form
  onSubmit={handleSubmit(onSubmit)}
  className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto"
>
  {/* Upload */}
  <div>
    <label className="block text-gray-700 font-semibold mb-2">Lecture Video</label>
    <Upload
      name="lectureVideo"
      label="Lecture Video"
      register={register}
      setValue={setValue}
      errors={errors}
      video={true}
      viewData={view ? modalData.videoFile : null}
      editData={edit ? modalData.videoFile : null}
    />
    {errors.lectureVideo && (
      <p className="text-red-500 text-sm mt-1">Lecture video is required</p>
    )}
  </div>

  {/* Title */}
  <div>
    <label
      htmlFor="lectureTitle"
      className="block text-gray-700 font-semibold mb-2"
    >
      Lecture Title
    </label>
    <input
      id="lectureTitle"
      placeholder="Enter Lecture Title"
      {...register("lectureTitle", { required: true })}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
    {errors.lectureTitle && (
      <p className="text-red-500 text-sm mt-1">Lecture title is required</p>
    )}
  </div>

  {/* Description */}
  <div>
    <label
      htmlFor="lectureDesc"
      className="block text-gray-700 font-semibold mb-2"
    >
      Lecture Description
    </label>
    <textarea
      id="lectureDesc"
      placeholder="Enter Lecture Description"
      {...register("lectureDesc", { required: true })}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-[130px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
    {errors.lectureDesc && (
      <p className="text-red-500 text-sm mt-1">Lecture description is required</p>
    )}
  </div>

  {/* Submit Button */}
  {!view && (
    <div className="pt-2">
      <IconBtn
        type="submit"
        disabled={loading}
        text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition"
      />
    </div>
  )}
</form>

        </div>

    </div>
  )
}

export default SubSectionModal