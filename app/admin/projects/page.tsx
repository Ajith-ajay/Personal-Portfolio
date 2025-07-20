"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string;
  image: string;
  link: string;
  technologies: string[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    link: "",
    details: "",
    technologies: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null); // NEW: track editing
  const [searchTerm, setSearchTerm] = useState("");

  useRequireAuth();

  const fetchProjects = async () => {
    const snap = await getDocs(collection(db, "project_category"));
    setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = form.technologies.split(",").map((t) => t.trim());

    if (editingId) {
      // ✅ Update existing project
      await updateDoc(doc(db, "project_category", editingId), {
        ...form,
        technologies: techArray,
      });
      setEditingId(null);
    } else {
      // ✅ Add new project
      await addDoc(collection(db, "project_category"), {
        ...form,
        technologies: techArray,
      });
    }

    setForm({
      title: "",
      description: "",
      category: "",
      image: "",
      link: "",
      details: "",
      technologies: "",
    });
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "project_category", id));
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    // ✅ Prefill form with selected project
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image,
      link: project.link,
      details: project.details,
      technologies: project.technologies.join(", "),
    });
    setEditingId(project.id);
  };

  const handleCancelEdit = () => {
    // ✅ Reset form and exit edit mode
    setForm({
      title: "",
      description: "",
      category: "",
      image: "",
      link: "",
      details: "",
      technologies: "",
    });
    setEditingId(null);
  };

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.details.toLowerCase().includes(term) ||
      p.technologies.some((tech) => tech.toLowerCase().includes(term))
    );
  });


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Manage Projects
        </h2>
        {/* Add / Edit Form */}
        <form
          onSubmit={handleAdd}
          className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-3 rounded-lg"
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border p-3 rounded-lg"
            />
            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="border p-3 rounded-lg"
            />
            <input
              placeholder="Link (GitHub / Live)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="border p-3 rounded-lg"
            />
          </div>
          <textarea
            placeholder="Short Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-3 rounded-lg w-full"
          />
          <textarea
            placeholder="Details"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="border p-3 rounded-lg w-full"
          />
          <input
            placeholder="Technologies (comma separated)"
            value={form.technologies}
            onChange={(e) =>
              setForm({ ...form, technologies: e.target.value })
            }
            className="border p-3 rounded-lg w-full"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
            >
              {editingId ? "Update Project" : "Add Project"}
            </button>
            {editingId && (
              <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

<div className="relative mb-6 w-full md:w-1/2">
  {/* 🔍 Search Icon */}
  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  </span>

  <input
    type="text"
    placeholder="Search projects..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400 text-white"
  />
</div>

        {/* Project List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
              <span className="text-sm text-blue-600 font-medium mb-2">
                {p.category}
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                {p.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex justify-between items-center gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No projects yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}
