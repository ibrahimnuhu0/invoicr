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
        <h2 className="text-2xl font-bold">Clients</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          {showForm ? "Cancel" : "+ Add Client"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-semibold mb-4">New Client</h3>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="phone"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              name="address"
              placeholder="Address (optional)"
              value={formData.address}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800"
          >
            {submitting ? "Saving..." : "Save Client"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="font-semibold">All Clients</h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No clients yet. Add your first one above.
          </div>
        ) : (
          <div className="divide-y">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
                {client.phone && (
                  <p className="text-sm text-gray-500">{client.phone}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}