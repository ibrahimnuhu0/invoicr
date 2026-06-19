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

  const setType = (type: string) => {
    setFormData({ ...formData, accountType: type });
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
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#0B0D10] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M5 7h8M5 10h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0B0D10]">Invoicr</span>
        </Link>

        <div className="bg-white border border-black/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#0B0D10] mb-1 text-center">
            Create your account
          </h1>
          <p className="text-sm text-[#6B7280] text-center mb-7">
            Start sending invoices in minutes.
          </p>

          {error && (
            <div className="bg-[#FFF1ED] border border-[#FF5A1F]/20 text-[#C2410C] text-sm rounded-lg px-4 py-2.5 mb-5 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Account type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("freelancer")}
                  className={`h-10 rounded-lg text-sm font-bold border transition-colors ${
                    formData.accountType === "freelancer"
                      ? "bg-[#0B0D10] text-white border-[#0B0D10]"
                      : "bg-white text-[#6B7280] border-black/15 hover:border-black/30"
                  }`}
                >
                  Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setType("business")}
                  className={`h-10 rounded-lg text-sm font-bold border transition-colors ${
                    formData.accountType === "business"
                      ? "bg-[#0B0D10] text-white border-[#0B0D10]"
                      : "bg-white text-[#6B7280] border-black/15 hover:border-black/30"
                  }`}
                >
                  Business
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Full name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Ada Okafor"
                onChange={handleChange}
                className="border border-black/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-[#0B0D10] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Email address
              </label>
              <input
                name="email"
                type="email"
                placeholder="ada@studio.com"
                onChange={handleChange}
                className="border border-black/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-[#0B0D10] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                onChange={handleChange}
                className="border border-black/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-[#0B0D10] transition-colors"
              />
            </div>

            {formData.accountType === "business" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                  Business name
                </label>
                <input
                  name="businessName"
                  type="text"
                  placeholder="Studio Okafor Ltd."
                  onChange={handleChange}
                  className="border border-black/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-[#0B0D10] transition-colors"
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#0B0D10] text-white py-3 rounded-full font-bold text-sm hover:bg-[#FF5A1F] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-[#6B7280] mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0B0D10] font-bold hover:text-[#FF5A1F] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          <Link href="/" className="hover:text-[#0B0D10] transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}