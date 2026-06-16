"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "freelancer",
    businessName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create your Invoicr account
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Full name"
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
          <select
            name="accountType"
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          >
            <option value="freelancer">Freelancer</option>
            <option value="business">Business</option>
          </select>

          {formData.accountType === "business" && (
            <input
              name="businessName"
              type="text"
              placeholder="Business name"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-black font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}