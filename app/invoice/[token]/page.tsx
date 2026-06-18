"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { pdf, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.0/files/noto-sans-all-400-normal.woff",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.0/files/noto-sans-all-700-normal.woff",
      fontWeight: 700,
    },
  ],
});

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  dueDate: string;
  taxRate: number;
  notes: string;
  publicToken: string;
  client: { name: string; email: string; address?: string };
  user: { name: string; email: string; businessName?: string };
  items: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
};

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "NotoSans" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  title: { fontSize: 20, fontWeight: 700 },
  label: { fontSize: 10, color: "#9ca3af", marginBottom: 4 },
  value: { fontSize: 12 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#111111",
    paddingBottom: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  col1: { flex: 3, fontSize: 11 },
  col2: { flex: 1, fontSize: 11, textAlign: "right" },
  totals: { alignItems: "flex-end", marginTop: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 180,
    marginBottom: 6,
  },
  totalDivider: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 180,
    borderTopWidth: 1,
    borderTopColor: "#111111",
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: { fontSize: 11, color: "#6b7280" },
  totalValue: { fontSize: 11 },
  totalLabelBold: { fontSize: 12, fontWeight: 700, color: "#111111" },
  totalValueBold: { fontSize: 12, fontWeight: 700, color: "#111111" },
});

export default function PublicInvoicePage() {
  const { token } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/invoice/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice || !invoice.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Invoice not found.</p>
      </div>
    );
  }

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + tax;

  const handleDownloadPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{invoice.user.businessName || invoice.user.name}</Text>
              <Text style={{ fontSize: 11, color: "#6b7280" }}>{invoice.user.email}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.title}>{invoice.invoiceNumber}</Text>
              <Text style={{ fontSize: 11, color: "#6b7280" }}>{invoice.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
            <View>
              <Text style={styles.label}>BILLED TO</Text>
              <Text style={styles.value}>{invoice.client.name}</Text>
              <Text style={{ fontSize: 11, color: "#6b7280" }}>{invoice.client.email}</Text>
              {invoice.client.address && (
                <Text style={{ fontSize: 11, color: "#6b7280" }}>{invoice.client.address}</Text>
              )}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.label}>DUE DATE</Text>
              <Text style={styles.value}>
                {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.col1, { color: "#9ca3af", fontSize: 10 }]}>DESCRIPTION</Text>
            <Text style={[styles.col2, { color: "#9ca3af", fontSize: 10 }]}>QTY</Text>
            <Text style={[styles.col2, { color: "#9ca3af", fontSize: 10 }]}>RATE</Text>
            <Text style={[styles.col2, { color: "#9ca3af", fontSize: 10 }]}>AMOUNT</Text>
          </View>

          {invoice.items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col2}>₦{item.rate.toLocaleString()}</Text>
              <Text style={styles.col2}>₦{item.amount.toLocaleString()}</Text>
            </View>
          ))}

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>₦{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
              <Text style={styles.totalValue}>₦{tax.toLocaleString()}</Text>
            </View>
            <View style={styles.totalDivider}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>₦{total.toLocaleString()}</Text>
            </View>
          </View>

          {invoice.notes && (
            <View style={{ marginTop: 30, backgroundColor: "#f9fafb", padding: 12, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Notes</Text>
              <Text style={{ fontSize: 11, color: "#6b7280" }}>{invoice.notes}</Text>
            </View>
          )}

        </Page>
      </Document>
    );

    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePayment = async () => {
    setPaying(true);

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: invoice.client.email,
        amount: total,
        invoiceId: invoice.id,
      }),
    });

    const data = await res.json();

    if (data.authorizationUrl) {
      window.location.href = data.authorizationUrl;
    } else {
      alert("Payment initialization failed. Please try again.");
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div
        ref={invoiceRef}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8"
      >
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">
              {invoice.user.businessName || invoice.user.name}
            </h1>
            <p className="text-gray.500 text-sm">{invoice.user.email}</p>
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
      </div>

      <div className="max-w-2xl mx-auto mt-4 flex flex-col gap-3">
        <button
          onClick={handleDownloadPDF}
          className="w-full border border-black text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          Download PDF
        </button>

        {invoice.status !== "paid" && (
          <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            {paying
              ? "Redirecting to payment..."
              : `Pay Now — ₦${total.toLocaleString()}`}
          </button>
        )}
      </div>
    </div>
  );
}