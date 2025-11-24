"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [Name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name,
          lastName,
          PhoneNo,
          Email,
          Username,
          Password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err: any) {
      console.error("Signup Error:", err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Fill in your details to sign up
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"

            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"


            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={PhoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"

            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"

            />
          </div>

          {/* Username */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"

            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"

            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-black text-black placeholder-gray-400 rounded-md px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"

            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="mt-3 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Signup
          </button>

        </form>

        {/* Footer */}
        <p className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
