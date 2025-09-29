"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "@/app/services/snackbarContext";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { Icon } from "@iconify-icon/react";
import { addServiceTypes } from "@/app/services/assetsApi";

// Define the validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Service Type Name is required")
    .min(3, "Service Type Name must be at least 3 characters")
    .max(50, "Service Type Name cannot exceed 50 characters"),
  status: Yup.string()
    .oneOf(["1", "0"], "Invalid status selected")
    .required("Status is required"),
});

export default function AddServiceType() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter(); 

  const formik = useFormik({
    initialValues: {
      name: "",
      status: "1",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
        const res = await addServiceTypes({
          name: values.name.trim(),
          status: Number(values.status),
        });

        if(res.error) {
          showSnackbar(res.data.message || "Failed to add Service Type", "error");
          throw new Error("Unable to add Service Type");
        } else {
          showSnackbar( res.message || "Service Type added successfully", "success");
          resetForm();
          router.push("/dashboard/assets/types");
        }
        setSubmitting(false);
  }});
      

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div onClick={() => router.back()}>
          <Icon icon="lucide:arrow-left" width={24} />
        </div>
        <h1 className="text-xl font-semibold">Add Servie Type</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Type Name Field */}
            <InputFields
              label="Service Type Name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : ""
              }
            />

            {/* Status Field */}
            <InputFields
              label="Status"
              type="select"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              error={
                formik.touched.status && formik.errors.status
                  ? formik.errors.status
                  : ""
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </button>

            <SidebarBtn
              type="submit"
              label="Submit"
              isActive
              leadingIcon="mdi:check"
              disabled={formik.isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
