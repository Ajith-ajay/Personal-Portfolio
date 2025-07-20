"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

export default function ActiveStatusPage() {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const docRef = doc(db, "active_status", "TBrfdBLjRv32rvSMvQk9");
  useRequireAuth();

  useEffect(() => {
    (async () => {
      const snap = await getDoc(docRef);
      if (snap.exists()) setStatus(snap.data().status);
      setLoading(false);
    })();
  }, []);

  const toggleStatus = async () => {
    setLoading(true);
    await updateDoc(docRef, { status: !status });
    setStatus(!status);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-12 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-800">
          Active Status
        </h2>

        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading status...</p>
        ) : (
          <>
            {/* Status Indicator */}
            <div className="flex flex-col items-center mb-6">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold mb-4 transition-all duration-300 ${
                  status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {status ? "✅" : "❌"}
              </div>
              <p className="text-xl font-medium text-gray-700">
                Current Status:{" "}
                <span
                  className={`font-bold ${
                    status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status ? "Active" : "Inactive"}
                </span>
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-8">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={toggleStatus}
                  className="sr-only peer"
                  disabled={loading}
                />
                <div className="w-20 h-10 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative transition-all duration-300">
                  <div className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md transform transition-all duration-300 peer-checked:translate-x-10"></div>
                </div>
                <span className="ml-3 text-lg font-medium text-gray-700">
                  {status ? "Turn Off" : "Turn On"}
                </span>
              </label>
            </div>

            {/* Extra Button */}
            <button
              onClick={toggleStatus}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md"
            >
              {status ? "Set Inactive" : "Set Active"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
