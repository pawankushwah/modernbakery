"use client";

import KeyValueData from "@/app/(private)/(dashboard)/(master)/customer/[customerId]/keyValueData";
import ContainerCard from "@/app/components/containerCard";
import Table, { configType } from "@/app/components/customTable";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import Logo from "@/app/components/logo";
import { salesmanLoadByUuid } from "@/app/services/agentTransaction";
import { useLoading } from "@/app/services/loadingContext";
import { useSnackbar } from "@/app/services/snackbarContext";
import { Icon } from "@iconify-icon/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


interface CustomerItem {
  id: number;
  uuid: string;
  osa_code: string;
  salesman_type: string;
  warehouse: { code: string; name: string };
  route: { code: string; name: string };
  salesman: { code: string; name: string };
  projecttype: { code: string; name: string };
  details: Array<{
    id: number;
    uuid: string;
    osa_code: string;
    item: { id: number; code: string; name: string };
    uom: number;
    qty: number;
    price: string;
    status: number;
  }>;
  customer_code: string;
  customer: string;
  contact_person: string;
  contact_no1: string;
  contact_no2: string;
  road_street: string;
  town: string;
  landmark: string;
  district: string;
  balance: number;
  payment_type: string;
  bank_name: string;
  bank_account_number: string;
  creditday: string;
  tin_no: string;
  accuracy: string;
  creditlimit: number;
  guarantee_name: string;
  guarantee_amount: number;
  guarantee_from: string;
  guarantee_to: string;
  totalcreditlimit: number;
  credit_limit_validity: string;
  vat_no: string;
  longitude: string;
  latitude: string;
  threshold_radius: number;
  dchannel_id: number;
  status: number;
  get_outlet_channel: {
    outlet_channel: string;
    outlet_channel_code: string;
  };
  get_region: { region_code: string; region_name: string };
  get_area: { area_code: string; area_name: string };
}



const backBtnUrl = "/salesmanLoad";

export default function ViewPage() {

  const params = useParams();
  const uuid = Array.isArray(params.uuid)
    ? params.uuid[0] || ""
    : (params.uuid as string) || "";

  const [customer, setCustomer] = useState<CustomerItem | null>(null);

  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();

  const title = `Load ${customer?.osa_code || "-"}`;



  // Function to download current card as PDF
  const handleDownload = async () => {
    try {
      const element = document.getElementById("");
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${customer?.osa_code || "Salesman_Load"}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  // Function to print page
  const handlePrint = () => {
    window.print();
  };





  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await salesmanLoadByUuid(uuid);
        if (res.error) {
          showSnackbar(
            res.data?.message || "Unable to fetch Salesman Load Details",
            "error"
          );
          return;
        }
        setCustomer(res.data);
      } catch {
        showSnackbar("Unable to fetch Salesman Load Details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid, setLoading, showSnackbar]);

  // ✅ Table configuration
  const columns: configType["columns"] = [
    { key: "item", label: "Item" },
    { key: "uom", label: "UOM" },
    { key: "qty", label: "Quantity" },
    { key: "price", label: "Price" },
  ];

  // ✅ Prepare data for table
  const tableData =
    customer?.details?.map((detail) => ({
      item: detail.item
        ? `${detail.item.code} - ${detail.item.name}`
        : "-",
      uom: detail.uom !== undefined && detail.uom !== null ? String(detail.uom) : "-",
      qty: detail.qty !== undefined && detail.qty !== null ? String(detail.qty) : "-",
      price: detail.price !== undefined && detail.price !== null ? String(detail.price) : "-",
    })) || [];

  return (
    <>
      {/* ---------- Header ---------- */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={backBtnUrl}>
          <Icon
            icon="lucide:arrow-left"
            width={24}
            className="text-gray-700 hover:text-primary transition"
          />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">
          {title}
        </h1>
      </div>

      {/* ---------- Main Card ---------- */}
      <ContainerCard className="rounded-xl shadow-sm space-y-8 bg-white p-6">
        {/* Top Section */}
        <div className="flex justify-between flex-wrap gap-6 items-start">
          <Logo type="full" />

          <div className="text-right">
            <h2 className="text-4xl font-bold text-gray-400 uppercase mb-2">
              Load
            </h2>
            <p className="text-primary text-sm tracking-[5px]">
              {customer?.osa_code || "-"}
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* ---------- Info Section ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left side - details */}
          <div>
            <KeyValueData
              data={[
                {
                  key: "Warehouse",
                  value:
                    customer?.warehouse?.code && customer?.warehouse?.name
                      ? `${customer.warehouse.code} - ${customer.warehouse.name.split("-")[0]} - (${customer.warehouse.name.split("-")[1]})`
                      : "-",
                },
                {
                  key: "Route",
                  value: customer?.route
                    ? `${customer.route.code} - ${customer.route.name}`
                    : "-",
                },
                {
                  key: "Salesman Type",
                  value: customer?.salesman_type || "-",
                },
                {
                  key: "Salesman",
                  value: customer?.salesman
                    ? `${customer.salesman.code} - ${customer.salesman.name}`
                    : "-",
                },
              ]}
            />
          </div>

          {/* Right side - image */}
          <div className="flex justify-end items-center">
            <Image
              src="/logo.png"
              alt="Salesman Signature"
              width={300}
              height={300}
            // className="rounded-lg object-contain shadow-sm"
            />
          </div>
        </div>


        {/* ---------- Table ---------- */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Load Items
          </h3>
          <Table
            data={tableData}
            config={{ columns }}
          />
        </div>

        {/* ---------- Footer Buttons ---------- */}
        {/* ---------- Footer Buttons ---------- */}
        <div className="flex flex-wrap justify-end gap-4 pt-4 border-t border-gray-200">
          <SidebarBtn
            leadingIcon="lucide:download"
            leadingIconSize={20}
            label="Download"
            onClick={handleDownload}
          />
          <SidebarBtn
            isActive
            leadingIcon="lucide:printer"
            leadingIconSize={20}
            label="Print Now"
            onClick={handlePrint}
          />
        </div>

      </ContainerCard>
    </>
  );
}
