"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { useRouter, useSearchParams } from "next/navigation";

import BorderIconButton from "@/app/components/borderIconButton";
import CustomDropdown from "@/app/components/customDropdown";
import Table, { TableDataType } from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { routeTypeList, deleteRouteTypeById } from "@/app/services/allApi";
import Loading from "@/app/components/Loading";
import DismissibleDropdown from "@/app/components/dismissibleDropdown";
import DeleteConfirmPopup from "@/app/components/deletePopUp";
import { useSnackbar } from "@/app/services/snackbarContext";

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
  { key: "route_type_code", label: "Route Type Code" },
  { key: "route_type_name", label: "Route Type Name" },
  { key: "status", label: "Status" },
];

export default function RouteType() {
  interface RouteTypeItem {
    id?: number | string;
    route_type_code?: string;
    route_type_name?: string;
    status?: number; // 1 = Active, 0 = Inactive
  }

  const [routeType, setRouteType] = useState<RouteTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RouteTypeItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const updated = searchParams.get("updated"); // detect if redirected after update
  const { showSnackbar } = useSnackbar();

  type TableRow = TableDataType & { id?: string };

  const tableData: TableDataType[] = routeType.map((item) => ({
    id: String(item.id ?? ""),
    route_type_code: item.route_type_code ?? "",
    route_type_name: item.route_type_name ?? "",
    status: item.status === 1 ? "Active" : "Inactive",
  }));

  useEffect(() => {
    const fetchRouteTypes = async () => {
      setLoading(true);
      try {
        const res = await routeTypeList({});
        setRouteType(res.data);
      } catch (error) {
        console.error("API Error:", error);
        showSnackbar("Failed to fetch Route Types", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRouteTypes();
  }, [updated]); // refetch automatically after update

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return;
    const idToDelete = String(selectedRow.id);
    setDeletingId(idToDelete);

    try {
      await deleteRouteTypeById(idToDelete);
      setRouteType((prev) =>
        prev.filter((item) => String(item.id) !== idToDelete)
      );
      showSnackbar("Route Type deleted successfully", "success");
    } catch (error) {
      console.error("Delete failed:", error);
      showSnackbar("Failed to delete Route Type", "error");
    } finally {
      setShowDeletePopup(false);
      setSelectedRow(null);
      setDeletingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-semibold text-[#181D27] h-[30px] flex items-center leading-[30px] mb-[1px]">
          Route Type
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
                  href="/dashboard/settings/routetype/add"
                  isActive
                  leadingIcon="lucide:plus"
                  label="Add Route Type"
                  labelTw="hidden sm:block"
                />,
              ],
            },
            footer: { nextPrevBtn: true, pagination: true },
            columns,
            rowSelection: true,
            rowActions: [
              { icon: "lucide:eye" },
              {
                icon: "lucide:edit-2",
                onClick: (data: object) => {
                  const row = data as TableRow;
                  router.push(
                    `/dashboard/settings/routetype/update_routetype/${row.id}`
                  );
                },
              },
              {
                icon: "lucide:trash",
                onClick: (data: object) => {
                  const row = data as TableRow;
                  if (deletingId === String(row.id)) return;
                  setSelectedRow({ id: String(row.id) });
                  setShowDeletePopup(true);
                },
              },
            ],
            pageSize: 10,
          }}
        />
      </div>

      {/* Delete popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <DeleteConfirmPopup
            title="Route Type"
            onClose={() => setShowDeletePopup(false)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}
    </>
  );
}
