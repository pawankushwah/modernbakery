"use client";

import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useLoading } from "@/app/services/loadingContext";
import { useSnackbar } from "@/app/services/snackbarContext";

interface ExportButtonProps {
  startDate?: string;
  endDate?: string;
}

export default function ExportButton({ startDate = "2025-08-09", endDate = "2025-08-11" }: ExportButtonProps) {
  const { setLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const [showPopup, setShowPopup] = useState(false);

  const handleExport = async (format: "csv" | "xlsx") => {
    setShowPopup(false);
    const url = `https://api.coreexl.com/osa_productionV2/public/api/merchendisher/campagin-info/exportfile?start_date=${startDate}&end_date=${endDate}&format=${format}`;

    try {
      setLoading(true);
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `campaign_${startDate}_to_${endDate}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      showSnackbar(`${format.toUpperCase()} downloaded successfully!`, "success");
    } catch (err) {
      console.error(err);
      showSnackbar(`Failed to download ${format.toUpperCase()}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Export Button */}
      <div
        onClick={() => setShowPopup(true)}
        className="w-[113px] h-[34px] flex items-center justify-center gap-2 rounded-[8px] border border-[#D5D7DA] bg-white text-black px-[10px] py-2 cursor-pointer hover:bg-gray-50"
      >
        <Icon icon="lucide:download" width={18} />
        Export
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-lg p-4 w-[250px] flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()} // prevent closing on click inside
          >
            <h3 className="text-lg font-semibold">Select Format</h3>
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleExport("csv")}
            >
              CSV
            </button>
            <button
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => handleExport("xlsx")}
            >
              XLSX
            </button>
            <button
              className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
