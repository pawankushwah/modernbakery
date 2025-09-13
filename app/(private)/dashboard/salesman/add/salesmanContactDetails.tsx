"use client";
import CustomPasswordInput from "@/app/components/customPasswordInput";
import { useState } from "react";
import InputFields from "@/app/components/inputFields";

export default function SalesmanContactDetails() {
  const [primaryCode, setPrimaryCode] = useState("uae");
  const [primaryContact, setPrimaryContact] = useState("");
  const [secondaryCode, setSecondaryCode] = useState("uae");
  const [secondaryContact, setSecondaryContact] = useState("");
    const [mobileDevice, setMobileDevice] = useState("");
  const [deviceId, setDeviceId] = useState("");
    const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
 const [password, setPassword] = useState("uae");
  const countryOptions = [
    { value: "uae", label: "UAE" },
    { value: "in", label: "India" },
    { value: "us", label: "USA" },
    { value: "uk", label: "UK" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Primary Contact */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 mb-2">Primary Contact</label>
        <div className="flex">
          <select
            value={primaryCode}
            onChange={(e) => setPrimaryCode(e.target.value)}
            className="border border-gray-300 rounded-l-md px-3 h-11 text-gray-900"
            
          >
            {countryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={primaryContact}
            onChange={(e) => setPrimaryContact(e.target.value)}
            placeholder="Contact Number"
            className="border border-gray-300 rounded-r-md px-3 h-11 w-full text-gray-900 placeholder-gray-400 flex-1"
   
          />
        </div>
      </div>

      {/* Secondary Contact */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 mb-2">Secondary Contact</label>
        <div className="flex">
          <select
            value={secondaryCode}
            onChange={(e) => setSecondaryCode(e.target.value)}
            className="border h-11 border-gray-300 rounded-l-md px-3 text-gray-900"
          
          >
            {countryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={secondaryContact}
            onChange={(e) => setSecondaryContact(e.target.value)}
            placeholder="Secondary Contact"
            className="border border-gray-300 rounded-r-md px-3 w-full text-gray-900 h-11 placeholder-gray-400 flex-1"
          
          />
        </div>
      </div>
                                      <InputFields
        label="Mobile Device"
        value={mobileDevice}
        onChange={(e) => setMobileDevice(e.target.value)}
      
      />
       <InputFields
        label="Divice ID"
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
      />
 <InputFields
        label="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      {/* Email */}
      <InputFields
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
       <CustomPasswordInput
                                          label="Password"
                                          value={password}
                                          onChange={(e) =>
                                              setPassword(e.target.value)
                                          }
                                      />
       
    </div>
  );
}
