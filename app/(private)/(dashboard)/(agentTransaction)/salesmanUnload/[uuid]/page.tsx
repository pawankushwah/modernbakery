"use client";

import ContainerCard from "@/app/components/containerCard";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import Table, { configType, TableDataType } from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import InputFields from "@/app/components/inputFields";
import Logo from "@/app/components/logo";
import {
    salesmanUnloadHeaderAdd,
    salesmanUnloadHeaderById,
    salesmanUnloadHeaderUpdate,
} from "@/app/services/agentTransaction";
import { itemList } from "@/app/services/allApi";
import { useLoading } from "@/app/services/loadingContext";
import { useSnackbar } from "@/app/services/snackbarContext";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

interface FormData {
    id: number,
    erp_code: string,
    item_code: string,
    name: string,
    description: string,
    uom: {
        id: number,
        item_id: number,
        uom_type: string,
        name: string,
        price: string,
        is_stock_keeping: boolean,
        upc: string,
        enable_for: string
    }[],
    brand: string,
    image: string,
    category: {
        id: number,
        name: string,
        code: string
    },
    itemSubCategory: {
        id: number,
        name: string,
        code: string
    },
    shelf_life: string,
    commodity_goods_code: string,
    excise_duty_code: string,
    status: number,
    is_taxable: boolean,
    has_excies: boolean,
    item_weight: string,
    volume: number
}

export default function AddEditSalesmanUnload() {
    const { salesmanTypeOptions, routeOptions, salesmanOptions, warehouseOptions, fetchRouteOptions, fetchSalesmanByRouteOptions } =
        useAllDropdownListData();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const { setLoading } = useLoading();
    const params = useParams();
    const unloadUUID = params?.uuid as string | undefined;
    const isEditMode = unloadUUID && unloadUUID !== "add";

    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        salesman_type: "",
        route_id: "",
        warehouse: "",
        salesman_id: "",
        project_type: "",
        unload_date: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [itemData, setItemData] = useState<TableDataType[]>([]);
    const [isItemsLoaded, setIsItemsLoaded] = useState(false);
    const [itemOptions, setItemsOptions] = useState();
    const [orderData, setOrderData] = useState<FormData[]>([]);

    // ✅ Load all items
    // ✅ Load all items
    useEffect(() => {
        if (!isItemsLoaded) {
            (async () => {
                try {
                    setLoading(true);
                    const res = await itemList({ page: "1" });
                    const data = res.data.map((item: any) => ({
                        id: item.id,
                        item_code: item.item_code,
                        name: item.name,
                        uoms: item.uom || [], // 👈 attach uoms
                        qty: "",
                        uom_id: "",
                    }));
                    setItemData(data);
                    setIsItemsLoaded(true);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [isItemsLoaded, setLoading]);


    // ✅ Fetch data for edit mode
    useEffect(() => {
        if (isEditMode && unloadUUID && isItemsLoaded) {
            (async () => {
                try {
                    setLoading(true);
                    const res = await salesmanUnloadHeaderById(String(unloadUUID));
                    console.log("res", res)
                    const data = res?.data ?? res;

                    setForm({
                        salesman_type: data?.salesman_type || "",
                        warehouse: data?.warehouse?.id.toString(),
                        route_id: data.route?.id?.toString() || "",
                        salesman_id: data?.salesman?.id?.toString() || "",
                        project_type:
                            data?.projecttype?.id?.toString() || data?.project_type || "",
                        unload_date: data?.unload_date || "",
                    });

                    if (data?.details && Array.isArray(data.details)) {
                        setItemData((prev) =>
                            prev.map((item) => {
                                const matched = data.details.find(
                                    (d: any) => d.item?.id === item.id
                                );
                                return matched
                                    ? {
                                        ...item,
                                        qty: matched.qty?.toString() || "",
                                        //   qty: matched.qty?.toString() || "",
                                    }
                                    : item;
                            })
                        );
                    }
                } catch {
                    showSnackbar("Failed to fetch details", "error");
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [isEditMode, unloadUUID, isItemsLoaded, setLoading, showSnackbar]);

    // ✅ Validation Schema
    const validationSchema = yup.object().shape({
        salesman_type: yup.string().required("Salesman Type is required"),
        route_id: yup.string().required("Route is required"),
        salesman_id: yup.string().required("Salesman is required"),
        unload_date: yup.string().required("Unload Date is required"),
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    // ✅ Handle Qty Change
    const handleQtyChange = (
        itemId: string | number,
        type: "qty" | "qty",
        value: string
    ) => {
        setItemData((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, [type]: value } : item
            )
        );
    };

    // ✅ Table Columns (Updated: Removed Available Stock)
    const columns: configType["columns"] = [
        {
            key: "item",
            label: "Item Code - Name",
            render: (row: TableDataType) => (
                <span>
                    {row.item_code && row.name
                        ? `${row.item_code} - ${row.name}`
                        : row.item_code || row.name || "-"}
                </span>
            ),
        },
        { key: "pcs", label: "PCS" },
        {
            key: "qty",
            label: "PCS Qty",
            render: (row: TableDataType) => {
                const currentItem = itemData.find((i) => i.id === row.id);
                return (
                    <div className="w-[100px]">
                        <input
                            type="number"
                            className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm text-center"
                            value={currentItem?.qty ?? ""}
                            onChange={(e) =>
                                handleQtyChange(row.id, "qty", e.target.value)
                            }
                        />
                    </div>
                );
            },
        },
        { key: "cse", label: "CSE" },
        {
            key: "qty",
            label: "Qty",
            render: (row: TableDataType) => {
                const currentItem = itemData.find((i) => i.id === row.id);
                return (
                    <div className="w-[100px]">
                        <input
                            type="number"
                            className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm text-center"
                            value={currentItem?.qty ?? ""}
                            onChange={(e) =>
                                handleQtyChange(row.id, "qty", e.target.value)
                            }
                        />
                    </div>
                );
            },
        },
    ];

    const recalculateItem = (index: number, field: string, value: string) => {
        const newData = [...itemData];
        newData[index][field] = value;
        setItemData(newData);
    };


    const fetchItem = async (searchTerm: string) => {
        const res = await itemList({ per_page: "10", name: searchTerm });
        if (res.error) {
            showSnackbar(res.data?.message || "Failed to fetch items", "error");

            return;
        }
        const data = res?.data || [];
        setOrderData(data);
        const options = data.map((item: { id: number; name: string; item_code: string; }) => ({
            value: String(item.id),
            label: `${item.item_code} - ${item.name}`
        }));
        setItemsOptions(options);

    };

    const handleRemoveItem = (index: number) => {
        if (itemData.length <= 1) {
            setItemData([
                {
                    item_id: "",
                    itemName: "",
                    UOM: "",
                    uom_id: "",
                    Quantity: "1",

                },
            ]);
            return;
        }
        setItemData(itemData.filter((_, i) => i !== index));
    };

    // ✅ Handle Submit
    const handleSubmit = async () => {
        try {
            await validationSchema.validate(form, { abortEarly: false });
            setErrors({});
            setSubmitting(true);

            const payload = {
                route_id: Number(form.route_id),
                salesman_type: form.salesman_type,
                warehouse_id: Number(form.warehouse),
                project_type: form.project_type,
                salesman_id: Number(form.salesman_id),
                unload_date: form.unload_date,
                details: itemData
                    .filter((i) => i.qty)
                    .map((i) => ({
                        item_id: i.id,
                        uom: i.uom_id ? Number(i.uom_id) : null,
                        qty: String(i.qty || "0"),
                    })),

            };

            const res = isEditMode
                ? await salesmanUnloadHeaderUpdate(unloadUUID, payload)
                : await salesmanUnloadHeaderAdd(payload);

            if (res?.error) {
                showSnackbar(res.data?.message || "Failed to submit form", "error");
            } else {
                showSnackbar(
                    isEditMode
                        ? "Salesman Unload updated successfully"
                        : "Salesman Unload added successfully",
                    "success"
                );
                router.push("/salesmanUnload");
            }
        } catch (err: any) {
            if (err instanceof yup.ValidationError) {
                const formErrors: Record<string, string> = {};
                err.inner.forEach((e) => {
                    if (e.path) formErrors[e.path] = e.message;
                });
                setErrors(formErrors);
            } else {
                console.error(err);
                showSnackbar("Failed to submit form", "error");
            }
        } finally {
            setSubmitting(false);
        }
    };
    //   console.log("form",form)

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/salesmanUnload">
                        <Icon icon="lucide:arrow-left" width={24} />
                    </Link>
                    <h1 className="text-xl font-semibold text-gray-900">
                        {isEditMode ? "Update Salesman Unload" : "Add Salesman Unload"}
                    </h1>
                </div>
            </div>
            <ContainerCard className="rounded-[10px] scrollbar-none">
                {/* --- Header Section --- */}
                <div className="flex justify-between mb-10 flex-wrap gap-[20px]">
                    <div className="flex flex-col gap-[10px]">
                        <Logo type="full" />
                        {/* <span className="text-primary font-normal text-[16px]">
                          Emma-Köhler-Allee 4c, Germering - 13907
                        </span> */}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[42px] uppercase text-[#A4A7AE] mb-[10px]">
                            Load
                        </span>
                        <span className="text-primary text-[14px] tracking-[10px]">
                            #L0201
                        </span>
                    </div>
                </div>
                <hr className="w-full text-[#D5D7DA]" />

                {/* --- Form Fields --- */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10 mb-10 flex-wrap">
                    <InputFields
                        label="Salesman Type"
                        name="salesman_type"
                        value={form.salesman_type}
                        options={[
                            { label: "Sales Executive-GT", value: "Sales Executive-GT" },
                            { label: "Salesman", value: "Salesman" },
                            { label: "Project", value: "Project" },
                        ]}
                        onChange={(e) => handleChange("salesman_type", e.target.value)}
                    />
                    {errors.salesman_type && (
                        <p className="text-red-500 text-sm mt-1">{errors.salesman_type}</p>
                    )}

                    {form.salesman_type === "Project" && (
                        <InputFields
                            label="Project List"
                            value={form.project_type}
                            options={salesmanTypeOptions}
                            onChange={(e) => handleChange("project_type", e.target.value)}
                        />
                    )}
                    <InputFields
                        label="Warehouse"
                        name="warehouse"
                        value={form.warehouse}
                        options={warehouseOptions}
                        onChange={(e) => {
                            const val = e.target.value;
                            handleChange("warehouse", val);
                            // Clear customer when warehouse changes
                            handleChange("route", "");
                            // Fetch customers for selected warehouse
                            if (val) {
                                fetchRouteOptions(val);
                            }
                        }
                        }
                    />
                    <InputFields
                        label="Route"
                        name="route"
                        value={form.route_id}
                        options={routeOptions}
                        onChange={(e) => {
                            const val = e.target.value;
                            handleChange("route_id", val);
                            // Clear customer when warehouse changes
                            handleChange("salesman", "");
                            // Fetch customers for selected warehouse
                            if (val) {
                                fetchSalesmanByRouteOptions(val);
                            }
                        }}
                    />
                    <InputFields
                        label="Salesman"
                        name="salesman_id"
                        value={form.salesman_id}
                        options={salesmanOptions}
                        onChange={(e) => handleChange("salesman_id", e.target.value)}
                    />
                </div>

                {/* --- Table --- */}
                <Table
                    data={itemData.map((row, idx) => ({ ...row, idx: idx.toString() }))}
                    config={{
                        table: { height: 500 },
                        columns: [
                            {
                                key: "item",
                                label: "Items",
                                render: (row: TableDataType) => {
                                    const currentItem = itemData.find((item) => item.id === row.id);
                                    return (
                                        <span>
                                            {row.item_code && row.name
                                                ? `${row.item_code} - ${row.name}`
                                                : row.item_code
                                                    ? row.item_code
                                                    : row.name
                                                        ? row.name
                                                        : "-"}
                                        </span>
                                    );
                                },
                            },
                            {
                                key: "UOM",
                                label: "UOM",
                                render: (row) => {
                                    const currentItem = itemData.find((item) => item.id === row.id);
                                        const uomOptions =
                                            Array.isArray(currentItem?.uoms)
                                                ? currentItem.uoms.map((u: any) => ({
                                                      label: u.name,
                                                      value: u.id.toString(),
                                                  }))
                                                : [];
    
                                        return (
                                            <InputFields
                                                label=""
                                                name="uom_id"
                                                value={row.uom_id || ""}
                                                options={uomOptions}
                                                onChange={(e) =>
                                                    recalculateItem(Number(row.idx), "uom_id", e.target.value)
                                                }
                                            />
                                        );
                                },
                            },
                            { key: "cse", label: "CSE" },
                            {
                                key: "Quantity",
                                label: "Qty",
                                render: (row) => (
                                    <InputFields
                                        label=""
                                        type="number"
                                        name="Quantity"
                                        value={row.Quantity}
                                        onChange={(e) =>
                                            recalculateItem(
                                                Number(row.idx),
                                                "Quantity",
                                                e.target.value
                                            )
                                        }
                                    />
                                ),
                            },
                            { key: "pcs", label: "PCS" },
                            {
                                key: "Quantity",
                                label: "Qty",
                                render: (row) => (
                                    <InputFields
                                        label=""
                                        type="number"
                                        name="Quantity"
                                        value={row.Quantity}
                                        onChange={(e) =>
                                            recalculateItem(
                                                Number(row.idx),
                                                "Quantity",
                                                e.target.value
                                            )
                                        }
                                    />
                                ),
                            },

                        ],
                    }}
                />

                {/* --- Summary --- */}
                <div className="flex justify-between text-primary gap-0 mb-10">
                    <div></div>
                    <div className="flex justify-between flex-wrap w-full">
                        <div className="flex flex-col justify-end gap-[20px] w-full lg:w-[400px]">

                        </div>
                    </div>
                </div>

                {/* --- Buttons --- */}
                <hr className="text-[#D5D7DA]" />
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => router.push("/salesmanLoad")}
                    >
                        Cancel
                    </button>
                    <SidebarBtn
                        isActive={true}
                        label="Create Order"
                        onClick={handleSubmit}
                    />
                </div>
            </ContainerCard>
        </>
    );
}
