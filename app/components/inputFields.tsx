"use client";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify-icon/react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  name?: string;
  value?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options?: Option[];
  type?: "text" | "select" | "file" | "date";
  id?: string;
  width?: string;
  error?: string | false;
  disabled?: boolean;
};

export default function InputFields({
  label,
  name,
  id,
  value,
  onChange,
  options,
  type = "text",
  width = "max-w-[406px]",
  error,
  disabled,
  onBlur
}: Props) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMulti = options && options.length > 0 && typeof isSingle !== 'undefined' && isSingle === false;
  const selectedValues: string[] = Array.isArray(value) ? value : [];

  const filteredOptions = options?.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  ) || [];

  useEffect(() => {
    if (!isMulti || !dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen, isMulti]);

  type MultiSelectChangeEvent = {
    target: {
      value: string[];
      name?: string;
    };
  };
  
  const createMultiSelectEvent = (vals: string[]): MultiSelectChangeEvent => {
    return { target: { value: vals, name } };
  };
  
  const safeOnChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | MultiSelectChangeEvent
  ) => {
    if (typeof onChange === 'function') {
      onChange(event as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    } else {
      console.warn('InputFields: onChange prop is not a function. You must pass (e) => setValue(e.target.value)');
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      safeOnChange(createMultiSelectEvent([]));
    } else {
      safeOnChange(createMultiSelectEvent(filteredOptions.map(opt => opt.value)));
    }
  };

  const handleCheckbox = (val: string) => {
    safeOnChange(
      createMultiSelectEvent(
        selectedValues.includes(val)
          ? selectedValues.filter(v => v !== val)
          : [...selectedValues, val]
      )
    );
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${width}`}>
      <label
        htmlFor={id ?? name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {isMulti ? (
        <div className="relative" ref={dropdownRef}>
          {/* multi select code stays same */}
        </div>
      ) : options && options.length > 0 ? (
        <select
          id={id ?? name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          className={`border h-[44px] w-full rounded-md px-3 mt-[6px] ${error ? "border-red-500" : "border-gray-300"
            } text-gray-900`}
        >
          <option value="" disabled hidden className="text-gray-400">
            {`Select ${label}`}
          </option>
          {options.map((opt, idx) => (
            <option key={`${opt.value}-${idx}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <input
          id={id ?? name}
          name={name}
          type="file"
          onChange={onChange}
          onBlur={onBlur}
          className={`border h-[44px] w-full rounded-md px-3 py-1 mt-[6px] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${error ? "border-red-500" : "border-gray-300"
            }`}
        />
      ) : type === "date" ? (
        <div className="relative">
          <input
            id={id ?? name}
            name={name}
            type="date"
            value={value ?? ""}
            onChange={safeOnChange}
            disabled={disabled}
            onBlur={onBlur}
            className={`border h-[44px] w-full rounded-md px-3 pr-10 mt-[6px] text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 ${error ? "border-red-500" : "border-gray-300"}`}
          />
          
        </div>
      ) : (
        <input
          id={id ?? name}
          name={name}
          type="text"
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          onBlur={onBlur}
          className={`border h-[44px] w-full rounded-md px-3 mt-[6px] text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 ${error ? "border-red-500" : "border-gray-300"}`}
          placeholder={`Enter ${label}`}
        />
      )}

      {error && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}
