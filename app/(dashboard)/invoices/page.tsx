import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InvoicesPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const getTotal = (invoice: any) => {
    const subtotal = invoice.items.reduce(
      (sum: number, item: any) => sum + item.amount,
      0
    );
    const tax = (subtotal * invoice.taxRate) / 100;
    return subtotal + tax;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Link
          href="/invoices/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          + New Invoice
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="font-semibold">All Invoices</h3>
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
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{invoice.client.name}</p>
                  <p className="text-sm text-gray-500">
                    {invoice.invoiceNumber} · Due{" "}
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">
                    ₦{getTotal(invoice).toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <Link
                    href={`/invoice/${invoice.publicToken}`}
                    className="text-sm text-gray-500 hover:text-black underline"
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