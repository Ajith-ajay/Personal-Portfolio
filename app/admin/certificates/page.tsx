"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

export default function CertificatesPage() {
  const [certs, setCerts] = useState<{ id: string; issuer: string; title: string; year: string }[]>([]);
  const [form, setForm] = useState({ issuer: "", title: "", year: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const { authReady, user } = useRequireAuth();

  const fetchCerts = async () => {
    try {
      setErrorMessage("");
      const snap = await getDocs(collection(db, "certificates"));
      setCerts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)));
    } catch {
      setErrorMessage("Unable to load certificates. Check Firestore permissions.");
    }
  };

  useEffect(() => {
    if (!authReady || !user) return;
    fetchCerts();
  }, [authReady, user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.issuer.trim() || !form.title.trim() || !form.year.trim()) return;
    try {
      setErrorMessage("");
      await addDoc(collection(db, "certificates"), form);
      setForm({ issuer: "", title: "", year: "" });
      fetchCerts();
    } catch {
      setErrorMessage("Unable to add certificate. Check Firestore permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      setErrorMessage("");
      await deleteDoc(doc(db, "certificates", id));
      fetchCerts();
    } catch {
      setErrorMessage("Unable to delete certificate. Check Firestore permissions.");
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
          Loading certificates...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Manage Certificates
          </h2>
          <p className="mt-2 text-gray-600">
            Add and review certificates shown across your portfolio.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleAdd}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-800">Add Certificate</h3>
            <p className="mt-2 text-sm text-gray-500">
              Fill in the issuer, title, and year to publish a new certificate.
            </p>

            {errorMessage && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <input
                placeholder="Issuer"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <input
                placeholder="Year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Add Certificate
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Certificate List</h3>
                <p className="text-sm text-gray-500">{certs.length} total entries</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Live records
              </div>
            </div>

            <ul className="space-y-4">
              {certs.map((c) => (
                <li
                  key={c.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {c.year}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-600">{c.issuer}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {certs.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
                No certificates added yet. Add one above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}