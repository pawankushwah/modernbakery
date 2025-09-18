"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import ContainerCard from "@/app/components/containerCard";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import Loading from "@/app/components/Loading";
import { useSnackbar } from "@/app/services/snackbarContext";
import { getCustomerType, updateCustomerType } from "@/app/services/allApi";

interface CustomerTypeForm {
  code: string;
  name: string;
  status: string;
}

export default function UpdateCustomerType() {
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<CustomerTypeForm>({
    code: "",
    name: "",
    status: "Active",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();

  const customerId = searchParams.get("id") || "";

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomerType(customerId);
        setInitialValues({
          code: res.data.code,
          name: res.data.name,
          status: res.data.status === "active" ? "Active" : "Inactive",
        });
      } catch (error) {
        console.error("Failed to fetch customer ❌", error);
        showSnackbar("Failed to fetch customer ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchCustomer();
  }, [customerId]);

  const validationSchema = Yup.object({
    code: Yup.string().required("Code is required"),
    name: Yup.string().required("Name is required"),
    status: Yup.string().oneOf(["Active", "Inactive"]).required(),
  });

  const handleSubmit = async (values: CustomerTypeForm) => {
    try {
      await updateCustomerType(customerId, {
        ...values,
        status: values.status.toLowerCase(),
      });
      showSnackbar("Customer Type updated ✅", "success");
      router.push("/dashboard/settings/customer/customerType");
    } catch (error) {
      console.error("Update failed ❌", error);
      showSnackbar("Failed to update customer ❌", "error");
    }
  };

  if (loading) return <Loading />;

  return (
    <ContainerCard>
      <div className="flex justify-between mb-4">
        <h1 className="text-[20px] font-semibold">Update Customer Type</h1>
        <SidebarBtn href="/dashboard/settings/customer/customerType" label="Back" />
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="flex flex-col gap-4">
            <InputFields
              label="Code"
              name="code"
              value={values.code}
              onChange={handleChange}
            
            />
            <ErrorMessage name="code" component="div" className="text-red-500 text-sm" />

            <InputFields
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
             
            />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

            <label className="font-medium">Status</label>
            <select
              name="status"
              value={values.status}
              onChange={handleChange}
              className="border p-2 rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Customer Type
            </button>
          </Form>
        )}
      </Formik>
    </ContainerCard>
  );
}
