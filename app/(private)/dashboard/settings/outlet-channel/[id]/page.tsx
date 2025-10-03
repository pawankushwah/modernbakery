"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import ContainerCard from "@/app/components/containerCard";
import InputFields from "@/app/components/inputFields";
import Loading from "@/app/components/Loading";
import {
  updateOutletChannel,
  addOutletChannel,
  getOutletChannelById,
} from "@/app/services/allApi";

import { useSnackbar } from "@/app/services/snackbarContext";

type OutletChannel = {
  outlet_channel: string;
  status: string; // "active" | "inactive"
};

export default function AddOrEditOutletChannel() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Formik setup
  const formik = useFormik<OutletChannel>({
    initialValues: {
      outlet_channel: "",
      status: "active", // default
    },
    validationSchema: Yup.object({
      outlet_channel: Yup.string().required("Outlet Channel Code is required."),
      status: Yup.string().required("Status is required."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("Submitting form with values:", values);
        const payload = {
          outlet_channel: values.outlet_channel,
          status: values.status === "active" ? 1 : 0,
        };

        console.log("Payload to submit:", payload);

        let res;
        if (isEditMode && params?.id && params.id !== "add") {
          res = await updateOutletChannel(String(params.id), payload);
        } else {
          res = await addOutletChannel(payload);
        }

        if (res.error) {
          showSnackbar(res.data?.message || "Failed to submit form", "error");
        } else {
          showSnackbar(
            res.message ||
              (isEditMode
                ? "Channel Updated Successfully"
                : "Channel Created Successfully"),
            "success"
          );
          router.push("/dashboard/settings/outlet-channel");
        }
      } catch (error) {
        showSnackbar("Something went wrong", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ✅ Load existing data for edit mode
  useEffect(() => {
    if (params?.id && params.id !== "add") {
      setIsEditMode(true);
      setLoading(true);
      (async () => {
        console.log("Fetching data for ID:", params.id);
        try {
          const res = await getOutletChannelById(String(params.id));
          if (res?.data) {
            console.log(res.data);
            formik.setValues({
              outlet_channel: res.data.outlet_channel || "",
              status: res.data.status === 1 ? "active" : "inactive",
            });
          }
        } catch (error) {
          console.error("Failed to fetch user type", error);
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-[20px]">
        <div className="flex items-center gap-[16px]">
          <Link href="/dashboard/settings/outlet-channel">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-[20px] font-semibold text-[#181D27] flex items-center leading-[30px] mb-[5px]">
            {isEditMode ? "Edit Channel" : "Add New Channel"}
          </h1>
        </div>
      </div>

      {/* Form */}
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <ContainerCard>
            <h2 className="text-lg font-semibold mb-6">
              Outlet Channel Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Name */}
              <InputFields
                type="text"
                name="outlet_channel"
                label="Outlet Channel"
                value={formik.values.outlet_channel}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.outlet_channel && formik.errors.outlet_channel
                }
              />

              {/* Status */}
              <InputFields
                type="select"
                name="status"
                label="Status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && formik.errors.status}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>
          </ContainerCard>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 h-[40px] w-[80px] rounded-md font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100"
              type="button"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </button>

            <SidebarBtn
              label="Submit"
              isActive={true}
              leadingIcon="mdi:check"
              type="submit"
            />
          </div>
        </form>
      )}
    </>
  );
}
