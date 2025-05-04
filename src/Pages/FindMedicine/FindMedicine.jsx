import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CloudUpload } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { supabase } from "../../Config/Supabase";

const validationSchema = Yup.object({
  medicineName: Yup.string()
    .required("Medicine name is required")
    .min(2, "Medicine name must be at least 2 characters"),
  notes: Yup.string().required("Additional details are required"),
  image: Yup.mixed()
    .nullable()
    .required("An image is required")
    .test("fileSize", "File size is too large", (value) => {
      return value && value.size <= 10 * 1024 * 1024; // 3MB
    })
    .test("fileType", "Unsupported file format", (value) => {
      return (
        value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      );
    })
    .test("fileRequired", "An image is required", (value) => {
      return value && value.size > 0;
    }),
});

const FindMedicinePage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitStatus({ type: "loading", message: "Submitting your request..." });

    try {
      const userId = "PAT-0";
      let imageUrl = null;

      if (values.image) {
        const storage = getStorage();
        const fileName = `${Date.now()}_${values.medicineName.replace(
          /\s+/g,
          "_"
        )}.jpg`;
        const storageRef = ref(storage, `FindMedicine/${fileName}`);

        await uploadBytes(storageRef, values.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const { data, error } = await supabase.from("FindMedicine").insert([
        {
          name: values.medicineName,
          notes: values.notes || "EMPTY",
          image_url: imageUrl,
          answer: null,
          is_found: false,
          user_id: userId,
          pharmacy_id: null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      resetForm();
      setImagePreview(null);
      setSubmitStatus({
        type: "success",
        message:
          "Your request has been submitted! We will notify you when a pharmacy responds.",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      setSubmitStatus({
        type: "error",
        message:
          "There was a problem submitting your request. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 rounded-lg">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-blue-900">
        Find My Medicine
      </h1>

      <p className="mb-4 text-gray-700 text-sm sm:text-base">
        Can't find a specific medicine? Let us help you locate it. Fill out the
        details below and nearby pharmacies will check if they have it in stock.
      </p>

      <Formik
        initialValues={{
          medicineName: "",
          notes: "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, setFieldValue }) => (
          <Form className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="medicineName"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
              >
                Medicine Name
              </label>
              <Field
                type="text"
                id="medicineName"
                name="medicineName"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter medicine name"
              />
              {errors.medicineName && touched.medicineName && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.medicineName}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
              >
                Additional Details (optional)
              </label>
              <Field
                as="textarea"
                id="notes"
                name="notes"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dosage, form (tablets, syrup, etc.), or any other details"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <div className="bg-blue-100 rounded-xl p-3 sm:p-5 border-2 mb-3 sm:mb-4 border-dashed border-blue-400">
                <p className="text-xs sm:text-sm font-medium text-[#00155D] break-words">
                  Please upload an image of the medicine or prescription <br/>
                  <span className="font-semibold">Max size:</span> 3MB (JPEG,
                  PNG, JPG)
                </p>
              </div>

              <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 mx-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFieldValue("image", null);
                        setImagePreview(null);
                      }}
                      className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <CloudUpload className="h-12 w-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Click to upload an image of the medicine or prescription
                    </span>
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-white text-sm sm:text-base font-medium ${
                isSubmitting ? "bg-blue-400" : "bg-[#00155d] hover:bg-[#00165dc0]"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </Form>
        )}
      </Formik>

      {submitStatus && (
        <div
          className={`mt-4 p-2 sm:p-3 rounded-md text-sm sm:text-base ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800"
              : submitStatus.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
    </div>
  );
};

export default FindMedicinePage;