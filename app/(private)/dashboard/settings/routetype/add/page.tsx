
"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import InputFields from "@/app/components/inputFields";
import { getRouteTypeById, updateRouteTypeById, routeTypeList } from "@/app/services/allApi";
import Loading from "@/app/components/Loading";

interface RouteTypeOption {
  id: number | string;
  route_type_code: string | null;
  route_type_name: string;
  status: number;
  created_date: string | null;
}

export default function EditRouteType() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [routeType, setRouteType] = useState<RouteTypeOption | null>(null);
  const [routeTypes, setRouteTypes] = useState<RouteTypeOption[]>([]);
  const [selectedRouteType, setSelectedRouteType] = useState("");
  const [status, setStatus] = useState("1");

  // Fetch the data for the specific route type to be edited
  useEffect(() => {
    const fetchRouteType = async () => {
      if (!id) return;
      try {
        const res = await getRouteTypeById(id);
        if (res.data) {
          setRouteType(res.data);
          setSelectedRouteType(String(res.data.id));
          setStatus(String(res.data.status));
        }
      } catch (err) {
        console.error("Failed to fetch route type", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllRouteTypes = async () => {
      try {
        const res = await routeTypeList();
        const dataArray: RouteTypeOption[] = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setRouteTypes(dataArray);
      } catch (err) {
        console.error("Failed to fetch all route types", err);
      }
    };

    fetchRouteType();
    fetchAllRouteTypes();
  }, [id]);

  const handleSubmit = async () => {
    if (!selectedRouteType || !routeType) {
      alert("Please select a Route Type");
      return;
    }

    const selected = routeTypes.find((r) => String(r.id) === selectedRouteType);
    if (!selected) {
      alert("Invalid Route Type selected");
      return;
    }

    try {
      const res = await updateRouteTypeById(String(routeType.id), {
        route_type_code: selected.route_type_code,
        route_type_name: selected.route_type_name,
        status: Number(status),
      });

      if (res.status) {
        alert("Route Type updated successfully ✅");
        router.push("/dashboard/settings/routetype");
      } else {
        alert("Failed to update Route Type ❌: " + res.message);
      }
    } catch (err) {
      console.error("Update Route Type error", err);
      alert("Error updating Route Type ❌");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/settings/routetype">
          <Icon icon="lucide:arrow-left" width={24} />
        </Link>
        <h1 className="text-xl font-semibold">Edit Route Type</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputFields
            label="Route Type"
            type="select"
            value={selectedRouteType}
            onChange={(e) => setSelectedRouteType(e.target.value)}
            options={routeTypes.map((r) => ({
              value: String(r.id),
              label: r.route_type_name,
            }))}
          />
          <InputFields
            label="Status"
            type="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ]}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 border rounded-lg"
            onClick={() => {
              // Optionally reset to original values
              if (routeType) {
                setSelectedRouteType(String(routeType.id));
                setStatus(String(routeType.status));
              }
            }}
          >
            Cancel
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