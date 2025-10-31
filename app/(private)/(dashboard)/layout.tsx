"use client";

import DashboardLayout0 from "./layout0";
import DashboardLayout1 from "./layout1";
import { useEffect, useState } from "react";
import { isVerify } from "@/app/services/allApi";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import { ThemeProvider, useTheme } from "./contexts";
import usePermissionManager from "@/app/components/contexts/usePermission";
import { PermissionProvider } from "@/app/components/contexts/permissionContext";

type Role = {
    id: number;
    name: string;
    status: number;
    menus: RoleMenu[];
};

type MenuItem = {
    isActive: boolean;
    href?: string;
    label: string;
    leadingIcon: string;
    iconColor: string;
    trailingIcon?: string;
    children?: ChildrenItem[];
};

type ChildrenItem = {
    isActive?: boolean;
    href?: string;
    label?: string;
    leadingIcon?: string;
    iconColor?: string;
};

type PermissionSubmenu = {
    id: number;
    name: string;
    path: string;
    permissions: { permission_id: number; permission_name: string }[];
};

type PermissionMenu = {
    id: number;
    menu: { id: number; name: string; path: string };
    submenu: PermissionSubmenu[];
};

type Permission = {
    permission_id: number;
    permission_name: string;
};

type SubMenu = {
    id: number;
    name: string;
    path: string;
    permissions: Permission[];
};

type RoleMenu = {
    id: number;
    menu: {
        id: number;
        name: string;
        path: string;
    };
    submenu: SubMenu[];
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider>
            <PermissionProvider>
                <LayoutSelector>{children}</LayoutSelector>
            </PermissionProvider>
        </ThemeProvider>
    );
}
// Permission filtering lives in the PermissionContext now. Layout consumes that context via usePermissionManager.

function LayoutSelector({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { preload } = usePermissionManager();

    useEffect(() => {
        async function verifyUser(){
            const res = await isVerify();
            if(res.error) {
                localStorage.removeItem("token");
                return router.push("/");
            }
            try {
                await preload();
            } catch (e) {
                console.error("permission preload failed", e);
            }
            setLoading(false);
        }
        verifyUser();
    }, [preload]);

    return loading ? <Loading /> :(
        <>
            {theme === "layoutTheme" ? (
                <DashboardLayout0>{children}</DashboardLayout0>
            ) : (
                <DashboardLayout1>{children}</DashboardLayout1>
            )}
        </>
    );
}
