import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Password = ({ value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="block text-gray-700 text-sm mb-2">
        Password <span className="text-red-500">*</span>
      </label>
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={value}
        onChange={onChange}
        placeholder="Enter your password"
        className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-black"
      />
      <span
        className="absolute right-2 top-8 text-gray-500 cursor-pointer text-lg"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
      </span>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Password;
