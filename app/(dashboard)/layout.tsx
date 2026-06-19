import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <nav className="bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0B0D10] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M5 7h8M5 10h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-[#0B0D10]">Invoicr</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-[#6B7280] hover:text-[#0B0D10] transition-colors">
            Dashboard
          </Link>
          <Link href="/invoices" className="text-sm font-medium text-[#6B7280] hover:text-[#0B0D10] transition-colors">
            Invoices
          </Link>
          <Link href="/clients" className="text-sm font-medium text-[#6B7280] hover:text-[#0B0D10] transition-colors">
            Clients
          </Link>
          <Link
            href="/api/auth/signout"
            className="text-sm bg-[#0B0D10] text-white px-4 py-2 rounded-full font-bold hover:bg-[#FF5A1F] transition-colors"
          >
            Sign out
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}