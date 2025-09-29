"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import ContainerCard from "@/app/components/containerCard";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import InputFields from "@/app/components/inputFields";
import { useSnackbar } from "@/app/services/snackbarContext";
import { useLoading } from "@/app/services/loadingContext";
import { shelvesListById, updateShelves } from "@/app/services/merchandiserApi";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";

const ShelfDisplaySchema = Yup.object().shape({
  shelf_name: Yup.string().required("Name is required."),
  valid_from: Yup.date()
    .required("Field is required.")
    .typeError("Please enter a valid date"),
  valid_to: Yup.date()
    .required("Field is required.")
    .typeError("Please enter a valid date")
    .min(
      Yup.ref("valid_from"),
      "Valid To date cannot be before Valid From date"
    ),

  height: Yup.number().required("Height is required."),
  width: Yup.number().required("Width is required."),
  depth: Yup.number().required("Depth is required."),
  customer_ids: Yup.array()
    .of(Yup.number().required())
    .min(1, "Please select at least one customer.")
    .required("Please select at least one customer."),
});

type shelvesType = {
  shelf_name: string;
  valid_from: string;
  valid_to: string;
  height: string;
  width: string;
  depth: string;
  customer_ids: Array<string>;
};

const getSimpleDate = (isoDateString: string | undefined): string => {
  if (!isoDateString) return "";
  return isoDateString.substring(0, 10);
};

export default function AddShelfDisplay() {
    const params = useParams();
    let id = params?.id || "";
    if(Array.isArray(id)) id = id[0] || "";

  const { companyCustomersOptions } = useAllDropdownListData();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const {setLoading} = useLoading();
  const [shelves, setShelves] = useState<shelvesType | null>(null);

  useEffect(() => {
      const fetchShelfDisplay = async () => {
          setLoading(true);
          const res = await shelvesListById(id);
          setLoading(false);
          if(res.error) {
              showSnackbar(res.data.message || "Unable to fetch Shelf Display List", "error");
              throw new Error("Unable to fetch Shelf Display List");
          } else {
            setShelves(res.data);
          }
      }
      fetchShelfDisplay();
  }, []);

  const initialValues: shelvesType = {
    shelf_name: shelves?.shelf_name || "",
    valid_from: getSimpleDate(shelves?.valid_from),
    valid_to: getSimpleDate(shelves?.valid_to),
    height: shelves?.height || "",
    width: shelves?.width || "",
    depth: shelves?.depth || "",
    customer_ids: shelves?.customer_ids || [companyCustomersOptions[0].value],
  };

  const handleSubmit = async (
    values: shelvesType,
    { setSubmitting }: FormikHelpers<shelvesType>
  ) => {
    const localPayload = {
      shelf_name: values.shelf_name.trim(),
      valid_from: values.valid_from.trim(),
      valid_to: values.valid_to.trim(),
      height: Number(values.height.trim()),
      width: Number(values.width.trim()),
      depth: Number(values.depth.trim()),
      customer_ids: values.customer_ids.map(Number),
    };

    setLoading(true);
    const res = await updateShelves(id, localPayload);
    if(res.error) {
      showSnackbar(res.data.message, "error");
      setLoading(false);
      setSubmitting(false);
      throw new Error("Unable to Update Shelf Display");
    } else {
      showSnackbar(res.message || "Shelf Display Updated successfully", "success");
      setLoading(false);
      setSubmitting(false);
      router.push("/dashboard/merchandiser/shelfDisplay");
    }

  };
  
  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/merchandiser/shelfDisplay">
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold">Edit Shelf Display</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={ShelfDisplaySchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, touched, errors }) => (
          <Form>
            <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
                Shelf Display Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <InputFields
                    required
                    label="Name"
                    name="shelf_name"
                    value={values.shelf_name}
                    onChange={(e) => setFieldValue("shelf_name", e.target.value)}
                    error={touched.shelf_name && errors.shelf_name}
                  />
                  <ErrorMessage
                    name="shelf_name"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    required
                    label="Customer"
                    name="customer_ids"
                    value={values.customer_ids}
                    isSingle={false}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setFieldValue("customer_ids", e.target.value)}
                    options={companyCustomersOptions}
                  />
                  <ErrorMessage
                    name="customer"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>

                <div>
                  <InputFields
                    required
                    label="Valid From"
                    type="date"
                    name="valid_from"
                    value={values.valid_from}
                    onChange={(e) => setFieldValue("valid_from", e.target.value)}
                  />
                  <ErrorMessage
                    name="valid_from"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    required
                    label="Valid To"
                    type="date"
                    name="valid_to"
                    value={values.valid_to}
                    onChange={(e) => setFieldValue("valid_to", e.target.value)}
                  />
                  <ErrorMessage
                    name="valid_to"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    required
                    label="Height(CM)"
                    name="height"
                    value={values.height}
                    onChange={(e) => setFieldValue("height", e.target.value)}
                  />
                  <ErrorMessage
                    name="height"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    required
                    label=" Width(CM)"
                    name="width"
                    value={values.width}
                    onChange={(e) => setFieldValue("width", e.target.value)}
                  />
                  <ErrorMessage
                    name="width"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    required
                    label="Depth(CM)"
                    name="depth"
                    value={values.depth}
                    onChange={(e) => setFieldValue("depth", e.target.value)}
                  />
                  <ErrorMessage
                    name="depth"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
              </div>
            </ContainerCard>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="reset"
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <SidebarBtn
                type="submit"
                label={isSubmitting ? "Submitting..." : "Submit"}
                isActive
                leadingIcon="mdi:check"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
