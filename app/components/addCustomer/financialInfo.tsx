import FormCard from "./cordAddCustomer";

export default function FinancialInfo() {
  return (
    <FormCard title="Financial Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Credit */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Credit
          </label>
          <input
            type="text"
            placeholder="0.00"
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

        {/* Credit Limit */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Credit Limit
          </label>
          <input
            type="text"
            placeholder="0.00"
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

        {/* Payment Type */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Payment Type
          </label>
          <select className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
">
            <option>Select Payment Type</option>
          </select>
        </div>

        {/* Credit Days */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Credit Days
          </label>
          <input
            type="text"
            placeholder="Enter Credit Limit Days"
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

        {/* Fees Type */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Fees Type
          </label>
          <select className=" px-3 py-2 bg-[#FFFFFF] h-[44px] opacity-100 rounded-[8px]  gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;
text-[#717680]
">
            <option>Select Fees Type</option>
          </select>
        </div>

        {/* VAT No */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            VAT No
          </label>
          <input
            type="text"
            placeholder="Enter VAT No"
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
