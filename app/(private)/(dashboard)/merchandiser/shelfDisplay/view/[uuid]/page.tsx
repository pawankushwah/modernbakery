"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { differenceInDays, parseISO } from "date-fns";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

import ContainerCard from "@/app/components/containerCard";
import TabBtn from "@/app/components/tabBtn";
import { useSnackbar } from "@/app/services/snackbarContext";
import { getShelfById } from "@/app/services/merchandiserApi";

import { OverviewTab } from "./tabs/overview";
import { PlanogramTab } from "./tabs/planogram";
import { ExpiryTab } from "./tabs/expiry";
import { DamageTab } from "./tabs/damage";
import { CustomerTab } from "./tabs/customer";
import Loading from "@/app/components/Loading";

export const tabs = [
  { name: "Overview", url: "overview", component: <OverviewTab /> },
  { name: "Customer", url: "customer", component: <CustomerTab /> },
  { name: "Planogram", url: "planogram", component: <PlanogramTab /> },
  { name: "Damage", url: "damage", component: <DamageTab /> },
  { name: "Expiry", url: "expiry", component: <ExpiryTab /> },
];

interface Customer {
  uuid: number;
  customer_code: string;
  customer_type: string;
  owner_name: string;
}

interface Merchandiser {
  uuid: number;
  osa_code: string;
  type: string;
  name: string;
}

interface Shelf {
  uuid: string;
  shelf_name: string;
  logo?: string | null;
  height?: number;
  width?: number;
  depth?: number;
  valid_from?: string;
  valid_to?: string;
  status?: string | number;
  customers?: Customer[];
  code: string;
  merchandisers?: Merchandiser[];
}

export default function Page() {
  const { uuid } = useParams();
  const { showSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shelfData, setShelfData] = useState<Shelf | null>(null);

  const onTabClick = (index: number) => setActiveTab(index);

  const backBtnUrl = "/merchandiser/shelfDisplay/";

  useEffect(() => {
    if (!uuid) return;

    const fetchShelfData = async () => {
      setLoading(true);
      try {
        const res = await getShelfById(uuid.toString());
        const data = res?.data?.data || res?.data;

        if (!data) {
          showSnackbar("Unable to fetch shelf details", "error");
          return;
        }

        setShelfData(data);
      } catch (error) {
        console.error("Error fetching shelf data:", error);
        showSnackbar("Unable to fetch shelf details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchShelfData();
  }, [uuid, showSnackbar]);

  const renderRemainingDays = () => {
    if (!shelfData?.valid_to) return null;
    const today = new Date();
    const validTo = parseISO(shelfData.valid_to);
    const diff = differenceInDays(validTo, today);

    return diff <= 0
      ? "Expired"
      : `${diff} day${diff !== 1 ? "s" : ""} remaining`;
  };

  const isActive =
    shelfData?.status == 1 &&
    (!shelfData?.valid_to ||
      differenceInDays(parseISO(shelfData.valid_to), new Date()) > 0);

  return (
    <>
      {/* Back Button and Title */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={backBtnUrl}>
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold mb-1">Shelf Details</h1>
      </div>

      {loading ? (
        <Loading />
      ) : shelfData ? (
        <>
          {/* Shelf Header */}
          <div className="flex flex-row align-middle items-center md:flex-row justify-between p-5 border border-gray-200 my-5 rounded-lg bg-white shadow-sm">
            {/* Shelf Info */}
            <div className="flex flex-row items-center gap-4 bg-gray-50 rounded-lg p-2">
              <Image
                src="/shelves.png"
                alt="Shelf Icon"
                width={56}
                height={56}
                className="h-[50px] w-[50px] object-cover rounded-full border border-gray-300 bg-gray-100 p-0.5"
              />

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <div className="flex flex-col justify-center">
                  {/* Shelf Name */}
                  <h1 className="font-semibold text-lg md:text-xl text-gray-900">
                    {shelfData.shelf_name || "-"}
                  </h1>

                  {/* Owner and Customer Count */}
                  {shelfData.customers && shelfData.customers.length > 0 && (
                    <>
                      <span className="text-sm font-medium text-gray-700">
                        Owner: {shelfData.customers[0].owner_name}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        Customers: {shelfData.customers.length}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Shelf Code & Status */}
            <div className="p-2 rounded-lg flex flex-col items-start justify-center min-w-max bg-gray-50">
              <h1 className="text-xs text-gray-500 uppercase">Shelf Code</h1>
              <h2 className="text-lg font-semibold text-gray-900">
                {shelfData.code || "SHELF-001"}
              </h2>

              {/* Expired Badge */}
              {shelfData.valid_to &&
                differenceInDays(parseISO(shelfData.valid_to), new Date()) <=
                  0 && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium text-red-700 border border-red-400 bg-red-50">
                    <span className="text-red-600">•</span>
                    Expired
                  </span>
                )}

              {/* Remaining Days */}
              {shelfData.valid_to &&
                differenceInDays(parseISO(shelfData.valid_to), new Date()) >
                  0 && (
                  <span className="text-sm font-medium text-gray-600">
                    {(() => {
                      const today = new Date();
                      const validTo = parseISO(shelfData.valid_to);
                      const diff = differenceInDays(validTo, today);
                      return `Remaining days :${diff}`
                    })()}
                  </span>
                )}
            </div>
          </div>

          {/* Tabs */}
          <ContainerCard
            className="w-full flex gap-[4px] overflow-x-auto"
            padding="5px"
          >
            {tabs.map((tab, index) => (
              <TabBtn
                key={index}
                label={tab.name}
                isActive={activeTab === index}
                onClick={() => onTabClick(index)}
              />
            ))}
          </ContainerCard>

          {/* Tab Content */}
          <ContainerCard className="mt-4">
            {tabs[activeTab]?.component}
          </ContainerCard>
        </>
      ) : (
        <p className="text-red-500">Shelf data not found.</p>
      )}
    </>
  );
}
