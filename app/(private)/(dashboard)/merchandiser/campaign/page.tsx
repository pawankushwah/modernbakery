"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify-icon/react";

import Table, { TableDataType } from "@/app/components/customTable";
import DismissibleDropdown from "@/app/components/dismissibleDropdown";
import BorderIconButton from "@/app/components/borderIconButton";
import CustomDropdown from "@/app/components/customDropdown";

import { useSnackbar } from "@/app/services/snackbarContext";
import { useLoading } from "@/app/services/loadingContext";
import { campaignInformationList,exportCompaignData } from "@/app/services/merchandiserApi";
import { div } from "framer-motion/client";



const dropdownDataList = [
  { icon: "lucide:radio", label: "Inactive", iconWidth: 20 },
  { icon: "lucide:delete", label: "Delete", iconWidth: 20 },
];

export default function CampaignPage() {
  const { setLoading } = useLoading();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  // ✅ Fetch Table Data
  const fetchComplaintFeedback = useCallback(
    async (pageNo = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const res = await campaignInformationList({
          page: String(pageNo),
          per_page: String(pageSize),
        });
        setLoading(false);

        const dataArray: TableDataType[] = Array.isArray(res?.data)
          ? res.data
          : [];
        const pagination = res?.pagination;

        return {
          data: dataArray,
          currentPage: pagination.current_page,
          pageSize: pagination.per_page,
          total: pagination.last_page,
        };
      } catch (err) {
        setLoading(false);
        showSnackbar("Failed to fetch campaign list", "error");
        console.error(err);
        return {
          data: [] as TableDataType[],
          currentPage: 1,
          pageSize,
          total: 0,
        };
      }
    },
    [setLoading, showSnackbar]
  );

  const handleExport = async (fileType: "csv" | "xlsx") => {
    try {
      setLoading(true);

      const res = await exportCompaignData({ file_type: fileType });
      console.log("Export API Response:", res);

      let downloadUrl = "";

      if (res?.url && res.url.startsWith("blob:")) {
        downloadUrl = res.url;
      } else if (res?.url && res.url.startsWith("http")) {
        downloadUrl = res.url;
      } else if (typeof res === "string" && res.includes(",")) {
        const blob = new Blob([res], {
          type:
            fileType === "csv"
              ? "text/csv;charset=utf-8;"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        downloadUrl = URL.createObjectURL(blob);
      } else {
        showSnackbar("No valid file or URL returned from server", "error");
        return;
      }

      // ⬇️ Trigger browser download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `campaign_export.${fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar(
        `Download started for ${fileType.toUpperCase()} file`,
        "success"
      );
    } catch (error) {
      console.error("Export error:", error);
      showSnackbar("Failed to export campaign data", "error");
    } finally {
      setLoading(false);
      setShowExportDropdown(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[20px] font-semibold text-[#181D27]">Campaigns Information</h1>

        {/* Export & Options */}
        <div className="flex gap-2 relative">
          {/* Export Button */}
          <div className="relative">
            <BorderIconButton
              icon="gala:file-document"
              label="Export"
              labelTw="text-[12px] hidden sm:block"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
            />

            {showExportDropdown && (
              <div className="absolute top-full right-0 mt-2 z-30 bg-white border border-gray-200 rounded-md shadow-lg inline-block min-w-max">
                <div className="py-1">
                  <button
                    className="text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleExport("csv")}
                  >
                    CSV
                  </button>
                  <hr />
                  <button
                    className="text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleExport("xlsx")}
                  >
                    XLSX
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Options Dropdown */}
          <DismissibleDropdown
            isOpen={showDropdown}
            setIsOpen={setShowDropdown}
            button={<BorderIconButton icon="ic:sharp-more-vert" />}
            dropdown={
              <div className="absolute top-full right-0 mt-2 z-30 w-[226px] bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1">
                  {dropdownDataList.map((link, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Icon
                        icon={link.icon}
                        width={link.iconWidth}
                        className="text-gray-500"
                      />
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="h-[calc(100%-60px)]">
        <Table
          refreshKey={refreshKey}
          config={{
            api: { list: fetchComplaintFeedback },
            header: {
              searchBar: false,
              columnFilter: true,
              actions: [
                // <SidebarBtn
                //   key="add"
                //   href="/merchandiser/complaintFeedback/add"
                //   leadingIcon="lucide:plus"
                //   label="Add Feedback"
                //   labelTw="hidden lg:block"
                //   isActive
                // />,

              ],
            },
            footer: { nextPrevBtn: true, pagination: true },
            columns: [
              { key: "code", label: "Campaign Code" },
              {
                key: "merchendiser",
                label: "Merchandiser",
                render: (row) =>
                  typeof row.merchendiser === "object" &&
                  row.merchendiser !== null &&
                  "name" in row.merchendiser
                    ? (row.merchendiser as { name?: string })?.name || "-"
                    : "-",
              },
              {
                key: "customer",
                label: "Customer",
                render: (row) =>
                  typeof row.customer === "object" &&
                  row.customer !== null &&
                  "owner_name" in row.customer
                    ? (row.customer as { owner_name?: string })?.owner_name ||
                      "-"
                    : "-",
              },
              { key: "feedback", label: "Feedback" },
            ],
            rowSelection: true,
            pageSize: 10,
          }}
        />
      </div>
    </div>
  );
}
