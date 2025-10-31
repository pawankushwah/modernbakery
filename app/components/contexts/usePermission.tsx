"use client";

import { useCallback } from "react";
import { usePermission as usePermCtx } from "./permissionContext";
import { initialLinkData } from "../../(private)/data/dashboardLinks";

// Lightweight custom hook that exposes permission context and a preload helper
export function usePermissionManager() {
  const ctx = usePermCtx();

  const preload = useCallback(async () => {
    try {
      const menus = Array.isArray(initialLinkData) && initialLinkData[0] ? initialLinkData[0].data : null;
      if (ctx && ctx.refreshPermissions) {
        await ctx.refreshPermissions(menus as any);
      }
    } catch (e) {
      console.error("usePermissionManager.preload failed", e);
    }
  }, [ctx]);

  return {
    ...ctx,
    preload,
    // convenience wrapper to call refreshPermissions with options
    refresh: async (options?: { roleId?: string; force?: boolean }) => {
      try {
        const menus = Array.isArray(initialLinkData) && initialLinkData[0] ? initialLinkData[0].data : null;
        return await ctx.refreshPermissions(menus as any, options);
      } catch (e) {
        console.error("usePermissionManager.refresh failed", e);
        return [] as any;
      }
    },
  };
}

export default usePermissionManager;
