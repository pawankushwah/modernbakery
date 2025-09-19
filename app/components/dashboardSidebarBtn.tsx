import { Icon, IconifyIcon } from "@iconify-icon/react";
import Link from "next/link";
import React from "react";

export default function SidebarBtn({
  isActive = false,
  href,
  className = "",
  buttonTw = "px-3 py-2 h-10",
  disabled = false,
  onClick,
  label,
  labelTw = "",
  leadingIcon,
  leadingIconSize = 24,
  leadingIconTw,
  trailingIcon,
  trailingIconSize = 24,
  trailingIconTw,
  children,
  isSubmenu = false,
  type = "button",
}: {
  isActive?: boolean;
  className?: string;
  buttonTw?: string;
  disabled?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  labelTw?: string;
  leadingIcon?: IconifyIcon | string;
  leadingIconSize?: number;
  leadingIconTw?: string;
  trailingIcon?: IconifyIcon | string;
  trailingIconSize?: number;
  trailingIconTw?: string;
  children?: React.ReactNode;
  isSubmenu?: boolean;
  type?: "button" | "submit";
}) {
  const baseClasses = `${buttonTw} w-full rounded-lg flex items-center gap-[12px] justify-between ${
    isActive
      ? "bg-[var(--primary-btn-color)] text-white"
      : "bg-transparent text-[#414651] hover:bg-[var(--secondary-btn-color)] hover:text-[var(--secondary-btn-text-color)]"
  } ${disabled ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`;

  const content = (
    <>
      <div
        className={`flex items-center ${
          isSubmenu ? "gap-[8px]" : "gap-[12px]"
        }`}
      >
        {leadingIcon && (
          <Icon
            icon={leadingIcon}
            width={leadingIconSize}
            className={`${leadingIconTw ?? ""}`}
          />
        )}
        {children ? children : <span className={labelTw}>{label}</span>}
      </div>
      {trailingIcon && (
        <Icon
          icon={trailingIcon}
          width={trailingIconSize}
          className={trailingIconTw}
        />
      )}
    </>
  );

  // 👉 If href is provided, render as a Link
  if (href) {
    return (
      <Link href={href} className={className}>
        <div className={baseClasses}>{content}</div>
      </Link>
    );
  }

  // 👉 Otherwise render as a button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${baseClasses}`}
    >
      {content}
    </button>
  );
}
