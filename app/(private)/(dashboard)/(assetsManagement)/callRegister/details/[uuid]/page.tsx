"use client";

import KeyValueData from "@/app/components/keyValueData";
import ContainerCard from "@/app/components/containerCard";
import StatusBtn from "@/app/components/statusBtn2";
import { callRegisterByUUID } from "@/app/services/assetsApi";
import { useLoading } from "@/app/services/loadingContext";
import { useSnackbar } from "@/app/services/snackbarContext";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const title = "View Call Register";
const backBtnUrl = "/assetsManagement/callRegister";

export default function ViewPage() {
    const params = useParams();
    const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;

    const { showSnackbar } = useSnackbar();
    const { setLoading } = useLoading();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!uuid) return;
            setLoading(true);
            const res = await callRegisterByUUID(uuid);
            setLoading(false);

            if (res.error) {
                showSnackbar(res.data?.message || "Unable to fetch Call Register details", "error");
            } else {
                setData(res.data);
            }
        };
        fetchDetails();
    }, [uuid]);

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={backBtnUrl}>
                    <Icon icon="lucide:arrow-left" width={24} />
                </Link>
                <h1 className="text-xl font-semibold">{title}</h1>
            </div>

            {/* MAIN WRAPPER */}
            <div className="flex flex-col gap-6">

                {/* ================= CALL REGISTER BASIC DETAILS ================= */}
                <h2 className="text-lg font-semibold mt-2">Call Register Details</h2>
                <div className="flex flex-wrap gap-x-[20px] gap-y-[20px]">
                    <ContainerCard className="w-full lg:w-[680px]">
                        <KeyValueData
                            data={[
                                { key: "Ticket Type", value: data?.ticket_type },
                                { key: "Ticket Date", value: data?.ticket_date },
                                { key: "Chiller Serial Number", value: data?.chiller_serial_number },
                                { key: "Asset Number", value: data?.asset_number || "-" },
                                { key: "Model Number", value: data?.model_number },
                                { key: "Chiller Code", value: data?.chiller_code },
                            ]}
                        />
                    </ContainerCard>

                    <ContainerCard className="w-full lg:w-[680px]">
                        <KeyValueData
                            data={[
                                { key: "Branding", value: data?.branding || "-" },
                                { key: "CTC Status", value: data?.ctc_status },
                                {
                                    key: "Status",
                                    value: "",
                                    component: <StatusBtn isActive={data?.status === "1"} />
                                },
                                { key: "Nature of Call", value: data?.nature_of_call },
                                { key: "Follow-up Action", value: data?.follow_up_action },
                            ]}
                        />
                    </ContainerCard>
                </div>

                {/* ================= ASSIGN CUSTOMER DETAILS ================= */}
                <h2 className="text-lg font-semibold">Assign Customer Details</h2>
                <div className="flex flex-wrap gap-x-[20px] gap-y-[20px]">
                    <ContainerCard className="w-full lg:w-[680px]">
                        <KeyValueData
                            data={[
                                { key: "Outlet Code", value: data?.outlet_code || "-" },
                                { key: "Outlet Name", value: data?.outlet_name || "-" },
                                { key: "Owner Name", value: data?.owner_name || "-" },
                                { key: "Road/Street", value: data?.road_street || "-" },
                                { key: "District", value: data?.district || "-" },
                            ]}
                        />
                    </ContainerCard>

                    <ContainerCard className="w-full lg:w-[680px]">
                        <KeyValueData
                            data={[
                                { key: "Town", value: data?.town || "-" },
                                { key: "Landmark", value: data?.landmark || "-" },
                                { key: "Contact Number 1", value: data?.contact_no1 || "-" },
                                { key: "Contact Number 2", value: data?.contact_no2 || "-" },
                            ]}
                        />
                    </ContainerCard>
                </div>

                {/* ================= CURRENT CUSTOMER DETAILS ================= */}
                <h2 className="text-lg font-semibold">Current Customer Details</h2>
                <div className="flex flex-wrap gap-x-[20px] gap-y-[20px]">
                    <ContainerCard className="w-full lg:w-[680px]">
                        <KeyValueData
                            data={[
                                { key: "Outlet Code", value: data?.current_outlet_code },
                                { key: "Outlet Name", value: data?.current_outlet_name },
                                { key: "Owner Name", value: data?.current_owner_name },
                                { key: "Road/Street", value: data?.current_road_street || "-" },
                                { key: "District", value: data?.current_district || "-" },
                            ]}
                        />
                    </ContainerCard>

                    <ContainerCard className="w-full lg:w-[680px]">
                        <KeyValueData
                            data={[
                                { key: "Town", value: data?.current_town || "-" },
                                { key: "Landmark", value: data?.current_landmark || "-" },
                                { key: "Contact Number 1", value: data?.current_contact_no1 },
                                { key: "Contact Number 2", value: data?.current_contact_no2 },
                            ]}
                        />
                    </ContainerCard>
                </div>
                {/* <h2 className="text-lg font-semibold">Image Customer Details</h2>
                <div className="flex flex-wrap gap-x-[20px] gap-y-[20px]">
                    <ContainerCard className="w-full lg:w-[680px]">
                        <KeyValueData
                            data={[
                                { key: "Outlet Code", value: data?.current_outlet_code },
                                { key: "Outlet Name", value: data?.current_outlet_name },
                                { key: "Owner Name", value: data?.current_owner_name },
                                { key: "Road/Street", value: data?.current_road_street || "-" },
                                { key: "District", value: data?.current_district || "-" },
                            ]}
                        />
                    </ContainerCard>
                </div> */}

                {/* ================= REJECTION COMMENT ================= */}
                {data?.reason_for_cancelled && (
                    <ContainerCard className="w-full">
                        <h3 className="font-semibold mb-2">Reason for Cancellation</h3>
                        <p className="text-gray-700">{data.reason_for_cancelled}</p>
                    </ContainerCard>
                )}

            </div>
        </>
    );
}
