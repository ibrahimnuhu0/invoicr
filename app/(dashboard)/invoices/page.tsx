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
  dueDate: Date;
  taxRate: number;
  publicToken: string;
  client: { name: string };
  items: InvoiceItem[];
};

export default async function InvoicesPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const getTotal = (invoice: Invoice) => {
    const subtotal = invoice.items.reduce(
      (sum: number, item: InvoiceItem) => sum + item.amount,
      0
    );
    const tax = (subtotal * invoice.taxRate) / 100;
    return subtotal + tax;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#0B0D10]">Invoices</h2>
        <Link
          href="/invoices/new"
          className="bg-[#0B0D10] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#FF5A1F] transition-colors"
        >
          + New invoice
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black/10">
        <div className="p-6 border-b border-black/10">
          <h3 className="font-bold text-[#0B0D10]">All invoices</h3>
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
            {(invoices as Invoice[]).map((invoice: Invoice) => (
              <div
                key={invoice.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#0B0D10]">{invoice.client.name}</p>
                  <p className="text-sm text-[#6B7280]">
                    {invoice.invoiceNumber} · Due{" "}
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium tabular-nums text-[#0B0D10]">
                    ₦{getTotal(invoice).toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      invoice.status === "paid"
                        ? "bg-[#0B0D10] text-white"
                        : invoice.status === "overdue"
                        ? "bg-[#FF5A1F]/10 text-[#FF5A1F]"
                        : "bg-[#FFD23F]/30 text-[#0B0D10]"
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <Link
                    href={`/invoice/${invoice.publicToken}`}
                    className="text-sm text-[#6B7280] hover:text-[#0B0D10] underline transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}