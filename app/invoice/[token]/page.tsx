import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>; 
}) {
  const { token } = await params; 

  const invoice = await prisma.invoice.findUnique({
    where: { publicToken: token },
    include: { client: true, items: true, user: true },
  });

  if (!invoice) notFound();

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">
              {invoice.user.businessName || invoice.user.name}
            </h1>
            <p className="text-gray-500 text-sm">{invoice.user.email}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              {invoice.invoiceNumber}
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Billed To</p>
            <p className="font-medium">{invoice.client.name}</p>
            <p className="text-sm text-gray-500">{invoice.client.email}</p>
            {invoice.client.address && (
              <p className="text-sm text-gray-500">{invoice.client.address}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase mb-1">Due Date</p>
            <p className="font-medium">
              {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b text-sm text-gray-400">
              <th className="text-left pb-3">Description</th>
              <th className="text-right pb-3">Qty</th>
              <th className="text-right pb-3">Rate</th>
              <th className="text-right pb-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3 text-sm">{item.description}</td>
                <td className="py-3 text-sm text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-right">
                  ₦{item.rate.toLocaleString()}
                </td>
                <td className="py-3 text-sm text-right font-medium">
                  ₦{item.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-2 mb-8 text-sm">
          <div className="flex justify-between w-48">
            <span className="text-gray-500">Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-48">
            <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
            <span>₦{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-48 font-bold text-base border-t pt-2">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Notes</p>
            <p>{invoice.notes}</p>
          </div>
        )}

        {invoice.status !== "paid" && (
          <div className="mt-8 text-center">
            <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 w-full">
              Pay Now — ₦{total.toLocaleString()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}