"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

export default function ActiveStatusPage() {
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const docRef = doc(db, "active_status", "TBrfdBLjRv32rvSMvQk9");
  const { authReady, user } = useRequireAuth();

  useEffect(() => {
    if (!authReady || !user) return;
    (async () => {
      try {
        setErrorMessage("");
        const snap = await getDoc(docRef);
        if (snap.exists()) setStatus(Boolean(snap.data().status));
      } catch {
        setErrorMessage("Unable to load active status. Check Firestore permissions.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authReady, user]);

  const toggleStatus = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await updateDoc(docRef, { status: !status });
      setStatus(!status);
    } catch {
      setErrorMessage("Unable to update active status. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
          Loading active status...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Active Status
          </h2>
          <p className="mt-2 text-gray-600">
            Toggle the site availability state for your portfolio.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Current State
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading ? "Checking..." : status ? "Active" : "Inactive"}
                </p>
              </div>
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-sm transition-all duration-300 ${
                  loading
                    ? "bg-gray-100 text-gray-400"
                    : status
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                }`}
              >
                {loading ? "…" : status ? "✓" : "×"}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-4 text-sm text-gray-600">
              {status
                ? "Your portfolio is visible to visitors right now."
                : "Your portfolio is currently hidden from visitors."}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800">Update Status</h3>
            <p className="mt-2 text-sm text-gray-500">
              Use the switch or button below to change the current state.
            </p>

            {errorMessage && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            {loading ? (
              <p className="mt-8 text-gray-500 animate-pulse">Loading status...</p>
            ) : (
              <>
                <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
                  <div
                    className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold transition-all duration-300 ${
                      status ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {status ? "✓" : "×"}
                  </div>
                  <p className="text-xl font-medium text-gray-700">
                    Current Status: {" "}
                    <span className={`font-bold ${status ? "text-emerald-600" : "text-rose-600"}`}>
                      {status ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={toggleStatus}
                      className="sr-only peer"
                      disabled={loading}
                    />
                    <div className="relative h-10 w-20 rounded-full bg-gray-200 transition-all duration-300 peer-checked:bg-emerald-500">
                      <div className="absolute left-1 top-1 h-8 w-8 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:translate-x-10" />
                    </div>
                    <span className="text-base font-medium text-gray-700">
                      {status ? "Turn Off" : "Turn On"}
                    </span>
                  </label>
                </div>

                <button
                  onClick={toggleStatus}
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status ? "Set Inactive" : "Set Active"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
