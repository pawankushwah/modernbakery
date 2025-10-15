"use client";

import BorderIconButton from "@/app/components/borderIconButton";
import { Icon } from "@iconify-icon/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDropdown from "@/app/components/customDropdown";
import Table, {
    listReturnType,
    TableDataType,
    searchReturnType
} from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { routeList, deleteRoute, routeGlobalSearch,exportRoutesCSV } from "@/app/services/allApi";
import DeleteConfirmPopup from "@/app/components/deletePopUp";
import { useSnackbar } from "@/app/services/snackbarContext";
import StatusBtn from "@/app/components/statusBtn2";
import { useLoading } from "@/app/services/loadingContext";
import { format } from "path";

const columns = [ { key: "route_code", label: "Route Code", render: (data: TableDataType) => ( <span className="font-semibold text-[#181D27] text-[14px]"> {data.route_code ? data.route_code : "-"} </span> ), },
    { key: "route_name", label: "Route Name", isSortable: true, render: (data: TableDataType) => data.route_name ? data.route_name : "-" },
     { key: "getrouteType", label: "Route Type", render: (data: TableDataType) => { const typeObj = data.getrouteType ? JSON.parse(JSON.stringify(data.getrouteType)) : null; return typeObj?.name ? typeObj.name : "-"; }, filter: { isFilterable: true, render: (data: TableDataType[]) => ( <> {data.map((row, index) => { const typeObj = row.route_Type ? JSON.parse(JSON.stringify(row.route_Type)) : null; return ( <div key={index} className="flex items-center gap-[8px] px-[14px] py-[10px] hover:bg-[#FAFAFA] text-[14px]" > <span className="font-[500] text-[#181D27]"> {typeObj?.route_type_name ? typeObj.route_type_name : "-"} </span> </div> ); })} </> ), }, width: 218, },
      { key: "warehouse", label: "Warehouse", width: 218, render: (data: TableDataType) => (typeof data.warehouse === "object" && data.warehouse !== null) ? (data.warehouse as { code?: string }).code : "-", filter: { isFilterable: true, render: (data: TableDataType[]) => ( <> {data.map((row, index) => ( <div key={index} className="flex items-center gap-[8px] px-[14px] py-[10px] hover:bg-[#FAFAFA] text-[14px]" > <span className="font-[500] text-[#181D27]"> {(typeof row.warehouse === "object" && row.warehouse !== null) ? (row.warehouse as { warehouse_name?: string }).warehouse_name : "-"} </span> </div> ))} </> ), }, }, 
      { key: "vehicle", label: "Vehicle", render: (data: TableDataType) => { const vehicleObj = typeof data.vehicle === "string" ? JSON.parse(data.vehicle) : data.vehicle; return vehicleObj?.code ? vehicleObj.code : "-"; }, }, { key: "status", label: "Status", render: (row: TableDataType) => ( <StatusBtn isActive={row.status && row.status.toString() === "1" ? true : false} /> ), }, ];

const dropdownDataList = [
    { icon: "lucide:radio", label: "Inactive", iconWidth: 20 },
    { icon: "lucide:delete", label: "Delete", iconWidth: 20 },
];

export default function Route() {
    const [selectedRowId, setSelectedRowId] = useState<number | undefined>();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { setLoading } = useLoading();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const fetchRoutes = async (pageNo: number = 1, pageSize: number = 10): Promise<listReturnType> => {
        try {
            const listRes = await routeList({
                page: pageNo.toString(),
                per_page: pageSize.toString(),
            });
            return {
                data: listRes.data || [],
                currentPage: listRes.pagination.page || pageNo,
                pageSize: listRes.pagination.limit || pageSize,
                total: listRes?.pagination.totalPages ?? 0,
            };
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const searchRoute = useCallback(async (searchQuery: string, pageSize: number = 10, columnName?: string): Promise<searchReturnType> => {
        setLoading(true);
        let result;
        if (columnName && columnName !== "") {
            result = await routeList({ per_page: pageSize.toString(), [columnName]: searchQuery });
        } else {
            result = await routeGlobalSearch({ search: searchQuery, per_page: pageSize.toString() });
        }
        setLoading(false);
        if (result.error) throw new Error(result.data.message);
        const pagination = result.pagination?.pagination || {};
        return {
            data: result.data || [],
            total: pagination.totalPages || 10,
            currentPage: pagination.page || 1,
            pageSize: pagination.limit || 10,
        };
    }, []);

    useEffect(() => {
        setLoading(true);
    }, []);

    const handleConfirmDelete = async () => {
        if (!selectedRowId) return;
        try {
            await deleteRoute(String(selectedRowId));
            showSnackbar("Route deleted successfully ✅", "success");
            await fetchRoutes();
        } catch (error) {
            console.error("Delete failed ❌:", error);
            showSnackbar("Failed to delete Route ❌", "error");
        } finally {
            setShowDeletePopup(false);
            setSelectedRowId(undefined);
        }
    };


const handleDownloadCSV = async () => {
  try {
    const blob = await exportRoutesCSV({ format: "csv" });
    if (!blob) {
      showSnackbar("No file received ❌", "error");
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "routes.csv"; // 👈 downloaded filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showSnackbar("Route exported successfully ✅", "success");
  } catch (error) {
    console.error("Export failed ❌:", error);
    showSnackbar("Failed to export Route ❌", "error");
  } finally {
    setShowDeletePopup(false);
    setSelectedRowId(undefined);
  }
};




   

           

          

    return (
        <>
            <div className="h-[calc(100%-60px)]">
                <Table
                    config={{
                        api: {
                            list: fetchRoutes,
                            search: searchRoute,
                        },
                        header: {
                            title: "Routes",
                               threeDot: [
               {
    icon: "gala:file-document",
    label: "Export CSV",
    labelTw: "text-[12px] hidden sm:block",
    onClick: handleDownloadCSV, // ✅ Add this
  },
                {
                  icon: "gala:file-document",
                  label: "Export Excel",
                  labelTw: "text-[12px] hidden sm:block",
                },
                {
                  icon: "lucide:radio",
                  label: "Inactive",
                  labelTw: "text-[12px] hidden sm:block",
                //   showOnSelect: true
                },
              ],
                            wholeTableActions: [
                                <div key={0} className="flex gap-[12px] relative">
                                    <BorderIconButton
                                        icon="ic:sharp-more-vert"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    />

                                    {showDropdown && (
                                        <div className="w-[226px] absolute top-[40px] right-0 z-30">
                                            <CustomDropdown>
                                                {dropdownDataList.map((link, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-[14px] py-[10px] flex items-center gap-[8px] hover:bg-[#FAFAFA]"
                                                    >
                                                        <Icon icon={link.icon} width={link.iconWidth} className="text-[#717680]" />
                                                        <span className="text-[#181D27] font-[500] text-[16px]">
                                                            {link.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </CustomDropdown>
                                        </div>
                                    )}
                                </div>
                            ],
                            searchBar: true,
                            columnFilter: true,
                            actions: [
                                <SidebarBtn
                                    key={0}
                                    href="/route/add"
                                    isActive={true}
                                    leadingIcon="lucide:plus"
                                    label="Add"
                                    labelTw="hidden sm:block"
                                />,
                                // <SidebarBtn
                                //     key={1}
                                //     leadingIcon="lucide:download"
                                //     onClick={handleDownloadCSV}
                                //     label="Download CSV"
                                //     labelTw="hidden sm:block"
                                // />
                            ],
                        },
                        localStorageKey: "route-table",
                        footer: {
                            nextPrevBtn: true,
                            pagination: true,
                        },
                        columns: columns,
                        rowSelection: true,
                        rowActions: [
                            {
                                icon: "lucide:edit-2",
                                onClick: (data: TableDataType) => {
                                    router.push(`/route/${data.id}`);
                                },
                            },
                        ],
                        pageSize: 10,
                    }}
                />
            </div>

            {showDeletePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <DeleteConfirmPopup
                        title="Route"
                        onClose={() => setShowDeletePopup(false)}
                        onConfirm={handleConfirmDelete}
                    />
                </div>
            )}
        </>
    );
}
