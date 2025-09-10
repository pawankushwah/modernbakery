import FormCard from "./cordAddCustomer";

export default function CustomerDetails() {
  return (
    <FormCard title="Customer Details">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Customer Type */}
        <div className="flex flex-col">
          <label className=" font-medium text-sm leading-5 text-[#414651] mb-1">
            Customer Type
          </label>
          <select className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
">
            <option>Select Customer Type</option>
          </select>
        </div>

        {/* Customer Code */}
        <div className="flex flex-col">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Customer Code
          </label>
          <input
            type="text"
            placeholder="Enter Code"
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

        {/* SAP Id */}
        <div className="flex flex-col">
          <label className=" font-medium text-sm leading-5 text-[#414651] mb-1">
            SAP Id
          </label>
          <input
            type="text"
            placeholder="Enter SAP ID"
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

        {/* Category */}
        <div className="flex flex-col">
          <label className=" font-medium text-sm leading-5 text-[#414651] mb-1">
            Category
          </label>
          <select className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
">
            <option>Select Category</option>
          </select>
        </div>

        {/* Sub Category */}
        <div className="flex flex-col">
          <label className=" font-medium text-sm leading-5 text-[#414651] mb-1">
            Sub Category
          </label>
          <select className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
">
            <option>Select Sub Category</option>
          </select>
        </div>

        {/* Outlet Channel */}
        <div className="flex flex-col">
          <label className=" font-medium text-sm leading-5 text-[#414651] mb-1">
            Outlet Channel
          </label>
          <select className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
">
            <option>Select Outlet Channel</option>
          </select>
        </div>
      </div>
    </FormCard>
  );
}
