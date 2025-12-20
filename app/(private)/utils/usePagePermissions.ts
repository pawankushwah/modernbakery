"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubmenuBasedPermissions } from "@/app/services/allApi";
import { usePermissionManager } from "@/app/components/contexts/usePermission";
import { LinkDataType } from "@/app/(private)/data/dashboardLinks";

/**
 * Custom hook to handle page-level permissions.
 * Centralizes the logic for finding menu IDs and fetching permissions.
 */
export const usePagePermissions = (path: string) => {
  const { filteredMenu } = usePermissionManager();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const findMenuId = useCallback((menus: LinkDataType[], targetPath: string): number | string | undefined => {
    for (const menu of menus) {
      if (menu.href === targetPath) return menu.id;
      if (menu.children) {
        const id = findMenuId(menu.children, targetPath);
        if (id) return id;
      }
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!filteredMenu) return;

    const menuId = findMenuId(filteredMenu as LinkDataType[], path);
    if (menuId) {
      setLoading(true);
      getSubmenuBasedPermissions(menuId).then((res: any) => {
        if (res?.status === "success" && Array.isArray(res?.data)) {
          const perms = res.data.map((p: any) => p.name.toLowerCase());
          setPermissions(perms);
        }
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [filteredMenu, path, findMenuId]);

  /**
   * Helper function to check if a user has a specific permission.
   * e.g., can('create'), can('edit'), can('export')
   */
  const can = (action: string) => permissions.includes(action.toLowerCase());

  return {
    permissions,
    can,
    loading,
    // Add specific common checks for convenience
    canCreate: can('create'),
    canEdit: can('edit'),
    canDelete: can('delete'),
    canView: can('view') || can('list'),
    canExport: can('export')
  };
};
