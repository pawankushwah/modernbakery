"use client";
import FormCard from "./cordAddCustomer";
import CustomTextInput from "../CustomTextInput";
import { useState } from "react";
export default function LocationInfo() {
     const [userId, setUserId] = useState("");
  return (
    <FormCard title="Location Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Region */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Region
          </label>
          <select className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
">
            <option>Select Region</option>
          </select>
        </div>

        {/* Sub Region */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Sub Region
          </label>
          <input
            type="text"
            placeholder="Select Sub Region"
            className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
"
          />
        </div>

        {/* District */}
        <div className="flex flex-col gap-1">
<CustomTextInput
  label="District"
  value={userId}
  placeholder="Enter District"
  onChange={(e) => setUserId(e.target.value)}
/>

          
        </div>

        {/* Town/Village */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Town/Village
          </label>
          <input
            type="text"
            placeholder="Enter Town/Village"
            className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
"
          />
        </div>

        {/* Street */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Street
          </label>
          <input
            type="text"
            placeholder="Enter Street"
            className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
"
          />
        </div>

        {/* Landmark */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Landmark
          </label>
          <input
            type="text"
            placeholder="Enter Landmark"
            className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
"
          />
        </div>

        {/* Latitude */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Latitude
          </label>
          <input
            type="text"
            placeholder="Enter Latitude"
            className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
"
          />
        </div>

        {/* Longitude */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Longitude
          </label>
          <input
            type="text"
            placeholder="Enter Longitude"
            className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
"
          />
        </div>

        {/* Threshold Radius */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Threshold Radius
          </label>
          <input
            type="text"
            placeholder="Enter Threshold Radius"
            className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
"
          />
        </div>
      </div>
    </FormCard>
  );
}
