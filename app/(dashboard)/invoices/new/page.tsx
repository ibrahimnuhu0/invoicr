"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
  email: string;
};

type Item = {
  description: string;
  quantity: number;
  rate: number;
};

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    clientId: "",
    dueDate: "",
    taxRate: 0,
    notes: "",
  });
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const tax = (subtotal * formData.taxRate) / 100;
  const total = subtotal + tax;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, items }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">New Invoice</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold mb-4">Invoice Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Client</label>
            <select
              name="clientId"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Due Date</label>
            <input
              name="dueDate"
              type="date"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Tax Rate (%)</label>
            <input
              name="taxRate"
              type="number"
              placeholder="0"
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Notes (optional)</label>
            <input
              name="notes"
              type="text"
              placeholder="Payment terms, notes..."
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold mb-4">Line Items</h3>
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <input
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="border rounded-lg px-3 py-2 col-span-5"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
                className="border rounded-lg px-3 py-2 col-span-2"
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(index, "rate", Number(e.target.value))
                }
                className="border rounded-lg px-3 py-2 col-span-2"
              />
              <p className="col-span-2 text-sm font-medium text-right">
                ₦{(item.quantity * item.rate).toLocaleString()}
              </p>
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
                  className="col-span-1 text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-4 text-sm text-gray-500 hover:text-black underline"
        >
          + Add line item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tax ({formData.taxRate}%)</span>
            <span>₦{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
      >
        {loading ? "Creating invoice..." : "Create Invoice"}
      </button>
    </div>
  );
}