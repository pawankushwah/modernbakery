"use client";

import { useAllDropdownListData } from "@/app/components/contexts/allDropdownListData";
import Table, { TableDataType } from "@/app/components/customTable";
import Toggle from "@/app/components/toggle";
import { Icon } from "@iconify-icon/react";
import { JSX, useEffect, useMemo, useRef, useState } from "react";

type Permission = { permission_id: number; permission_name: string };
type Submenu = { id?: number | null; uuid?: string | null; name?: string | null; path?: string | null; permissions?: Permission[]; [k: string]: any };
type MenuInner = { id?: number | null; uuid?: string | null; name?: string | null; path?: string | null; submenu?: Submenu[]; sub_menus?: Submenu[]; [k: string]: any };
type MenuWrapper = { menu?: MenuInner | null };
type RoleRow = { id: number | string; uuid?: string | null; name?: string | null; guard_name?: string | null; menus?: MenuWrapper[]; sub_menus?: any };

const DEFAULT_PERMS = ["view", "create", "edit", "delete"];

function deepClone<T>(v: T): T {
    return JSON.parse(JSON.stringify(v));
}

export default function RolesPermissionTable({
    menus: initialMenus = [],
    activeIndex = 0,
    onMenusChange,
}: {
    menus?: RoleRow[];
    activeIndex?: number;
    onMenusChange?: (menus: RoleRow[], permissionIds: number[]) => void;
}): JSX.Element {
    const { permissions } = useAllDropdownListData();

    const [menus, setMenus] = useState<RoleRow[]>(Array.isArray(initialMenus) ? deepClone(initialMenus) : []);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        if (Array.isArray(initialMenus)) setMenus(deepClone(initialMenus));
    }, [initialMenus]);

    // prevent notifying parent repeatedly (causes depth exceeded loop)
    const lastSentRef = useRef<string | null>(null);

    // helper: get submenus array for a RoleRow (support both submenu and sub_menus)
    const getSubmenus = (role: RoleRow): Submenu[] => {
        if (!role) return [];
        const mw = Array.isArray(role.menus) && role.menus.length > 0 ? role.menus[0] : undefined;
        const inner = mw?.menu ?? (role as any);
        return (inner?.sub_menus ?? inner?.submenu ?? []) as Submenu[];
    };

    // helper: set submenus for a role (preserve field name that existed)
    const setSubmenusForRole = (role: RoleRow, newSubs: Submenu[]): RoleRow => {
        const copy = deepClone(role);
        const mw = Array.isArray(copy.menus) && copy.menus.length > 0 ? copy.menus[0] : undefined;
        if (mw && mw.menu) {
            if (mw.menu.hasOwnProperty("sub_menus")) mw.menu.sub_menus = newSubs;
            else mw.menu.submenu = newSubs;
        } else {
            // fallback to top-level fields
            if ((copy as any).hasOwnProperty("sub_menus")) (copy as any).sub_menus = newSubs;
            else (copy as any).submenu = newSubs;
        }
        return copy;
    };

    const permExistsIn = (perms: Permission[] | undefined, key: string) => {
        if (!Array.isArray(perms)) return false;
        const k = key.toLowerCase();
        return perms.some((p) => {
            const pn = String(p.permission_name || "").toLowerCase();
            if (k === "view") return pn.includes("view") || pn.includes("list");
            return pn.includes(k);
        });
    };

    const extractPermissionIds = (ms: RoleRow[]) => {
        const set = new Set<number>();
        for (const r of ms) {
            const subs = getSubmenus(r);
            for (const s of subs) {
                const perms = s?.permissions ?? [];
                for (const p of perms) if (typeof p.permission_id === "number") set.add(p.permission_id);
            }
        }
        return Array.from(set);
    };

    const permissionIdForName = (name: string | undefined) => {
        if (!permissions || !Array.isArray(permissions)) return undefined;
        const key = String(name || "").toLowerCase();
        const found = permissions.find((p: any) => {
            const n = String(p.name || "").toLowerCase();
            return n === key || n.includes(key);
        });
        return found?.id;
    };

    // Toggle a permission on a specific submenu of the active menu
    const handleToggle = (submenuId: number | string, field: "all" | string) => {
        setMenus((prev) => {
            const newMenus = deepClone(prev);
            const idx = Math.max(0, Math.min(activeIndex, newMenus.length - 1));
            const role = newMenus[idx];
            if (!role) return prev;

            const subs = getSubmenus(role);
            // derive perm list names
            const permList = Array.isArray(permissions)
                ? permissions.map((p: any) => String(p.name ?? "").toLowerCase()).filter(Boolean)
                : DEFAULT_PERMS;

            const newSubs = subs.map((s) => {
                if (String(s.id) !== String(submenuId)) return s;
                let perms = Array.isArray(s.permissions) ? deepClone(s.permissions) : [];
                if (field === "all") {
                    // check if all currently exist
                    const allCurrently = permList.every((pname) => permExistsIn(perms, pname));
                    if (!allCurrently) {
                        // add missing
                        for (const pname of permList) {
                            if (!permExistsIn(perms, pname)) {
                                const id = permissionIdForName(pname) ?? Date.now();
                                perms.push({ permission_id: id, permission_name: pname });
                            }
                        }
                    } else {
                        // remove all known permList
                        perms = perms.filter((p) => {
                            const pn = String(p.permission_name || "").toLowerCase();
                            return !permList.includes(pn);
                        });
                    }
                } else {
                    const willAdd = !permExistsIn(perms, field);
                    if (willAdd) {
                        const id = permissionIdForName(field) ?? Date.now();
                        perms.push({ permission_id: id, permission_name: field });
                    } else {
                        perms = perms.filter((p) => {
                            const pn = String(p.permission_name || "").toLowerCase();
                            if (field === "view") return !(pn.includes("view") || pn.includes("list"));
                            return !pn.includes(field.toLowerCase());
                        });
                    }
                }
                return { ...s, permissions: perms };
            });

            // set updated submenus back to the role
            newMenus[idx] = setSubmenusForRole(role, newSubs);
            setRefreshKey((k) => k + 1);
            return newMenus;
        });
    };

    // notify parent AFTER render asynchronously, but only when menus actually changed
    useEffect(() => {
        const ids = extractPermissionIds(menus);
        const json = JSON.stringify(menus || []);
        if (lastSentRef.current === json) return; // already sent this exact shape
        lastSentRef.current = json;

        if (typeof onMenusChange === "function") {
            setTimeout(() => {
                try {
                    onMenusChange(deepClone(menus), ids);
                } catch (e) {
                    // swallow
                }
            }, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menus]);

    // build permission columns
    const permissionColumns = useMemo(() => {
        if (!permissions || !Array.isArray(permissions)) return [];
        return permissions.map((p: any) => ({
            key: p.name ?? "",
            label: p.name ?? "",
            render: (row: TableDataType) => {
                const m = row as unknown as Submenu;
                const checked = permExistsIn(m.permissions, p.name);
                return <Toggle isChecked={checked} onChange={() => handleToggle(m.id as number | string, p.name as any)} />;
            },
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissions, menus]);

    // build table config for submenus of active menu
    const tableConfig = useMemo(() => {
        const active = menus && menus.length > 0 ? menus[Math.max(0, Math.min(activeIndex, menus.length - 1))] : undefined;
        const subrows = active ? getSubmenus(active) : [];
        return {
            columns: [
                { key: "name", label: "Submenu", width: 200, sticky: "left", align: "left", render: (row: TableDataType) => (row as any).name || (row as any).title || "-" },
                {
                    key: "search",
                    label: <Icon icon="lucide:search" />,
                    align: "center",
                    render: (row: TableDataType) => {
                        const r = row as unknown as Submenu;
                        // determine all-perm for this submenu
                        const permList = Array.isArray(permissions)
                            ? permissions.map((p: any) => String(p.name ?? "").toLowerCase()).filter(Boolean)
                            : DEFAULT_PERMS;
                        const allChecked = permList.every((pname) => permExistsIn(r.permissions, pname));
                        return <Toggle isChecked={allChecked} onChange={() => handleToggle(r.id as number | string, "all")} />;
                    },
                },
                ...permissionColumns,
            ],
            rows: subrows,
        };
        // dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissionColumns, menus, activeIndex, refreshKey]);

    return (
        <Table
            refreshKey={refreshKey}
            data={(tableConfig.rows || []) as unknown as TableDataType[]}
            config={tableConfig as any}
        />
    );
}