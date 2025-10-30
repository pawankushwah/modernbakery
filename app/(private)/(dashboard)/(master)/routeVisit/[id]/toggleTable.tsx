"use client";
import Loading from "@/app/components/Loading";
import { getRouteVisitList } from "@/app/services/allApi";
import { useState, useEffect } from "react";

// Types for API responses
type CustomerItem = {
  id: number;
  osa_code: string;
  owner_name: string;
};

type RouteVisitItem = {
  id: number;
  uuid: string;
  osa_code: string;
  customer?: {
    id: number;
    code: string;
    name: string;
  };
  days: string[];
};

type TransformedCustomer = {
  id: number;
  name: string;
};

type TransformedEditCustomer = {
  id: number; // <-- will now represent customer.id
  uuid: string;
  name: string;
  days: string[];
};

// ✅ Transform function for add mode (existing functionality)
const transformCustomerList = (
  apiResponse: CustomerItem[]
): TransformedCustomer[] => {
  return apiResponse.map((item) => ({
    id: item.id,
    name: `${item.osa_code} - ${item.owner_name}`,
  }));
};

// ✅ Transform function for edit mode (updated to use customer.id)
const transformEditCustomerList = (
  apiResponse: RouteVisitItem[]
): TransformedEditCustomer[] => {
  return apiResponse.map((item) => ({
    id: item.customer?.id ?? item.id, // ✅ use customer.id if available, fallback to item.id
    uuid: item.uuid,
    name: item.customer
      ? `${item.customer.code} - ${item.customer.name}`
      : "Unknown Customer",
    days: item.days || [],
  }));
};

type DayState = {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
};

type RowStates = Record<number, DayState>;

type CustomerSchedule = {
  customer_id: number;
  days: string[];
};

type TableProps = {
  isEditMode: boolean;
  customers: CustomerItem[];
  onScheduleUpdate?: (schedules: CustomerSchedule[]) => void;
  initialSchedules?: CustomerSchedule[];
  selectedCustomerType: string;
};

export default function Table({
  isEditMode,
  selectedCustomerType,
  customers,
  onScheduleUpdate,
  initialSchedules = [],
}: TableProps) {
  const [editModeData, setEditModeData] = useState<TransformedEditCustomer[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // ✅ For ADD mode: use the existing transform function
  const addModeData = transformCustomerList(customers);

  // ✅ For EDIT mode: fetch and transform data from route visit list API
  useEffect(() => {
    if (isEditMode) {
      const fetchEditData = async () => {
        setLoading(true);
        try {
          const res = await getRouteVisitList();
          console.log("Edit mode data:", res);
          if (res?.data) {
            console.log(res.data);
            const transformedData = transformEditCustomerList(
              res.data as RouteVisitItem[]
            );
            setEditModeData(transformedData);
          }
        } catch (error) {
          console.error("Failed to fetch edit mode data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEditData();
    }
  }, [isEditMode]);

  // ✅ Initialize state from props or edit mode data
  const initialRowStates = isEditMode
    ? editModeData.reduce((acc, item) => {
        acc[item.id] = {
          Monday: item.days.includes("Monday"),
          Tuesday: item.days.includes("Tuesday"),
          Wednesday: item.days.includes("Wednesday"),
          Thursday: item.days.includes("Thursday"),
          Friday: item.days.includes("Friday"),
          Saturday: item.days.includes("Saturday"),
          Sunday: item.days.includes("Sunday"),
        };
        return acc;
      }, {} as RowStates)
    : initialSchedules.reduce((acc, sched) => {
        acc[sched.customer_id] = {
          Monday: sched.days.includes("Monday"),
          Tuesday: sched.days.includes("Tuesday"),
          Wednesday: sched.days.includes("Wednesday"),
          Thursday: sched.days.includes("Thursday"),
          Friday: sched.days.includes("Friday"),
          Saturday: sched.days.includes("Saturday"),
          Sunday: sched.days.includes("Sunday"),
        };
        return acc;
      }, {} as RowStates);

  const [rowStates, setRowStates] = useState<RowStates>(initialRowStates);

  // ✅ Update rowStates when editModeData changes
  useEffect(() => {
    if (isEditMode && editModeData.length > 0) {
      const newRowStates = editModeData.reduce((acc, item) => {
        acc[item.id] = {
          Monday: item.days.includes("Monday"),
          Tuesday: item.days.includes("Tuesday"),
          Wednesday: item.days.includes("Wednesday"),
          Thursday: item.days.includes("Thursday"),
          Friday: item.days.includes("Friday"),
          Saturday: item.days.includes("Saturday"),
          Sunday: item.days.includes("Sunday"),
        };
        return acc;
      }, {} as RowStates);
      setRowStates(newRowStates);
    }
  }, [isEditMode, editModeData]);

  useEffect(() => {
    if (typeof onScheduleUpdate === "function") {
      const schedules: CustomerSchedule[] = Object.entries(rowStates)
        .map(([customer_id, daysObj]) => {
          const dayState = daysObj as DayState;
          const selectedDays = Object.entries(dayState)
            .filter(([_, isSelected]) => isSelected)
            .map(([day]) => day);
          return selectedDays.length > 0
            ? { customer_id: Number(customer_id), days: selectedDays }
            : null;
        })
        .filter(Boolean) as CustomerSchedule[];

      onScheduleUpdate(schedules);
    }
  }, [rowStates, onScheduleUpdate]);

  const handleToggle = (rowId: number, field: keyof DayState) => {
    setRowStates((prev: RowStates) => {
      const current = prev[rowId] || {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      };

      const updatedRow = {
        ...current,
        [field]: !current[field],
      };

      return {
        ...prev,
        [rowId]: updatedRow,
      };
    });
  };

  // ✅ Determine which data to display
  const displayData = isEditMode ? editModeData : addModeData;

  if (loading) {
    return <Loading />;
  }

  // ✅ Responsive table
  return (
    <div className="w-full flex flex-col">
      <div className="rounded-lg border border-[#E9EAEB] overflow-hidden">
        {/* ✅ Horizontal scroll container for small screens */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="text-[12px] bg-[#FAFAFA] text-[#535862] sticky top-0 z-20">
              <tr className="h-[44px] border-b border-[#E9EAEB]">
                <th className="px-4 py-3 font-[500] text-left border-r border-[#E9EAEB] whitespace-nowrap">
                  {selectedCustomerType.toString() === "1"
                    ? "Agent Customer"
                    : "Merchandiser"}
                </th>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <th
                    key={day}
                    className="px-4 py-3 font-[500] text-center border-l border-[#E9EAEB] whitespace-nowrap"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-[14px] bg-white text-[#535862]">
              {displayData.map((row) => {
                const state = rowStates[row.id] || {
                  Monday: false,
                  Tuesday: false,
                  Wednesday: false,
                  Thursday: false,
                  Friday: false,
                  Saturday: false,
                  Sunday: false,
                };

                return (
                  <tr key={row.id} className="border-b border-[#E9EAEB]">
                    <td className="px-4 py-3 text-left font-[500] border-r border-[#E9EAEB] whitespace-nowrap">
                      {row.name}
                    </td>

                    {Object.keys(state).map((day) => (
                      <td
                        key={day}
                        className="px-4 py-3 text-center border-l border-[#E9EAEB] whitespace-nowrap"
                      >
                        <Checkbox
                          isChecked={state[day as keyof DayState]}
                          onChange={() =>
                            handleToggle(row.id, day as keyof DayState)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type CheckboxProps = {
  label?: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Checkbox({
  label,
  isChecked = false,
  onChange,
}: CheckboxProps) {
  return (
    <label className="inline-flex items-center cursor-pointer space-x-2">
      <input
        type="checkbox"
        className="w-5 h-5 accent-green-500 cursor-pointer border border-gray-300 rounded focus:ring-2 focus:ring-white"
        checked={isChecked}
        onChange={onChange}
      />
      {label && (
        <span className="text-sm font-medium text-gray-900">{label}</span>
      )}
    </label>
  );
}
