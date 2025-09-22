"use client";

import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { warehouseList, getVehicleById, updateVehicle } from "@/app/services/allApi";
import { useSnackbar } from "@/app/services/snackbarContext";
import Loading from "@/app/components/Loading";

interface Warehouse {
  id: number;
  warehouse_name: string;
}

interface VehicleFormValues {
  vehicleBrand: string;
  numberPlate: string;
  chassisNumber: string;
  vehicleType: string;
  ownerType: string;
  warehouseId: string;
  odoMeter: string;
  capacity: string;
  status: "active" | "inactive";
  validFrom: string;
  validTo: string;
}

// Yup validation schema
const VehicleSchema = Yup.object().shape({
  vehicleBrand: Yup.string().required("Vehicle Brand is required"),
  numberPlate: Yup.string()
    .matches(/^[A-Z0-9]{6,12}$/i, "Number Plate must be 6–12 alphanumeric characters")
    .required("Number Plate is required"),
  chassisNumber: Yup.string()
    .matches(/^[A-Z0-9]{8,20}$/i, "Chassis Number must be 8–20 alphanumeric characters")
    .required("Chassis Number is required"),
  vehicleType: Yup.string().required("Vehicle Type is required"),
  ownerType: Yup.string().required("Owner Type is required"),
  warehouseId: Yup.string().required("Warehouse is required"),
  odoMeter: Yup.string().matches(/^\d+$/, "Odometer must be numeric").required("Odometer is required"),
  capacity: Yup.string()
    .matches(/^\d+(\s?kg)?$/i, "Capacity must be numeric or numeric + 'kg'")
    .required("Capacity is required"),
  status: Yup.string().oneOf(["active", "inactive"]).required(),
  validFrom: Yup.date().required("Valid From date is required"),
  validTo: Yup.date()
    .min(Yup.ref("validFrom"), "Valid To must be after Valid From")
    .required("Valid To date is required"),
});

export default function UpdateVehicle() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  
  // Ensure id is string, handle undefined
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [initialValues, setInitialValues] = useState<VehicleFormValues>({
    vehicleBrand: "",
    numberPlate: "",
    chassisNumber: "",
    vehicleType: "",
    ownerType: "",
    warehouseId: "",
    odoMeter: "",
    capacity: "",
    status: "active",
    validFrom: "",
    validTo: "",
  });

  // Fetch warehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await warehouseList();
        if (res?.data && Array.isArray(res.data)) setWarehouses(res.data);
      } catch (err) {
        console.error("Failed to fetch warehouses ❌", err);
        showSnackbar("Failed to fetch warehouses ❌", "error");
      }
    };
    fetchWarehouses();
  }, [showSnackbar]);

  // Fetch vehicle data by ID
  useEffect(() => {
    if (!id) {
      setLoading(false);
      showSnackbar("Vehicle ID is missing ❌", "error");
      return;
    }

    const fetchVehicle = async () => {
      try {
        const res = await getVehicleById(id);
        if (res?.data) {
          const vehicle = res.data;
          setInitialValues({
            vehicleBrand: vehicle.description || "",
            numberPlate: vehicle.number_plat || "",
            chassisNumber: vehicle.vehicle_chesis_no || "",
            vehicleType: vehicle.vehicle_type || "",
            ownerType: vehicle.owner_type || "",
            warehouseId: String(vehicle.warehouse_id) || "",
            odoMeter: vehicle.opening_odometer || "",
            capacity: vehicle.capacity || "",
            status: vehicle.status === 1 ? "active" : "inactive",
            validFrom: vehicle.valid_from || "",
            validTo: vehicle.valid_to || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch vehicle ❌", err);
        showSnackbar("Failed to fetch vehicle ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, showSnackbar]);

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!id) return;

    try {
      // All values as strings to satisfy API
      const payload: Record<string, string> = {
        number_plat: values.numberPlate,
        vehicle_chesis_no: values.chassisNumber,
        description: values.vehicleBrand,
        capacity: values.capacity,
        vehicle_type: values.vehicleType,
        owner_type: values.ownerType,
        warehouse_id: String(values.warehouseId),
        opening_odometer: values.odoMeter,
        status: String(values.status === "active" ? 1 : 0),
        valid_from: values.validFrom,
        valid_to: values.validTo,
      };

      const res = await updateVehicle(id, payload);

      if (res?.error) {
        showSnackbar(res.message || "Failed to update vehicle ❌", "error");
      } else {
        showSnackbar("Vehicle updated successfully ✅", "success");
        router.push("/dashboard/master/vehicle");
      }
    } catch (err) {
      console.error("Update vehicle failed ❌", err);
      showSnackbar("Update vehicle failed ❌", "error");
    }
  };

  if (loading) return <div><Loading /></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-[20px]">
        <div className="flex items-center gap-[16px]">
          <Link href="/dashboard/master/vehicle">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-[20px] font-semibold text-[#181D27] flex items-center leading-[30px] mb-[5px]">
            Update Vehicle
          </h1>
        </div>
      </div>

      <Formik<VehicleFormValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={VehicleSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form className="space-y-8">
            {/* Vehicle Details */}
            <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6 p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputFields label="Vehicle Brand" value={values.vehicleBrand} onChange={handleChange} onBlur={handleBlur} error={touched.vehicleBrand && errors.vehicleBrand} name="vehicleBrand" />
                <InputFields label="Number Plate" value={values.numberPlate} onChange={handleChange} onBlur={handleBlur} error={touched.numberPlate && errors.numberPlate} name="numberPlate" />
                <InputFields label="Chassis Number" value={values.chassisNumber} onChange={handleChange} onBlur={handleBlur} error={touched.chassisNumber && errors.chassisNumber} name="chassisNumber" />
                <InputFields label="Vehicle Type" value={values.vehicleType} onChange={handleChange} onBlur={handleBlur} error={touched.vehicleType && errors.vehicleType} name="vehicleType" options={[
                  { value: "1", label: "Truck" },
                  { value: "2", label: "Van" },
                  { value: "3", label: "Bike" },
                  { value: "4", label: "Tuktuk" },
                ]} />
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6 p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputFields label="Owner Type" value={values.ownerType} onChange={handleChange} onBlur={handleBlur} error={touched.ownerType && errors.ownerType} name="ownerType" options={[
                  { value: "0", label: "Company Owned" },
                  { value: "1", label: "Contractor" },
                ]} />
                <InputFields label="Warehouse" value={values.warehouseId} onChange={handleChange} onBlur={handleBlur} error={touched.warehouseId && errors.warehouseId} name="warehouseId" options={warehouses.map(w => ({ value: String(w.id), label: w.warehouse_name }))} />
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputFields label="Odo Meter" value={values.odoMeter} onChange={handleChange} onBlur={handleBlur} error={touched.odoMeter && errors.odoMeter} name="odoMeter" />
                <InputFields label="Capacity" value={values.capacity} onChange={handleChange} onBlur={handleBlur} error={touched.capacity && errors.capacity} name="capacity" />
                <InputFields label="Status" value={values.status} onChange={handleChange} onBlur={handleBlur} error={touched.status && errors.status} name="status" options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]} />
                <InputFields label="Valid From" type="date" value={values.validFrom} onChange={handleChange} onBlur={handleBlur} error={touched.validFrom && errors.validFrom} name="validFrom" />
                <InputFields label="Valid To" type="date" value={values.validTo} onChange={handleChange} onBlur={handleBlur} error={touched.validTo && errors.validTo} name="validTo" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pr-0 mt-4">
              <button type="button" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => router.push("/dashboard/master/vehicle")}>
                Cancel
              </button>
              <SidebarBtn label="Update" isActive={true} leadingIcon="mdi:check" type="submit" />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
