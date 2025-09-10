import FormCard from "./cordAddCustomer";

export default function ContactInfo() {
  return (
    <FormCard title="Contact Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Number */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Contact Number
          </label>
          <div className="flex">
            <select className="border border-[#D5D7DA] rounded-l-lg px-3 py-2 h-[44px] bg-white text-sm text-[#344054]">
              <option>UAE</option>
            </select>
            <input
              type="text"
              placeholder="Enter Contact Number"
                 className="border border-[#D5D7DA] rounded-r-lg px-3 py-2 flex-1 h-[44px] text-sm text-[#717680]
              
            bg-[#FFFFFF]  opacity-100   gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D]  font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;


              "
            />
          </div>
        </div>

        {/* Secondary Contact */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Secondary Contact
          </label>
          <div className="flex">
            <select className="border border-[#D5D7DA] rounded-l-lg px-3 py-2 h-[44px] bg-white text-sm text-[#344054]">
              <option>UAE</option>
            </select>
            <input
              type="text"
              placeholder="Enter Secondary Contact"
              className="border border-[#D5D7DA] rounded-r-lg px-3 py-2 flex-1 h-[44px] text-sm text-[#717680]
              
            bg-[#FFFFFF]  opacity-100   gap-[8px] pt-[10px] pr-[14px] pb-[10px] pl-[14px] flex items-center shadow-[0px_1px_2px_0px_#0A0D120D]  font-family: Inter;
font-weight: 400;
font-size: 16px;
leading-trim: NONE;
line-height: 24px;
letter-spacing: 0%;


              "
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter Email Address"
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
