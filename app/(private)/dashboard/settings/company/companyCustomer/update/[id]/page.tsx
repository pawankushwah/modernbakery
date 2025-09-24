"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import ContainerCard from "@/app/components/containerCard";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { useSnackbar } from "@/app/services/snackbarContext";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import {
  getCompanyCustomerById,
  updateCompanyCustomer,
} from "@/app/services/allApi";

// ✅ Types
interface FormValues {
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
}

interface ApiPayload {
  sap_code: string;
  customer_code: string;
  business_name: string;
  customer_type: number;
  owner_name: string;
  owner_no: string;
  is_whatsapp: number;
  whatsapp_no: string;
  email: string;
  language: string;
  contact_no2: string;
  buyer_type: number;
  road_street: string;
  town: string;
  landmark: string;
  district: string;
  region_id: number;
  area_id: number;
  balance: number;
  payment_type: number;
  bank_name: string;
  bank_account_number: string;
  creditday: string;
  tin_no: string;
  accuracy: string;
  credit_limit: number;
  totalcreditlimit: number;
  credit_limit_validity: string;
  guarantee_name: string;
  guarantee_amount: number;
  guarantee_from: string;
  guarantee_to: string;
  vat_no: string;
  longitude: string;
  latitude: string;
  threshold_radius: number;
  dchannel_id: number;
  status: number;
}

// ✅ Validation Schema
const CompanyCustomerSchema = Yup.object().shape({
  sapCode: Yup.string().required("SAP Code is required."),
  customerCode: Yup.string().required("Customer Code is required."),
  businessName: Yup.string().required("Business Name is required."),
  customerType: Yup.string().required("Customer Type is required."),
  ownerName: Yup.string().required("Owner Name is required."),
  ownerNumber: Yup.string().required("Owner Number is required."),
  email: Yup.string().email("Invalid email").required("Email is required."),
  language: Yup.string().required("Language is required."),
  balance: Yup.number().required("Balance is required."),
  paymentType: Yup.string().required("Payment Type is required."),
  bankName: Yup.string().required("Bank Name is required."),
  bankAccountNumber: Yup.string().required("Bank Account Number is required."),
  creditDay: Yup.number().required("Credit Day is required."),
  creditLimit: Yup.number().required("Credit Limit is required."),
  totalCreditLimit: Yup.number().required("Total Credit Limit is required."),
  guaranteeName: Yup.string().required("Guarantee Name is required."),
  guaranteeAmount: Yup.number().required("Guarantee Amount is required."),
  guaranteeFrom: Yup.date().required("Guarantee From is required."),
  guaranteeTo: Yup.date().required("Guarantee To is required."),
  town: Yup.string().required("Town is required."),
  roadStreet: Yup.string().required("Road/Street is required."),
  landmark: Yup.string().required("Landmark is required."),
  district: Yup.string().required("District is required."),
  region: Yup.string().required("Region is required."),
  area: Yup.string().required("Area is required."),
  status: Yup.string().required("Status is required."),
  vatNo: Yup.string().required("VAT No is required."),
  tinNo: Yup.string().required("TIN No is required."),
  longitude: Yup.string().required("Longitude is required."),
  latitude: Yup.string().required("Latitude is required."),
  thresholdRadius: Yup.number().required("Threshold Radius is required."),
  dChannelId: Yup.string().required("DChannel is required."),
});

// ✅ Component
export default function UpdateCompanyCustomer() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const { regionOptions, areaOptions } = useAllDropdownListData();

  const [initialValues, setInitialValues] = useState<FormValues | null>(null);

  // 🔹 Fetch data by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params?.id as string;
        const data = await getCompanyCustomerById(id);

        const mapped: FormValues = {
          sapCode: data.sap_code || "",
          customerCode: data.customer_code || "",
          businessName: data.business_name || "",
          customerType: String(data.customer_type || ""),
          ownerName: data.owner_name || "",
          ownerNumber: data.owner_no || "",
          isWhatsapp: String(data.is_whatsapp ?? "1"),
          whatsappNo: data.whatsapp_no || "",
          email: data.email || "",
          language: data.language || "",
          contactNo2: data.contact_no2 || "",
          buyerType: String(data.buyer_type || "0"),
          roadStreet: data.road_street || "",
          town: data.town || "",
          landmark: data.landmark || "",
          district: data.district || "",
          region: String(data.region_id || ""),
          area: String(data.area_id || ""),
          balance: String(data.balance || ""),
          paymentType: String(data.payment_type || "1"),
          bankName: data.bank_name || "",
          bankAccountNumber: data.bank_account_number || "",
          creditDay: String(data.creditday || ""),
          tinNo: data.tin_no || "",
          accuracy: data.accuracy || "",
          creditLimit: String(data.credit_limit || ""),
          guaranteeName: data.guarantee_name || "",
          guaranteeAmount: String(data.guarantee_amount || ""),
          guaranteeFrom: data.guarantee_from || "",
          guaranteeTo: data.guarantee_to || "",
          totalCreditLimit: String(data.totalcreditlimit || ""),
          creditLimitValidity: data.credit_limit_validity || "",
          vatNo: data.vat_no || "",
          longitude: data.longitude || "",
          latitude: data.latitude || "",
          thresholdRadius: String(data.threshold_radius || ""),
          dChannelId: String(data.dchannel_id || ""),
          status: String(data.status || "1"),
        };

        setInitialValues(mapped);
      } catch (error) {
        console.error(error);
        showSnackbar("Failed to load data ❌", "error");
      }
    };

    fetchData();
  }, [params?.id]);

  // 🔹 Handle Update
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const payload: ApiPayload = {
        sap_code: values.sapCode,
        customer_code: values.customerCode,
        business_name: values.businessName,
        customer_type: Number(values.customerType),
        owner_name: values.ownerName,
        owner_no: values.ownerNumber,
        is_whatsapp: Number(values.isWhatsapp),
        whatsapp_no: values.whatsappNo || "",
        email: values.email,
        language: values.language,
        contact_no2: values.contactNo2 || "",
        buyer_type: Number(values.buyerType),
        road_street: values.roadStreet,
        town: values.town,
        landmark: values.landmark,
        district: values.district,
        region_id: Number(values.region),
        area_id: Number(values.area),
        balance: Number(values.balance),
        payment_type: Number(values.paymentType),
        bank_name: values.bankName,
        bank_account_number: values.bankAccountNumber,
        creditday: String(values.creditDay),
        tin_no: values.tinNo,
        accuracy: values.accuracy || "",
        credit_limit: Number(values.creditLimit),
        totalcreditlimit: Number(values.totalCreditLimit),
        credit_limit_validity: values.creditLimitValidity || "",
        guarantee_name: values.guaranteeName,
        guarantee_amount: Number(values.guaranteeAmount),
        guarantee_from: values.guaranteeFrom,
        guarantee_to: values.guaranteeTo,
        vat_no: values.vatNo,
        longitude: values.longitude,
        latitude: values.latitude,
        threshold_radius: Number(values.thresholdRadius),
        dchannel_id: Number(values.dChannelId),
        status: Number(values.status),
      };

      const id = params?.id as string;
      const res = await updateCompanyCustomer(id, payload);

      if (res?.errors) {
        const errs: string[] = [];
        for (const key in res.errors) errs.push(...res.errors[key]);
        showSnackbar(errs.join(" | "), "error");
        return;
      }

      showSnackbar("Company Customer updated successfully ✅", "success");
      router.push("/dashboard/settings/company/companyCustomer");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to update Company Customer ❌", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) return <p className="p-6">Loading...</p>;

  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/settings/company/companyCustomer">
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold">Update Company Customer</h1>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={CompanyCustomerSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
                Company Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "SAP Code", name: "sapCode" },
                  { label: "Customer Code", name: "customerCode" },
                  { label: "Business Name", name: "businessName" },
                  {
                    label: "Customer Type",
                    name: "customerType",
                    options: [
                      { value: "1", label: "Type 1" },
                      { value: "2", label: "Type 2" },
                    ],
                  },
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
                      onChange={(e) =>
                        setFieldValue(field.name, e.target.value)
                      }
                      options={field.options}
                    />
                    <ErrorMessage
                      name={field.name}
                      component="span"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>
                ))}
              </div>
            </ContainerCard>
  <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
                Location Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Street Road", name: "roadStreet" },
                  { label: "Town", name: "town" },
                  { label: "Landmark", name: "landmark" },
                
                  { label: "District", name: "district" },
                  { label: "Owner Number", name: "ownerNumber" },
                  { label: "Region", name: "region" },
                  { label: "Area", name: "area" },
                ].map((field) => (
                  <div key={field.name}>
                    <InputFields
                      label={field.label}
                      name={field.name}
                      value={values[field.name as keyof typeof values]}
                      onChange={(e) =>
                        setFieldValue(field.name, e.target.value)
                      }
                 
                    />
                    <ErrorMessage
                      name={field.name}
                      component="span"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>
                ))}
              </div>
            </ContainerCard>
  <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
              Financial Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Balance", name: "balance" },
                  { label: "Payment Type", name: "paymentType" },
                  { label: "Bank Name", name: "bankName" },
                
                  { label: "Bank Account Number", name: "bankAccountNumber" },
                  { label: "Credit Day", name: "creditDay" },
                  { label: "Credit Limit", name: "creditLimit" },
                  { label: "Total Credit Limit", name: "totalCreditLimit" },
                       { label: "Guarantee Name", name: "guaranteeName" },
                       { label: "Guarantee Amount", name: "guaranteeAmount" },
                       { label: "Guarantee From", name: "guaranteeFrom" },
                       { label: "Guarantee To", name: "guaranteeTo" },
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
                      onChange={(e) =>
                        setFieldValue(field.name, e.target.value)
                      }
                 
                    />
                    <ErrorMessage
                      name={field.name}
                      component="span"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>
                ))}
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
                label={isSubmitting ? "Updating..." : "Update"}
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