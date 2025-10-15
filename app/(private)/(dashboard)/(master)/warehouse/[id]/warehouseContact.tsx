"use client";
import React, { useEffect, useState } from "react";
import InputFields from "@/app/components/inputFields";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";

type Props = {
  values: Record<string, string>;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFieldValue: (field: string, value: string) => void;
  selectedCountry: { name: string; code?: string; flag?: string };
   setSelectedCountry: ( { name: string; code?: string; flag?: string }) ;
};

export default function WarehouseContactDetails({ values, errors, touched, handleChange, setFieldValue,selectedCountry, setSelectedCountry }: Props) {



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="flex flex-col gap-2">
          <InputFields
            required
            type="contact"
            label="Owner Contact Number"
            name="owner_number"
            setSelectedCountry={setSelectedCountry}
            selectedCountry={selectedCountry}
            value={`${values.owner_number ?? ''}`}
                     onChange={handleChange}

            error={errors?.owner_number && touched?.owner_number ? errors.owner_number : false}
          />
         {errors?.owner_number && touched?.owner_number && (
          <span className="text-xs text-red-500 mt-1">{errors.owner_number}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 ">
          <InputFields
            type="contact"
            label="Manager Contact Number"
            name="warehouse_manager_contact"
            setSelectedCountry={setSelectedCountry}
            selectedCountry={selectedCountry}
            value={values.warehouse_manager_contact ?? ''}
            onChange={handleChange}

           
            error={errors?.warehouse_manager_contact && touched?.warehouse_manager_contact ? errors.warehouse_manager_contact : false}
          />
           {errors?.warehouse_manager_contact && touched?.warehouse_manager_contact && (
          <span className="text-xs text-red-500 mt-1">{errors.warehouse_manager_contact}</span>
        )}
        </div>
       
      <div>
        <InputFields
          label="Owner Email"
          name="owner_email"
          value={values.owner_email}
          onChange={handleChange}
          error={errors?.owner_email && touched?.owner_email ? errors.owner_email : false}
        />
        {errors?.owner_email && touched?.owner_email && (
          <span className="text-xs text-red-500 mt-1">{errors.owner_email}</span>
        )}
      </div>
      
    </div>
  );
}
  