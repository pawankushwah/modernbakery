"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StatusBtn from "@/app/components/statusBtn2";
import Table, {
    configType,
    listReturnType,
    TableDataType,
} from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { authUserList} from "@/app/services/allApi";
import { useSnackbar } from "@/app/services/snackbarContext";
import { useLoading } from "@/app/services/loadingContext";

export default function User() {
    const [selectedUser, setSelectedUser] = useState<string>("");
    const columns: configType["columns"] = [
    { key: "outlet_name", label: "Outlet Name", showByDefault: true },
    { key: "owner_name", label: "Owner Name" },
    { key: "landmark", label: "Landmark" },
    { key: "district", label: "District" },
    { key: "street", label: "Street" },
    { key: "town", label: "Town" },
    { key: "contact_no", label: "Contact No." },
    { key: "whatsapp_no", label: "Whatsapp No." },
    { key: "buyertype", label: "Buyer Type", render: (row: TableDataType) => (row.buyertype === "0" ? "B2B" : "B2C") },
    { key: "payment_type", label: "Payment Type" },
    {
        key: "status",
        label: "Status",
        render: (row: TableDataType) => {
            // Treat status 1 or 'active' (case-insensitive) as active
            const isActive =
                String(row.status) === "1" ||
                (typeof row.status === "string" &&
                    row.status.toLowerCase() === "active");
            return <StatusBtn isActive={isActive} />;
        },
        showByDefault: true,
    },
    ];

    const { setLoading } = useLoading();
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    type TableRow = TableDataType & { id?: string };

    const fetchUser = useCallback(
        async (
            page: number = 1,
            pageSize: number = 50
        ): Promise<listReturnType> => {
            try {
                setLoading(true);
                // const params: any = {
                //     page: page.toString(),
                // };
                const listRes = await authUserList({});
                setLoading(false);
                return {
                    data: Array.isArray(listRes.data) ? listRes.data : [],
                    total: listRes?.pagination?.totalPages || 1,
                    currentPage: listRes?.pagination?.page || 1,
                    pageSize: listRes?.pagination?.limit || pageSize,
                };
            } catch (error: unknown) {
                setLoading(false);
                showSnackbar("Error fetching user data", "error");
                return {
                    data: [],
                    total: 1,
                    currentPage: 1,
                    pageSize: 50,
                };
            }
        },
        [selectedUser, setLoading]
    );

    useEffect(() => {
        setLoading(true);
    }, []);

    return (
        <>
            <div className="flex flex-col h-full">
                <Table
                    refreshKey={refreshKey}
                    config={{
                        api: { list: fetchUser },
                        header: {
                            title: "Users",
                            searchBar: false,
                            columnFilter: true,
                            actions: [
                                <SidebarBtn
                                    key={0}
                                    href="/settings/user/add"
                                    isActive
                                    leadingIcon="lucide:plus"
                                    label="Add"
                                    labelTw="hidden sm:block"
                                />,
                            ],
                        },
                        localStorageKey: "user-table",
                        footer: { nextPrevBtn: true, pagination: true },
                        columns,
                        rowSelection: true,
                        rowActions: [
                            // {
                            //     icon: "lucide:eye",
                            //     onClick: (data: object) => {
                            //         const row = data as TableRow;
                            //         router.push(`/agentCustomer/details/${row.uuid}`);
                            //     },
                            // },
                            {
                                icon: "lucide:edit-2",
                                onClick: (data: object) => {
                                    const row = data as TableRow;
                                    router.push(
                                        `/agentCustomer/${row.uuid}`
                                    );
                                },
                            },
                        ],
                        pageSize: 50,
                    }}
                />
            </div>
        </>
    );
}
