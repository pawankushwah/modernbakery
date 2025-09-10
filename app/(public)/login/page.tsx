"use client";

import { useState } from "react";
import Button from "../../components/customButton";
import RememberCheckbox from "../../components/rememberCheckbox";
import PoweredByTag from "../../components/poweredByTag";
import CustomPasswordInput from "../../components/customPasswordInput";
import CustomTextInput from "../../components/CustomTextInput";
import Logo from "../../components/logo";
import CardForLoginPage from "../../components/cardForLoginPage";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter()

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
         router.push("/dashboard");
        // Handle form submission logic here
        // alert("Form submitted");
        // console.log("User ID:", userId);
        // console.log("Password:", password);
    }

    return (
        <div className="w-[100%] min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="hidden flex-col justify-center ml-[24px] my-[24px] lg:flex">
                    <CardForLoginPage />
                </div>
                <div className="relative flex flex-col justify-center items-center min-h-screen lg:h-full">
                    <form
                        className="flex flex-col gap-[32px] w-[360px]"
                        onSubmit={handleSubmit}
                    >
                        <Logo twClass="m-auto" />
                        <div className="text-center">
                            <h1 className="text-3xl font-semibold leading-9.5 space-y-4 text-gray-900 mb-[12px]">
                                Welcome back
                            </h1>
                            <p className="text-gray-600 text-[16px]">
                                Please log in with your details to continue to
                                the Production Server.
                            </p>
                        </div>

                        <div className="flex flex-col gap-[24px] m-[20px] lg:m-0">
                            <div className="flex flex-col gap-[20px]">
                                <CustomTextInput
                                    label="User ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="User ID"
                                />
                                <CustomPasswordInput
                                    label="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex justify-between">
                                <RememberCheckbox />
                                <span className="text-[#EA0A2A] font-semibold text-sm">
                                    Forgot password?
                                </span>
                            </div>

                            <Button onClick={handleSubmit}>Sign in</Button>
                        </div>
                    </form>
                    <PoweredByTag />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
