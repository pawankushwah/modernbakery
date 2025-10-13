"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useRouter } from "next/navigation";
import DismissibleDropdown from "@/app/components/dismissibleDropdown";
import CustomDropdown from "@/app/components/customDropdown";
import BorderIconButton from "@/app/components/borderIconButton";
import Table, { listReturnType, TableDataType } from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import DeleteConfirmPopup from "@/app/components/deletePopUp";
import { useSnackbar } from "@/app/services/snackbarContext";
import { deleteShelves, complaintFeedbackList } from "@/app/services/merchandiserApi";
import { useLoading } from "@/app/services/loadingContext";

interface ComplaintFeedbackItem {
  id: number;
  feedback_title: string;
  merchendiser?: { id: number; name: string };
  item?: { id: number; item_code: string; item_name: string };
  type: string;
 
}

const dropdownDataList = [
  { icon: "lucide:radio", label: "Inactive", iconWidth: 20 },
  { icon: "lucide:delete", label: "Delete", iconWidth: 20 },
];

export default function ComplaintFeedback() {
  const { setLoading } = useLoading();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ComplaintFeedbackItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const handleConfirmDelete = async () => {
    if (selectedRow) {
      setLoading(true);
      const res = await deleteShelves(String(selectedRow.id));
      setLoading(false);
      if (res.error) {
        showSnackbar(res.data.message || "Failed to delete row", "error");
      } else {
        setRefreshKey(refreshKey + 1);
        showSnackbar(res.message || "Deleted successfully", "success");
      }
      setShowDeletePopup(false);
    }
  };

  const fetchComplaintFeedback = useCallback(
    async (pageNo: number = 1, pageSize: number = 10): Promise<listReturnType> => {
      setLoading(true);
      const res = await complaintFeedbackList({
        page: pageNo.toString(),
        per_page: pageSize.toString(),
      });
      setLoading(false);
console.log("feedback",res)
      if (res.error) {
        showSnackbar(res.data.message || "Failed to fetch complaint feedback", "error");
        throw new Error("Unable to fetch complaint feedback");
      } else {
        const apiData = res.data?.data || [];
        return {
          data: apiData,
          currentPage: res.data?.current_page || 1,
          pageSize: res.data?.per_page || pageSize,
          total: res.data?.total || 0,
        };
      }
    },
    []
  );

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <>
      {/* Table */}
      <div className="h-[calc(100%-60px)]">
        <Table
          refreshKey={refreshKey}
          config={{
            api: {
              list: fetchComplaintFeedback,
            },
            header: {
              title: "Complaint Feedback",
              wholeTableActions: [
                <div key={0} className="flex gap-[12px] relative">
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
                </div>,
              ],
              searchBar: false,
              columnFilter: true,
              actions: [
                <SidebarBtn
                  key="add"
                  href="/dashboard/merchandiser/complaintFeedback/add"
                  leadingIcon="lucide:plus"
                  label="Add Feedback"
                  labelTw="hidden lg:block"
                  isActive
                />,
              ],
            },
            localStorageKey: "complaint-feedback-table",
            footer: { nextPrevBtn: true, pagination: true },
            columns: [
              { key: "feedback_title", label: "Title" },
              {
                key: "merchendiser",
                label: "Merchandiser",
                render: (row: ComplaintFeedbackItem) => row.merchendiser?.name || "-",
              },
              {
                key: "item",
                label: "Item",
                render: (row: ComplaintFeedbackItem) =>
                  row.item
                    ? `${row.item.item_code} - ${row.item.item_name}`
                    : "-",
              },
              { key: "type", label: "Type" },
              { key: "description", label: "Description" },
             
            ],
            rowSelection: true,
            rowActions: [
              {
                icon: "lucide:eye",
                onClick: (data: object) => {
                  const row = data as ComplaintFeedbackItem;
                  router.push(`/dashboard/merchandiser/complaintFeedback/view/${row.id}`);
                },
              },
              {
                icon: "lucide:edit-2",
                onClick: (data: object) => {
                  const row = data as ComplaintFeedbackItem;
                  router.push(`/dashboard/merchandiser/complaintFeedback/${row.id}`);
                },
              },
              {
                icon: "lucide:trash-2",
                onClick: (data: object) => {
                  const row = data as ComplaintFeedbackItem;
                  setSelectedRow(row);
                  setShowDeletePopup(true);
                },
              },
            ],
            pageSize: 10,
          }}
        />
      </div>

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <DeleteConfirmPopup
            title="Complaint Feedback"
            onClose={() => setShowDeletePopup(false)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}
    </>
  );
}
