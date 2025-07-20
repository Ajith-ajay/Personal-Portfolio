"use client";

import Link from "next/link";
import { useRequireAuth } from "../../hooks/use-auth";

export default function AdminPage() {
  useRequireAuth();

  const sections = [
    { name: "Active Status", path: "/admin/activestatus" },
    { name: "Certificates", path: "/admin/certificates" },
    { name: "Education", path: "/admin/education" },
    { name: "Experience", path: "/admin/experiences" },
    { name: "Projects", path: "/admin/projects" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800">
          Admin Dashboard
        </h2>

        {/* Grid of sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec) => (
            <Link key={sec.name} href={sec.path}>
              <div className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100 hover:border-blue-300">
                <div className="flex flex-col items-center justify-center space-y-3">
                  {/* Icon placeholder (optional) */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-800">
                      {sec.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center group-hover:text-blue-700">
                    {sec.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}