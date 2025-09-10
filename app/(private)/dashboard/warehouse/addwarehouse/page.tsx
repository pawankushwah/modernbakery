"use client";
import WarehouseDetails from "@/app/components/warehouseManagement/warehouseDetails";
import WarehouseContact from "@/app/components/warehouseManagement/warehouseContact";
import WarehouseLocationInformation from "@/app/components/warehouseManagement/warehouseLocationInfo";
import ContainerCard from "@/app/components/containerCard";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";

export default function addwarehouse() {

    return (
        <>
  
            {/* header */}
            <div className="flex justify-between items-center mb-[20px]">
                <div className="flex items-center gap-[16px]">
                    <Link href="/dashboard/customer">
                        <Icon icon="lucide:arrow-left" width={24} />
                    </Link>
                    <h1 className="text-[20px] font-semibold text-[#181D27] flex items-center leading-[30px] mb-[5px]">
                        Add New Warehouse
                    </h1>
                </div>
            </div>
        

            {/* content */}
            <div>
                <ContainerCard>
                    <h2 className="mb-4 font-semibold text-[18px] leading-[100%] text-[#181D27] tracking-[0%]">Warehouse Details</h2>
 <WarehouseDetails/>
                </ContainerCard>
                   <ContainerCard>
                    <h2 className="mb-4 font-semibold text-[18px] leading-[100%] text-[#181D27] tracking-[0%]">Warehouse Contact</h2>
<WarehouseContact/>
                </ContainerCard>
                   <ContainerCard>
                    <h2 className="mb-4 font-semibold text-[18px] leading-[100%] text-[#181D27] tracking-[0%]"> Location Information</h2>
    <WarehouseLocationInformation/>
                </ContainerCard>
            
            </div>
              
        </>
    );
}
