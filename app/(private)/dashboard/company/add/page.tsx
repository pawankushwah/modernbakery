"use client";

import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import ContainerCard from "@/app/components/containerCard";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import FormInputField from "@/app/components/formInputField";
import SearchableDropdown from "@/app/components/SearchableDropdown";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "@/app/services/snackbarContext";
import { addCompany } from "@/app/services/allApi";

// Dummy options (replace with API data if you have endpoints)
const countries = [
  { value: "ug", label: "Uganda" },
  { value: "ke", label: "Kenya" },
  { value: "tz", label: "Tanzania" },
];
const regions = [
  { value: "central", label: "Central" },
  { value: "eastern", label: "Eastern" },
];
const subRegions = [
  { value: "kampala", label: "Kampala" },
  { value: "jinja", label: "Jinja" },
];
const currency = [
  { value: "USD", label: "USD" },
  { value: "UGX", label: "UGX" },
];

export default function AddCompany() {
  const { showSnackbar } = useSnackbar();
  const [isOpen, setIsOpen] = useState(false);

  // Yup Validation
  const CompanySchema = Yup.object({
    companyName: Yup.string().required("Company name is required"),
    companyCode: Yup.string().required("Company code is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    tinNumber: Yup.string().required("TIN Number is required"),
    vatNo: Yup.number().typeError("VAT must be a number"),
    primaryContact: Yup.string().required("Primary contact is required"),
    country: Yup.string().required("Country is required"),
    companyType: Yup.string().required("Company type is required"),
    serviceType: Yup.string().required("Service type is required"),
  });

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      companyType: "",
      companyCode: "",
      companyName: "",
      companyLogo: null,
      companyWebsite: "",
      primaryCode: "uae",
      primaryContact: "",
      tollFreeCode: "uae",
      tollFreeNumber: "",
      email: "",
      region: "",
      subRegion: "",
      district: "",
      town: "",
      street: "",
      landmark: "",
      country: "",
      tinNumber: "",
      sellingCurrency: "USD",
      purchaseCurrency: "USD",
      vatNo: "",
      modules: "",
      serviceType: "",
      status: "1",
    },
    validationSchema: CompanySchema,
    onSubmit: async (values) => {
      try {
        const modulesArray = values.modules
          ? values.modules.split(",").map((m) => m.trim())
          : [];

        const formData = new FormData();
        formData.append("company_code", values.companyCode);
        formData.append("company_name", values.companyName);
        formData.append("email", values.email);
        formData.append("tin_number", values.tinNumber);
        formData.append("vat", values.vatNo);
        formData.append("country_id", values.country);
        formData.append("selling_currency", values.sellingCurrency);
        formData.append("purchase_currency", values.purchaseCurrency);
        formData.append(
          "toll_free_no",
          `${values.tollFreeCode}${values.tollFreeNumber}`
        );
        formData.append("website", values.companyWebsite);
        formData.append("service_type", values.serviceType);
        formData.append("company_type", values.companyType);
        formData.append("status", values.status);
        formData.append("district", values.district);
        formData.append("town", values.town);
        formData.append("street", values.street);
        formData.append("landmark", values.landmark);
        formData.append("region", values.region);
        formData.append("sub_region", values.subRegion);
        formData.append(
          "primary_contact",
          `${values.primaryCode}${values.primaryContact}`
        );

        const maybeFile = values.companyLogo as unknown;
        if (
          maybeFile &&
          typeof maybeFile === "object" &&
          "name" in (maybeFile as Record<string, unknown>)
        ) {
          formData.append("logo", maybeFile as Blob);
        }

        modulesArray.forEach((m, i) => {
          formData.append(`module_access[${i}]`, m);
        });

        const res = await addCompany(formData);
        if (res.error) {
          showSnackbar(res.data.message || "Failed to add company!", "error");
        } else {
          showSnackbar("Company added successfully ✅", "success");
          formik.resetForm();
        }
      } catch (err) {
        console.error("❌ Add Company failed", err);
        showSnackbar("Failed to add company ❌", "error");
      }
    },
  });

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-[20px]">
        <div className="flex items-center gap-[16px]">
          <Link href="/dashboard/company">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-[20px] font-semibold text-[#181D27] flex items-center leading-[30px] mb-[5px]">
            Add Company
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        {/* Company Details */}
        <ContainerCard>
          <h2 className="text-lg font-semibold mb-6">Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputFields
              name="companyName"
              label="Company Name"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.companyName && formik.errors.companyName}
            />
            <InputFields
              name="companyType"
              label="Company Type"
              value={formik.values.companyType}
              onChange={formik.handleChange}
              options={[
                { value: "manufacturing", label: "Manufacturing" },
                { value: "trading", label: "Trading" },
              ]}
              error={formik.touched.companyType && formik.errors.companyType}
            />
            <InputFields
              name="companyCode"
              label="Company Code"
              value={formik.values.companyCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.companyCode && formik.errors.companyCode}
            />
          </div>
        </ContainerCard>

        {/* Contact */}
        <ContainerCard>
          <h2 className="text-lg font-semibold mb-6">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormInputField
              type="contact"
              label="Primary Contact"
              contact={formik.values.primaryContact}
              code={formik.values.primaryCode}
              onContactChange={(e) =>
                formik.setFieldValue("primaryContact", e.target.value)
              }
              onCodeChange={(e) =>
                formik.setFieldValue("primaryCode", e.target.value)
              }
              options={countries}
              onBlur={formik.handleBlur}
              error={
                formik.touched.primaryContact && formik.errors.primaryContact
              }
            />
            <FormInputField
              type="contact"
              label="Toll Free Number"
              contact={formik.values.tollFreeNumber}
              code={formik.values.tollFreeCode}
              onContactChange={(e) =>
                formik.setFieldValue("tollFreeNumber", e.target.value)
              }
              onCodeChange={(e) =>
                formik.setFieldValue("tollFreeCode", e.target.value)
              }
              options={countries}
            />
            <InputFields
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />
          </div>
        </ContainerCard>

        {/* Location */}
        <ContainerCard>
          <h2 className="text-lg font-semibold mb-6">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SearchableDropdown
              label="Region"
              name="region"
              value={formik.values.region}
              options={regions}
              onChange={(val) => formik.setFieldValue("region", val)}
            />
            <SearchableDropdown
              label="Sub Region"
              name="subRegion"
              value={formik.values.subRegion}
              options={subRegions}
              onChange={(val) => formik.setFieldValue("subRegion", val)}
            />
            <InputFields
              name="district"
              label="District"
              value={formik.values.district}
              onChange={formik.handleChange}
            />
            <InputFields
              name="town"
              label="Town/Village"
              value={formik.values.town}
              onChange={formik.handleChange}
            />
            <InputFields
              name="street"
              label="Street"
              value={formik.values.street}
              onChange={formik.handleChange}
            />
            <InputFields
              name="landmark"
              label="Landmark"
              value={formik.values.landmark}
              onChange={formik.handleChange}
            />
            <SearchableDropdown
              label="Country"
              name="country"
              value={formik.values.country}
              options={countries}
              onChange={(val) => formik.setFieldValue("country", val)}
              error={formik.touched.country && formik.errors.country}
            />
            <InputFields
              name="tinNumber"
              label="TIN Number"
              value={formik.values.tinNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tinNumber && formik.errors.tinNumber}
            />
          </div>
        </ContainerCard>

        {/* Financial */}
        <ContainerCard>
          <h2 className="text-lg font-semibold mb-6">Financial Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputFields
              name="sellingCurrency"
              label="Selling Currency"
              value={formik.values.sellingCurrency}
              onChange={formik.handleChange}
              options={currency}
            />
            <InputFields
              name="purchaseCurrency"
              label="Purchase Currency"
              value={formik.values.purchaseCurrency}
              onChange={formik.handleChange}
              options={currency}
            />
            <InputFields
              name="vatNo"
              label="VAT No (%)"
              value={formik.values.vatNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.vatNo && formik.errors.vatNo}
            />
          </div>
        </ContainerCard>

        {/* Additional */}
        <ContainerCard>
          <h2 className="text-lg font-semibold mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputFields
              name="modules"
              label="Modules"
              value={formik.values.modules}
              onChange={formik.handleChange}
            />
            <InputFields
              name="serviceType"
              label="Service Type"
              value={formik.values.serviceType}
              onChange={formik.handleChange}
              options={[
                { value: "branch", label: "Branch" },
                { value: "warehouse", label: "Warehouse" },
              ]}
              error={formik.touched.serviceType && formik.errors.serviceType}
            />
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
              error={formik.touched.status && formik.errors.status}
            />
          </div>
        </ContainerCard>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 h-[40px] w-[80px] rounded-md font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100"
            type="button"
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
    </>
  );
}