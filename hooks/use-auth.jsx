"use client"; 

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/db";

export const useRequireAuth = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // guard on server
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);
};
