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
import { allPaymentList } from "@/app/services/allApi";
import { useSnackbar } from "@/app/services/snackbarContext";
import { useLoading } from "@/app/services/loadingContext";

interface Payment {
  id: number;
  uuid: string;
  osa_code: string;
  payment_type: number;
  payment_type_text: string;
  companybank_id: number;
  account_number: number;
  bank_name: string;
  branch: string;
  agent_id: number | null;
  Agent_bank_name: string | null;
  bank_account_number: string | null;
  amount: number;
  recipt_no: string;
  recipt_date: string;
  recipt_image: string | null;
  cheque_no: string | null;
  cheque_date: string | null;
  status: number;
}

export default function PaymentListPage() {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const columns: configType["columns"] = [
    { key: "osa_code", label: "OSA Code", showByDefault: true },
    { key: "payment_type_text", label: "Payment Type", showByDefault: true },
    { key: "bank_name", label: "Bank Name", showByDefault: true },
    { key: "branch", label: "Branch", showByDefault: true },
    { key: "account_number", label: "Account Number", showByDefault: true },
    { key: "amount", label: "Amount", showByDefault: true },
    { key: "recipt_no", label: "Receipt Number", showByDefault: true },
    { key: "recipt_date", label: "Receipt Date", showByDefault: true },
    {
      key: "Agent_bank_name",
      label: "Agent Bank",
      showByDefault: true,
      render: (row: TableDataType) => {
        return row.Agent_bank_name || "-";
      },
    },
    {
      key: "bank_account_number",
      label: "Agent Account",
      showByDefault: false,
      render: (row: TableDataType) => {
        return row.bank_account_number || "-";
      },
    },
    {
      key: "cheque_no",
      label: "Cheque Number",
      showByDefault: false,
      render: (row: TableDataType) => {
        return row.cheque_no || "-";
      },
    },
    {
      key: "cheque_date",
      label: "Cheque Date",
      showByDefault: false,
      render: (row: TableDataType) => {
        return row.cheque_date || "-";
      },
    },
    {
      key: "status",
      label: "Status",
      showByDefault: true,
      render: (row: TableDataType) => {
        // ✅ ADDED: Render status properly
        const isActive = row.status == "1" || row.status === "active";
        return <StatusBtn isActive={isActive} />;
      },
    },
  ];

  const { setLoading } = useLoading();
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  type TableRow = TableDataType & { uuid?: string };

  const fetchPayments = useCallback(
    async (
      page: number = 1,
      pageSize: number = 50
    ): Promise<listReturnType> => {
      try {
        setLoading(true);

        const listRes = await allPaymentList({
          page,
          limit: pageSize,
        });

        console.log("Payments API Response:", listRes);

        setLoading(false);

        // Handle API response based on your API structure
        if (listRes?.status === "success" || listRes?.success === true) {
          return {
            data: Array.isArray(listRes.data) ? listRes.data : [],
            total:
              listRes?.pagination?.totalPages ||
              listRes?.pagination?.totalRecords ||
              1,
            currentPage: listRes?.pagination?.page || page,
            pageSize: listRes?.pagination?.limit || pageSize,
          };
        } else {
          showSnackbar(
            listRes?.message || "Failed to fetch payment data",
            "error"
          );
          return {
            data: [],
            total: 1,
            currentPage: page,
            pageSize: pageSize,
          };
        }
      } catch (error: unknown) {
        setLoading(false);
        console.error("Error fetching payment data:", error);
        showSnackbar("Error fetching payment data", "error");
        return {
          data: [],
          total: 1,
          currentPage: page,
          pageSize: pageSize,
        };
      }
    },
    [setLoading, showSnackbar]
  );

  useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  const refreshTable = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Table
          refreshKey={refreshKey}
          config={{
            api: { list: fetchPayments },
            header: {
              title: "Advance Payments",
              searchBar: false,
              columnFilter: true,
              actions: [
                <SidebarBtn
                  key={0}
                  href="/advancePayment/add"
                  isActive
                  leadingIcon="lucide:plus"
                  label="Add"
                  labelTw="hidden sm:block"
                />,
              ],
            },
            localStorageKey: "payment-table",
            footer: { nextPrevBtn: true, pagination: true },
            columns,
            rowSelection: true,
            rowActions: [
              // {
              //   icon: "lucide:edit-2",
              //   onClick: (data: object) => {
              //     const row = data as TableRow;
              //     router.push(`/advancePayment/${row.uuid}`);
              //   },
              // },
              {
                icon: "lucide:eye",
                onClick: (data: object) => {
                  const row = data as TableRow;
                  router.push(`/advancePayment/details/${row.uuid}`);
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
