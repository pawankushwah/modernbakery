"use client";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../dashboard/contexts";

export function useThemeToggle() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useThemeToggle must be used within SettingsContext.Provider");
  }

  const { dispatchSettings, settings } = context;

   
  const [theme, setTheme] = useState<string>(settings.theme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTheme(localStorage.theme)
    document.body.classList.remove("layoutTheme", "layoutTheme2");
    document.body.classList.add(theme);

    dispatchSettings({ type: "themeChange", payload: { theme } });
    dispatchSettings({ type: "layoutToggle", payload: { } });
  }, [theme, dispatchSettings]);

  const toggle = ()=>{
    const newTheme=theme === "layoutTheme2" ? "layoutTheme" : "layoutTheme2"
    localStorage.theme=newTheme
    setTheme(newTheme);

  }
    
  

  return { theme, toggle };
}
