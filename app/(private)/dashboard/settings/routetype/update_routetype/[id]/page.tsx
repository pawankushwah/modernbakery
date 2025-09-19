"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import InputFields from "@/app/components/inputFields";
import { getRouteTypeById, updateRouteTypeById } from "@/app/services/allApi";
import { useSnackbar } from "@/app/services/snackbarContext";

interface RouteTypeData {
  id: string;
  route_type_name: string;
  status: number;
}

export default function UpdateRouteType() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string | string[] }>();
  const routeId = Array.isArray(id) ? id[0] : id;

  const [routeTypeName, setRouteTypeName] = useState<string>("");
  const [status, setStatus] = useState<"1" | "0">("1");
  const [loading, setLoading] = useState(true);

  // -----------------------
  // Fetch existing route type
  // -----------------------
  useEffect(() => {
    if (!routeId) return;

    const fetchRouteType = async () => {
      setLoading(true);
      try {
        const res = await getRouteTypeById(routeId);
        if (res?.data) {
          setRouteTypeName(res.data.route_type_name ?? "");
          setStatus(String(res.data.status ?? "1") as "1" | "0");
        } else {
          showSnackbar("Route Type not found", "error");
        }
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to load Route Type", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRouteType();
  }, [routeId, showSnackbar]);

  // -----------------------
  // Handle form submit
  // -----------------------
  const handleSubmit = async () => {
    if (!routeTypeName.trim()) {
      return showSnackbar("Please enter a Route Type Name", "error");
    }

    try {
      const res = await updateRouteTypeById(routeId, {
        route_type_name: routeTypeName.trim(),
        status: Number(status),
      });

      if (res?.status) {
        showSnackbar("Route Type updated successfully ✅", "success");
        router.push("/dashboard/settings/routetype?updated=1");
      } else {
        showSnackbar(res?.message || "Failed to update Route Type", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error updating Route Type ❌", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/settings/routetype">
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold">Update Route Type</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputFields
            label="Route Type Name"
            type="text"
            value={routeTypeName}
            onChange={(e) => setRouteTypeName(e.target.value)}
          />

          <InputFields
            label="Status"
            type="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as "1" | "0")}
            options={[
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ]}
          />
        </div>

        {/* Buttons */}
     {/* Buttons */}
<div className="flex justify-end gap-4 mt-6">
  <button
    className="px-4 py-2 border rounded-lg"
    onClick={() => router.push("/dashboard/settings/routetype")}
  >
    Cancel
  </button>

  <button
    className="px-4 py-2 border rounded-lg bg-red-500 text-white"
    onClick={() => {
      setRouteTypeName(""); // clear route type name
      setStatus("1");        // reset status
      showSnackbar("Form cleared ✅", "success");
    }}
  >
    Clear
  </button>

  <SidebarBtn
    label="Update"
    isActive
    leadingIcon="mdi:check"
    onClick={handleSubmit}
  />
</div>
      </div>
    </div>
  );
}
