// "use client";

// import KeyValueData from "@/app/(private)/dashboard/master/customer/[customerId]/keyValueData";
// import ContainerCard from "@/app/components/containerCard";
// import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
// import StatusBtn from "@/app/components/statusBtn2";
// import SummaryCard from "@/app/components/summaryCard";
// import SidebarBtn from "@/app/components/dashboardSidebarBtn";
// import { getVehicleById } from "@/app/services/allApi";
// import { useLoading } from "@/app/services/loadingContext";
// import { useSnackbar } from "@/app/services/snackbarContext";
// import { Icon } from "@iconify-icon/react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// type vehicle = {
//     vehicle_brand:string;
//     vehicle_code:string,
//   capacity: string,
//   valid_from: string,
//   valid_to: string,
//   description: string,
//   opening_odometer: string,
//   vender_details: string[] | {id: number, name: string, code: string}[],
//   manufacturer: string,
//   country_id: number,
//   type_name: string,
//   sap_code: string,
//   status: string | number,
//   is_assign: number,
//   customer_id: number,
//   agreement_id: number,
//   document_type: string,
//   document_id: number
// }

// const title = "Vehicle Details";

// export default function ViewPage() {
//     const params = useParams();
//     let id: string = "";
//     if (params.id) {
//         if (Array.isArray(params.id)) {
//             id = params.id[0] || "";
//         } else {
//             id = params.id as string;
//         }
//     }

//     // state variables
//     const { showSnackbar } = useSnackbar();
//     const { setLoading } = useLoading();
//     const [vehicle, setVehicle] = useState<vehicle | null>(null);

//     // dropdown data from context
//     const { onlyCountryOptions, vendorOptions } = useAllDropdownListData();

//     useEffect(() => {
//         const fetchChillerDetails = async () => {
//             setLoading(true);
//             const res = await getVehicleById(id);
//             setLoading(false);
//             if (res.error) {
//                 showSnackbar(
//                     res.data.message || "Unable to fetch Vehicle Details",
//                     "error"
//                 );
//                 throw new Error("Unable to fetch Vehicle Details");
//             } else {
//                 setVehicle(res.data);
//             }
//         };
//         fetchChillerDetails();
//     }, []);

//     return (
//         <>
//             <div className="flex items-center gap-4 mb-6">
                
//                 <Link href="/dashboard/master/vehicle">
//                     <Icon icon="lucide:arrow-left" width={24} />
//                 </Link>
//                 <h1 className="text-xl font-semibold mb-1">{title}</h1>
//             </div>
//             <div className="flex lg:gap-[20px]">
//                  <ContainerCard className="w-half xl:w-[350px] space-y-[30px] p-[30px] h-fit">
//                                 <SummaryCard
//                                     icon="fa6-solid:building-wheat"
//                                     iconWidth={40}
//                                     iconCircleTw="flex item-center justify-center bg-[#E9EAEB] text-[#535862] w-[80px] h-[80px] p-[20px]"
//                                     title={
//                                         <span className="text-[20px] font-semibold">
//                                             {vehicle?.vehicle_brand}
//                                         </span>
//                                     }
//                                     description={`Vehicle Code: ${vehicle?.vehicle_code ?? ""}`}
//                                     isVertical={true}
//                                 />
//                                  <span className="flex justify-center p-[10px] sm:p-0 sm:inline-block mt-[10px] sm:mt-0 sm:ml-[10px]">
//                                                                     <StatusBtn isActive={!!vehicle?.status} />
//                                                                 </span>
                
//                                 <hr className="text-[#D5D7DA]" />
                
//                                 <div className="text-center space-y-[12px] text-[16px]">
                                   
//                                 </div>
                
                                
//                             </ContainerCard>
//                 <ContainerCard className="w-full justify-space-between">
//                     <KeyValueData
//                         title="Vehicle Information"
//                         data={[
//                             { value: vehicle?.capacity, key: "Capacity" },
//                             { value: vehicle?.description, key: "Vehicle Description" },
//                             { value: vehicle?.valid_from, key: "Valid From" },
//                             { value: vehicle?.valid_to, key: "Valid To" },
//                             { value: vehicle?.opening_odometer, key: "Opening Odo Meter" },
//                         ]}
//                     />
//                 </ContainerCard>
//             </div>
//         </>
//     );
// }



// "use client";

// import KeyValueData from "@/app/(private)/dashboard/master/customer/[customerId]/keyValueData";
// import ContainerCard from "@/app/components/containerCard";
// import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
// import StatusBtn from "@/app/components/statusBtn2";
// import SummaryCard from "@/app/components/summaryCard";
// import { getVehicleById } from "@/app/services/allApi";
// import { useLoading } from "@/app/services/loadingContext";
// import { useSnackbar } from "@/app/services/snackbarContext";
// import { Icon } from "@iconify-icon/react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// type vehicle = {
//   number_plat: string;
//   vehicle_brand: string;
//   vehicle_code: string;
//   plate_number: string;
//   capacity: string;
//   valid_from: string;
//   valid_to: string;
//   description: string;
//   opening_odometer: string;
//   vender_details: string[] | { id: number; name: string; code: string }[];
//   manufacturer: string;
//   country_id: number;
//   type_name: string;
//   sap_code: string;
//   status: string | number;
//   is_assign: number;
//   customer_id: number;
//   agreement_id: number;
//   document_type: string;
//   document_id: number;
// };

// const title = "Vehicle Details";

// export default function ViewPage() {
//   const params = useParams();
//   let id: string = "";
//   if (params.id) {
//     if (Array.isArray(params.id)) {
//       id = params.id[0] || "";
//     } else {
//       id = params.id as string;
//     }
//   }

//   const { showSnackbar } = useSnackbar();
//   const { setLoading } = useLoading();
//   const [vehicle, setVehicle] = useState<vehicle | null>(null);

//   const { onlyCountryOptions, vendorOptions } = useAllDropdownListData();

//   useEffect(() => {
//     const fetchVehicleDetails = async () => {
//       setLoading(true);
//       const res = await getVehicleById(id);
//       setLoading(false);
//       if (res.error) {
//         showSnackbar(
//           res.data.message || "Unable to fetch Vehicle Details",
//           "error"
//         );
//         throw new Error("Unable to fetch Vehicle Details");
//       } else {
//         setVehicle(res.data);
//       }
//     };
//     fetchVehicleDetails();
//   }, []);

//   return (
//     <>
//       <div className="flex items-center gap-4 mb-6">
//         <Link href="/dashboard/master/vehicle">
//           <Icon icon="lucide:arrow-left" width={24} />
//         </Link>
//         <h1 className="text-xl font-semibold mb-1">{title}</h1>
//       </div>

//       <div className="flex lg:gap-[20px]">
//         {/* Left summary card */}
//         <ContainerCard className="w-half xl:w-[350px] space-y-[30px] p-[30px] h-fit">
//           <SummaryCard
//             icon="lucide:truck" // changed icon to truck to match screenshot
//             iconWidth={40}
//             iconCircleTw="flex items-center justify-center bg-[#E9EAEB] text-[#535862] w-[80px] h-[80px]"
//             title={
//               <span className="text-[20px] font-semibold">
//                 {vehicle?.vehicle_brand}
//               </span>
//             }
//             description={`Vehicle Code: ${vehicle?.vehicle_code ?? ""}`}
//             isVertical={true}
//           />

//           {/* Status */}
//           <div className="flex justify-center p-0 mt-0 mb-2">
//             <StatusBtn isActive={!!vehicle?.status} />
//           </div>

//           <hr className="text-[#D5D7DA]" />

//           {/* Plate Number */}
//           <div className="space-y-[12px] text-[16px]">
//             <div className="flex flex-wrap items-center ">
//               <span className="font-medium text-gray-700">Plate Number</span>
//               <span className="mt-2 px-4 py-1 rounded border border-black bg-[#FFD200] text-black font-semibold text-lg tracking-wider shadow-sm">
//                 {vehicle?.number_plat ?? "-"}
//               </span>
//             </div>
//           </div>
//         </ContainerCard>

//         {/* Right details card */}
//         <ContainerCard className="w-full justify-space-between">
//           <KeyValueData
//             title="Vehicle Information"
//             data={[
//               { value: vehicle?.capacity, key: "Capacity" },
//               { value: vehicle?.sap_code ?? "-", key: "ERP Code" },
//               { value: vehicle?.description, key: "Vehicle Description" },
//               { value: vehicle?.valid_from, key: "Valid From" },
//               { value: vehicle?.valid_to, key: "Valid To" },
//               { value: vehicle?.opening_odometer, key: "Opening Odometer" },
//               { value: "Agent", key: "Vehicle Owner" }, // static for now
//             ]}
//           />
//         </ContainerCard>
//       </div>
//     </>
//   );
// }



"use client";

import KeyValueData from "@/app/(private)/dashboard/master/customer/[customerId]/keyValueData";
import ContainerCard from "@/app/components/containerCard";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import StatusBtn from "@/app/components/statusBtn2";
import SummaryCard from "@/app/components/summaryCard";
import { getVehicleById } from "@/app/services/allApi";
import { useLoading } from "@/app/services/loadingContext";
import { useSnackbar } from "@/app/services/snackbarContext";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Vehicle = {
  number_plat: string;
  vehicle_brand: string;
  vehicle_code: string;
  plate_number: string;
  capacity: string;
  valid_from: string;
  valid_to: string;
  description: string;
  opening_odometer: string;
  vender_details: string[] | { id: number; name: string; code: string }[];
  manufacturer: string;
  country_id: number;
  type_name: string;
  sap_code: string;
  status: string | number;
  is_assign: number;
  customer_id: number;
  agreement_id: number;
  document_type: string;
  document_id: number;
};

const title = "Vehicle Details";

export default function ViewPage() {
  const params = useParams();
  let id: string = "";
  if (params.id) {
    id = Array.isArray(params.id) ? params.id[0] || "" : (params.id as string);
  }

  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const { onlyCountryOptions, vendorOptions } = useAllDropdownListData();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      const res = await getVehicleById(id);
      setLoading(false);

      if (res.error) {
        showSnackbar(
          res.data.message || "Unable to fetch Vehicle Details",
          "error"
        );
        return;
      }
      setVehicle(res.data);
    };
    fetchVehicleDetails();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/master/vehicle">
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold mb-1">{title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-[20px]">
        {/* Left summary card */}
        <ContainerCard className="lg:w-[350px] space-y-[30px] p-[30px] h-fit">
          <SummaryCard
            icon="lucide:truck"
            iconWidth={40}
            iconCircleTw="flex items-center justify-center bg-[#E9EAEB] text-[#535862] w-[80px] h-[80px]"
            title={
              <span className="text-[20px] font-semibold">
                {vehicle?.vehicle_brand || "-"}
              </span>
            }
            description={`Vehicle Code: ${vehicle?.vehicle_code ?? "-"}`}
            isVertical={true}
          />

          {/* Status */}
          <div className="flex justify-center">
            <StatusBtn isActive={!!vehicle?.status} />
          </div>

          <hr className="text-[#D5D7DA]" />

          {/* Plate Number */}
         {/* Plate Number */}
<div className="space-y-[12px] text-[16px]">
  <div className="flex flex-col gap-2">
    <span className="font-medium text-gray-700">Plate Number</span>
    <div className="inline-block bg-[#FFD200] text-black font-bold text-lg tracking-wider rounded-md border border-black px-6 py-2 shadow-sm">
      {vehicle?.number_plat ?? "-"}
    </div>
  </div>
</div>

        </ContainerCard>

        {/* Right details card */}
        <ContainerCard className="w-full">
          <KeyValueData
            title="Vehicle Information"
            data={[
              { value: vehicle?.capacity ?? "-", key: "Capacity", icon: "lucide:package" },
              { value: vehicle?.sap_code ?? "-", key: "ERP Code", icon: "lucide:file-text" },
              { value: vehicle?.description ?? "-", key: "Vehicle Description", icon: "lucide:truck" },
              { value: vehicle?.valid_from ?? "-", key: "Valid From", icon: "lucide:calendar" },
              { value: vehicle?.valid_to ?? "-", key: "Valid To", icon: "lucide:calendar" },
              { value: vehicle?.opening_odometer ?? "-", key: "Opening Odometer", icon: "lucide:gauge" },
              { value: "Agent", key: "Vehicle Owner", icon: "lucide:user" },
            ]}
          />
        </ContainerCard>
      </div>
    </>
  );
}
