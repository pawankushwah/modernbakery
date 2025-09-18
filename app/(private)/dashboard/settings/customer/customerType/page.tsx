"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { useRouter } from "next/navigation";

import BorderIconButton from "@/app/components/borderIconButton";
import CustomDropdown from "@/app/components/customDropdown";
import Table, { TableDataType } from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import Loading from "@/app/components/Loading";
import DismissibleDropdown from "@/app/components/dismissibleDropdown";
import DeleteConfirmPopup from "@/app/components/deletePopUp";
import { useSnackbar } from "@/app/services/snackbarContext";
import { customerTypeList, deleteCustomerType } from "@/app/services/allApi";

interface CustomerType {
  id: string;
  code: string;
  name: string;
  status: string;
  [key: string]: string;
}

interface DropdownItem {
  icon: string;
  label: string;
  iconWidth: number;
}

const dropdownDataList: DropdownItem[] = [
  { icon: "lucide:layout", label: "SAP", iconWidth: 20 },
  { icon: "lucide:download", label: "Download QR Code", iconWidth: 20 },
  { icon: "lucide:printer", label: "Print QR Code", iconWidth: 20 },
  { icon: "lucide:radio", label: "Inactive", iconWidth: 20 },
  { icon: "lucide:delete", label: "Delete", iconWidth: 20 },
];

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
];

export default function Customer() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);

  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const listRes = await customerTypeList();
        const formatted: CustomerType[] = (listRes.data || []).map((c: CustomerType) => ({
          ...c,
          status: c.status === "active" ? "Active" : "Inactive",
        }));
        setCustomers(formatted);
      } catch (error: unknown) {
        console.error("API Error:", error);
        setCustomers([]); // fallback empty list
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async () => {
    if (!selectedCustomer?.id) return;

    try {
      await deleteCustomerType(selectedCustomer.id);
      showSnackbar("Customer deleted successfully ✅", "success");
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
    } catch (error) {
      console.error("Delete failed ❌", error);
      showSnackbar("Failed to delete customer ❌", "error");
    } finally {
      setShowDeletePopup(false);
      setSelectedCustomer(null);
    }
  };

  const tableData: TableDataType[] = customers.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    status: c.status,
  }));

  return loading ? (
    <Loading />
  ) : (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-semibold text-[#181D27] h-[30px] flex items-center leading-[30px] mb-[1px]">
          Customer Type
        </h1>

        <div className="flex gap-[12px] relative">
          <BorderIconButton icon="gala:file-document" label="Export CSV" />
          <BorderIconButton icon="mage:upload" />

          <DismissibleDropdown
            isOpen={showDropdown}
            setIsOpen={setShowDropdown}
            button={<BorderIconButton icon="ic:sharp-more-vert" />}
            dropdown={
              <div className="absolute top-[40px] right-0 z-30 w-[226px]">
                <CustomDropdown>
                  {dropdownDataList.map((link, idx) => (
                    <div
                      key={idx}
                      className="px-[14px] py-[10px] flex items-center gap-[8px] hover:bg-[#FAFAFA]"
                    >
                      <Icon
                        icon={link.icon}
                        width={link.iconWidth}
                        className="text-[#717680]"
                      />
                      <span className="text-[#181D27] font-[500] text-[16px]">
                        {link.label}
                      </span>
                    </div>
                  ))}
                </CustomDropdown>
              </div>
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="h-[calc(100%-60px)]">
        <Table
          data={tableData}
          config={{
            header: {
              searchBar: true,
              columnFilter: true,
              actions: [
                <SidebarBtn
                  key={0}
                  href="/dashboard/settings/customer/customerType/add"
                  isActive
                  leadingIcon="lucide:plus"
                  label="Add Customer Type"
                  labelTw="hidden sm:block"
                />,
              ],
            },
            pageSize: 5,
            footer: { nextPrevBtn: true, pagination: true },
            columns,
            rowSelection: true,
            rowActions: [
              {
                icon: "lucide:eye",
                onClick: (row: object) => {
                  const r = row as TableDataType;
                  router.push(`/dashboard/settings/customer/customerType/view/${r.id}`);
                },
              },
              {
                icon: "lucide:edit-2",
                onClick: (row: object) => {
                  const r = row as TableDataType;
                  router.push(`/dashboard/settings/customer/customerType/updateCustomerType/${r.id}`);
                },
              },
              {
                icon: "lucide:more-vertical",
                onClick: (row: object) => {
                  const r = row as TableDataType;
                  setSelectedCustomer({ id: r.id, code: r.code, name: r.name, status: r.status });
                  setShowDeletePopup(true);
                },
              },
            ],
          }}
        />
      </div>

      {/* Delete Popup */}
      {showDeletePopup && selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <DeleteConfirmPopup
            title={`Delete Customer "${selectedCustomer.name}"?`}
            onClose={() => setShowDeletePopup(false)}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </>
  );
}
