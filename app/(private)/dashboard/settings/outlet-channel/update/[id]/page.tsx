"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChannelById, updateChannel } from "@/app/services/allApi";
import { useSnackbar } from "@/app/services/snackbarContext";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";

export default function UpdateChannelPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    outlet_channel_code: "",
    outlet_channel: "",
  });

  // ✅ Fetch existing channel by id
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await getChannelById(id);
        const data = res.original.data;
        setFormData({
          outlet_channel_code: data.outlet_channel_code ?? "",
          outlet_channel: data.outlet_channel ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch channel:", err);
      }
    };
    fetchData();
  }, [id]);


  console.log(formData,"rrr");
  
  // ✅ Handle input change
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateChannel(String(id), formData);
      showSnackbar("Channel updated successfully ✅", "success");
      router.push("/dashboard/settings/outlet-channel");
    } catch (err) {
      console.error("Update failed:", err);
      showSnackbar("Failed to update ❌", "error");
    }
  };

  return (
    <div className="w-full h-full overflow-x-hidden p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings/outlet-channel">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            Update Channel
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Channel Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Channel Code */}
              <InputFields
                label="Channel Code"
                value={formData.outlet_channel_code}
                onChange={(e) =>
                  handleChange("outlet_channel_code", e.target.value)
                }
              />

              {/* Channel Name */}
              <InputFields
                label="Outlet Channel Name"
                value={formData.outlet_channel}
                onChange={(e) =>
                  handleChange("outlet_channel", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard/settings/outlet-channel")}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <SidebarBtn
            label="Update"
            isActive={true}
            leadingIcon="mdi:check"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
