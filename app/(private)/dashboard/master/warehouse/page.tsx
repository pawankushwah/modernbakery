"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import BorderIconButton from "@/app/components/borderIconButton";
import CustomDropdown from "@/app/components/customDropdown";
import Table, { TableDataType } from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { getWarehouse ,deleteWarehouse} from "@/app/services/allApi";
import Loading from "@/app/components/Loading";
import DismissibleDropdown from "@/app/components/dismissibleDropdown";
import DeleteConfirmPopup from "@/app/components/deletePopUp";
import { useSnackbar } from "@/app/services/snackbarContext";

const dropdownDataList = [
  { icon: "lucide:layout", label: "SAP", iconWidth: 20 },
  { icon: "lucide:download", label: "Download QR Code", iconWidth: 20 },
  { icon: "lucide:printer", label: "Print QR Code", iconWidth: 20 },
  { icon: "lucide:radio", label: "Inactive", iconWidth: 20 },
  { icon: "lucide:delete", label: "Delete", iconWidth: 20 },
];

// Move WarehouseRow type above columns so it is in scope
type WarehouseRow = TableDataType & {
  id?:string;
  code?: string;
  warehouseName?: string;
  tin_no?: string;
  ownerName?: string;
  owner_email?: string;
  ownerContact?: string;
  warehouse_type?: string;
  business_type?: string;
  warehouse_manager?: string;
  warehouse_manager_contact?: string;
  district?: string;
  street?: string;
  branch_id?: string;
  town_village?: string;
  region?: {region_name?:string;}
  get_company_customer?: {owner_name?:string};
  city?: string;
  location?: string;
  landmark?: string;
  latitude?: string;
  longitude?: string;
  threshold_radius?: string;
  device_no?: string;
  is_branch?: string;
  p12_file?: string;
  is_efris?: string;
  stock_capital?: string;
  deposite_amount?: string;
  phoneNumber?: string;
  address?: string;
  status?: string | boolean | number;
  company_customer_id?: string;
  region_id?: string;
  area_name?: string;
};

const columns = [
  { key: "registation_no", label: "Registration No." },
  { key: "code", label: "Warehouse Code" },
  { key: "warehouseName", label: "Warehouse Name" },
  { key: "tin_no", label: "TIN No" },
  { key: "ownerName", label: "Owner Name" },
  { key: "ownerContact", label: "Owner Contact No." },
  { key: "owner_email", label: "Owner Email" },
  // { key: "depotName", label: "Depot Name" },
  { key: "depotLocation", label: "Warehouse Location" },
  { key: "company_customer_id", label: "Customer"},
  {
    label: 'Customer',
    key: 'company_customer_id',
    render: (row: WarehouseRow) => row.company_customer_id || '-',
  },
  { key: "warehouse_manager", label: "Warehouse Manager"},
  { key: "warehouse_manager_contact", label: "Warehouse Manager Contact"},
  { key: "warehouse_type", label: "Warehouse Type"},
  { key: "business_type", label: "Business Type"},
  // { key: "region_id", label: "Region"},
  {
    label: 'Region',
    key: 'region_id',
    render: (row: WarehouseRow) => row.region_id || '-',
  },
  {
    label: 'Sub Region',
    key: 'area_name',
    render: (row: WarehouseRow) => row.area_name || '-',
  },
  // { key: "sub_region_id", label: "Sub Region"},
  { key: "city", label: "City"},
  { key: "district", label: "District" },
  { key: "location", label: "Location" },
  { key: "address", label: "Address" },
  { key: "town_village", label: "Town" },
  { key: "street", label: "Street" },
  { key: "landmark", label: "Landmark" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
  { key: "threshold_radius", label: "Threshold Radius" },
  { key: "stock_capital", label: "Stock Capital" },
  { key: "deposite_amount", label: "Deposit Amount" },
  { key: "device_no", label: "Device No." },
  { key: "p12_file", label: "P12 File" },
  { key: "branch_id", label: "Branch" },
  { key: "is_efris", label: "EFRIS" },
  {
    key: "status",
    label: "Status",
    render: (row: TableDataType) => (
      <div className="flex items-center">
        {row.status ? (
          <span className="text-sm text-[#027A48] bg-[#ECFDF3] font-[500] p-1 px-4 rounded-xl text-[12px]">
            Active
          </span>
        ) : (
          <span className="text-sm text-red-700 bg-red-200 p-1 px-4 rounded-xl text-[12px]">
            Inactive
          </span>
        )}
      </div>
    ),
  },
];

export default function Warehouse() {
  const [warehouses, setWarehouses] = useState<TableDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  type TableRow = TableDataType & { id?: string };
    // typed row for warehouse table
    type WarehouseRow = TableDataType & {
      id?:string;
      code?: string;
      warehouseName?: string;
      tin_no?: string;
      ownerName?: string;
      owner_email?: string;
      ownerContact?: string;
      warehouse_type?: string;
      business_type?: string;
      // depotName?: string;
      warehouse_manager?: string;
      warehouse_manager_contact?: string;
      district?: string;
      street?: string;
      branch_id?: string;
      town_village?: string;
      region?: {region_name?:string;}
      get_company_customer?: {owner_name?:string};
      city?: string;
      location?: string;
      landmark?: string;
      latitude?: string;
      longitude?: string;
      threshold_radius?: string;
      device_no?: string;
      is_branch?: string;
      p12_file?: string;
      is_efris?: string;
      stock_capital?: string;
      deposite_amount?: string;
      // depotLocation?: string;
      // depotLocation?: string;
      phoneNumber?: string;
      address?: string;
      
      status?: string | boolean | number;
    };

    const [selectedRow, setSelectedRow] = useState<WarehouseRow | null>(null);
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
 
    const fetchWarehouses = async () => {
      try {
        const res = await getWarehouse();
        interface ApiWarehouse {
          id?: number | string;
          registation_no?: string;
          warehouse_code?: string;
          tin_no?: string;
          warehouse_manager?: string;
      warehouse_manager_contact?: string;
      area?:{area_name:string;}
      region?: {region_name?:string;};
          warehouse_name?: string;
          business_type?: string;
          get_company_customer?: {owner_name?:string};
          district?: string;
          is_efris?: string;
          latitude?: string;
          branch_id?: string;
          p12_file?: string;
          street?: string;
          town_village?: string;
          warehouse_type?: string;
          owner_name?: string;
          owner_email?: string;
          threshold_radius?: string;
          landmark?: string;
          ownerContact?: string;
          deposite_amount?: string;
          stock_capital?: string;
          
          location?: string;
          owner_number?: string;
          address?: string;
          device_no?: string;
          city?: string;
          longitude?: string;
          status?: number;
        }

        const mapped = (res.data || []).map((item: ApiWarehouse) => {
          let warehouseTypeLabel = "";
          const warehouseTypeStr = item.warehouse_type != null ? String(item.warehouse_type) : "";
          if (warehouseTypeStr === "0") warehouseTypeLabel = "Agent";
          else if (warehouseTypeStr === "1") warehouseTypeLabel = "Hariss";
          else if (warehouseTypeStr === "2") warehouseTypeLabel = "Outlet";
          else warehouseTypeLabel = warehouseTypeStr;
          return {
            id: item.id,
            registation_no: item.registation_no ?? "",
            code: item.warehouse_code ?? "",
            warehouseName: item.warehouse_name ?? "",
            tin_no: item.tin_no ?? "",
            ownerName: item.owner_name ?? "-",
            ownerContact: item.owner_number ?? "-",
            owner_email: item.owner_email ?? "-",
            // depotName: item.branch_id?.toString() ?? "",
            depotLocation: item.location ?? "",
            company_customer_id: item.get_company_customer?.owner_name ?? "-",
            warehouse_type: warehouseTypeLabel,
            // business_type: item.business_type ?? "",
            business_type:  "B2B",
            region_id: item.region?.region_name ?? "",
            area_name: item.area?.area_name ?? "",
            warehouse_manager: item.warehouse_manager ?? "",
            warehouse_manager_contact: item.warehouse_manager_contact ?? "",
            phoneNumber: item.owner_number ?? "",
            address: item.address ?? "",
            city: item.city ?? "",
            district: item.district ?? "",
            location: item.location ?? "",
            town_village: item.town_village ?? "",
            street: item.street ?? "",
            landmark: item.landmark ?? "",
            latitude: item.latitude ?? "",
            longitude: item.longitude ?? "",
            threshold_radius: item.threshold_radius ?? "",
            stock_capital: item.stock_capital ?? "",
            deposite_amount: item.deposite_amount ?? "",
            device_no: item.device_no ?? "",
            p12_file: item.p12_file ?? "",
            branch_id: item.branch_id ?? "",
            is_efris: item.is_efris ?? "",
            status: item.status === 1 ? "Active" : "Inactive",
          } as WarehouseRow;
        });
        setWarehouses(mapped);
      } catch {
        // ignore error details here but ensure warehouses cleared
        setWarehouses([]);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchWarehouses();
    }, [fetchWarehouses]);

    const handleConfirmDelete = async () => {
      if (!selectedRow) return;
  
      try {
        if (!selectedRow?.id) throw new Error('Missing id');
        await deleteWarehouse(String(selectedRow.id)); // call API
        
        showSnackbar("Warehouse deleted successfully ", "success"); 
        await fetchWarehouses();
         setWarehouses((prev) => prev.filter((c) => String(c.id) !== String(selectedRow.id)));
      } catch (error) {
        console.error("Delete failed :", error);
        showSnackbar("Failed to delete Warehouse", "error"); 
      } finally {
        setShowDeletePopup(false);
        setSelectedRow(null);
      }
    };

  return loading ? <Loading /> : (
    <>
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-semibold text-[#181D27] h-[30px] flex items-center leading-[30px] mb-[1px]">
          Warehouse
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
      <div className="h-[calc(100%-60px)]">
        <Table
          data={warehouses}
          config={{
            header: {
              searchBar: true,
              columnFilter: true,
              actions: [
                <SidebarBtn
                  key={0}
                  href="/dashboard/master/warehouse/addwarehouse"
                  isActive
                  leadingIcon="lucide:plus"
                  label="Add Warehouse"
                  labelTw="hidden sm:block"
                />,
              ],
            },
            footer: { nextPrevBtn: true, pagination: true },
            columns,
            rowSelection: true,
            rowActions: [
              
              {
                icon: "lucide:edit-2",
                onClick: (data: object) => {
                  const row = data as TableRow;
                  router.push(`/dashboard/master/warehouse/${row.id}`);
                },
              },
              // { icon: "lucide:edit-2", onClick: console.log },
               {
                icon: "lucide:trash-2",
                onClick: (data: object) => {
                  const row = data as TableRow;
                  if (row.id) {
                    setSelectedRow({ id: String(row.id) });
                  }
                  setShowDeletePopup(true);
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
                  title="Warehouse"
                  onClose={() => setShowDeletePopup(false)}
                  onConfirm={handleConfirmDelete}
                />
              </div>
            )}
    </>
  );
}