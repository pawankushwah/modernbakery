"use client";

import React from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import ContainerCard from "@/app/components/containerCard";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import InputFields from "@/app/components/inputFields";
import { useSnackbar } from "@/app/services/snackbarContext";
import { addCompanyCustomers } from "@/app/services/allApi";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";

// ✅ Validation Schema
export const CompanyCustomerSchema = Yup.object().shape({
  sapCode: Yup.string().required("Sap Code is required."),
  customerCode: Yup.string().required("Customer Code is required."),
  businessName: Yup.string().required("Business Name is required."),
  customerType: Yup.string().required("Customer Type is required."),
  ownerName: Yup.string().required("Owner Name is required."),
  ownerNo: Yup.string().required("Owner Number is required."),
  whatsappNo: Yup.string().nullable(),
  email: Yup.string().email("Invalid email format").required("Email is required."),
  language: Yup.string().required("Language is required."),
  contactNo2: Yup.string().required("Contact 2 is required."),
  buyerType: Yup.string().required("Buyer Type is required."),
  roadStreet: Yup.string().required("Road Street is required."),
  town: Yup.string().required("Town is required."),
  landmark: Yup.string().required("Landmark is required."),
  district: Yup.string().required("District is required."),
  balance: Yup.string().required("Balance is required."),
  paymentType: Yup.string().required("Payment Type is required."),
  bankName: Yup.string().required("Bank Name is required."),
  bankAccountNumber: Yup.string().required("Bank Account Number is required."),
  creditDay: Yup.string().required("Credit Day is required."),
  tinNo: Yup.string().required("Tin Number is required."),
  accuracy: Yup.string().required("Accuracy is required."),
  creditLimit: Yup.string().required("Credit Limit is required."),
  guaranteeName: Yup.string().required("Guarantee Name is required."),
  guaranteeAmount: Yup.string().required("Guarantee Amount is required."),
  guaranteeFrom: Yup.string().required("Guarantee From is required."),
  guaranteeTo: Yup.string().required("Guarantee To is required."),
  totalCreditLimit: Yup.string().required("Total Credit Limit is required."),
  creditLimitValidity: Yup.string().required("Credit Limit Validity is required."),
  regionId: Yup.string().required("Region is required."),
  areaId: Yup.string().required("Area is required."),
  vatNo: Yup.string().required("VAT No is required."),
  longitude: Yup.string().required("Longitude is required."),
  latitude: Yup.string().required("Latitude is required."),
  thresholdRadius: Yup.string().required("Threshold Radius is required."),
  dchannelId: Yup.string().required("DChannel ID is required."),
  isWhatsapp: Yup.string().required("Whatsapp status is required."),
  status: Yup.string().required("Status is required."),
});


type CompanyCustomerFormValues = {
  sapCode: string;
  customerCode: string;
  businessName: string;
  customerType: string;
  ownerName: string;
  ownerNo: string;
  whatsappNo: string;
  email: string;
  language: string;
  contactNo2: string;
  buyerType: string;
  roadStreet: string;
  town: string;
  landmark: string;
  district: string;
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
  regionId: string;
  areaId: string;
  vatNo: string;
  longitude: string;
  latitude: string;
  thresholdRadius: string;
  dchannelId: string;
  isWhatsapp: string;
  status: string;
  
};

export default function AddCompanyCustomer() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { regionOptions,areaOptions} =
    useAllDropdownListData();

  // ✅ Initial Values
  const initialValues: CompanyCustomerFormValues = {
    sapCode: "",
    customerCode: "",
    businessName: "",
    customerType: "1",
    ownerName: "",
    ownerNo: "",
    balance: "",
    isWhatsapp: "",
    whatsappNo: "",
    email: "",
    language: "",
    contactNo2: "",
    buyerType: "0",
    roadStreet: "",
    town: "",
    landmark: "",
    district: "",
    paymentType: "0",
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
    regionId: "",
    areaId: "",
    vatNo: "",
    longitude: "",
    latitude: "",
    thresholdRadius: "",
    dchannelId: "",
    status: "1", // default Active

  };

  // ✅ Submit Handler
  const handleSubmit = async (
    values: CompanyCustomerFormValues,
    { setSubmitting }: FormikHelpers<CompanyCustomerFormValues>
  ) => {
    try {
const payload = {
  sap_code: values.sapCode.trim(),
  customer_code: values.customerCode.trim(),
  business_name: values.businessName.trim(),
  customer_type: Number(values.customerType) || 1,
  owner_name: values.ownerName.trim(),
  owner_no: values.ownerNo.trim(),
  is_whatsapp: Number(values.isWhatsapp) || 0,
  whatsapp_no: values.whatsappNo?.trim() || "",
  email: values.email.trim(),
  language: values.language.trim(),
  contact_no2: values.contactNo2?.trim() || "",
  buyerType: Number(values.buyerType) || 0,
  road_street: values.roadStreet.trim(),
  town: values.town.trim(),
  landmark: values.landmark.trim(),
  district: values.district.trim(),
  balance: parseFloat(values.balance) || 0,
  payment_type: Number(values.paymentType) || 0,
  bank_name: values.bankName.trim(),
  bank_account_number: values.bankAccountNumber.trim(),
  creditday: values.creditDay.trim(),             // ✅
  tin_no: values.tinNo.trim(),
  accuracy: values.accuracy.trim(),
  creditlimit: Number(values.creditLimit) || 0,   // ✅
  guarantee_name: values.guaranteeName.trim(),
  guarantee_amount: Number(values.guaranteeAmount) || 0,
  guarantee_from: values.guaranteeFrom.trim(),
  guarantee_to: values.guaranteeTo.trim(),
  totalcreditlimit: Number(values.totalCreditLimit) || 0, // ✅
  credit_limit_validity: values.creditLimitValidity.trim(),
  region_id: Number(values.regionId) || 0,
  area_id: Number(values.areaId) || 0,
  vat_no: values.vatNo.trim(),
  longitude: values.longitude.trim(),
  latitude: values.latitude.trim(),
  threshold_radius: Number(values.thresholdRadius) || 0,
  dchannel_id: Number(values.dchannelId) || 0,
  status: Number(values.status) || 1,
};

      console.log("Payload ->", payload);
      const res = await addCompanyCustomers(payload);

      if (res?.errors) {
        const errs: string[] = [];
        for (const key in res.errors) errs.push(...res.errors[key]);
        showSnackbar(errs.join(" | "), "error");
        setSubmitting(false);
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
        <Link href="/dashboard/settings/region">
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
            {/* ✅ Section 1: Basic Details */}
            <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
                Company Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <InputFields
                    label="Sap Code"
                    name="sapCode"
                    value={values.sapCode}
                    onChange={(e) => setFieldValue("sapCode", e.target.value)}
                  />
                  <ErrorMessage
                    name="sapCode"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    label="Customer Code"
                    name="customerCode"
                    value={values.customerCode}
                    onChange={(e) =>
                      setFieldValue("customerCode", e.target.value)
                    }
                  />
                  <ErrorMessage
                    name="customerCode"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    label="Business Name"
                    name="businessName"
                    value={values.businessName}
                    onChange={(e) =>
                      setFieldValue("businessName", e.target.value)
                    }
                  />
                  <ErrorMessage
                    name="businessName"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    label="Owner Name"
                    name="ownerName"
                    value={values.ownerName}
                    onChange={(e) =>
                      setFieldValue("ownerName", e.target.value)
                    }
                  />
                  <ErrorMessage
                    name="ownerName"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
                  <InputFields
                    label="Owner Number"
                    name="ownerNo"
                    value={values.ownerNo}
                    onChange={(e) => setFieldValue("ownerNo", e.target.value)}
                  />
                  <ErrorMessage
                    name="ownerNo"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
             
                <div>
                 <InputFields
  label="Customer Type"
  name="customerType"
  value={values.customerType}
  onChange={(e) => setFieldValue("customerType", e.target.value)}
  options={[
    { value: "1", label: "Retail" },
    { value: "2", label: "Wholesale" },
    { value: "3", label: "Distributor" },
    { value: "4", label: "Online" },
    { value: "5", label: "Other" },
  ]}
/>
<ErrorMessage
  name="customerType"
  component="span"
  className="text-xs text-red-500"
/>

                </div>
                <div>
                  <InputFields
                    label="Language"
                    name="language"
                    value={values.language}
                    onChange={(e) => setFieldValue("language", e.target.value)}
                  />
                  <ErrorMessage
                    name="language"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
          
              </div>
            </ContainerCard>

 <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
                 Location Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <InputFields
                    label="Road Steet"
                    name="roadStreet"
                    value={values.roadStreet}
                    onChange={(e) => setFieldValue("roadStreet", e.target.value)}
                  />
                  <ErrorMessage
                    name="roadStreet"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                      <div>
                  <InputFields
                    label="Town"
                    name="town"
                    value={values.town}
                    onChange={(e) => setFieldValue("town", e.target.value)}
                  />
                  <ErrorMessage
                    name="town"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                 <div>
                  <InputFields
                    label="Landmark"
                    name="landmark"
                    value={values.landmark}
                    onChange={(e) => setFieldValue("landmark", e.target.value)}
                  />
                  <ErrorMessage
                    name="landmark"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                  <div>
                  <InputFields
                    label="District"
                    name="district"
                    value={values.district}
                    onChange={(e) => setFieldValue("district", e.target.value)}
                  />
                  <ErrorMessage
                    name="district"
                    component="span"
                    className="text-xs text-red-500"
                  />
                </div>
                <div>
  <InputFields
    label="Region"
    name="regionId"
    value={values.regionId}
    onChange={(e) => setFieldValue("regionId", e.target.value)}
    options={
    regionOptions}
  />
  <ErrorMessage
    name="regionId"
    component="span"
    className="text-xs text-red-500"
  />
</div>
                <div>
  <InputFields
    label="Area "
    name="areaId"
    value={values.areaId}
    onChange={(e) => setFieldValue("areaId", e.target.value)}
    options={
    areaOptions}
  />
  <ErrorMessage
    name="areaId"
    component="span"
    className="text-xs text-red-500"
  />
</div>
            
                
               
               
              
              
          
              </div>
            </ContainerCard>



            {/* ✅ Section 2: Contact */}
            <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
                Company Customer Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         {/* SAP Code */}


{/* Customer Code */}


{/* Business Name */}





{/* Whatsapp Available */}
<div>
  <InputFields
    label="Whatsapp Available?"
    name="isWhatsapp"
    value={values.isWhatsapp}
    onChange={(e) => setFieldValue("isWhatsapp", e.target.value)}
    options={[
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ]}
  />
  <ErrorMessage
    name="isWhatsapp"
    component="span"
    className="text-xs text-red-500"
  />
</div>

{/* Whatsapp Number */}
<div>
  <InputFields
    label="Whatsapp Number"
    name="whatsappNo"
    value={values.whatsappNo}
    onChange={(e) => setFieldValue("whatsappNo", e.target.value)}
  />
  <ErrorMessage
    name="whatsappNo"
    component="span"
    className="text-xs text-red-500"
  />
</div>

{/* Email */}
<div>
  <InputFields
    label="Email"
    name="email"
    value={values.email}
    onChange={(e) => setFieldValue("email", e.target.value)}
  />
  <ErrorMessage
    name="email"
    component="span"
    className="text-xs text-red-500"
  />
</div>

{/* Language */}


{/* Contact No 2 */}
<div>
  <InputFields
    label=" Contact No"
    name="contactNo2"
    value={values.contactNo2}
    onChange={(e) => setFieldValue("contactNo2", e.target.value)}
  />
  <ErrorMessage
    name="contactNo2"
    component="span"
    className="text-xs text-red-500"
  />
</div>

{/* Balance */}




{/* Status */}
<div>
  <InputFields
    label="Status"
    name="status"
    value={values.status}
    onChange={(e) => setFieldValue("status", e.target.value)}
    options={[
      { value: "1", label: "Active" },
      { value: "0", label: "Inactive" },
    ]}
  />
  <ErrorMessage
    name="status"
    component="span"
    className="text-xs text-red-500"
  />
</div>

             
              
              </div>
            </ContainerCard>
  <ContainerCard>
              <h2 className="text-lg font-semibold mb-6">
              Financial Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
  <InputFields
    label="Balance"
    name="balance"
    value={values.balance}
    onChange={(e) => setFieldValue("balance", e.target.value)}
  />
  <ErrorMessage
    name="balance"
    component="span"
    className="text-xs text-red-500"
  />
</div>

    <div>
  <InputFields
    label="Payment Type"
    name="paymentType"
    value={values.paymentType}
    onChange={(e) => setFieldValue("paymentType", e.target.value)}
    options={[
      { value: "0", label: "Select Payment Type" },
      { value: "1", label: "Cash" },
      { value: "2", label: "Credit" },
      { value: "3", label: "Cheque" },
    ]}
  />
  <ErrorMessage
    name="paymentType"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="Bank Name"
    name="bankName"

    value={values.bankName}
    onChange={(e) => setFieldValue("bankName", e.target.value)}
  />
  <ErrorMessage
    name="bankName"
    component="span"
    className="text-xs text-red-500"
  />
</div>

<div>
  <InputFields
    label="Bank Account Number"
 name="bankAccountNumber"


    value={values.bankAccountNumber}
    onChange={(e) => setFieldValue("bankAccountNumber", e.target.value)}
  />
  <ErrorMessage
    name="bankAccountNumber"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="Credit Day"
    name="creditDay"

    value={values.creditDay}
    onChange={(e) => setFieldValue("creditDay", e.target.value)}
  />
  <ErrorMessage
    name="creditDay"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="Credit Limit"
    name="creditLimit"

    value={values.creditLimit}
    onChange={(e) => setFieldValue("creditLimit", e.target.value)}
  />
  <ErrorMessage
    name="creditLimit"
    component="span"
    className="text-xs text-red-500"
  />
</div>

<div>
  <InputFields
    label="Total Credit Limit"
    name="totalCreditLimit"
    value={values.totalCreditLimit}
    onChange={(e) => setFieldValue("totalCreditLimit", e.target.value)}
  />
  <ErrorMessage
    name="totalCreditLimit"
    component="span"
    className="text-xs text-red-500"
  />
</div>



{/* Guarantee From */}
<div>
  <InputFields
    label="Guarantee From"
    name="guaranteeFrom"

    value={values.guaranteeFrom}
    onChange={(e) => setFieldValue("guaranteeFrom", e.target.value)}
  />
  <ErrorMessage
    name="guaranteeFrom"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="Guarantee Name"
    name="guaranteeName"

    value={values.guaranteeName}
    onChange={(e) => setFieldValue("guaranteeName", e.target.value)}
  />
  <ErrorMessage
    name="guaranteeName"
    component="span"
    className="text-xs text-red-500"
  />
</div>

{/* Guarantee To */}
<div>
  <InputFields
    label="Guarantee To"
    name="guaranteeTo"

    value={values.guaranteeTo}
    onChange={(e) => setFieldValue("guaranteeTo", e.target.value)}
  />
  <ErrorMessage
    name="guaranteeTo"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="VAT No"
    name="vatNo"

    value={values.vatNo}
    onChange={(e) => setFieldValue("vatNo", e.target.value)}
  />
  <ErrorMessage
    name="vatNo"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="Tin No"
    name="tinNo"

    value={values.tinNo}
    onChange={(e) => setFieldValue("tinNo", e.target.value)}
  />
  <ErrorMessage
    name="tinNo"
    component="span"
    className="text-xs text-red-500"
  />
</div>
{/* Total Credit Limit */}

<div>
  <InputFields
    label="Longitude"
    name="longitude"
    value={values.longitude}
    onChange={(e) => setFieldValue("longitude", e.target.value)}
  />
  <ErrorMessage
    name="longitude"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="Latitude"
    name="latitude"
    value={values.latitude}
    onChange={(e) => setFieldValue("latitude", e.target.value)}
  />
  <ErrorMessage
    name="latitude"
    component="span"
    className="text-xs text-red-500"
  />
</div>
{/* Credit Limit Validity */}
<div>
  <InputFields
    label="Credit Limit Validity"
    name="creditLimitValidity"

    value={values.creditLimitValidity}
    onChange={(e) => setFieldValue("creditLimitValidity", e.target.value)}
  />
  <ErrorMessage
    name="creditLimitValidity"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="Threshold Radius"
    name="thresholdRadius"

    value={values.thresholdRadius}
    onChange={(e) => setFieldValue("thresholdRadius", e.target.value)}
  />
  <ErrorMessage
    name="thresholdRadius"
    component="span"
    className="text-xs text-red-500"
  />
</div>
<div>
  <InputFields
    label="DChannel ID"
    name="dchannelId"

    value={values.dchannelId}
    onChange={(e) => setFieldValue("dchannelId", e.target.value)}
  />
  <ErrorMessage
    name="dchannelId"
    component="span"
    className="text-xs text-red-500"
  />
</div>









{/* Country */}





             
              
              </div>
            </ContainerCard>





            {/* ✅ Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="reset"
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
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
