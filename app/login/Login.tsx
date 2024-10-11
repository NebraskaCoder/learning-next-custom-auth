"use client";
import { useState } from "react";
import { doLogin } from "@/lib/authActions";

const Login = () => {
  const [userId, setUserId] = useState("");
  const onLogin = async () => {
    if (!userId) {
      console.log("No user ID provided");
      return;
    }

    const results = await doLogin({ email: userId });
    console.log("Login results:", results);
  };

  return (
    <div className="flex items-center gap-5">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded-md"
        onClick={onLogin}
      >
        Do Login
      </button>
      <input
        type="text"
        className="border border-gray-300 rounded-md p-1"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
    </div>
  );
};

export default Login;
