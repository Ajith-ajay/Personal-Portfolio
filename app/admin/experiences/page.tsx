"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

export default function ExperiencePage() {
  const [exp, setExp] = useState<any[]>([]);
  const [form, setForm] = useState({
    company: "",
    location: "",
    period: "",
    role: "",
    description: "",
    skills: "" 
  });

  useRequireAuth();

  const fetchExp = async () => {
    const snap = await getDocs(collection(db, "experience"));
    setExp(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchExp();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    await addDoc(collection(db, "experience"), { ...form, skills: skillArray });
    setForm({ company: "", location: "", period: "", role: "", description: "", skills: "" });
    fetchExp();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "experience", id));
    fetchExp();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Manage Experience
        </h2>

        {/* Add Experience Form */}
        <form
          onSubmit={handleAdd}
          className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Period (e.g. Jan 2025 – Present)"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none w-full h-24"
          />
          <input
            placeholder="Skills (comma separated, e.g. React, JavaScript, MongoDB)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none w-full"
          />
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold rounded-lg shadow-md"
          >
            Add Experience
          </button>
        </form>

        {/* Experience List */}
        <div className="space-y-6">
          {exp.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{e.role}</h3>
                  <p className="text-gray-600 font-medium">{e.company}</p>
                  <p className="text-sm text-gray-500">{e.location}</p>
                  <p className="text-sm text-gray-500 italic">{e.period}</p>
                </div>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
              {e.description && (
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {e.description}
                </p>
              )}
              {e.skills && e.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {e.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full"
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
          <p className="text-center text-gray-500 mt-10">
            No experience records yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}