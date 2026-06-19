"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
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
            Welcome back
          </h1>
          <p className="text-sm text-[#6B7280] text-center mb-7">
            Sign in to manage your invoices.
          </p>

          {error && (
            <div className="bg-[#FFF1ED] border border-[#FF5A1F]/20 text-[#C2410C] text-sm rounded-lg px-4 py-2.5 mb-5 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Email address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@studio.com"
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
                placeholder="••••••••"
                onChange={handleChange}
                className="border border-black/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-[#0B0D10] transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#0B0D10] text-white py-3 rounded-full font-bold text-sm hover:bg-[#FF5A1F] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-[#6B7280] mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#0B0D10] font-bold hover:text-[#FF5A1F] transition-colors">
                Create one
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