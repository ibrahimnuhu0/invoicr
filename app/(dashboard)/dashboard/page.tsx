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
        <h2 className="text-2xl font-bold">
          Welcome back, {session?.user?.name} 👋
        </h2>
        <Link
          href="/invoices/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          + New Invoice
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Total Earned</p>
          <p className="text-2xl font-bold">
            ₦{totalEarned.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Pending Invoices</p>
          <p className="text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Total Clients</p>
          <p className="text-2xl font-bold">{clients}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-semibold">Recent Invoices</h3>
          <Link href="/invoices" className="text-sm text-gray-500 hover:text-black">
            View all
          </Link>
        </div>
        {invoices.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No invoices yet.{" "}
            <Link href="/invoices/new" className="text-black underline">
              Create your first one
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {(invoices as Invoice[]).map((inv: Invoice) => (
              <div
                key={inv.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{inv.client.name}</p>
                  <p className="text-sm text-gray-500">
                    {inv.invoiceNumber}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    inv.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : inv.status === "overdue"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
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