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
  const [errorMessage, setErrorMessage] = useState("");

  const { authReady, user } = useRequireAuth();

  const fetchProjects = async () => {
    try {
      setErrorMessage("");
      const snap = await getDocs(collection(db, "project_category"));
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
    } catch {
      setErrorMessage("Unable to load projects. Check Firestore permissions.");
    }
  };

  useEffect(() => {
    if (!authReady || !user) return;
    fetchProjects();
  }, [authReady, user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const techArray = form.technologies.split(",").map((t) => t.trim());

    try {
      setErrorMessage("");
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
    } catch {
      setErrorMessage(editingId ? "Unable to update project. Check Firestore permissions." : "Unable to add project. Check Firestore permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      setErrorMessage("");
      await deleteDoc(doc(db, "project_category", id));
      fetchProjects();
    } catch {
      setErrorMessage("Unable to delete project. Check Firestore permissions.");
    }
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

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
          Loading projects...
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Manage Projects
          </h2>
          <p className="mt-2 text-gray-600">
            Add, edit, and filter project cards with a cleaner workflow.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Project" : "Add Project"}
              </h3>
              <p className="text-sm text-gray-500">
                Update project metadata, descriptions, and technologies.
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <input
              placeholder="Link (GitHub / Live)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="mt-4 space-y-4">
            <textarea
              placeholder="Short Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="h-28 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <textarea
              placeholder="Details"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="h-28 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <input
              placeholder="Technologies (comma separated)"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Project Library</h3>
              <p className="text-sm text-gray-500">{filteredProjects.length} visible / {projects.length} total</p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
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
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
                    <p className="text-sm font-medium text-emerald-700">{p.category}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Project
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-gray-700">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
              No projects yet. Add one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
