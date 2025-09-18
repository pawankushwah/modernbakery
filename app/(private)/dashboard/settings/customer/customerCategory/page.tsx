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
import { customerCategoryList, deleteCustomerType } from "@/app/services/allApi";

interface CustomerCategory {
  id: string;
  outlet_channel_id: string;
  customer_category_code: string;
  customer_category_name: string;
  status: string;
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
    { key: "outlet_channel_id", label: "ID", hidden: true },
  { key: "customer_category_code", label: "Code" },
  { key: "customer_category_name", label: "Name" },
  { key: "status", label: "Status" },
];

export default function CustomerCategoryPage() {
  const [categories, setCategories] = useState<CustomerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CustomerCategory | null>(null);

  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const listRes = await customerCategoryList();
        const formatted: CustomerCategory[] = (listRes.data || []).map((c: any) => ({
          id: c.id,
            outlet_channel_id: c.outlet_channel_id,
          customer_category_code: c.customer_category_code,
          customer_category_name: c.customer_category_name,
          status: c.status === "active" ? "Active" : "Inactive",
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("API Error:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!selectedCategory?.id) return;

    try {
      await deleteCustomerType(selectedCategory.id);
      showSnackbar("Customer Category deleted ✅", "success");
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
    } catch (error) {
      console.error("Delete failed ❌", error);
      showSnackbar("Failed to delete category ❌", "error");
    } finally {
      setShowDeletePopup(false);
      setSelectedCategory(null);
    }
  };

  const tableData: TableDataType[] = categories.map((c) => ({
    id: c.id,
    outlet_channel_id: c.outlet_channel_id,
    customer_category_code: c.customer_category_code,
    customer_category_name: c.customer_category_name,
    status: c.status,
  }));

  return loading ? (
    <Loading />
  ) : (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-semibold text-[#181D27]">Customer Category</h1>

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
                      <Icon icon={link.icon} width={link.iconWidth} className="text-[#717680]" />
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
                  href="/dashboard/settings/customer/customerCategory/add"
                  isActive
                  leadingIcon="lucide:plus"
                  label="Add Category"
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
                  router.push(`/dashboard/settings/customer/customerCategory/view/${r.id}`);
                },
              },
              {
                icon: "lucide:edit-2",
                onClick: (row: object) => {
                  const r = row as TableDataType;
                  router.push(`/dashboard/settings/customer/customerCategory/update/${r.id}`);
                },
              },
              {
                icon: "lucide:more-vertical",
                onClick: (row: object) => {
                  const r = row as TableDataType;
                  const category = categories.find((c) => c.id === r.id) || null;
                  setSelectedCategory(category);
                  setShowDeletePopup(true);
                },
              },
            ],
          }}
        />
      </div>

      {/* Delete Popup */}
      {showDeletePopup && selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <DeleteConfirmPopup
            title={`Delete Category "${selectedCategory.customer_category_name}"?`}
            onClose={() => setShowDeletePopup(false)}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </>
  );
}
