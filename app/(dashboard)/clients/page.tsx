"use client";

import { useState, useEffect } from "react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setSubmitting(false);
      return;
    }

    setFormData({ name: "", email: "", phone: "", address: "" });
    setShowForm(false);
    fetchClients();
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#0B0D10]">Clients</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0B0D10] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#FF5A1F] transition-colors"
        >
          {showForm ? "Cancel" : "+ Add client"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-black/10 p-6 mb-8">
          <h3 className="font-bold text-[#0B0D10] mb-4">New client</h3>
          {error && (
            <p className="text-[#FF5A1F] text-sm mb-4">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="border border-black/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0B0D10] transition-colors"
            />
            <input
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="border border-black/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0B0D10] transition-colors"
            />
            <input
              name="phone"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="border border-black/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0B0D10] transition-colors"
            />
            <input
              name="address"
              placeholder="Address (optional)"
              value={formData.address}
              onChange={handleChange}
              className="border border-black/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0B0D10] transition-colors"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 bg-[#0B0D10] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#FF5A1F] transition-colors"
          >
            {submitting ? "Saving..." : "Save client"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/10">
        <div className="p-6 border-b border-black/10">
          <h3 className="font-bold text-[#0B0D10]">All clients</h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-[#6B7280]">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="p-6 text-center text-[#6B7280]">
            No clients yet. Add your first one above.
          </div>
        ) : (
          <div className="divide-y divide-black/10">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#0B0D10]">{client.name}</p>
                  <p className="text-sm text-[#6B7280]">{client.email}</p>
                </div>
                {client.phone && (
                  <p className="text-sm text-[#6B7280]">{client.phone}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}