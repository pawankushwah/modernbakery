"use client";

import InputFields from "@/app/components/inputFields";
import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import React, { useEffect, useState } from "react";
type Props = {
  values: Record<string, string>;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFieldValue: (field: string, value: string) => void;
};
export default function WarehouseLocationInfo({ values, errors, touched, handleChange, setFieldValue }: Props) {
   const [skeleton, setSkeleton] = useState({
              region_id: false,
              area_id: false,
          });
  const { regionOptions, loading, areaOptions,fetchAreaOptions } = useAllDropdownListData();

  const prevRegionRef = React.useRef<string | undefined>(undefined);

  useEffect(() => {
    const prev = prevRegionRef.current;
    if (prev !== values.region_id) {
      if (prev !== undefined) {
        setFieldValue("area_id", "");
      }
      if (values.region_id) {
        fetchAreaOptions(values.region_id);
      }
    } else {
      if (values.region_id && (!areaOptions)) {
        fetchAreaOptions(values.region_id);
      }
    }

    prevRegionRef.current = values.region_id;
  }, [values.region_id, areaOptions?.length, fetchAreaOptions, setFieldValue]);

  // Keep localAreaOptions in sync with context areaOptions

  return (
    <>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Row 1 */}
        <div>
          <InputFields
            required
            label="Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            options={[
              { value: 'Urban', label: 'Urban' },
              { value: 'Suburban', label: 'Suburban' },
              { value: 'Rural', label: 'Rural' },
            ]}
            error={errors?.location && touched?.location ? errors.location : false}
          />
          {errors?.location && touched?.location && (
            <span className="text-xs text-red-500 mt-1">{errors.location}</span>
          )}
        </div>
        <div>
          <InputFields
            required
            label="City"
            name="city"
            value={values.city}
            onChange={handleChange}
            error={errors?.city && touched?.city ? errors.city : false}
          />
          {errors?.city && touched?.city && (
            <span className="text-xs text-red-500 mt-1">{errors.city}</span>
          )}
        </div>
        <div>
          <InputFields
            required
            label="Region"
            name="region_id"
            disabled={true}
            showSkeleton={skeleton.region_id}
            value={values.region_id}
            onChange={handleChange}
            options={regionOptions}
            error={errors?.region_id && touched?.region_id ? errors.region_id : false}
          />
          {errors?.region_id && touched?.region_id && (
            <span className="text-xs text-red-500 mt-1">{errors.region_id}</span>
          )}
        </div>
        <div>
          <InputFields
            required
            label="Area"
            disabled={true}
            showSkeleton={skeleton.area_id}
            name="area_id"
            
            value={values.area_id}
            onChange={handleChange}
            options={areaOptions}
            error={errors?.area_id && touched?.area_id ? errors.area_id : false}
          />
          {errors?.area_id && touched?.area_id && (
            <span className="text-xs text-red-500 mt-1">{errors.area_id}</span>
          )}
        </div>
        
        <div>
          <InputFields
            label="Town/Village"
            name="town_village"
            value={values.town_village}
            onChange={handleChange}
            error={errors?.town_village && touched?.town_village ? errors.town_village : false}
          />
          {errors?.town_village && touched?.town_village && (
            <span className="text-xs text-red-500 mt-1">{errors.town_village}</span>
          )}
        </div>
        <div>
          <InputFields
            label="Street"
            name="street"
            value={values.street}
            onChange={handleChange}
            error={errors?.street && touched?.street ? errors.street : false}
          />
          {errors?.street && touched?.street && (
            <span className="text-xs text-red-500 mt-1">{errors.street}</span>
          )}
        </div>
        <div>
          <InputFields
            label="Landmark"
            name="landmark"
            value={values.landmark}
            onChange={handleChange}
            error={errors?.landmark && touched?.landmark ? errors.landmark : false}
          />
          {errors?.landmark && touched?.landmark && (
            <span className="text-xs text-red-500 mt-1">{errors.landmark}</span>
          )}
        </div>
        <div>
                        <InputFields
                            required
                            label="Latitude"
                            type="number"
                            name="latitude"
                            value={values.latitude}
                            onChange={handleChange}
                            error={errors?.latitude && touched?.latitude ? errors.latitude : false}
                        />
                        {errors?.latitude && touched?.latitude && (
                            <span className="text-xs text-red-500 mt-1">{errors.latitude}</span>
                        )}
                    </div>
                    <div>
                        <InputFields
                            required
                            label="Longitude"
                            name="longitude"
                            type="number"
                            value={values.longitude}
                            onChange={handleChange}
                            error={errors?.longitude && touched?.longitude ? errors.longitude : false}
                        />
                        {errors?.longitude && touched?.longitude && (
                            <span className="text-xs text-red-500 mt-1">{errors.longitude}</span>
                        )}
                    </div>
      </div>
    </>
  );
}