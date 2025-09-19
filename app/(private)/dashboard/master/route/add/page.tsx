"use client";

import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useState } from "react";
import * as yup from "yup";
import { addRoutes } from "@/app/services/allApi";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import SettingPopUp from "@/app/components/settingPopUp";
import IconButton from "@/app/components/iconButton";
export default function Route() {
  const [isOpen, setIsOpen] = useState(false);
  const [routeCode, setRouteCode] = useState("");
  const [routeName, setRouteName] = useState("");
  const [routeType, setRouteType] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const schema = yup.object().shape({
    route_code: yup.string().required("Route code is required").max(10),
    route_name: yup.string().required("Route name is required").max(100),
    warehouse: yup.number().required("Warehouse is required").typeError("Warehouse must be a number"),
    route_type: yup.number().required("Route type is required").typeError("Route type must be a number"),
    status: yup.number().required("Status is required").oneOf([0, 1, 2], "Invalid status"),
  });

  const clearErrors = () => setErrors({});

  const handleSubmit = async () => {
    clearErrors();
    type AddRoutePayload = {
      route_code?: string;
      route_name?: string;
      warehouse?: number | undefined;
      route_type?: number | undefined;
      status?: number | undefined;
      description:string;
    };

    const payload: AddRoutePayload = {
      route_code: routeCode,
      route_name: routeName,
      warehouse: warehouse ? Number(warehouse) : undefined,
      route_type: routeType ? Number(routeType) : undefined,
      status: status ? (status === "active" ? 1 : status === "inactive" ? 0 : Number(status)) : undefined,
      description:description
    };

    try {
      setSubmitting(true);
      const res = await addRoutes(payload);
      setSubmitting(false);
    } catch (err: unknown) {
      setSubmitting(false);
      if (err instanceof yup.ValidationError && Array.isArray(err.inner)) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        console.error(err);
      }
    }
  };


  return (
    <>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/master/route">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            Add New Route
          </h1>
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6">

          {/* Route Details */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Route Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-end gap-2 max-w-[406px]">
                <InputFields
                  label="Route Code"
                  value={routeCode}
                  onChange={(e) => setRouteCode(e.target.value)}
                />
                {errors.route_code && (
                  <p className="text-red-500 text-sm mt-1">{errors.route_code}</p>
                )}

                <IconButton bgClass="white" className="mb-2 cursor-pointer text-[#252B37]"
                  icon="mi:settings"
                  onClick={() => setIsOpen(true)}
                />

                <SettingPopUp
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  title="Route Code"
                />
              </div>

              <div>
                <InputFields
                  label="Route Name"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                />
                {errors.route_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.route_name}</p>
                )}
              </div>
              <div>
                <InputFields
                  label="Route Type"
                  value={routeType}
                  onChange={(e) => setRouteType(e.target.value)}
                  options={[
                    { value: "1", label: "Route 1" },
                    { value: "2", label: "Route 2" },
                    { value: "3", label: "Route 3" },
                  ]}
                />
                {errors.route_type && (
                  <p className="text-red-500 text-sm mt-1">{errors.route_type}</p>
                )}

              </div>
            </div>
          </div>
        </div>
        {/* Location Information */}
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Location Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <InputFields
                  label="Warehouse"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  options={[
                    { value: "1", label: "warehouse A" },
                    { value: "2", label: "warehouse B" },
                    { value: "3", label: "warehouse C" },
                  ]}
                />
                {errors.warehouse && (
                  <p className="text-red-500 text-sm mt-1">{errors.warehouse}</p>
                )}
              </div>

            </div>
          </div>
        </div>
        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 ">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                <InputFields
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
               
              </div>
              <div>
                <InputFields
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "In Active" },
                  ]}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6  pr-0">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <SidebarBtn
            label={submitting ? "Submitting..." : "Submit"}
            isActive={!submitting}
            leadingIcon="mdi:check"
            onClick={handleSubmit}
            disabled={submitting}
          />
        </div>
      </div>

    </>
  );
}