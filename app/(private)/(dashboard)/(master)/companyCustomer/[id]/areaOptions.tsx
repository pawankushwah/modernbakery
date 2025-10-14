import { useEffect, useRef } from "react";
import { useFormikContext, FormikContextType } from "formik";

import type { CompanyCustomerFormValues } from "./page";

export default function RegionWatcher({ fetchAreaOptions }: { fetchAreaOptions: (region: string) => void }) {
  const { values, setFieldValue }: FormikContextType<CompanyCustomerFormValues> = useFormikContext<CompanyCustomerFormValues>();
  const prevRegionRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const prev = prevRegionRef.current;
    if (prev !== values.region) {
      if (prev !== undefined) {
        setFieldValue("area", "");
      }
      if (values.region) {
        fetchAreaOptions(values.region);
      }
    }
    prevRegionRef.current = values.region;
  }, [values.region, fetchAreaOptions, setFieldValue]);

  return null;
}
