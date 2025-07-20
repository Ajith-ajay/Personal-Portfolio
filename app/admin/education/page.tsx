"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

export default function EducationPage() {
  const [edu, setEdu] = useState<
    { id: string; degree: string; description: string; institution: string; location: string; period: string }[]
  >([]);
  const [form, setForm] = useState({
    institution: "",
    degree: "",
    location: "",
    period: "",
    description: ""
  });

  useRequireAuth();

  const fetchEdu = async () => {
    const snap = await getDocs(collection(db, "education"));
    setEdu(snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)));
  };
  useEffect(() => {
    fetchEdu();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "education"), form);
    setForm({ institution: "", degree: "", location: "", period: "", description: "" });
    fetchEdu();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "education", id));
    fetchEdu();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Manage Education
        </h2>

        {/* Form */}
        <form onSubmit={handleAdd} className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Institution"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              placeholder="Degree"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              placeholder="Period (e.g. 2023 - Present)"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none w-full h-24"
          />
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold rounded-lg shadow-md"
          >
            Add Education
          </button>
        </form>

        {/* Education list */}
        <div className="space-y-6">
          {edu.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{e.degree}</h3>
                  <p className="text-gray-600 font-medium">{e.institution}</p>
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
                <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                  {e.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {edu.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No education records yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}
