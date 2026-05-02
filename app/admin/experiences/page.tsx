"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

export default function ExperiencePage() {
  const [exp, setExp] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    company: "",
    location: "",
    period: "",
    role: "",
    description: "",
    skills: "" 
  });

  const { authReady, user } = useRequireAuth();

  const fetchExp = async () => {
    try {
      setErrorMessage("");
      const snap = await getDocs(collection(db, "experience"));
      setExp(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      setErrorMessage("Unable to load experience records. Check Firestore permissions.");
    }
  };

  useEffect(() => {
    if (!authReady || !user) return;
    fetchExp();
  }, [authReady, user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const skillArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const payload = { ...form, skills: skillArray };

    try {
      setErrorMessage("");
      if (editingId) {
        await updateDoc(doc(db, "experience", editingId), payload);
      } else {
        await addDoc(collection(db, "experience"), payload);
      }
      setForm({ company: "", location: "", period: "", role: "", description: "", skills: "" });
      setEditingId(null);
      fetchExp();
    } catch {
      setErrorMessage(editingId ? "Unable to update experience. Check Firestore permissions." : "Unable to add experience. Check Firestore permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      setErrorMessage("");
      await deleteDoc(doc(db, "experience", id));
      fetchExp();
    } catch {
      setErrorMessage("Unable to delete experience record. Check Firestore permissions.");
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      company: item.company ?? "",
      location: item.location ?? "",
      period: item.period ?? "",
      role: item.role ?? "",
      description: item.description ?? "",
      skills: Array.isArray(item.skills) ? item.skills.join(", ") : (item.skills ?? ""),
    });
    setEditingId(item.id);
  };

  const handleCancelEdit = () => {
    setForm({ company: "", location: "", period: "", role: "", description: "", skills: "" });
    setEditingId(null);
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
          Loading experience records...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Manage Experience
          </h2>
          <p className="mt-2 text-gray-600">
            Organize internships and roles in a clean timeline.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleAdd}
            className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ${
              editingId ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingId ? "Edit Experience" : "Add Experience"}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Capture the role, company, and skills for each experience entry.
                </p>
              </div>
              {editingId && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Editing mode
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {editingId && (
              <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900">
                You are updating this experience entry. Click Update to save your changes.
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="Period (e.g. Jan 2025 – Present)"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <input
                  placeholder="Role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="h-28 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <input
                placeholder="Skills (comma separated, e.g. React, JavaScript, MongoDB)"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                {editingId ? "Update Experience" : "Add Experience"}
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Experience List</h3>
                <p className="text-sm text-gray-500">{exp.length} total entries</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Live records
              </div>
            </div>

            <div className="space-y-5">
              {exp.map((e) => (
                <div
                  key={e.id}
                  className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{e.role}</h3>
                      <p className="text-gray-600 font-medium">{e.company}</p>
                      <p className="text-sm text-gray-500">{e.location}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(e)}
                      className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        editingId === e.id
                          ? "border-blue-300 bg-blue-600 text-white"
                          : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {editingId === e.id ? "Editing" : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {e.period}
                  </div>

                  {e.description && (
                    <p className="mt-4 text-sm leading-relaxed text-gray-700">
                      {e.description}
                    </p>
                  )}

                  {e.skills && e.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {e.skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {exp.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
                No experience records yet. Add one above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}