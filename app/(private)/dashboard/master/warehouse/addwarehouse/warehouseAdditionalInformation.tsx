"use client";
import { useState } from "react";

import CustomSecurityCode from "@/app/components/customSecurityCode";
import CustomDate from "@/app/components/customDate";
import InputFields from "@/app/components/inputFields";
export default function WarehouseAdditionalInformation() {
    const [deposit, setDeposit] = useState("");
    const [stock, setStock] = useState("");
    const [diviceNo, setDiviceNo] = useState("");
    const [efris, setEfris] = useState("");

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputFields
                label="Device No. "
                value={diviceNo}
                onChange={(e) => setDiviceNo(e.target.value)}
            />
            <InputFields
                label="EFRIS Configuration  "
                value={efris}
                onChange={(e) => setEfris(e.target.value)}
            />

            <CustomSecurityCode
                label="Stock Capital "
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter Stock Capital"
            />
            <CustomSecurityCode
                label="Deposit  "
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="Enter Deposit"
            />

            {/* Second Row - Accuracy + Days */}
        </div>
    );
}
