"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import Image from "next/image";

import ContainerCard from "@/app/components/containerCard";
import KeyValueData from "@/app/components/keyValueData";
import SummaryCard from "@/app/components/summaryCard";
import { useSnackbar } from "@/app/services/snackbarContext";
import { useLoading } from "@/app/services/loadingContext";
import { itemById } from "@/app/services/allApi";
import StatusBtn from "@/app/components/statusBtn2";

interface ItemType {
  id?: number;
  erp_code?: string;
  item_code?: string;
  name?: string;
  description?: string;
  brand?: string;
  image?: string;
  shelf_life?: string;
  commodity_goods_code?: string;
  excise_duty_code?: string;
  status?: number;
  is_taxable?: boolean;
  has_excies?: boolean;
  item_weight?: string;
  volume?: number;
  category?: {
    id?: number;
    name?: string;
    code?: string;
  };
  itemSubCategory?: {
    id?: number;
    name?: string;
    code?: string;
  };
}

export default function ViewPage() {
  const params = useParams();
  const id = Array.isArray(params.id)
    ? params.id[0] || ""
    : (params.id as string) || "";

  const [item, setItem] = useState<ItemType | null>(null);
  const { showSnackbar } = useSnackbar();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!id) return;

    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const res = await itemById(id);
        if (res.error) {
          showSnackbar(res.data?.message || "Unable to fetch item details", "error");
          return;
        }
        setItem(res.data);
      } catch (error) {
        showSnackbar("Unable to fetch item details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, setLoading, showSnackbar]);

  return (
    <>
      <div className="flex gap-x-[20px] flex-wrap md:flex-nowrap">
        {/* Left Section */}
        <div className="w-full md:w-[350px]">
          <ContainerCard>
            <div className="text-[18px] font-semibold mb-[25px]">
              Item Image
            </div>

            <div className="flex justify-center">
              <>{console.log(item)}</>
              <Image
                src={ "/logo.png"}
                alt={item?.name || "Item Image"}
                width={200}
                height={200}
                className="object-contain border rounded-lg"
              />
            </div>
          </ContainerCard>
        </div>

        {/* Right Section */}
        <div className="w-full flex flex-col gap-y-[15px]">
            {item?.description && (
            <ContainerCard className="w-full h-fit">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {item.description}
              </p>
            </ContainerCard>
          )}
          <ContainerCard className="w-full h-fit">
            <KeyValueData
              title="Item Information"
              data={[
                { key: "ERP Code", value: item?.erp_code || "-" },
                { key: "Brand", value: item?.brand || "-" },
                {
                  key: "Category",
                  value: item?.category?.name
                    ? `${item.category.code} - ${item.category.name}`
                    : "-",
                },
                {
                  key: "Sub Category",
                  value: item?.itemSubCategory?.name
                    ? `${item.itemSubCategory.code} - ${item.itemSubCategory.name}`
                    : "-",
                },
                { key: "Shelf Life", value: item?.shelf_life || "-" },
                { key: "Commodity Goods Code", value: item?.commodity_goods_code || "-" },
                { key: "Excise Duty Code", value: item?.excise_duty_code || "-" },
                { key: "Item Weight", value: item?.item_weight || "-" },
                { key: "Volume", value: item?.volume?.toString() || "-" },
                {
                  key: "Taxable",
                  value: item?.is_taxable ? "Yes" : "No",
                },
                {
                  key: "Has Excise",
                  value: item?.has_excies ? "Yes" : "No",
                },
              ]}
            />
          </ContainerCard>
        </div>
      </div>
    </>
  );
}