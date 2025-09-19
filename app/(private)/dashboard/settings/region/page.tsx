// "use client";

// import { useState, useEffect } from "react";
// import { Icon } from "@iconify-icon/react";
// import BorderIconButton from "@/app/components/borderIconButton";
// import CustomDropdown from "@/app/components/customDropdown";
// import Table, { TableDataType } from "@/app/components/customTable";
// import SidebarBtn from "@/app/components/dashboardSidebarBtn";
// import DismissibleDropdown from "@/app/components/dismissibleDropdown";
// import Loading from "@/app/components/Loading";
// import { regionList, deleteRegion } from "@/app/services/allApi";
// import { useSnackbar } from "@/app/services/snackbarContext";
// import { useParams, useRouter } from "next/navigation";
// import DeleteConfirmPopup from "@/app/components/deletePopUp";

// // -----------------------
// // Types
// // -----------------------
// interface RegionAPIItem {
//   id: number | string;
//   region_code: string;
//   region_name: string;
//   status: number;
// }

// interface Region extends TableDataType {
//   id: string;
//   region_code: string;
//   region_name: string;
//    country_name: string;
//   status: "Active" | "Inactive";
// }

// // -----------------------
// // Table columns
// // -----------------------
// const columns = [
//   { key: "region_code", label: "Region Code" },
//   { key: "region_name", label: "Region Name" },
//   { key: "country_name", label: "country_name" },
//   { key: "status", label: "Status" },
// ];


// // -----------------------
// // Component
// // -----------------------
// export default function RegionPage() {
//   const [regions, setRegions] = useState<Region[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<Region | null>(null);
//   const router = useRouter();
//   const { showSnackbar } = useSnackbar();

//   // -----------------------
//   // Fetch regions
//   // -----------------------
//   useEffect(() => {
//     const fetchRegions = async () => {
//       try {
//         const res = await regionList();
//         if (res.status && Array.isArray(res.data)) {
//         const mappedData: Region[] = res.data.map((item: any) => ({
//   id: item.id.toString(),
//   region_code: item.region_code,
//   region_name: item.region_name,
//   country_name: item.country?.country_name || "", // ✅ fixed
//   status: item.status === 1 ? "Active" : "Inactive",
// }));

//           setRegions(mappedData);
//         } else {
//           setRegions([]);
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//         setRegions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRegions();
//   }, []);

//   // -----------------------
//   // Confirm delete
//   // -----------------------
//   const handleConfirmDelete = async () => {
//     if (!selectedRow?.id) return;
//     const idToDelete = String(selectedRow.id);
//     setDeletingId(idToDelete);

//     try {
//       const res = await deleteRegion(idToDelete);
//       if (res?.status) {
//         setRegions((prev) =>
//           prev.filter((item) => String(item.id) !== idToDelete)
//         );
//         showSnackbar("Region deleted successfully ✅", "success");
//       } else {
//         showSnackbar("Failed to delete region ❌", "error");
//       }
//     } catch (error) {
//       console.error("Delete failed:", error);
//       showSnackbar("Error deleting region ❌", "error");
//     } finally {
//       setShowDeletePopup(false);
//       setSelectedRow(null);
//       setDeletingId(null);
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className="h-full p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-semibold text-gray-900">Regions</h1>

//         <div className="flex gap-2 relative">
//           <BorderIconButton icon="gala:file-document" label="Export CSV" />
//           <BorderIconButton icon="mage:upload" />
//           <DismissibleDropdown
//             isOpen={showDropdown}
//             setIsOpen={setShowDropdown}
//             button={<BorderIconButton icon="ic:sharp-more-vert" />}
//             dropdown={
//               <div className="absolute top-[40px] right-0 z-30 w-[226px]">
//                 <CustomDropdown>
//                   <div className="px-4 py-2 flex items-center gap-2 text-gray-600">
//                     <Icon icon="lucide:delete" width={20} />
//                     <span>Bulk Delete</span>
//                   </div>
//                 </CustomDropdown>
//               </div>
//             }
//           />
//         </div>
//       </div>

//       {/* Table */}
//      <Table
//   key={regions.length}   // 👈 ye ensure karega har delete/add ke baad re-render
//   data={regions}
//   config={{
//     header: {
//       searchBar: true,
//       columnFilter: true,
//       actions: [
//         <SidebarBtn
//           key={0}
//           href="/dashboard/settings/region/add"
//           isActive
//           leadingIcon="lucide:plus"
//           label="Add Region"
//           labelTw="hidden sm:block"
//         />,
//       ],
//     },
//     footer: { nextPrevBtn: true, pagination: true },
//     columns,
//     rowSelection: true,
//     rowActions: [
//        {
//                 icon: "lucide:edit-2",
//                 onClick: (data: object) => {
//                   const row = data as TableRow;
//                   router.push(
//                     `/dashboard/settings/region/update_region/${row.id}`
//                   );
//                 },
//               },
//       {
//         icon: "lucide:trash-2",
//         onClick: (row) => {
//           setSelectedRow(row as Region);
//           setShowDeletePopup(true);
//         },
//       },
//     ],
//     pageSize: 10,
//   }}
// />


//       {/* Delete confirmation popup */}
//       {showDeletePopup && selectedRow && (
//         <DeleteConfirmPopup
//           isOpen={showDeletePopup}
//           onClose={() => setShowDeletePopup(false)}
//           onConfirm={handleConfirmDelete}
//           title="Delete Region"
//           description={`Are you sure you want to delete region "${selectedRow.region_name}"?`}
//           loading={deletingId === String(selectedRow.id)}
//         />
//       )}
//     </div>
//   );
// }
