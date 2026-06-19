import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type InvoiceItem = {
  amount: number;
};

type Invoice = {
  id: string;
  status: string;
  invoiceNumber: string;
  client: { name: string };
  items: InvoiceItem[];
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const [invoices, clients] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.client.count({
      where: { userId },
    }),
  ]);

  const totalEarned = (invoices as Invoice[])
    .filter((inv: Invoice) => inv.status === "paid")
    .reduce((sum: number, inv: Invoice) => {
      const invoiceTotal = inv.items.reduce(
        (s: number, item: InvoiceItem) => s + item.amount,
        0
      );
      return sum + invoiceTotal;
    }, 0);

  const pending = (invoices as Invoice[]).filter(
    (inv: Invoice) => inv.status === "sent" || inv.status === "viewed"
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#0B0D10]">
          Welcome back, {session?.user?.name}
        </h2>
        <Link
          href="/invoices/new"
          className="bg-[#0B0D10] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#FF5A1F] transition-colors"
        >
          + New invoice
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#FF5A1F] rounded-2xl p-6">
          <p className="text-sm text-white/80 mb-1">Total earned</p>
          <p className="text-2xl font-bold text-white tabular-nums">
            ₦{totalEarned.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-black/10">
          <p className="text-sm text-[#6B7280] mb-1">Pending invoices</p>
          <p className="text-2xl font-bold text-[#0B0D10] tabular-nums">{pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-black/10">
          <p className="text-sm text-[#6B7280] mb-1">Total clients</p>
          <p className="text-2xl font-bold text-[#0B0D10] tabular-nums">{clients}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/10">
        <div className="p-6 border-b border-black/10 flex items-center justify-between">
          <h3 className="font-bold text-[#0B0D10]">Recent invoices</h3>
          <Link href="/invoices" className="text-sm text-[#6B7280] hover:text-[#FF5A1F] transition-colors">
            View all
          </Link>
        </div>
        {invoices.length === 0 ? (
          <div className="p-6 text-center text-[#6B7280]">
            No invoices yet.{" "}
            <Link href="/invoices/new" className="text-[#0B0D10] font-bold underline">
              Create your first one
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-black/10">
            {(invoices as Invoice[]).map((inv: Invoice) => (
              <div
                key={inv.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#0B0D10]">{inv.client.name}</p>
                  <p className="text-sm text-[#6B7280]">
                    {inv.invoiceNumber}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    inv.status === "paid"
                      ? "bg-[#0B0D10] text-white"
                      : inv.status === "overdue"
                      ? "bg-[#FF5A1F]/10 text-[#FF5A1F]"
                      : "bg-[#FFD23F]/30 text-[#0B0D10]"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}