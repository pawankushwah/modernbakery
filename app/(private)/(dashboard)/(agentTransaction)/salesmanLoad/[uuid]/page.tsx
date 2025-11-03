"use client";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as yup from "yup";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { useSnackbar } from "@/app/services/snackbarContext";
import CustomTable, { TableDataType } from "@/app/components/customTable";
import {
  getRouteById,
} from "@/app/services/allApi";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import { useLoading } from "@/app/services/loadingContext";
import ContainerCard from "@/app/components/containerCard";
import {
  salesmanLoadHeaderAdd,
  salesmanLoadHeaderUpdate,
} from "@/app/services/agentTransaction";

export default function AddEditSalesmanLoad() {
  const {
    salesmanTypeOptions,
    warehouseOptions,
    salesmanOptions,
    fetchRoutebySalesmanOptions,
    fetchSalesmanOptions,
    routeOptions,
    itemOptions,
  } = useAllDropdownListData();

  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();
  const params = useParams();
  const loadUUID = params?.uuid as string | undefined;
  const isEditMode = loadUUID !== undefined && loadUUID !== "add";

  const [submitting, setSubmitting] = useState(false);
  const [filteredOptions, setFilteredRouteOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [form, setForm] = useState({
    salesmanType: "",
    project_type: "",
    route: "",
    warehouse: "",
    salesman: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skeleton, setSkeleton] = useState(false);

  const [tableData, setTableData] = useState<TableDataType[]>([]);

  useEffect(() => {
    if (itemOptions && itemOptions.length > 0) {
      setTableData(
        itemOptions.map((item) => ({
          id: item.value,
          item: item.label,
          availableStock: "100", // Replace with actual stock data
          // uom: item.uom || [],
          cse: "",
        }))
      );
    }
  }, [itemOptions]);

  const handleCseChange = (id: string, value: string) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, cse: value } : row
      )
    );
  };

  useEffect(() => {
    if (isEditMode && loadUUID) {
      setLoading(true);
      (async () => {
        try {
          const res = await getRouteById(String(loadUUID));
          const data = res?.data ?? res;
          setForm({
            salesmanType: data?.salesmanType || "",
            project_type: data?.project_type || "",
            route: data?.route || "",
            warehouse: data?.warehouse || "",
            salesman: data?.salesman || "",
          });
          if (data?.warehouse) {
            await fetchSalesmanOptions(String(data.warehouse));
          }
        } catch {
          showSnackbar("Failed to fetch route details", "error");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEditMode, loadUUID]);

  const validationSchema = yup.object().shape({
    salesmanType: yup.string().required("Salesman Type is required"),
    warehouse: yup.string().required("Warehouse is required"),
    salesman: yup.string().required("Salesman is required"),
    route: yup.string().required("Route is required"),
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const fetchRoutesBySalesman = async (salesman: string) => {
    if (!salesman) {
      setFilteredRouteOptions([]);
      return;
    }
    setSkeleton(true);
    try {
      const res = await fetchRoutebySalesmanOptions(String(salesman));
      const normalize = (
        r: unknown
      ): { id?: string | number; route_code?: string; route_name?: string }[] => {
        if (r && typeof r === "object") {
          const obj = r as Record<string, unknown>;
          if (Array.isArray(obj.data)) return obj.data as any[];
        }
        if (Array.isArray(r)) return r as any[];
        return [];
      };
      const routes = normalize(res);
      const options = routes.map((r) => ({
        value: String(r.id ?? ""),
        label:
          r.route_code && r.route_name
            ? `${r.route_code} - ${r.route_name}`
            : r.route_name ?? "",
      }));
      setFilteredRouteOptions(options);
    } catch {
      setFilteredRouteOptions([]);
    } finally {
      setSkeleton(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(form, { abortEarly: false });
      setErrors({});

      // Validate qty (CSE)
      const invalidItems = tableData.filter((row) => {
        const cse = parseFloat(row.cse) || 0;
        const availableStock = parseFloat(row.availableStock) || 0;
        return cse > availableStock;
      });

      if (invalidItems.length > 0) {
        showSnackbar("Check the CSE values. CSE cannot exceed available stock.", "error");
        return;
      }

      setSubmitting(true);

      const details = tableData
        .filter((i) => i.cse && Number(i.cse) > 0)
        .map((i) => {
          const uomArray = typeof i.uom === "string" ? JSON.parse(i.uom) : i.uom;
          const uomId = Array.isArray(uomArray)
            ? (
                uomArray.find(
                  (u: { id: number | string; uom_type: string }) =>
                    u.uom_type === "secondary"
                )?.id || uomArray[0]?.id
              )
            : null;

          return {
            item_id: Number(i.id),
            uom: Number(uomId),
            qty: Number(i.cse),
            status: 1,
          };
        });

      const payload = {
        warehouse_id: Number(form.warehouse),
        route_id: Number(form.route),
        salesman_id: Number(form.salesman),
        salesmanType: String(form.salesmanType),
        project_type: Number(form.project_type),
        details,
      };

      let res;
      if (isEditMode && loadUUID) {
        res = await salesmanLoadHeaderUpdate(loadUUID, payload);
      } else {
        res = await salesmanLoadHeaderAdd(payload);
      }

      if (res?.error) {
        showSnackbar(res.data?.message || "Failed to submit form", "error");
      } else {
        showSnackbar(
          isEditMode
            ? "Salesman Load updated successfully"
            : "Salesman Load added successfully",
          "success"
        );
        router.push("/salesmanLoad");
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        showSnackbar(
          isEditMode ? "Failed to update Salesman Load" : "Failed to add Salesman Load",
          "error"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/salesmanLoad">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Update Salesman Load" : "Add Salesman Load"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <ContainerCard>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Salesman Load Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
                                       <InputFields
                                       required
                                       label="Salesman Type"
                                       value={form.salesmanType}
                                       options={[{ label: "Sales Executive-GT", value: "Sales Executive-GT" }, 
                                           { label: "Salesman", value: "Salesman", },
                                       { label: "Project", value: "Project", }]}
                                       onChange={(e) => handleChange("salesmanType", e.target.value)}
                                   />
                                   {errors.salesmanType && (
                                       <p className="text-red-500 text-sm mt-1">{errors.salesmanType}</p>
                                   )}
                                   </div>
                                   {form.salesmanType === "Project" && (
                                                     <div>
                                                       <InputFields
                                                         label="Project List"
                                                         name="project_type"
                                                         value={form.project_type || ""}
                                                         options={salesmanTypeOptions}
                                                         onChange={(e) => handleChange("project_type", e.target.value)}
                                                       />
                                                     </div>
                                                   )}
            <InputFields
              required
              label="Warehouse"
              value={form.warehouse}
              options={warehouseOptions}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("warehouse", val);
                handleChange("salesman", "");
                if (val) fetchSalesmanOptions(val);
              }}
            />
            <InputFields
              required
              label="Salesman"
              value={form.salesman}
              options={salesmanOptions}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("salesman", val);
                fetchRoutesBySalesman(val);
              }}
            />
            <InputFields
              required
              label="Route"
              value={form.route}
              options={routeOptions}
              onChange={(e) => handleChange("route", e.target.value)}
            />
          </div>
        </div>
      </ContainerCard>

      {/* Items Table */}
      <div className="mb-6">
        <CustomTable
          data={tableData}
          config={{
            header: { title: "Items" },
            columns: [
              { key: "item", label: "Item", showByDefault: true, width: 250 },
              {
                key: "availableStock",
                label: "Available Stock",
                showByDefault: true,
                width: 150,
              },
              {
                key: "cse",
                label: "CSE (Qty)",
                showByDefault: true,
                width: 150,
                render: (row) => {
                  const cse = parseFloat(row.cse) || 0;
                  const stock = parseFloat(row.availableStock) || 0;
                  const invalid = cse > stock;
                  return (
                    <div>
                      <input
                        type="number"
                        value={row.cse}
                        onChange={(e) =>
                          handleCseChange(row.id, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          invalid
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                        placeholder="Enter CSE"
                      />
                      {invalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Exceeds stock
                        </p>
                      )}
                    </div>
                  );
                },
              },
            ],
            footer: { pagination: false, nextPrevBtn: false },
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          onClick={() => router.push("/salesmanLoad")}
          disabled={submitting}
        >
          Cancel
        </button>
        <SidebarBtn
          label={
            submitting
              ? isEditMode
                ? "Updating..."
                : "Submitting..."
              : isEditMode
              ? "Update"
              : "Submit"
          }
          isActive={!submitting}
          leadingIcon="mdi:check"
          onClick={handleSubmit}
          disabled={submitting}
        />
      </div>
    </>
  );
}
