"use client";
import { useState } from "react";
import FormCard from "./cordAddCustomer";

type FieldConfig = {
  label: string;
  name: string;
  type: "text" | "radio";
  options?: { label: string; value: string }[]; // sirf radio ke liye
};

const formFields: FieldConfig[] = [
  {
    label: "Enter Barcode",
    name: "barcode",
    type: "text",
  },
  {
    label: "Enable Promo Txn",
    name: "promoTxn",
    type: "radio",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    label: "Assign QR Value",
    name: "qrValue",
    type: "text",
  },
];

export default function TransactionPromo() {
  const [formData, setFormData] = useState<Record<string, string>>({
    barcode: "",
    promoTxn: "no",
    qrValue: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormCard title="Transaction & Promotion">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formFields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="font-medium text-sm leading-5 text-[#414651] mb-1">
              {field.label}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={formData[field.name] || ""}
                placeholder={field.label}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="px-3 py-2 bg-white h-[44px] rounded-[8px] border border-[#D5D7DA] shadow-sm"
              />
            )}

            {field.type === "radio" && field.options && (
              <div className="flex items-center gap-6 h-[44px] px-3 py-2">
                {field.options.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-sm text-[#344054]"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={opt.value}
                      checked={formData[field.name] === opt.value}
                      onChange={() => handleChange(field.name, opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </FormCard>
  );
}
