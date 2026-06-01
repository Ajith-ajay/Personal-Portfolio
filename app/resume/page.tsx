"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/db";

const RESUME_COLLECTION = "resume_settings";
const RESUME_DOC_ID = "current";
const FALLBACK_RESUME_URL = "/Resume.pdf";

export default function ResumeRedirectPage() {
	const [statusMessage, setStatusMessage] = useState("Opening the latest resume...");

	useEffect(() => {
		let isMounted = true;

		const redirectToLatestResume = async () => {
			try {
				const snapshot = await getDoc(doc(db, RESUME_COLLECTION, RESUME_DOC_ID));
				const latestUrl = snapshot.exists() ? (snapshot.data() as { url?: string }).url : null;
				const targetUrl = latestUrl || FALLBACK_RESUME_URL;

				if (isMounted) {
					window.location.replace(targetUrl);
				}
			} catch {
				if (isMounted) {
					setStatusMessage("Unable to load the latest resume right now. Opening the fallback resume.");
					window.location.replace(FALLBACK_RESUME_URL);
				}
			}
		};

		redirectToLatestResume();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
			<div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl backdrop-blur">
				<p className="text-sm uppercase tracking-[0.24em] text-white/50">Resume</p>
				<h1 className="mt-2 text-2xl font-semibold">Redirecting...</h1>
				<p className="mt-3 text-sm text-white/70">{statusMessage}</p>
			</div>
		</div>
	);
}
