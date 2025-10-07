
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  companyList,
  countryList,
  regionList,
  routeList,
  warehouseType,
  routeType,
  getSubRegion,
  getCompanyCustomers,
  getCompanyCustomersType,
  itemCategory,
  itemSubCategory,
  channelList,
  userTypes,
  getCustomerType,
  salesmanTypeList,
  vehicleListData,
  customerCategoryList,
  customerSubCategoryList,
  itemList,
  getDiscountTypeList,
  menuList as getMenuList,
  salesmanList,
  agentCustomerList
} from "@/app/services/allApi";
import { vendorList } from "@/app/services/assetsApi";
import { shelvesList } from "@/app/services/merchandiserApi";

// Common interface for all dropdown data
export interface DropdownItem {
  id?: number | string;
  code?: string;
  name?: string;
  company_code?: string;
  company_name?: string;
  country_code?: string;
  country_name?: string;
  region_code?: string;
  region_name?: string;
  route_code?: string;
  route_name?: string;
  warehouse_code?: string;
  warehouse_name?: string;
  route_type_code?: string;
  route_type_name?: string;
  area_code?: string;
  area_name?: string;
  customer_code?: string;
  owner_name?: string;
  category_code?: string;
  category_name?: string;
  sub_category_code?: string;
  sub_category_name?: string;
  outlet_channel_code?: string;
  outlet_channel?: string;
  salesman_type_code?: string;
  salesman_type_name?: string;
  vehicle_code?: string;
  customer_category_code?: string;
  customer_category_name?: string;
  customer_sub_category_code?: string;
  customer_sub_category_name?: string;
  discount_code?: string;
  discount_name?: string;
  osa_code?: string;
  shelf_name?: string;
}

// Dropdown config: add new dropdowns here
const dropdownConfig = [


  {
    key: "companyList",
    api: companyList,
    option: (item: DropdownItem) => ({
      value: String(item.id ?? ""),
      label: item.company_code && item.company_name ? `${item.company_code} - ${item.company_name}` : item.company_name ?? ""
    })
  },
  {
    key: "countryList",
    api: countryList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.country_code && item.country_name ? `${item.country_code} - ${item.country_name}` : item.country_name ?? "" })
  },
  {
    key: "regionList",
    api: regionList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.region_code && item.region_name ? `${item.region_code} - ${item.region_name}` : item.region_name ?? "" })
  },
  {
    key: "routeList",
    api: () => routeList({}),
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.route_code && item.route_name ? `${item.route_code} - ${item.route_name}` : item.route_name ?? "" })
  },
  {
    key: "warehouseList",
    api: () => warehouseType(1),
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.warehouse_code && item.warehouse_name ? `${item.warehouse_code} - ${item.warehouse_name}` : item.warehouse_name ?? "" })
  },
  {
    key: "routeType",
    api: routeType,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.route_type_code && item.route_type_name ? `${item.route_type_code} - ${item.route_type_name}` : item.route_type_name ?? "" })
  },
  {
    key: "areaList",
    api: getSubRegion,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.area_code && item.area_name ? `${item.area_code} - ${item.area_name}` : item.area_name ?? "" })
  },
  {
    key: "companyCustomers",
    api: getCompanyCustomers,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.customer_code && item.owner_name ? `${item.customer_code} - ${item.owner_name}` : item.owner_name ?? "" })
  },
  {
    key: "companyCustomersType",
    api: getCompanyCustomersType,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.code && item.name ? `${item.code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "itemCategory",
    api: itemCategory,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.category_code && item.category_name ? `${item.category_code} - ${item.category_name}` : item.category_name ?? "" })
  },
  {
    key: "itemSubCategory",
    api: itemSubCategory,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.sub_category_code && item.sub_category_name ? `${item.sub_category_code} - ${item.sub_category_name}` : item.sub_category_name ?? "" })
  },
  {
    key: "channelList",
    api: channelList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.outlet_channel_code && item.outlet_channel ? `${item.outlet_channel_code} - ${item.outlet_channel}` : item.outlet_channel ?? "" })
  },
  {
    key: "customerType",
    api: getCustomerType,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.code && item.name ? `${item.code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "userTypes",
    api: userTypes,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.code && item.name ? `${item.code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "salesmanType",
    api: () => salesmanTypeList({}),
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.salesman_type_code && item.salesman_type_name ? `${item.salesman_type_code} - ${item.salesman_type_name}` : item.salesman_type_name ?? "" })
  },
  {
    key: "vehicleList",
    api: vehicleListData,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.vehicle_code ?? "-" })
  },
  {
    key: "customerCategory",
    api: customerCategoryList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.customer_category_code && item.customer_category_name ? `${item.customer_category_code} - ${item.customer_category_name}` : item.customer_category_name ?? "" })
  },
  {
    key: "customerSubCategory",
    api: customerSubCategoryList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.customer_sub_category_code && item.customer_sub_category_name ? `${item.customer_sub_category_code} - ${item.customer_sub_category_name}` : item.customer_sub_category_name ?? "" })
  },
  {
    key: "item",
    api: itemList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.code && item.name ? `${item.code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "discountType",
    api: getDiscountTypeList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.discount_code && item.discount_name ? `${item.discount_code} - ${item.discount_name}` : item.discount_name ?? "" })
  },
  {
    key: "menuList",
    api: getMenuList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.osa_code && item.name ? `${item.osa_code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "vendor",
    api: vendorList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.code && item.name ? `${item.code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "salesman",
    api: salesmanList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.osa_code && item.name ? `${item.osa_code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "agentCustomer",
    api: agentCustomerList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.osa_code && item.name ? `${item.osa_code} - ${item.name}` : item.name ?? "" })
  },
  {
    key: "shelves",
    api: shelvesList,
    option: (item: DropdownItem) => ({ value: String(item.id ?? ""), label: item.shelf_name ?? "" })
  }
];

type DropdownOptions = { value: string; label: string };
const dropdownKeys = [
  "companyList", "countryList", "regionList", "routeList", "warehouseList", "routeType", "areaList", "companyCustomers", "companyCustomersType", "itemCategory", "itemSubCategory", "channelList", "customerType", "userTypes", "salesmanType", "vehicleList", "customerCategory", "customerSubCategory", "item", "discountType", "menuList", "vendor", "salesman", "agentCustomer", "shelves"
] as const;
const optionKeys = [
  "companyOptions", "countryOptions", "regionOptions", "routeOptions", "warehouseOptions", "routeTypeOptions", "areaOptions", "companyCustomersOptions", "companyCustomersTypeOptions", "itemCategoryOptions", "itemSubCategoryOptions", "channelOptions", "customerTypeOptions", "userTypeOptions", "salesmanTypeOptions", "vehicleOptions", "customerCategoryOptions", "customerSubCategoryOptions", "itemOptions", "discountOptions", "menuOptions", "vendorOptions", "salesmanOptions", "agentCustomerOptions", "shelvesOptions"
] as const;

type AllDropdownListDataContextType = {
  [K in typeof dropdownKeys[number]]: DropdownItem[]
} & {
  [K in typeof optionKeys[number]]: DropdownOptions[]
} & {
  refreshDropdowns: () => Promise<void>;
  loading: boolean;
};

const AllDropdownListDataContext = createContext<AllDropdownListDataContextType | undefined>(undefined);

export const useAllDropdownListData1 = () => {
  const context = useContext(AllDropdownListDataContext);
  if (!context) throw new Error("useAllDropdownListData must be used within AllDropdownListDataProvider");
  return context;
};

export const AllDropdownListDataProvider1 = ({ children }: { children: ReactNode }) => {
  const dropdownKeys = [
    "companyList", "countryList", "regionList", "routeList", "warehouseList", "routeType", "areaList", "companyCustomers", "companyCustomersType", "itemCategory", "itemSubCategory", "channelList", "customerType", "userTypes", "salesmanType", "vehicleList", "customerCategory", "customerSubCategory", "item", "discountType", "menuList", "vendor", "salesman", "agentCustomer", "shelves"
  ] as const;

  const optionKeys = [
    "companyOptions", "countryOptions", "regionOptions", "routeOptions", "warehouseOptions", "routeTypeOptions", "areaOptions", "companyCustomersOptions", "companyCustomersTypeOptions", "itemCategoryOptions", "itemSubCategoryOptions", "channelOptions", "customerTypeOptions", "userTypeOptions", "salesmanTypeOptions", "vehicleOptions", "customerCategoryOptions", "customerSubCategoryOptions", "itemOptions", "discountOptions", "menuOptions", "vendorOptions", "salesmanOptions", "agentCustomerOptions", "shelvesOptions"
  ] as const;

  type InitialDropdownsType = { [K in typeof dropdownKeys[number]]: DropdownItem[] };
  type InitialOptionsType = { [K in typeof optionKeys[number]]: DropdownOptions[] };

  const initialDropdowns: InitialDropdownsType = dropdownKeys.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as InitialDropdownsType);

  const initialOptions: InitialOptionsType = optionKeys.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as InitialOptionsType);

  const [dropdowns, setDropdowns] = useState(initialDropdowns);
  const [options, setOptions] = useState(initialOptions);
  const [loading, setLoading] = useState(false);

  // Helper to normalize API response
  const normalize = (r: unknown): DropdownItem[] => {
    if (
      r &&
      typeof r === "object" &&
      "data" in r &&
      Array.isArray((r as { data?: unknown }).data)
    ) {
      return (r as { data: DropdownItem[] }).data;
    }
    if (Array.isArray(r)) return r as DropdownItem[];
    return r ? [r as DropdownItem] : [];
  };

  // Refresh all dropdowns
  const refreshDropdowns = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(dropdownConfig.map((cfg) => cfg.api()));
      const keyMap: Record<string, keyof typeof initialOptions> = {
        companyList: "companyOptions",
        countryList: "countryOptions",
        regionList: "regionOptions",
        routeList: "routeOptions",
        warehouseList: "warehouseOptions",
        routeType: "routeTypeOptions",
        areaList: "areaOptions",
        companyCustomers: "companyCustomersOptions",
        companyCustomersType: "companyCustomersTypeOptions",
        itemCategory: "itemCategoryOptions",
        itemSubCategory: "itemSubCategoryOptions",
        channelList: "channelOptions",
        customerType: "customerTypeOptions",
        userTypes: "userTypeOptions",
        salesmanType: "salesmanTypeOptions",
        vehicleList: "vehicleOptions",
        customerCategory: "customerCategoryOptions",
        customerSubCategory: "customerSubCategoryOptions",
        item: "itemOptions",
        discountType: "discountOptions",
        menuList: "menuOptions",
        vendor: "vendorOptions",
        salesman: "salesmanOptions",
        agentCustomer: "agentCustomerOptions",
        shelves: "shelvesOptions"
      };
      const newDropdowns: typeof initialDropdowns = { ...initialDropdowns };
      const newOptions: typeof initialOptions = { ...initialOptions };
      dropdownConfig.forEach((cfg, idx) => {
        const data = normalize(results[idx]);
        newDropdowns[cfg.key as keyof typeof newDropdowns] = data;
        const optionKey = keyMap[cfg.key] || (cfg.key + "Options");
        newOptions[optionKey as keyof typeof newOptions] = data.map(cfg.option);
      });
      setDropdowns(newDropdowns);
      setOptions(newOptions);
    } catch (err) {
      setDropdowns(initialDropdowns);
      setOptions(initialOptions);
      console.error("Error loading dropdowns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDropdowns();
  }, []);

  // To add a new dropdown, just add to dropdownConfig above

  return (
    <AllDropdownListDataContext.Provider
      value={{
        ...dropdowns,
        ...options,
        refreshDropdowns,
        loading
      } as AllDropdownListDataContextType}
    >
      {children}
    </AllDropdownListDataContext.Provider>
  );
};

