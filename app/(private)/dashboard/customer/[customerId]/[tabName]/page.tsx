"use client";

import ContainerCard from "@/app/components/containerCard";
import { useParams } from "next/navigation";
import Overview from "./overview";
import CustomerInfo from "./customerInfo";
import { url } from "inspector";
import Balance from "./balance";
import Settings from "./settings";
import SalesSummary from "./salesSummary";
import CallHistory from "./callHistory";

export const tabs = [
    {
        name: "Overview",
        url: "overview",
        component: <Overview />,
    },
    {
        name: "Customer Info",
        url: "customer-info",
        component: <CustomerInfo />,
    },
    {
        name: "Balance",
        url: "balance",
        component: <Balance />,
    },
    {
        name: "Settings",
        url: "settings",
        component: <Settings />,
    },
    {
        name: "Sales Summary",
        url: "sales-summary",
        component: <SalesSummary />,
    },
    {
        name: "Call History",
        url: "call-history",
        component: <CallHistory />,
    },
];

export default function Page() {
    const { tabName } = useParams();

    return (
        <>
            {tabs.find((tab) => tab.url === tabName)?.component || (
                <div className="text-2xl p-[10px] w-fit h-[50px] flex items-center text-white bg-[#f49d9d] font-semibold rounded-[8px]">
                    Please select the tab
                </div>
            )}
        </>
    );
}
