"use client";

import React from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import ContainerCard from "@/app/components/containerCard";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { useSnackbar } from "@/app/services/snackbarContext";
import { addCompanyCustomers } from "@/app/services/allApi";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";



export const CompanyCustomerSchema = Yup.object().shape({
  sapCode: Yup.string().required("SAP Code is required."),
  customerCode: Yup.string().required("Customer Code is required."),
  businessName: Yup.string().required("Business Name is required."),
  customerType: Yup.string().required("Customer Type is required."),
  ownerName: Yup.string().required("Owner Name is required."),
  ownerNumber: Yup.string().required("Owner Number is required."),
  isWhatsapp: Yup.string().required("Whatsapp availability is required."),
  whatsappNo: Yup.string().required("Whatsapp Number is required."),
  email: Yup.string().email("Invalid email").required("Email is required."),
  language: Yup.string().required("Language is required."),
  contactNo2: Yup.string().required("Contact No 2 is required."),
  buyerType: Yup.string().required("Buyer Type is required."),
  roadStreet: Yup.string().required("Road/Street is required."),
  town: Yup.string().required("Town is required."),
  landmark: Yup.string().required("Landmark is required."),
  district: Yup.string().required("District is required."),
  region: Yup.string().required("Region is required."),
  area: Yup.string().required("Area is required."),
  balance: Yup.number().typeError("Balance must be a number").required("Balance is required."),
  paymentType: Yup.string().required("Payment Type is required."),
  bankName: Yup.string().required("Bank Name is required."),
  bankAccountNumber: Yup.string().required("Bank Account Number is required."),
  creditDay: Yup.number().typeError("Credit Day must be a number").required("Credit Day is required."),
  tinNo: Yup.string().required("TIN No is required."),
  accuracy: Yup.string().required("Accuracy is required."),
  creditLimit: Yup.number().typeError("Credit Limit must be a number").required("Credit Limit is required."),
  guaranteeName: Yup.string().required("Guarantee Name is required."),
  guaranteeAmount: Yup.number().typeError("Guarantee Amount must be a number").required("Guarantee Amount is required."),
  guaranteeFrom: Yup.date().typeError("Invalid date").required("Guarantee From is required."),
  guaranteeTo: Yup.date().typeError("Invalid date").required("Guarantee To is required."),
  totalCreditLimit: Yup.number().typeError("Total Credit Limit must be a number").required("Total Credit Limit is required."),
  creditLimitValidity: Yup.date().typeError("Invalid date").required("Credit Limit Validity is required."),
  vatNo: Yup.string().required("VAT No is required."),
  longitude: Yup.string().required("Longitude is required."),
  latitude: Yup.string().required("Latitude is required."),
  thresholdRadius: Yup.number().typeError("Threshold Radius must be a number").required("Threshold Radius is required."),
  dChannelId: Yup.string().required("DChannel ID is required."),
  status: Yup.string().required("Status is required."),
});


export type CompanyCustomerFormValues = {
  sapCode: string;
  customerCode: string;
  businessName: string;
  customerType: string;
  ownerName: string;
  ownerNumber: string;
  isWhatsapp: string;
  whatsappNo: string;
  email: string;
  language: string;
  contactNo2: string;
  buyerType: string;
  roadStreet: string;
  town: string;
  landmark: string;
  district: string;
  region: string;
  area: string;
  balance: string;
  paymentType: string;
  bankName: string;
  bankAccountNumber: string;
  creditDay: string;
  tinNo: string;
  accuracy: string;
  creditLimit: string;
  guaranteeName: string;
  guaranteeAmount: string;
  guaranteeFrom: string;
  guaranteeTo: string;
  totalCreditLimit: string;
  creditLimitValidity: string;
  vatNo: string;
  longitude: string;
  latitude: string;
  thresholdRadius: string;
  dChannelId: string;
  status: string;
};

export default function AddCompanyCustomer() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { onlyCountryOptions, regionOptions, areaOptions } = useAllDropdownListData();

const initialValues = {
  sapCode: "SAP1022w01",
  customerCode: "CUST22ww2001",
  businessName: "XYZ Distributors",
  customerType: "1",
  ownerName: "Ramesh Kumar",
  ownerNumber: "9876543210",
  isWhatsapp: "1",
  whatsappNo: "9876543210",
  email: "xyzdistributors@example.com",
  language: "English",
  contactNo2: "9123456789",
  buyerType: "0",
  roadStreet: "Church Street",
  town: "Bangalore",
  landmark: "Near Brigade Road",
  district: "Bangalore Urban",
  balance: "12000.50",
  paymentType: "0",
  bankName: "HDFC Bank",
  bankAccountNumber: "9876543210123",
  creditDay: "30",
  tinNo: "TIN28877",
  accuracy: "98%",
  creditLimit: "100000",
  guaranteeName: "Suresh Gupta",
  guaranteeAmount: "20000",
  guaranteeFrom: "2025-01-01",
  guaranteeTo: "2025-12-31",
  totalCreditLimit: "120000",
  creditLimitValidity: "2025-12-31",
  region: "1",
  area: "2",
  vatNo: "VAT123456",
  longitude: "77.5946",
  latitude: "12.9716",
  thresholdRadius: "50",
  dChannelId: "1",
  status: "1"
};


  const handleSubmit = async (
    values: CompanyCustomerFormValues,
    { setSubmitting }: FormikHelpers<CompanyCustomerFormValues>
  ) => {
    try {
      const payload = {
  "sap_code": "SAP1022w01",
  "customer_code": "CUST22ww2001",
  "business_name": "XYZ Distributors",
  "customer_type": 1,
  "owner_name": "Ramesh Kumar",
  "owner_no": 9876543210,
  "is_whatsapp": 1,
  "whatsapp_no": 9876543210,
  "email": "xyzdistributors@example.com",
  "language": "English",
  "contact_no2": 9123456789,
  "buyerType": 0,
  "road_street": "Church Street",
  "town": "Bangalore",
  "landmark": "Near Brigade Road",
  "district": "Bangalore Urban",
  "balance": 12000.50,
  "payment_type": 0,
  "bank_name": "HDFC Bank",
  "bank_account_number": "9876543210123",
  "creditday": 30,
  "tin_no": "TIN28877",
  "accuracy": "98%",
  "creditlimit": 100000,
  "guarantee_name": "Suresh Gupta",
  "guarantee_amount": 20000,
  "guarantee_from": "2025-01-01",
  "guarantee_to": "2025-12-31",
  "totalcreditlimit": 120000,
  "credit_limit_validity": "2025-12-31",
  "region_id": 1,
  "area_id": 2,
  "vat_no": "VAT123456",
  "longitude": "77.5946",
  "latitude": "12.9716",
  "threshold_radius": 50,
  "dchannel_id": 1,
  "status": 1
}

      

      const res = await addCompanyCustomers(payload);

      if (res?.errors) {
        const errs: string[] = [];
        for (const key in res.errors) errs.push(...res.errors[key]);
        showSnackbar(errs.join(" | "), "error");
        return;
      }

      showSnackbar("Company Customer added successfully ✅", "success");
      router.push("/dashboard/settings/company/companyCustomer");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to add Company Customer ❌", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/settings/company/companyCustomer">
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold">Add New Company Customer</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={CompanyCustomerSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
  {/* ===== Company Customer Details ===== */}
  <ContainerCard>
    <h2 className="text-lg font-semibold mb-6">Company Customer Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { label: "SAP Code", name: "sapCode" },
        { label: "Customer Code", name: "customerCode" },
        { label: "Business Name", name: "businessName" },
        { label: "Customer Type", name: "customerType", options: [{ value: "1", label: "Type 1" }, { value: "2", label: "Type 2" }] },
        { label: "Owner Name", name: "ownerName" },
        { label: "Owner Number", name: "ownerNumber" },
        { label: "Email", name: "email" },
        { label: "Language", name: "language" },
      ].map((field) => (
        <div key={field.name}>
          <InputFields
            label={field.label}
            name={field.name}
            value={values[field.name as keyof typeof values]}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            options={field.options}
          />
          <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
        </div>
      ))}
    </div>
  </ContainerCard>

  {/* ===== Contact Details ===== */}
  <ContainerCard>
    <h2 className="text-lg font-semibold mb-6">Contact Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { label: "Whatsapp Available?", name: "isWhatsapp", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }] },
        { label: "Whatsapp Number", name: "whatsappNo" },
        { label: "Contact No 2", name: "contactNo2" },
        { label: "Buyer Type", name: "buyerType", options: [{ value: "0", label: "Buyer" }, { value: "1", label: "Seller" }] },
        { label: "Accuracy", name: "accuracy" },
      ].map((field) => (
        <div key={field.name}>
          <InputFields
            label={field.label}
            name={field.name}
            value={values[field.name as keyof typeof values]}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            options={field.options}
          />
          <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
        </div>
      ))}
    </div>
  </ContainerCard>

  {/* ===== Location Details ===== */}
  <ContainerCard>
    <h2 className="text-lg font-semibold mb-6">Location Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { label: "Road Street", name: "roadStreet" },
        { label: "Town", name: "town" },
        { label: "Landmark", name: "landmark" },
        { label: "District", name: "district" },
        { label: "Region", name: "region", options: regionOptions },
        { label: "Area", name: "area", options: areaOptions },
      ].map((field) => (
        <div key={field.name}>
          <InputFields
            label={field.label}
            name={field.name}
            value={values[field.name as keyof typeof values]}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            options={field.options}
          />
          <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
        </div>
      ))}
    </div>
  </ContainerCard>

  {/* ===== Financial & Bank Details ===== */}
  <ContainerCard>
    <h2 className="text-lg font-semibold mb-6">Financial & Bank Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { label: "Balance", name: "balance" },
        { label: "Payment Type", name: "paymentType", options: [{ value: "0", label: "Cash" }, { value: "1", label: "Credit" }] },
        { label: "Bank Name", name: "bankName" },
        { label: "Bank Account Number", name: "bankAccountNumber" },
        { label: "Credit Day", name: "creditDay" },
        { label: "Credit Limit", name: "creditLimit" },
        { label: "Total Credit Limit", name: "totalCreditLimit" },
        { label: "Guarantee Name", name: "guaranteeName" },
        { label: "Guarantee Amount", name: "guaranteeAmount" },
        { label: "Guarantee From", name: "guaranteeFrom" },
        { label: "Guarantee To", name: "guaranteeTo" },
        { label: "Credit Limit Validity", name: "creditLimitValidity" },
        { label: "VAT No", name: "vatNo" },
        { label: "TIN No", name: "tinNo" },
        { label: "Longitude", name: "longitude" },
        { label: "Latitude", name: "latitude" },
        { label: "Threshold Radius", name: "thresholdRadius" },
        { label: "DChannel ID", name: "dChannelId" },
      ].map((field) => (
        <div key={field.name}>
          <InputFields
            label={field.label}
            name={field.name}
            value={values[field.name as keyof typeof values]}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            options={field.options}
          />
          <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
        </div>
      ))}
    </div>
  </ContainerCard>

  {/* ===== Buttons ===== */}
  <div className="flex justify-end gap-4 mt-6">
    <button type="reset" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
      Cancel
    </button>
    <SidebarBtn
      label={isSubmitting ? "Submitting..." : "Submit"}
      isActive={!isSubmitting}
      leadingIcon="mdi:check"
      type="submit"
    />
  </div>
</Form>

        )}
      </Formik>
    </div>
  );
}
