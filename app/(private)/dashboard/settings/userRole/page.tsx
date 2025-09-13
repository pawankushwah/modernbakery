"use client";

import { useState, useContext, useEffect } from "react";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { SettingsContextValue, SettingsContext } from "../../contexts";
import Popup from "@/app/components/popUp";
import AddRole from "./addRole"; // form content

export default function UserRole() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [theme, setTheme] = useState<"layoutTheme" | "layoutTheme2">("layoutTheme");

  useEffect(() => {
    if (theme === "layoutTheme") {
      document.body.classList.add("layoutTheme");
      document.body.classList.remove("layoutTheme2");
    } else {
      document.body.classList.add("layoutTheme2");
      document.body.classList.remove("layoutTheme");
    }
  }, [theme]);

  const context = useContext<SettingsContextValue | undefined>(SettingsContext);
  if (!context) {
    throw new Error("Settings must be used within a SettingsContext.Provider");
  }
  const { dispatchSettings } = context;

  return (
    <div className="flex bg-white w-full h-[calc(100%-46px)] border border-[#E9EAEB] rounded-[8px] overflow-hidden">
      {/* Right Side Content */}
      <div className="p-[20px] hidden sm:block">
        <h1 className="text-[18px] font-semibold">Users & Roles</h1>

        {/* Toggle Layout Button */}
        <button
          className="bg-text-primary text-white p-2 rounded"
          onClick={() => dispatchSettings({ type: "layoutToggle", payload: {} })}
        >
          Toggle Layout
        </button>

        {/* Change Theme Btn */}
        <button
        className="bg-[#EA0A2A] text-white px-4 py-2 rounded"
        onClick={() =>
          setTheme(theme === "layoutTheme" ? "layoutTheme2" : "layoutTheme")
        }
      >
        Change Theme
      </button>

        {/* Add Role Btn (opens popup) */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="rounded-lg bg-[#EA0A2A] text-white px-4 py-[10px] flex items-center gap-[8px] cursor-pointer mt-4"
        >
          <Icon icon="tabler:plus" width={20} />
          <span className="md:block hidden">Add Role</span>
          <span className="hidden sm:block md:hidden">Add</span>
        </button>

        {/* Popup with AddRole Form */}
        {isPopupOpen && (
          <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
            <AddRole onClose={() => setIsPopupOpen(false)} />
          </Popup>
        )}
      </div>
    </div>
  );
}
