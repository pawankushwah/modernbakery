"use client";

import Table, {
    configType,
    listReturnType,
    TableDataType
} from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import StatusBtn from "@/app/components/statusBtn2";
import { salesmanLoadHeaderList } from "@/app/services/agentTransaction";
import { useLoading } from "@/app/services/loadingContext";
import { useSnackbar } from "@/app/services/snackbarContext"; // ✅ import snackbar
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface SalesmanLoadRow {
    osa_code?: string;
    warehouse?: {
        code?: string;
        name?: string;
    };
    route?: {
        code?: string;
        name?: string;
    };
    salesman?: {
        code?: string;
        name?: string;
    };
    projecttype?: {
        code?: string;
        name?: string;
    };
    is_confirmed?: boolean;
    salesman_type?: string;
    status?: boolean;
    uuid?: string;
}


export default function SalemanLoad() {
    const columns: configType["columns"] = [
        // { key: "osa_code", label: "Code" },
        {
            key: "warehouse",
            label: "Warehouse",
            render: (row: TableDataType) => {
                const salesmanRow = row as SalesmanLoadRow;
                return `${salesmanRow.warehouse?.code} - ${salesmanRow.warehouse?.name?.split("-")[0]} - (${salesmanRow.warehouse?.name?.split("-")[1]})` || "";
            }
        },
        {
            key: "route",
            label: "Route",
            render: (row: TableDataType) => {
                const salesmanRow = row as SalesmanLoadRow;
                return salesmanRow.route?.code || "";
            }
        },
        {
            key: "salesman",
            label: "Salesman",
            render: (row: TableDataType) => {
                const salesmanRow = row as SalesmanLoadRow;
                return `${salesmanRow.salesman?.code} - ${salesmanRow.salesman?.name}` || "";
            }
        },
        {
  key: "projecttype",
  label: "Salesman Role",
  render: (row: TableDataType) => {
    const s = row as SalesmanLoadRow;
    if (s.projecttype && typeof s.projecttype === "object") {
      const { code, name } = s.projecttype;
      if (code || name) {
        return `${code ?? ""}${code && name ? " - " : ""}${name ?? ""}`;
      }
    }
    return s.salesman_type || "-";
  },
},
        {
            key: "is_confirmed",
            label: "Status",
            render: (row: TableDataType) => {
                const salesmanRow = row as SalesmanLoadRow;

                return (
                    <StatusBtn
                        isActive={salesmanRow?.status ? true : false}
                    // label={salesmanRow.status?.toString() === "Pending" ? true : false }
                    />
                );
            },
        }

    ];

    const { setLoading } = useLoading();
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    type TableRow = TableDataType & { id?: string };

    const fetchSalesmanLoadHeader = useCallback(
        async (
            page: number = 1,
            pageSize: number = 50
        ): Promise<listReturnType> => {
            try {
                setLoading(true);
                const listRes = await salesmanLoadHeaderList({
                    // page: page.toString(),
                    // per_page: pageSize.toString(),
                });
                setLoading(false);
                return {
                    data: Array.isArray(listRes.data) ? listRes.data : [],
                    total: listRes?.pagination?.totalPages || 1,
                    currentPage: listRes?.pagination?.page || 1,
                    pageSize: listRes?.pagination?.limit || pageSize,
                };
            } catch (error: unknown) {
                setLoading(false);
                return {
                    data: [],
                    total: 1,
                    currentPage: 1,
                    pageSize: 5,
                };
            }
        }, [setLoading]);

    // const search = useCallback(
    //     async (
    //         searchQuery: string,
    //         pageSize: number,
    //         columnName?: string
    //     ): Promise<searchReturnType> => {
    //         let result;
    //         setLoading(true);
    //         if(columnName) {
    //             result = await agentCustomerList({
    //                 per_page: pageSize.toString(),
    //                 [columnName]: searchQuery
    //             });
    //         }
    //         setLoading(false);
    //         if (result.error) throw new Error(result.data.message);
    //         else {
    //             return {
    //                 data: result.data || [],
    //                 total: result.pagination.pagination.totalPages || 0,
    //                 currentPage: result.pagination.pagination.current_page || 0,
    //                 pageSize: result.pagination.pagination.limit || pageSize,
    //             };
    //         }
    //     },
    //     []
    // );

    useEffect(() => {
        setLoading(true);
    }, []);

    return (
        <>
            <div className="flex flex-col h-full">
                <Table
                    refreshKey={refreshKey}
                    config={{
                        api: {
                            list: fetchSalesmanLoadHeader,
                        },
                        header: {
                            title: "Salesman Load",
                            searchBar: false,
                            columnFilter: true,
                            actions: [
                                <SidebarBtn
                                    key={0}
                                    href="/salesmanLoad/add"
                                    isActive
                                    leadingIcon="lucide:plus"
                                    label="Add"
                                    labelTw="hidden sm:block"
                                />
                            ],
                        },
                        localStorageKey: "agentCustomer-table",
                        footer: { nextPrevBtn: true, pagination: true },
                        columns,
                        rowSelection: true,
                        rowActions: [
                            {
                                icon: "lucide:eye",
                                onClick: (data: object) => {
                                    const row = data as TableRow;
                                    router.push(`/salesmanLoad/details/${row.uuid}`);
                                },
                            },
                            // {
                            //     icon: "lucide:edit-2",
                            //     onClick: (data: object) => {
                            //         const row = data as TableRow;
                            //         router.push(
                            //             `/salesmanLoad/${row.uuid}`
                            //         );
                            //     },
                            // },
                        ],
                        pageSize: 50,
                    }}
                />
            </div>

            {/* {showDeletePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <DeleteConfirmPopup
                        title="Agent Customer"
                        onClose={() => setShowDeletePopup(false)}
                        onConfirm={handleConfirmDelete}
                    />
                </div>
            )} */}
        </>
    );
}
