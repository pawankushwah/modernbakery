"use client";

import StepperForm, {
  useStepperForm,
  StepperStep,
} from "@/app/components/stepperForm";
import ContainerCard from "@/app/components/containerCard";
import InputFields from "@/app/components/inputFields";
import {
  addCompany,
  getCompanyById,
  updateCompany,
  genearateCode,
  saveFinalCode,
} from "@/app/services/allApi";
import { useSnackbar } from "@/app/services/snackbarContext";
import { useParams, useRouter } from "next/navigation";
import * as Yup from "yup";
import {
  Formik,
  Form,
  FormikHelpers,
  FormikErrors,
  FormikTouched,
} from "formik";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import Link from "next/link";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import IconButton from "@/app/components/iconButton";
import SettingPopUp from "@/app/components/settingPopUp";
import { useEffect, useState, useRef } from "react";
import Loading from "@/app/components/Loading";

interface CompanyFormValues {
  company_name: string;
  company_code: string;
  company_type: string;
  website: string;
  company_logo: string | File;
  primary_contact: string;
  primary_code: string;
  toll_free_no: string;
  toll_free_code: string;
  email: string;
  country_id: string;
  address: string;
  city: string;
  selling_currency: string;
  purchase_currency: string;
  vat: string;
  module_access: string;
  service_type: string;
  status: string;
}

const CompanySchema = Yup.object().shape({
  company_name: Yup.string().required("Company name is required"),
  company_code: Yup.string().required("Company code is required"),
  company_type: Yup.string().required("Company type is required"),
  website: Yup.string()
    .required("Company website is required")
    .test("is-valid-website", "Invalid website URL", (value) => {
      if (!value) return false;
      try {
        const v = value.startsWith("http://") || value.startsWith("https://") ? value : `http://${value}`;
        const parsed = new URL(v);
        return !!parsed.hostname && parsed.hostname.indexOf(".") > -1;
      } catch (e) {
        return false;
      }
    }),
  company_logo: Yup.mixed().required("Company Logo is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  country_id: Yup.string().required("Country is required"),
  selling_currency: Yup.string().required("Selling currency is required"),
  purchase_currency: Yup.string().required("Purchase currency is required"),
  vat: Yup.string()
    .required("VAT Number is a required field")
    .max(15, "VAT Number cannot be more than 15 characters"),
  service_type: Yup.string().required("Service type is required"),
  status: Yup.string().required("Status is required"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  primary_contact: Yup.string()
    .required("Primary contact is required")
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .min(9, "Must be at least 9 digits")
    .max(10, "Must be at most 10 digits"),
  toll_free_no: Yup.string()
    .required("Toll free number is required")
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .min(10, "Must be at least 10 digits")
    .max(13, "Must be at most 13 digits"),
  module_access: Yup.string().required("Module is required field"),
});

// Step-wise schemas
const stepSchemas = [
  Yup.object({
    company_name: Yup.string().required("Company name is required"),
    company_code: Yup.string().required("Company code is required"),
    company_type: Yup.string().required("Company type is required"),
    website: Yup.string()
      .required("Company website is required")
      .test("is-valid-website", "Invalid website URL", (value) => {
        if (!value) return false;
        try {
          const v = value.startsWith("http://") || value.startsWith("https://") ? value : `http://${value}`;
          const parsed = new URL(v);
          return !!parsed.hostname && parsed.hostname.indexOf(".") > -1;
        } catch (e) {
          return false;
        }
      }),
    company_logo: Yup.mixed().required("Company Logo is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country_id: Yup.string().required("Country is required"),
    module_access: Yup.string().required("Module is required"),
    service_type: Yup.string().required("Service type is required"),
    status: Yup.string().required("Status is required"),
  }),

  Yup.object({
    primary_contact: Yup.string()
      .required("Primary contact is required")
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(9, "Must be at least 9 digits")
      .max(10, "Must be at most 10 digits"),
    primary_code: Yup.string(),
    toll_free_no: Yup.string()
      .required("Toll free number is required")
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .max(13, "Must be at most 13 digits"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),

  Yup.object({
    selling_currency: Yup.string()
      .trim()
      .required("Please select a selling currency"),
    purchase_currency: Yup.string()
      .trim()
      .required("Please select a purchase currency"),
    vat: Yup.string()
      .required("VAT Number is a required field")
      .max(15, "VAT Number cannot be more than 15 characters"),
  }),
];

export default function AddEditCompany() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeMode, setCodeMode] = useState<"auto" | "manual">("auto");
  const [prefix, setPrefix] = useState("");
  const { regionOptions, areaOptions, onlyCountryOptions, countryCurrency } =
    useAllDropdownListData();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string>("");
  const [initialValues, setInitialValues] = useState<CompanyFormValues>({
    company_name: "",
    company_code: "",
    company_type: "",
    website: "",
    company_logo: "",
    email: "",
    primary_contact: "",
    primary_code: "+256",
    toll_free_no: "",
    toll_free_code: "+256",
    country_id: "",
    address: "",
    city: "",
    selling_currency: "",
    purchase_currency: "",
    vat: "",
    module_access: "",
    service_type: "",
    status: "1",
  });

  const [primaryCountry, setPrimaryCountry] = useState<{ 
    name: string; 
    code?: string; 
    flag?: string 
  }>({
    name: "Uganda",
    code: "+256",
    flag: "🇺🇬",
  });

  const [tollFreeCountry, setTollFreeCountry] = useState<{ 
    name: string; 
    code?: string; 
    flag?: string 
  }>({
    name: "Uganda",
    code: "+256",
    flag: "🇺🇬",
  });

  const codeGeneratedRef = useRef(false);

  useEffect(() => {
    if (params?.id && params.id !== "add") {
      setIsEditMode(true);
      (async () => {
        setLoading(true);
        try {
          const res = await getCompanyById(params.id as string);
          if (res && !res.error) {
            const data = res.data;
            
            // Store existing logo URL
            if (data.logo) {
              setExistingLogoUrl(data.logo);
            }
            
            // Set form values
            setInitialValues({
              company_code: data.company_code || "",
              company_name: data.company_name || "",
              company_type: data.company_type || "",
              website: data.website || "",
              company_logo: data.logo || "",
              email: data.email || "",
              primary_contact: data.primary_contact || "",
              primary_code: data.primary_code || "+256",
              toll_free_no: data.toll_free_no || "",
              toll_free_code: data.toll_free_code || "+256",
              country_id: data.country?.id?.toString() || "",
              address: data.address || "",
              city: data.city || "",
              selling_currency: data.selling_currency || "",
              purchase_currency: data.purchase_currency || "",
              vat: data.vat || "",
              module_access: data.module_access || "",
              service_type: data.service_type || "",
              status: data.status?.toString() || "1",
            });

            // Set country dropdowns for contact fields
            if (data.primary_code && onlyCountryOptions) {
              const country = onlyCountryOptions.find((c: any) => 
                c.code === data.primary_code || c.value === data.primary_code
              );
              if (country) {
                setPrimaryCountry({
                  name: country.label,
                  code: data.primary_code,
                  flag: "🇺🇬"
                });
              } else {
                setPrimaryCountry({
                  name: "Unknown",
                  code: data.primary_code,
                  flag: "🏳️"
                });
              }
            }

            if (data.toll_free_code && onlyCountryOptions) {
              const country = onlyCountryOptions.find((c: any) => 
                c.code === data.toll_free_code || c.value === data.toll_free_code
              );
              if (country) {
                setTollFreeCountry({
                  name: country.label,
                  code: data.toll_free_code,
                  flag: "🇺🇬"
                });
              } else {
                setTollFreeCountry({
                  name: "Unknown",
                  code: data.toll_free_code,
                  flag: "🏳️"
                });
              }
            }
          } else {
            showSnackbar(res.message || "Failed to fetch company details", "error");
          }
        } catch (err) {
          console.error("Error fetching company:", err);
          showSnackbar("Failed to fetch company details", "error");
        } finally {
          setLoading(false);
        }
      })();
    } else if (
      (params?.id === "add" || !params?.id) &&
      !codeGeneratedRef.current
    ) {
      codeGeneratedRef.current = true;
      (async () => {
        try {
          const res = await genearateCode({ model_name: "company" });
          if (res?.code) {
            setInitialValues((prev) => ({ ...prev, company_code: res.code }));
          }
          if (res?.prefix) {
            setPrefix(res.prefix);
          }
        } catch (e) {
          console.error("Error generating code:", e);
        }
      })();
    }
  }, [params?.id, onlyCountryOptions]);

  const steps: StepperStep[] = [
    { id: 1, label: "Company" },
    { id: 2, label: "Contact" },
    { id: 3, label: "Financial" },
  ];

  const {
    currentStep,
    nextStep,
    prevStep,
    markStepCompleted,
    isStepCompleted,
    isLastStep,
  } = useStepperForm(steps.length);

  const handleSubmit = async (
    values: CompanyFormValues,
    { setSubmitting }: FormikHelpers<CompanyFormValues>
  ) => {
    try {
      await CompanySchema.validate(values, { abortEarly: false });
      setLoading(true);
      const formData = new FormData();

      // Append all fields
      (Object.keys(values) as (keyof CompanyFormValues)[]).forEach((key) => {
        if (key === "company_logo") {
          // Handle logo: if it's a File, append it; if string (existing), skip or handle accordingly
          if (values[key] instanceof File) {
            formData.append("logo", values[key] as File);
          } else if (isEditMode && typeof values[key] === "string") {
            // Don't append logo if it's the existing URL in edit mode unless you want to send it
            // Backend should handle this - only send if changed
          }
        } else {
          formData.append(key, values[key]?.toString() ?? "");
        }
      });

      let res;
      if (isEditMode) {
        res = await updateCompany(params.id as string, formData);
      } else {
        res = await addCompany(formData);
      }

      if (res.error) {
        showSnackbar(res.data?.message || res.message || "Failed to submit form", "error");
      } else {
        showSnackbar(
          isEditMode
            ? "Company Updated Successfully"
            : "Company Created Successfully",
          "success"
        );
        router.push("/settings/manageCompany/company");
        
        // Save final code
        if (!isEditMode) {
          try {
            await saveFinalCode({
              reserved_code: values.company_code,
              model_name: "company",
            });
          } catch (e) {
            console.error("Error saving final code:", e);
          }
        }
      }
    } catch (err) {
      console.error("Validation error:", err);
      if (err instanceof Yup.ValidationError) {
        showSnackbar(err.errors[0] || "Validation failed", "error");
      } else {
        showSnackbar("Failed to submit form", "error");
      }
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>, 
    fieldName: string, 
    setFieldValue: any
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFieldValue(fieldName, value);
  };

  const renderStepContent = (
    values: CompanyFormValues,
    setFieldValue: (
      field: keyof CompanyFormValues,
      value: string | File,
      shouldValidate?: boolean
    ) => void,
    errors: FormikErrors<CompanyFormValues>,
    touched: FormikTouched<CompanyFormValues>
  ) => {
    switch (currentStep) {
      case 1:
        return (
          <ContainerCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2 max-w-[406px]">
                <InputFields
                  label="Company Code"
                  name="company_code"
                  value={values.company_code}
                  onChange={(e) =>
                    setFieldValue("company_code", e.target.value)
                  }
                  disabled={codeMode === "auto" || isEditMode}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Company Name"
                  name="company_name"
                  value={values.company_name}
                  onChange={(e) =>
                    setFieldValue("company_name", e.target.value)
                  }
                  error={
                    errors?.company_name && touched.company_name
                      ? errors.company_name
                      : false
                  }
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Company Type"
                  name="company_type"
                  value={values.company_type}
                  onChange={(e) => setFieldValue("company_type", e.target.value)}
                  options={[
                    { value: "manufacturing", label: "Manufacturing" },
                    { value: "trading", label: "Trading" },
                  ]}
                  error={touched.company_type && errors.company_type}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Website"
                  name="website"
                  value={values.website}
                  onChange={(e) => setFieldValue("website", e.target.value)}
                  error={touched.website && errors.website}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Logo"
                  name="company_logo"
                  type="file"
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files[0]) {
                      setFieldValue("company_logo", target.files[0]);
                    }
                  }}
                  error={touched.company_logo && errors.company_logo}
                />
                {isEditMode && existingLogoUrl && typeof values.company_logo === "string" && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Current Logo:</p>
                    <img 
                      src={existingLogoUrl.startsWith("http") ? existingLogoUrl : `${process.env.NEXT_PUBLIC_API_URL || ""}/${existingLogoUrl}`} 
                      alt="Current logo" 
                      className="h-16 w-16 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <InputFields
                  required
                  label="Module"
                  name="module_access"
                  value={values.module_access}
                  onChange={(e) => setFieldValue("module_access", e.target.value)}
                  error={touched.module_access && errors.module_access}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Service Type"
                  name="service_type"
                  value={values.service_type}
                  onChange={(e) => setFieldValue("service_type", e.target.value)}
                  options={[
                    { value: "branch", label: "Branch" },
                    { value: "warehouse", label: "Warehouse" },
                  ]}
                  error={touched.service_type && errors.service_type}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Address"
                  name="address"
                  value={values.address}
                  onChange={(e) => setFieldValue("address", e.target.value)}
                  error={touched.address && errors.address}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="City"
                  name="city"
                  value={values.city}
                  onChange={(e) => setFieldValue("city", e.target.value)}
                  error={touched.city && errors.city}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Country"
                  name="country_id"
                  value={values.country_id ? values.country_id.toString() : ""}
                  options={onlyCountryOptions}
                  onChange={(e) => setFieldValue("country_id", e.target.value)}
                  error={touched.country_id && errors.country_id}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Status"
                  name="status"
                  type="radio"
                  value={values.status}
                  onChange={(e) => setFieldValue("status", e.target.value)}
                  options={[
                    { value: "1", label: "Active" },
                    { value: "0", label: "Inactive" },
                  ]}
                  error={touched.status && errors.status}
                />
              </div>
            </div>
          </ContainerCard>
        );

      case 2:
        return (
          <ContainerCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <InputFields
                  required
                  type="contact"
                  label="Primary Contact"
                  name="primary_contact"
                  selectedCountry={primaryCountry}
                  setSelectedCountry={(c: { name: string; code?: string; flag?: string } | undefined) => {
                    setPrimaryCountry(c ?? { name: "", code: "", flag: "" });
                    setFieldValue("primary_code", c?.code ?? "");
                  }}
                  value={values.primary_contact}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
                    handleNumericInput(e as React.ChangeEvent<HTMLInputElement>, "primary_contact", setFieldValue)
                  }
                  error={touched.primary_contact && errors.primary_contact}
                />
              </div>

              <div>
                <InputFields
                  required
                  type="contact"
                  label="Toll Free Number"
                  name="toll_free_no"
                  selectedCountry={tollFreeCountry}
                  setSelectedCountry={(c: { name: string; code?: string; flag?: string } | undefined) => {
                    setTollFreeCountry(c ?? { name: "", code: "", flag: "" });
                    setFieldValue("toll_free_code", c?.code ?? "");
                  }}
                  value={values.toll_free_no}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
                    handleNumericInput(e as React.ChangeEvent<HTMLInputElement>, "toll_free_no", setFieldValue)
                  }
                  error={touched.toll_free_no && errors.toll_free_no}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  error={touched.email && errors.email}
                />
              </div>
            </div>
          </ContainerCard>
        );

      case 3:
        return (
          <ContainerCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <InputFields
                  required
                  label="Selling Currency"
                  name="selling_currency"
                  value={values.selling_currency}
                  options={countryCurrency}
                  onChange={(e) => setFieldValue("selling_currency", e.target.value)}
                  error={touched.selling_currency && errors.selling_currency}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="Purchase Currency"
                  name="purchase_currency"
                  value={values.purchase_currency}
                  options={countryCurrency}
                  onChange={(e) => setFieldValue("purchase_currency", e.target.value)}
                  error={touched.purchase_currency && errors.purchase_currency}
                />
              </div>

              <div>
                <InputFields
                  required
                  label="VAT Number"
                  name="vat"
                  value={values.vat}
                  onChange={(e) => setFieldValue("vat", e.target.value)}
                  error={touched.vat && errors.vat}
                />
              </div>
            </div>
          </ContainerCard>
        );

      default:
        return null;
    }
  };

  if ((isEditMode && loading) || !onlyCountryOptions || !countryCurrency) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/settings/manageCompany/company">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Update Company" : "Add New Company"}
          </h1>
        </div>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={CompanySchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          setTouched,
          handleSubmit: formikSubmit,
        }) => {
          const handleNextStep = async () => {
            try {
              const schema = stepSchemas[currentStep - 1];
              if (!schema) return;

              await schema.validate(values, { abortEarly: false });

              markStepCompleted(currentStep);
              nextStep();
            } catch (err: unknown) {
              if (err instanceof Yup.ValidationError && err.inner) {
                const formTouched: Record<string, boolean> = {};
                err.inner.forEach((validationError: Yup.ValidationError) => {
                  if (validationError.path) {
                    formTouched[validationError.path] = true;
                  }
                });
                setTouched({ ...touched, ...formTouched });
                
                // Show first error
                if (err.errors && err.errors.length > 0) {
                  showSnackbar(err.errors[0], "error");
                }
              }
            }
          };

          return (
            <Form>
              <StepperForm
                steps={steps.map((s) => ({
                  ...s,
                  isCompleted: isStepCompleted(s.id),
                }))}
                currentStep={currentStep}
                onStepClick={() => {}}
                onBack={prevStep}
                onNext={handleNextStep}
                onSubmit={() => formikSubmit()}
                showSubmitButton={isLastStep}
                showNextButton={!isLastStep}
                nextButtonText="Save & Next"
                submitButtonText={isEditMode ? "Update" : "Submit"}
              >
                {renderStepContent(values, setFieldValue, errors, touched)}
              </StepperForm>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}