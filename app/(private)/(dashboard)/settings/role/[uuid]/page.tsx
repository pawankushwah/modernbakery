"use client";

import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import InputFields from "@/app/components/inputFields";
import SidebarBtn from "@/app/components/dashboardSidebarBtn";
import { useSnackbar } from "@/app/services/snackbarContext";
import { addRoles, getRoleById, editRoles, menuList, submenuList } from "@/app/services/allApi";
import { useLoading } from "@/app/services/loadingContext";
import RolesPermissionTable from "./table2";
import ContainerCard from "@/app/components/containerCard";
import TabBtn from "@/app/components/tabBtn";

const RoleSchema = Yup.object().shape({
  name: Yup.string().required("Role Name is required."),
  // removed permissions validation — we use the permissions table (menus JSON) instead
});

export default function AddEditRole() {
  // const { permissions } = useAllDropdownListData();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const [initialValues, setInitialValues] = useState<RoleFormValues>({
    name: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const { setLoading } = useLoading();
  useEffect(() => setLoading(true), []);
  const [guardName, setGuardName] = useState<"api" | "web">("api");
  const [activeTab, onTabClick] = useState(0);

  // hold full nested menus -> menu -> submenu -> permissions JSON from table
  const [roleTableData, setRoleTableData] = useState<any[]>([]);
  // optional: keep last permission ids computed by table (if needed)
  const [tablePermissionIds, setTablePermissionIds] = useState<number[]>([]);

  type RoleFormValues = {
    name: string;
  };
  // console.log(roleTableRows)
  useEffect(() => {
    if (params?.uuid && params.uuid !== "add") {
      // console.log("Edit mode for role ID:", params.uuid);
      setIsEditMode(true);
      setLoading(true);
      (async () => {
        try {
          const [roleRes, menuRes, submenuRes] = await Promise.all([
            getRoleById(String(params.uuid)),
            menuList(),
            submenuList(),
          ]);

          if (roleRes.error) {
            showSnackbar(roleRes?.data?.message || "Failed to fetch role data", "error");
            return;
          }
          let roleData = roleRes?.data || [];
          const menusFromRes = Array.isArray(roleData?.menus) ? roleData.menus : [];

          // extract menus and submenus from their APIs
          if(menuRes.error){
            showSnackbar(menuRes?.data?.message || "Failed to fetch menu data", "error");
            return;
          }
          const menusFromApi = menuRes?.data || [];

          if(submenuRes.error){
            showSnackbar(submenuRes?.data?.message || "Failed to fetch submenu data", "error");
            return;
          }
          const submenusFromApi = submenuRes?.data || [];

          const baseRows = (Array.isArray(menusFromApi) ? menusFromApi : []).map((m: any) => {
            // find submenus that belong to this menu (submenu.menu.id or submenu.menu?.id)
            const children = (Array.isArray(submenusFromApi) ? submenusFromApi : []).filter(
              (sm: any) => {
                const parentId = sm?.menu?.id || null;
                return parentId === m.id || parentId === m.uuid || sm?.menu?.code === m.osa_code;
              }
            ).map((sm: any) => ({
              id: sm.id,
              uuid: sm.uuid,
              osa_code: sm.osa_code ?? sm.code,
              name: sm.name,
              permissions: Array.isArray(sm.permissions) ? sm.permissions : [],
              // include any other submenu fields you want to keep
              path: sm.path,
            }));

            // simplified menu shape: { id, uuid, osa_code, name, submenu: [...] , ...other }
            return {
              id: m.id,
              uuid: m.uuid,
              osa_code: m.osa_code ?? m.code,
              name: m.name,
              // include any other menu fields you want to keep
              path: m.path,
              submenu: children,
            };
          });

          // if the role API returned menus/permissions, merge them into baseRows
          if (menusFromRes && menusFromRes.length) {
            // helper to match menus/submenus by id/uuid/osa_code
            const findMatch = (arr: any[], item: any) =>
              arr.find((a: any) =>
                // support both wrapped { menu: { ... } } and flat objects
                (a.menu && (a.menu.id === item.id || a.menu.uuid === item.uuid || a.menu.osa_code === item.osa_code))
                || a.id === item.id || a.uuid === item.uuid || a.osa_code === item.osa_code || a.osa_code === item.code
              );

            const merged = baseRows.map((base: any) => {
              // incoming item could be either menu object or wrapper { menu: {...} }
              const incomingItem = findMatch(menusFromRes, base)
                || menusFromRes.find((r: any) => {
                  const inner = r.menu ?? r;
                  return inner?.id === base.id || inner?.uuid === base.uuid || inner?.osa_code === base.osa_code || inner?.osa_code === base.code;
                });
              if (!incomingItem) return base;

              const incomingInner = incomingItem.menu ?? incomingItem;

              // collect incoming submenus from supported shapes
              const incomingSubs =
                (Array.isArray(incomingInner.submenu) && incomingInner.submenu) || [];

              // merge submenu entries
              const baseSubs = base.submenu || [];
              const mergedSubs = baseSubs.map((bsub: any) => {
                const incSub =
                  incomingSubs.find((isub: any) =>
                    isub.id === bsub.id || isub.uuid === bsub.uuid || isub.osa_code === bsub.osa_code
                  )
                  || incomingSubs.find((isub: any) =>
                    (isub.menu?.id === base.id || isub.menu === base.id) && isub.name === bsub.name
                  );

                if (!incSub) return bsub;
                return {
                  ...bsub,
                  ...incSub,
                  permissions: Array.isArray(incSub.permissions) ? incSub.permissions : bsub.permissions || [],
                };
              });

              // build merged menu object in simplified shape
              return {
                ...base,
                ...Object.fromEntries(Object.entries(incomingInner).filter(([key]) => key !== 'name')),
                submenu: mergedSubs,
              };
            });

            setRoleTableData(merged);
            console.log("Merged role menus/submenus/permissions:", merged);
            console.log("Merged role menus/submenus/permissions:", tablePermissionIds);
          } else {
            // no role-specific menus - use baseRows
            setRoleTableData(baseRows);
          }

          // seed form fields if role data present
          if (roleRes?.data) {
            setInitialValues({
              name: roleRes.data.name || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch roles/menus/submenus", error);
        } finally {
          setLoading(false);
        }
      })();
    } else setLoading(false);
  }, [params?.uuid, setLoading]);

  const handleSubmit = async (
    values: RoleFormValues,
    { setSubmitting }: FormikHelpers<RoleFormValues>
  ) => {
    // payload must include menus key with the roleTableData structure
    const payload = {
      ...values,
      guard_name: guardName,
      menus: roleTableData || [],
    };

    setLoading(true);
    let res;
    if (isEditMode && params?.uuid !== "add") {
      res = await editRoles(String(params.uuid), payload);
    } else {
      res = await addRoles(payload);
    }
    setLoading(false);
    if (res?.error) {
      showSnackbar(res.data?.message || "Failed to submit form", "error");
    } else {
      showSnackbar(
        res.message || (isEditMode ? "Role Updated Successfully" : "Role Created Successfully"),
        "success"
      );
      router.push("/settings/role");
    }
    setSubmitting(false);
  };

  console.log("Role Table Data:", roleTableData);

  return (
    <div className="w-full h-full overflow-x-hidden p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/settings/role">
            <Icon icon="lucide:arrow-left" width={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Role" : "Add New Role"}
          </h1>
        </div>
      </div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={RoleSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl mb-6">
              {/* <h2 className="text-lg font-medium text-gray-800 mb-4">
                Role Details
              </h2> */}
              <ContainerCard>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <InputFields
                      required
                      label="Role Name"
                      value={values.name}
                      onChange={(e) => setFieldValue("name", e.target.value)}
                      error={touched.name && errors.name}
                    />
                    <ErrorMessage
                      name="name"
                      component="span"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <InputFields
                      required
                      label="Guard Name"
                      value={guardName}
                      options={[
                        { label: "API", value: "api" },
                        { label: "Web", value: "web" }
                      ]}
                      onChange={(e) => setGuardName(e.target.value as "api" | "web")}
                    />
                  </div>
                </div>

                {/* Permissions table replaces select input — parent only updates local state.
                  onRowsChange is scheduled async to avoid setState during child render */}
                {isEditMode && <div className="py-6">

                  <ContainerCard
                      className="w-full flex gap-[4px] overflow-x-auto"
                      padding="5px"
                  >
                      {roleTableData.map((tab, index) => {
                      const label = tab.name || "Menu";
                      return (
                        <div key={index}>
                          <TabBtn label={label} isActive={activeTab === index} onClick={() => onTabClick(index)} />
                        </div>
                      );
                    })}
                  </ContainerCard>

                  {roleTableData && roleTableData.length > 0 && <RolesPermissionTable
                    menus={roleTableData}
                    activeIndex={activeTab}
                    onMenusChange={(updatedMenus: any, permissionIds: any) => {
                      // update asynchronously to be safe (avoid setState during child render)
                      setTimeout(() => {
                        try {
                          const incomingJson = JSON.stringify(updatedMenus || []);
                          const currentJson = JSON.stringify(roleTableData || []);
                          if (incomingJson === currentJson) return; // no-op if identical
                        } catch (e) {
                          // ignore stringify errors and proceed to set
                        }
                        setRoleTableData(updatedMenus || []);
                        setTablePermissionIds(permissionIds || []);
                        console.log("Updated menus from table:", updatedMenus);
                        console.log("Updated permission IDs from table:", permissionIds);
                      }, 0);
                    }}
                   />}
                </div>}
              </ContainerCard>
            </div>

            <div className="flex justify-end gap-4 mt-6 pr-0">
              <button
                type="button"
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => router.push("/settings/role")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <SidebarBtn
                label={isEditMode ? "Update" : "Submit"}
                isActive={true}
                disabled={isSubmitting}
                leadingIcon="mdi:check"
                type="submit"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}