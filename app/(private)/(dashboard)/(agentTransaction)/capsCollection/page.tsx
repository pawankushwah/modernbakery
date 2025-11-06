"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StatusBtn from "@/app/components/statusBtn2";
import Table, {
    configType,
    listReturnType,
    searchReturnType,
    TableDataType,
} from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { capsCollectionList,exportCapsCollection,capsCollectionStatusUpdate} from "@/app/services/agentTransaction";
import { downloadFile } from "@/app/services/allApi";
import { useSnackbar } from "@/app/services/snackbarContext"; // ✅ import snackbar
import { useLoading } from "@/app/services/loadingContext";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";

export default function SalemanLoad() {
    const columns: configType["columns"] = [
        { key: "code", label: "Code" },
        // { key: "date", label: "Collection Date" },
        { key: "warehouse_code", label: "Warehouse Code" },
        { key: "warehouse_name", label: "Warehouse Name" },
        { key: "salesman_code", label: "Salesman Code" },
        { key: "salesman_name", label: "Salesman Name" },
        { key: "route_code", label: "Route Code" },
        { key: "route_name", label: "Route Name" },
        { key: "customer", label: "Customer" },
        {
            key: "status",
            label: "Status",
            render: (row: TableDataType) => {
                return row.status ? "Confirmed" : "Waiting";
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
                const listRes = await capsCollectionList({
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

    const exportFile = async () => {
             try {
               const response = await exportCapsCollection(); 
               if (response && typeof response === 'object' && response.url) {
                await downloadFile(response.url);
                 showSnackbar("File downloaded successfully ", "success");
               } else {
                 showSnackbar("Failed to get download URL", "error");
               }
             } catch (error) {
               showSnackbar("Failed to download warehouse data", "error");
             } finally {
             }
           };
    
               const statusUpdate = async (
                 dataOrIds: TableRow[] | (string | number)[] | undefined,
                 selectedRowOrStatus?: number[] | number
               ) => {
                 try {
                   // normalize to an array of UUIDs and determine status
                   if (!dataOrIds || dataOrIds.length === 0) {
                     showSnackbar("No CAPS Collection selected", "error");
                     return;
                   }
           
                   let selectedRowsData: (string | number)[] = [];
                   let status: number | undefined;
           
                   const first = dataOrIds[0];
                   // if first element is an object, treat dataOrIds as WarehouseRow[] and selectedRowOrStatus as selected indexes
                   if (typeof first === "object") {
                     const data = dataOrIds as TableRow[];
                     const selectedRow = selectedRowOrStatus as number[] | undefined;
                     if (!selectedRow || selectedRow.length === 0) {
                       showSnackbar("No CAPS Collection selected", "error");
                       return;
                     }
                     selectedRowsData = data
                       .filter((row: TableRow, index) => selectedRow.includes(index))
                       .map((row: TableRow) => row.uuid || row.id)
                       .filter((id) => id !== undefined) as (string | number)[];
                     status = typeof selectedRowOrStatus === "number" ? selectedRowOrStatus : 0;
                   } else {
                     // otherwise treat dataOrIds as an array of UUIDs
                     const ids = dataOrIds as (string | number)[];
                     if (ids.length === 0) {
                       showSnackbar("No CAPS Collection selected", "error");
                       return;
                     }
                     selectedRowsData = ids;
                     status = typeof selectedRowOrStatus === "number" ? selectedRowOrStatus : 0;
                   }
           
                   if (selectedRowsData.length === 0) {
                     showSnackbar("No CAPS Collection selected", "error");
                     return;
                   }
           
                   const response = await capsCollectionStatusUpdate({ cap_ids: selectedRowsData, status: status ?? 0 });
                   
                   // Check if response has error
                   if (response?.error || response?.message?.includes("error") || response?.errors) {
                     const errorMessage = response?.message || response?.data?.message || "Failed to update CAPS Collection status";
                     showSnackbar(errorMessage, "error");
                     return;
                   }
                   
                   setRefreshKey((k) => k + 1);
                   showSnackbar("CAPS Collection status updated successfully", "success");
                 } catch (error: any) {
                   const errorMessage = error?.response?.data?.message || error?.message || "Failed to update CAPS Collection status";
                   showSnackbar(errorMessage, "error");
                 }
               };

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
                             threeDot: [
                {
                  icon: "gala:file-document",
                  label: "Export CSV",
                  labelTw: "text-[12px] hidden sm:block",
                  onClick: exportFile,
                },
                {
                  icon: "gala:file-document",
                  label: "Export Excel",
                  labelTw: "text-[12px] hidden sm:block",
                  onClick: exportFile,

                },
                // {
                //   icon: "lucide:radio",
                //   label: "Inactive",
                //   labelTw: "text-[12px] hidden sm:block",
                //   showOnSelect: true,
                //   onClick: (data: TableRow[], selectedRow?: number[]) => {
                //     statusUpdate(data, selectedRow);
                // },
                //   // onClick: statusUpdate,
                // },
                 {
                                    icon: "lucide:radio",
                                    label: "Inactive",
                                    showWhen: (data: TableDataType[], selectedRow?: number[]) => {
                                        if(!selectedRow || selectedRow.length === 0) return false;
                                        const status = selectedRow?.map((id) => data[id].status).map(String);
                                        return status?.includes("1") || false;
                                    },
                                    onClick: (data: TableDataType[], selectedRow?: number[]) => {
                                        const status: string[] = [];
                                        const ids = selectedRow?.map((id) => {
                                            const currentStatus = data[id].status;
                                            if(!status.includes(currentStatus)){
                                                status.push(currentStatus);
                                            }
                                            return data[id].uuid || data[id].id;
                                        })
                                        statusUpdate(ids, Number(0));
                                    },
                                },
                                {
                                    icon: "lucide:radio",
                                    label: "Active",
                                    // showOnSelect: true,
                                    showWhen: (data: TableDataType[], selectedRow?: number[]) => {
                                        if(!selectedRow || selectedRow.length === 0) return false;
                                        const status = selectedRow?.map((id) => data[id].status).map(String);
                                        return status?.includes("0") || false;
                                    },
                                    onClick: (data: TableDataType[], selectedRow?: number[]) => {
                                        const status: string[] = [];
                                        const ids = selectedRow?.map((id) => {
                                            const currentStatus = data[id].status;
                                            if(!status.includes(currentStatus)){
                                                status.push(currentStatus);
                                            }
                                            return data[id].uuid || data[id].id;
                                        })
                                        statusUpdate(ids, Number(1));
                                    },
                                },
              ],
                            title: "CAPS Master Collection",
                            searchBar: false,
                            columnFilter: true,
                            actions: [
                                <SidebarBtn
                                    key={0}
                                    href="/capsCollection/add"
                                    isActive
                                    leadingIcon="lucide:plus"
                                    label="Add"
                                    labelTw="hidden sm:block"
                                />
                            ],
                        },
                        footer: { nextPrevBtn: true, pagination: true },
                        columns,
                        rowSelection: true,
                        rowActions: [
                            {
                                icon: "lucide:eye",
                                onClick: (data: object) => {
                                    const row = data as TableRow;
                                    router.push(`/capsCollection/details/${row.uuid}`);
                                },
                            },
                            // {
                            //     icon: "lucide:edit-2",
                            //     onClick: (data: object) => {
                            //         const row = data as TableRow;
                            //         router.push(
                            //             `/capsCollection/${row.uuid}`
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
