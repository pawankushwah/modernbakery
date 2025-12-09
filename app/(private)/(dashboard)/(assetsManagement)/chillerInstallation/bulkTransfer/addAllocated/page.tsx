"use client";

import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import InputFields from "@/app/components/inputFields";
import Loading from "@/app/components/Loading";
import { addAllocate, getBtrByRegion } from "@/app/services/assetsApi";
import { useSnackbar } from "@/app/services/snackbarContext";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function AddRoute() {
  const { regionOptions, warehouseAllOptions } = useAllDropdownListData();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBtr, setLoadingBtr] = useState(false);

  const [btrOptions, setBtrOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [form, setForm] = useState({
    region_id: "",
    btr: "",
    warehouse_id: "",
    truck_no: "",
    turnmen_name: "",
    contact: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    region_id: yup.string().required("Region is required"),
    btr: yup.string().required("BTR is required"),
    warehouse_id: yup.string().required("Warehouse is required"),
    truck_no: yup.string().required("Truck Number is required"),
    turnmen_name: yup.string().required("Turnmen Name is required"),
    contact: yup
      .string()
      .required("Contact is required")
      .matches(/^[0-9]{10}$/, "Contact must be 10 digits"),
  });

  // ✅ HANDLE FORM FIELD CHANGES
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset BTR when region changes
    if (field === "region_id" && value !== form.region_id) {
      setForm((prev) => ({ ...prev, btr: "" }));
      setBtrOptions([]);
    }
  };

  // ✅ FETCH BTR OPTIONS BASED ON SELECTED REGION
  const fetchBtrData = async (value: string) => {
    console.log("Fetching BTR data for region:", form.region_id);
    if (!form.region_id) {
      setBtrOptions([]);
      return;
    }

    try {
      setLoadingBtr(true);
      const response = await getBtrByRegion(value);

      // Handle different response structures
      const btrData = response?.data?.data || response?.data || response || [];

      if (!Array.isArray(btrData)) {
        throw new Error("Invalid response format");
      }

      if (btrData.length === 0) {
        setBtrOptions([]);
        showSnackbar("No BTR found for this region", "info");
        return;
      }

      // Map API response to dropdown options
      const options = btrData.map((item: any) => ({
        value: item.osa_code || item.id?.toString() || "",
        label: item.osa_code || item.btr_name || item.name || "Unknown BTR",
      }));

      setBtrOptions(options);
      // showSnackbar(Found ${options.length} BTR(s) for selected region, "success");
    } catch (error: any) {
      console.error("Error fetching BTR:", error);
      setBtrOptions([]);
      showSnackbar(
        error?.message || "Failed to fetch BTR data",
        "error"
      );
    } finally {
      setLoadingBtr(false);
    }
  };


  // ✅ SUBMIT HANDLER
  const handleSubmit = async () => {
    try {
      await validationSchema.validate(form, { abortEarly: false });
      setErrors({});
      setSubmitting(true);

      const payload = {
        region_id: form.region_id,
        id: form.btr,
        warehouse_id: form.warehouse_id,
        truck_no: form.truck_no,
        turnmen_name: form.turnmen_name,
        contact: form.contact,
      };

      const res = await addAllocate(payload);

      if (res?.error) {
        showSnackbar(res.error || "Failed to submit form", "error");
        return;
      }

      showSnackbar("Bulk Transfer added successfully", "success");
      router.push("/chillerInstallation/bulkTransfer");
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
        showSnackbar("Please fix the form errors", "warning");
      } else {
        console.error("Submit error:", err);
        showSnackbar("Failed to add bulk transfer", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !warehouseAllOptions || !regionOptions) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/chillerInstallation/bulkTransfer">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            Add Bulk Transfer
          </h1>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* REGION DROPDOWN */}
            <div>
              <InputFields
                required
                label="Region"
                value={form.region_id}
                options={regionOptions}
               onChange={(e) => {
                console.log("Selected Region ID:", e.target.value);  // 👈 console log here
                handleChange("region_id", e.target.value);
                fetchBtrData(e.target.value);
              }}
              />
              {errors.region_id && (
                <p className="text-red-500 text-sm mt-1">{errors.region_id}</p>
              )}
            </div>

            {/* BTR DROPDOWN (Region-Dependent) */}
            <div>
              <InputFields
                required
                label="BTR"
                value={form.btr}
                options={btrOptions}
                onChange={(e) => handleChange("btr", e.target.value)}
                disabled={!form.region_id || loadingBtr}
                placeholder={
                  loadingBtr
                    ? "Loading BTR..."
                    : !form.region_id
                      ? "Select region first"
                      : "Select BTR"
                }
              />
              {errors.btr && (
                <p className="text-red-500 text-sm mt-1">{errors.btr}</p>
              )}
              {loadingBtr && (
                <p className="text-blue-500 text-xs mt-1">Loading BTR options...</p>
              )}
            </div>

            {/* WAREHOUSE DROPDOWN */}
            <div>
              <InputFields
                required
                label="Distributor"
                value={form.warehouse_id}
                options={warehouseAllOptions}
                onChange={(e) => handleChange("warehouse_id", e.target.value)}
              />
              {errors.warehouse_id && (
                <p className="text-red-500 text-sm mt-1">{errors.warehouse_id}</p>
              )}
            </div>

            {/* TRUCK NUMBER */}
            <div>
              <InputFields
                required
                label="Truck Number"
                value={form.truck_no}
                onChange={(e) => handleChange("truck_no", e.target.value)}
              />
              {errors.truck_no && (
                <p className="text-red-500 text-sm mt-1">{errors.truck_no}</p>
              )}
            </div>

            {/* TURNMEN NAME */}
            <div>
              <InputFields
                required
                label="Turnmen Name"
                value={form.turnmen_name}
                onChange={(e) => handleChange("turnmen_name", e.target.value)}
              />
              {errors.turnmen_name && (
                <p className="text-red-500 text-sm mt-1">{errors.turnmen_name}</p>
              )}
            </div>

            {/* CONTACT */}
            <div>
              <InputFields
                required
                label="Contact"
                value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="10 digit number"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          onClick={() => router.push("/chillerInstallation/bulkTransfer")}
          disabled={submitting}
        >
          Cancel
        </button>

        <SidebarBtn
          label={submitting ? "Submitting..." : "Submit"}
          isActive={!submitting}
          onClick={handleSubmit}
          disabled={submitting}
        />
      </div>
    </>
  );
}