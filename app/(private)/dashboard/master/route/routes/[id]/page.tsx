"use client";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import IconButton from "@/app/components/iconButton";
import SettingPopUp from "@/app/components/settingPopUp";
import { useSnackbar } from "@/app/services/snackbarContext";
import { getRouteById, updateRoute } from "@/app/services/allApi";

const RouteSchema = Yup.object().shape({
  route_code: Yup.string().required("Route Code is required."),
  route_name: Yup.string().required("Route Name is required."),
  description: Yup.string().nullable(),
  warehouse: Yup.number().required("Warehouse is required."),
  route_type: Yup.number().required("Route Type is required."),
  vehicle_id: Yup.number().required("Vehicle is required."),
  status: Yup.mixed().required("Status is required."),
});

export default function EditRoute() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const params = useParams();
  const routeId = params?.id ?? "";
  const queryId = searchParams.get("id") || routeId || "";

  const [fetched, setFetched] = useState<null | {
    route_code?: string;
    route_name?: string;
    description?: string;
    warehouse?: number | string;
    route_type?: number | string;
    vehicle_id?: number | string;
    status?: number | string;
  }>(null);

  useEffect(() => {
    if (!queryId) return;
    let mounted = true;
    (async () => {
        try {
        const res = await getRouteById(String(queryId));
        const data = res?.data ?? res;
        if (!mounted) return;
        setFetched({
          route_code: data?.route_code,
          route_name: data?.route_name,
          description: data?.description,
          warehouse: data?.warehouse,
          route_type: data?.route_type,
          vehicle_id: data?.vehicle_id,
          status: data?.status,
        });
      } catch (err: unknown) {
        console.error("Failed to fetch route by id", err);
      } finally {
      }
    })();
    return () => { mounted = false; };
  }, [queryId]);

  const [isOpen, setIsOpen] = useState(false);

  type RouteFormValues = {
    route_code: string;
    route_name: string;
    warehouse: string;
    route_type: string;
    status: string;
  };

  const initialValues: RouteFormValues = {
    route_code: fetched?.route_code ?? "",
    route_name: fetched?.route_name ?? "",
    warehouse: fetched?.warehouse ? String(fetched?.warehouse) : "",
    route_type: fetched?.route_type ? String(fetched?.route_type) : "",
    status: fetched?.status ? String(fetched?.status) : "",
  };

  const handleSubmit = async (values: RouteFormValues) => {
    if (!queryId) return;
      try {
      type UpdateRoutePayload = {
        route_code?: string;
        route_name?: string;
        warehouse?: number;
        route_type?: number;
        status?: number;
      };

      const payload: UpdateRoutePayload = {
        route_code: values.route_code,
        route_name: values.route_name,
        warehouse: values.warehouse ? Number(values.warehouse) : undefined,
        route_type: values.route_type ? Number(values.route_type) : undefined,
        status: values.status === "active" ? 1 : values.status === "inactive" ? 0 : Number(values.status),
      };

      await updateRoute(String(queryId), payload);
      showSnackbar("Route updated successfully", "success");
      router.push("/dashboard/master/route");
    } catch (error) {
      console.error("Failed to update route:", error);
      showSnackbar("Failed to update route", "error");
    }
  };

  return (
    <div className="w-full h-full overflow-x-hidden p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/master/route">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Edit Route</h1>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={RouteSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Route Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-end gap-2 max-w-[406px]">
                    <div className="w-full">
                      <InputFields
                        label="Route Code"
                        value={values.route_code}
                        onChange={(e) => setFieldValue("route_code", e.target.value)}
                      />
                      <ErrorMessage name="route_code" component="span" className="text-xs text-red-500" />
                    </div>
                    <IconButton
                      bgClass="white"
                      className="mb-2 cursor-pointer text-[#252B37]"
                      icon="mi:settings"
                      onClick={() => setIsOpen(true)}
                    />
                    <SettingPopUp isOpen={isOpen} onClose={() => setIsOpen(false)} title="Route Code" />
                  </div>

                  <div>
                    <InputFields label="Route Name" value={values.route_name} onChange={(e) => setFieldValue("route_name", e.target.value)} />
                    <ErrorMessage name="route_name" component="span" className="text-xs text-red-500" />
                  </div>

                  <div>
                    <InputFields
                      label="Route Type"
                      value={values.route_type}
                      onChange={(e) => setFieldValue("route_type", e.target.value)}
                      options={[{ value: "1", label: "Route 1" }, { value: "2", label: "Route 2" }, { value: "3", label: "Route 3" }]}
                    />
                    <ErrorMessage name="route_type" component="span" className="text-xs text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Location Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <InputFields
                      label="Warehouse"
                      value={values.warehouse}
                      onChange={(e) => setFieldValue("warehouse", e.target.value)}
                      options={[{ value: "1", label: "warehouse A" }, { value: "2", label: "warehouse B" }, { value: "3", label: "warehouse C" }]}
                    />
                    <ErrorMessage name="warehouse" component="span" className="text-xs text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <InputFields label="Status" value={values.status} onChange={(e) => setFieldValue("status", e.target.value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "In Active" }]} />
                    <ErrorMessage name="status" component="span" className="text-xs text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6 pr-0">
              <button type="reset" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
              <SidebarBtn label="Update" isActive={true} leadingIcon="mdi:check" type="submit" />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}