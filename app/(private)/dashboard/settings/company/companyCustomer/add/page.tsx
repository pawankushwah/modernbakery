"use client";

import React from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, ErrorMessage, FormikHelpers, FormikErrors, FormikTouched } from "formik";
import * as Yup from "yup";

import ContainerCard from "@/app/components/containerCard";
import InputFields from "@/app/components/inputFields";
import { useSnackbar } from "@/app/services/snackbarContext";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import { addCompanyCustomers } from "@/app/services/allApi";
import StepperForm, { useStepperForm, StepperStep } from "@/app/components/stepperForm";

// ---------------------- API Call ----------------------
interface CompanyCustomerPayload {
  sap_code: string;
  customer_code: string;
  business_name: string;
  customer_type: number;
  owner_name: string;
  owner_no: string;
  is_whatsapp: number;
  whatsapp_no?: string;
  email: string;
  language: string;
  contact_no2?: string;
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
  accuracy?: string;
  credit_limit: number;
  totalcreditlimit: number;
  credit_limit_validity?: string;
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

// ---------------------- Validation Schema ----------------------
const CompanyCustomerSchema = Yup.object().shape({
  sapCode: Yup.string().required("SAP Code is required."),
  customerCode: Yup.string().required("Customer Code is required."),
  businessName: Yup.string().required("Business Name is required."),
  customerType: Yup.string().required("Customer Type is required."),
  ownerName: Yup.string().required("Owner Name is required."),
  ownerNumber: Yup.string().required("Owner Number is required."),
  email: Yup.string().email("Invalid email").required("Email is required."),
  language: Yup.string().required("Language is required."),
  balance: Yup.number().typeError("Balance must be a number").required("Balance is required."),
  paymentType: Yup.string().required("Payment Type is required."),
  bankName: Yup.string().required("Bank Name is required."),
  bankAccountNumber: Yup.string().required("Bank Account Number is required."),
  creditDay: Yup.number().typeError("Credit Day must be a number").required("Credit Day is required."),
  creditLimit: Yup.number().typeError("Credit Limit must be a number").required("Credit Limit is required."),
  totalCreditLimit: Yup.number().typeError("Total Credit Limit must be a number").required("Total Credit Limit is required."),
  guaranteeName: Yup.string().required("Guarantee Name is required."),
  guaranteeAmount: Yup.number().required("Guarantee Amount is required."),
  guaranteeFrom: Yup.date().required("Guarantee From is required."),
  guaranteeTo: Yup.date().required("Guarantee To is required."),
  town: Yup.string().required("Town is required."),
  roadStreet: Yup.string().required("Road/Street is required."),
  contactNo2: Yup.string().required("Contact No 2 is required."),
  whatsappNo: Yup.string().required("WhatsApp No is required."),
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

const stepSchemas = [
  Yup.object({
    sapCode: Yup.string().required("SAP Code is required."),
    customerCode: Yup.string().required("Customer Code is required."),
    businessName: Yup.string().required("Business Name is required."),
    customerType: Yup.string().required("Customer Type is required."),
    ownerName: Yup.string().required("Owner Name is required."),
    ownerNumber: Yup.string().required("Owner Number is required."),
    email: Yup.string().email("Invalid email").required("Email is required."),
    language: Yup.string().required("Language is required."),
  }),
  Yup.object({
    contactNo2: Yup.string().required("Contact No 2 is required."),
    whatsappNo: Yup.string().required("WhatsApp No is required."),
  }),
  Yup.object({
    town: Yup.string().required("Town is required."),
    roadStreet: Yup.string().required("Road/Street is required."),
    landmark: Yup.string().required("Landmark is required."),
    district: Yup.string().required("District is required."),
    region: Yup.string().required("Region is required."),
    area: Yup.string().required("Area is required."),
  }),
  Yup.object({
    balance: Yup.number().typeError("Balance must be a number").required("Balance is required."),
    paymentType: Yup.string().required("Payment Type is required."),
    bankName: Yup.string().required("Bank Name is required."),
    bankAccountNumber: Yup.string().required("Bank Account Number is required."),
    creditDay: Yup.number().typeError("Credit Day must be a number").required("Credit Day is required."),
    creditLimit: Yup.number().typeError("Credit Limit must be a number").required("Credit Limit is required."),
    totalCreditLimit: Yup.number().typeError("Total Credit Limit must be a number").required("Total Credit Limit is required."),
    guaranteeName: Yup.string().required("Guarantee Name is required."),
    guaranteeAmount: Yup.number().required("Guarantee Amount is required."),
    guaranteeFrom: Yup.date().required("Guarantee From is required."),
    guaranteeTo: Yup.date().required("Guarantee To is required."),
    vatNo: Yup.string().required("VAT No is required."),
    tinNo: Yup.string().required("TIN No is required."),
    longitude: Yup.string().required("Longitude is required."),
    latitude: Yup.string().required("Latitude is required."),
    thresholdRadius: Yup.number().required("Threshold Radius is required."),
    dChannelId: Yup.string().required("DChannel is required."),
  }),
];

// ---------------------- Form Values ----------------------
type CompanyCustomerFormValues = {
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

// ---------------------- Component ----------------------
export default function AddCompanyCustomer() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { regionOptions, areaOptions } = useAllDropdownListData();

  const steps: StepperStep[] = [
    { id: 1, label: "Company Customer" },
    { id: 2, label: "Contact" },
    { id: 3, label: "Location" },
    { id: 4, label: "Financial" },
  ];

  const { currentStep, nextStep, prevStep, markStepCompleted, isStepCompleted, isLastStep } =
    useStepperForm(steps.length);

  const initialValues: CompanyCustomerFormValues = {
    sapCode: "",
    customerCode: "",
    businessName: "",
    customerType: "",
    ownerName: "",
    ownerNumber: "",
    isWhatsapp: "1",
    whatsappNo: "",
    email: "",
    language: "",
    contactNo2: "",
    buyerType: "0",
    roadStreet: "",
    town: "",
    landmark: "",
    district: "",
    region: "",
    area: "",
    balance: "",
    paymentType: "1",
    bankName: "",
    bankAccountNumber: "",
    creditDay: "",
    tinNo: "",
    accuracy: "",
    creditLimit: "",
    guaranteeName: "",
    guaranteeAmount: "",
    guaranteeFrom: "",
    guaranteeTo: "",
    totalCreditLimit: "",
    creditLimitValidity: "",
    vatNo: "",
    longitude: "",
    latitude: "",
    thresholdRadius: "",
    dChannelId: "",
    status: "1",
  };

  const handleNext = async (
    values: CompanyCustomerFormValues,
    actions: FormikHelpers<CompanyCustomerFormValues>
  ) => {
    try {
      const schema = stepSchemas[currentStep - 1];
      await schema.validate(values, { abortEarly: false });
      markStepCompleted(currentStep);
      nextStep();
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const fields = err.inner.map((e) => e.path);
        actions.setTouched(
          fields.reduce(
            (acc, key) => ({ ...acc, [key!]: true }),
            {} as Record<string, boolean>
          )
        );
        actions.setErrors(
          err.inner.reduce(
            (acc: Partial<Record<keyof CompanyCustomerFormValues, string>>, curr) => ({
              ...acc,
              [curr.path as keyof CompanyCustomerFormValues]: curr.message,
            }),
            {}
          )
        );
      }
      showSnackbar("Please fix validation errors before proceeding", "error");
    }
  };

  const handleSubmit = async (
    values: CompanyCustomerFormValues,
    { setSubmitting }: FormikHelpers<CompanyCustomerFormValues>
  ) => {
    try {
      const payload: CompanyCustomerPayload = {
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

      console.log("Payload sent:", payload);
      const res = await addCompanyCustomers(payload);
      console.log("Response:", res);

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

  const renderStepContent = (
    values: CompanyCustomerFormValues,
    setFieldValue: (
      field: keyof CompanyCustomerFormValues,
      value: string | File,
      shouldValidate?: boolean
    ) => void,
    errors: FormikErrors<CompanyCustomerFormValues>,
    touched: FormikTouched<CompanyCustomerFormValues>
  ) => {
    switch (currentStep) {
      case 1:
        return (
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
                    value={values[field.name as keyof CompanyCustomerFormValues]}
                    onChange={(e) => setFieldValue(field.name as keyof CompanyCustomerFormValues, e.target.value)}
                    options={field.options}
                  />
                  <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
                </div>
              ))}
            </div>
          </ContainerCard>
        );
      case 2:
        return (
          <ContainerCard>
            <h2 className="text-lg font-semibold mb-6">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Whatsapp Available?", name: "isWhatsapp", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }] },
                { label: "Whatsapp Number", name: "whatsappNo" },
                { label: "Contact No 2", name: "contactNo2" },
                { label: "Buyer Type", name: "buyerType", options: [{ value: "0", label: "Buyer" }, { value: "1", label: "Seller" }] },
              ].map((field) => (
                <div key={field.name}>
                  <InputFields
                    label={field.label}
                    name={field.name}
                    value={values[field.name as keyof CompanyCustomerFormValues]}
                    onChange={(e) => setFieldValue(field.name as keyof CompanyCustomerFormValues, e.target.value)}
                    options={field.options}
                  />
                  <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
                </div>
              ))}
            </div>
          </ContainerCard>
        );
      case 3:
        return (
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
                    value={values[field.name as keyof CompanyCustomerFormValues]}
                    onChange={(e) => setFieldValue(field.name as keyof CompanyCustomerFormValues, e.target.value)}
                    options={field.options}
                  />
                  <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
                </div>
              ))}
            </div>
          </ContainerCard>
        );
      case 4:
        return (
          <ContainerCard>
            <h2 className="text-lg font-semibold mb-6">Financial & Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Balance", name: "balance" },
                { label: "Payment Type", name: "paymentType", options: [{ value: "1", label: "Cash" }, { value: "2", label: "Credit" }] },
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
                { label: "Status", name: "status", options: [{ value: "1", label: "Active" }, { value: "0", label: "Inactive" }] },
              ].map((field) => (
                <div key={field.name}>
                  <InputFields
                    label={field.label}
                    name={field.name}
                    value={values[field.name as keyof CompanyCustomerFormValues]}
                    onChange={(e) => setFieldValue(field.name as keyof CompanyCustomerFormValues, e.target.value)}
                    options={field.options}
                  />
                  <ErrorMessage name={field.name} component="span" className="text-xs text-red-500 mt-1" />
                </div>
              ))}
            </div>
          </ContainerCard>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 text-gray-600">
        <Link href="/dashboard/settings/company/companyCustomer" className="hover:underline">
          <Icon icon="mdi:arrow-left" className="text-xl" />
        </Link>
        <h1 className="text-xl font-semibold">Add Company Customer</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={CompanyCustomerSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched, handleSubmit: formikSubmit }) => (
          <Form>
            <StepperForm
              steps={steps.map((step) => ({ ...step, isCompleted: isStepCompleted(step.id) }))}
              currentStep={currentStep}
              onStepClick={() => {}}
              onBack={prevStep}
              onNext={() =>
                handleNext(values, {
                  setErrors: () => {},
                  setTouched: () => {},
                } as unknown as FormikHelpers<CompanyCustomerFormValues>)
              }
              onSubmit={() => formikSubmit()}
              showSubmitButton={isLastStep}
              showNextButton={!isLastStep}
              nextButtonText="Save & Next"
              submitButtonText="Submit"
            >
              {renderStepContent(values, setFieldValue, errors, touched)}
            </StepperForm>
          </Form>
        )}
      </Formik>
    </>
  );
}