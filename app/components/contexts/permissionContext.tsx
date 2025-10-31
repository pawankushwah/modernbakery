"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { getRoleById } from "@/app/services/allApi";
import { LinkDataType } from "../../(private)/data/dashboardLinks";

type PermissionContextType = {
  filteredMenu: LinkDataType[] | null;
  loading: boolean;
  error?: string | null;
  refreshPermissions: (
    allMenus: LinkDataType[] | null,
    options?: { roleId?: string; force?: boolean }
  ) => Promise<LinkDataType[]>;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function filterMenuByPermissions(allMenus: LinkDataType[] = [], role: any): LinkDataType[] {
  if (!role || !Array.isArray(allMenus)) return [];
  const allowedMenus = (role?.menus || []).map((m: any) => m.menu?.name).filter(Boolean);
  const allowedSubMenus = (role?.menus || []).flatMap((m: any) => (Array.isArray(m.submenu) ? m.submenu.map((s: any) => s.name) : []));

  return allMenus
    .filter((menu) => allowedMenus.includes(menu.label))
    .map((menu) => {
      if (menu.children && menu.children.length > 0) {
        const children = menu.children as any[];
        const filteredChildren = children.filter((child: any) => allowedSubMenus.includes(child.label));
        return { ...menu, children: filteredChildren };
      }
      return menu;
    });
}

export async function fetchFilteredMenu(allMenus: LinkDataType[] | null, roleId?: string): Promise<LinkDataType[]> {
  try {
    const rid = roleId ?? (typeof window !== "undefined" ? localStorage.getItem("role") : null);
    if (!rid) return [];
    const res = await getRoleById(rid);
    if (res?.error || !res?.data) return [];
    return filterMenuByPermissions(allMenus || [], res.data || {});
  } catch (err) {
    console.error("fetchFilteredMenu error", err);
    return [];
  }
}

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [filteredMenu, setFilteredMenu] = useState<LinkDataType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRoleId = useRef<string | null>(null);
  const inFlight = useRef<Promise<LinkDataType[]> | null>(null);

  const refreshPermissions = useCallback(
    async (allMenus: LinkDataType[] | null, options?: { roleId?: string; force?: boolean }) => {
      const roleId = options?.roleId ?? (typeof window !== "undefined" ? localStorage.getItem("role") : null);
      if (!roleId) return [] as LinkDataType[];

      // If not forced and we already have menus for this role, return cached
      if (!options?.force && lastRoleId.current === roleId && filteredMenu) {
        return filteredMenu;
      }

      // If a fetch is already in-flight for the same role, return that promise
      if (inFlight.current) {
        return inFlight.current;
      }

      setLoading(true);
      setError(null);

      const promise = (async () => {
        try {
          const fm = await fetchFilteredMenu(allMenus, roleId);
          setFilteredMenu(fm);
          lastRoleId.current = roleId;
          return fm;
        } catch (err: any) {
          setError(err?.message || "Failed to load permissions");
          setFilteredMenu([]);
          return [] as LinkDataType[];
        } finally {
          setLoading(false);
          inFlight.current = null;
        }
      })();

      inFlight.current = promise;
      return promise;
    },
    [filteredMenu]
  );

  return (
    <PermissionContext.Provider value={{ filteredMenu, loading, error, refreshPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used within PermissionProvider");
  return ctx;
}

export default PermissionContext;
