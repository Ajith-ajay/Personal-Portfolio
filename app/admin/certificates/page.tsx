"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

export default function CertificatesPage() {
  const [certs, setCerts] = useState<{ id: string; issuer: string; title: string; year: string }[]>([]);
  const [form, setForm] = useState({ issuer: "", title: "", year: "" });
  useRequireAuth();

  const fetchCerts = async () => {
    const snap = await getDocs(collection(db, "certificates"));
    setCerts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)));
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.issuer.trim() || !form.title.trim() || !form.year.trim()) return;
    await addDoc(collection(db, "certificates"), form);
    setForm({ issuer: "", title: "", year: "" });
    fetchCerts();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "certificates", id));
    fetchCerts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Manage Certificates
        </h2>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Issuer"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              placeholder="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold rounded-lg shadow-md"
          >
            Add Certificate
          </button>
        </form>

        {/* Certificate list */}
        <ul className="space-y-4">
          {certs.map((c) => (
            <li
              key={c.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="mb-3 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
                <p className="text-sm text-gray-600">
                  {c.issuer} • {c.year}
                </p>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {certs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No certificates added yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}