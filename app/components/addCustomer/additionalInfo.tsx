import FormCard from "./cordAddCustomer";

export default function AdditionalInfo() {
  return (
    <FormCard title="Additional Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Route */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Route
          </label>
          <select className="px-3 py-2 bg-[#FFFFFF] h-[44px] rounded-[8px] shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] text-[#717680]">
            <option>Select Route</option>
          </select>
        </div>

        {/* Assign Latitude */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Assign Latitude
          </label>
          <input
            type="text"
            placeholder="Enter Latitude"
            className="px-3 py-2 bg-[#FFFFFF] h-[44px] rounded-[8px] shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] text-[#717680]"
          />
        </div>

        {/* Assign Longitude */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Assign Longitude
          </label>
          <input
            type="text"
            placeholder="Enter Longitude"
            className="px-3 py-2 bg-[#FFFFFF] h-[44px] rounded-[8px] shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] text-[#717680]"
          />
        </div>

        {/* Assign Accuracy */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Assign Accuracy
          </label>
          <input
            type="text"
            placeholder="Enter Accuracy"
            className="px-3 py-2 bg-[#FFFFFF] h-[44px] rounded-[8px] shadow-[0px_1px_2px_0px_#0A0D120D] border border-[#D5D7DA] text-[#717680]"
          />
        </div>

        {/* Available Days */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
            Available Days
          </label>
          <div className="flex gap-2 flex-nowrap overflow-x-auto">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span
                key={day}
                className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${
                  ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)
                    ? "bg-red-100 text-red-500 border-red-300"
                    : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FormCard>
  );
}
