"use client";

import KeyValueData from "@/app/(private)/(dashboard)/(master)/customer/[customerId]/keyValueData";
import ContainerCard from "@/app/components/containerCard";
import Map from "@/app/components/map";
import TabBtn from "@/app/components/tabBtn";
import { salesmanUnloadHeaderById } from "@/app/services/agentTransaction";
import { useLoading } from "@/app/services/loadingContext";
import { useSnackbar } from "@/app/services/snackbarContext";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomerItem {
  id: number;
  uuid: string;
  osa_code: string;
  unload_no: string;
  unload_date: string;
  unload_time: string;
  sync_date: string;
  sync_time: string;
  unload_from: string;
  salesman_type: string | null;
  latitude: string;
  longtitude: string;
  warehouse: {
    code: string;
    name: string;
  };
  route: {
    code: string;
    name: string;
  };
  salesman: {
    code: string;
    name: string;
  };
  projecttype?: {
    code: string;
    name: string;
  } | null;
  details: Array<{
    id: number;
    uuid: string;
    osa_code: string;
    item: {
      id: number;
      code: string;
      name: string;
    };
    uom: number;
    qty: number;
    price: string;
    status: number;
  }>;
}

const title = "Salesman Unload Details";
const backBtnUrl = "/salesmanUnload";

export default function ViewPage() {
  const params = useParams();
  const uuid = Array.isArray(params.uuid)
    ? params.uuid[0] || ""
    : (params.uuid as string) || "";

  const [customer, setCustomer] = useState<CustomerItem | null>(null);
  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();

  // Tab logic
  const [activeTab, setActiveTab] = useState("overview");
  const tabList = [
    { key: "overview", label: "Overview" },
    { key: "unload", label: "Unload" },
  ];

  const onTabClick = (idx: number) => {
    if (idx < 0 || idx >= tabList.length) return;
    setActiveTab(tabList[idx].key);
  };

  useEffect(() => {
    if (!uuid) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await salesmanUnloadHeaderById(uuid);
        if (res.error) {
          showSnackbar(
            res.data?.message || "Unable to fetch Salesman Unload Details",
            "error"
          );
          return;
        }
        setCustomer(res.data);
      } catch {
        showSnackbar("Unable to fetch Salesman Unload Details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [uuid, setLoading, showSnackbar]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={backBtnUrl}>
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold mb-1">{title}</h1>
      </div>

      <div className="flex gap-x-[20px] flex-wrap md:flex-nowrap">
        <div className="w-full flex flex-col">
          {/* Tabs */}
          <ContainerCard className="w-full flex gap-[4px] overflow-x-auto" padding="5px">
            {tabList.map((tab, index) => (
              <TabBtn
                key={tab.key}
                label={tab.label}
                isActive={activeTab === tab.key}
                onClick={() => onTabClick(index)}
              />
            ))}
          </ContainerCard>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="flex flex-col md:flex-row gap-5 mt-5">
              <div className="flex-1">
                <ContainerCard className="w-full h-fit mt-5">
                  <KeyValueData
                    title="Basic Information"
                    data={[
                      { key: "OSA Code", value: customer?.osa_code || "-" },
                      { key: "Warehouse Code", value: customer?.warehouse?.code || "-" },
                      { key: "Warehouse Name", value: customer?.warehouse?.name || "-" },
                      { key: "Route Code", value: customer?.route?.code || "-" },
                      { key: "Route Name", value: customer?.route?.name || "-" },
                      { key: "Salesman Type", value: customer?.salesman_type || "-" },
                      { key: "Salesman Code", value: customer?.salesman?.code || "-" },
                      { key: "Salesman Name", value: customer?.salesman?.name || "-" },
                    ]}
                  />
                </ContainerCard>
              </div>

              <div className="flex-1">
                      <ContainerCard className="w-full h-fit">
                       
                 <div className="text-[18px] font-semibold mb-4">{customer?.latitude && customer?.longtitude && (
                    <Map latitude={customer.latitude} longitude={customer.longtitude} title="Unload Location" />
                  )}</div>
                </ContainerCard>
                  
              </div>


            </div>
          )}

          {activeTab === "unload" && (
             <ContainerCard className="w-full h-fit">
                  <KeyValueData
                    title="Unload Information"
                    data={[
                      { key: "Unload No", value: customer?.unload_no || "-" },
                      { key: "Unload Date", value: customer?.unload_date || "-" },
                      { key: "Unload Time", value: customer?.unload_time || "-" },
                      { key: "Sync Date", value: customer?.sync_date || "-" },
                      { key: "Sync Time", value: customer?.sync_time || "-" },
                      { key: "Unload From", value: customer?.unload_from || "-" },
                      { key: "Latitude", value: customer?.latitude || "-" },
                      { key: "Longitude", value: customer?.longtitude || "-" },
                    ]}
                  />
                </ContainerCard>
          )}
        </div>
      </div>
    </>
  );
}
