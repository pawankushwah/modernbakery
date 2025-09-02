"use client";

import { useState } from "react";
import { Icon } from '@iconify-icon/react';

export default function CustomPasswordInput({label, value, onChange}: {label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function togglePasswordVisibility() {
        setIsPasswordVisible((prev) => !prev);
    }

    return (
        <div className="relative">
            <label htmlFor="password" className="text-sm text-gray-700">
                {label}
            </label>
            <div className="relative mt-[6px] h-fit">
                <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    value={value}
                    onChange={onChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder="••••••••"
                />
                <div
                    className="absolute cursor-pointer text-[#717680] h-full flex items-center top-1/2 -translate-y-1/2 right-[14px]"
                    onClick={togglePasswordVisibility}
                >
                    {isPasswordVisible ? (
                        <Icon icon="mdi-light:eye-off" width={25} />
                    ) : (
                        <Icon icon="mdi-light:eye" width={25} />
                    )}
                </div>
            </div>
        </div>
    );
}