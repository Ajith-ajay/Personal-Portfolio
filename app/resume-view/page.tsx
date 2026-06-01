"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/db";

const RESUME_COLLECTION = "resume_settings";
const RESUME_DOC_ID = "current";
const FALLBACK_RESUME_URL = "/Resume1.pdf";
const STATIC_RESUME_URL = "/resume-view";

export default function ResumeViewPage() {
	const [resumeUrl, setResumeUrl] = useState(FALLBACK_RESUME_URL);
	const [resumeName, setResumeName] = useState("Resume1.pdf");
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		let isMounted = true;

		const loadResume = async () => {
			try {
				const snapshot = await getDoc(doc(db, RESUME_COLLECTION, RESUME_DOC_ID));

				if (!isMounted) return;

				if (snapshot.exists()) {
					const data = snapshot.data() as { url?: string; fileName?: string };

					if (data.url) {
						setResumeUrl(data.url);
					}

					if (data.fileName) {
						setResumeName(data.fileName);
					}
				}
			} catch {
				if (isMounted) {
					setErrorMessage("Unable to load the latest resume. Showing the fallback copy.");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadResume();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-neutral-100 via-white to-neutral-200 text-neutral-900">
			<div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
				<div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
					<div>
						<p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Resume Preview</p>
						<h1 className="text-lg font-semibold text-neutral-900">Ajith G</h1>
					</div>
					<div className="flex flex-wrap gap-2 text-sm">
						<a
							href={resumeUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-full border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
						>
							Open PDF
						</a>
						<a
							href={resumeUrl}
							download
							className="rounded-full bg-neutral-900 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-700"
						>
							Download
						</a>
					</div>
				</div>

				{errorMessage && (
					<div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
						{errorMessage}
					</div>
				)}

				<div className="relative flex-1 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
					{loading ? (
						<div className="flex h-full min-h-[80vh] items-center justify-center text-sm text-neutral-500">
							Loading resume...
						</div>
					) : (
						<iframe
							src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
							title="Resume preview"
							scrolling="no"
							className="h-[calc(100vh-9rem)] w-full bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						/>
					)}
				</div>

				<div className="flex items-center justify-center pt-2 text-xs text-neutral-500">
					<span className="rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-sm">
						Backup viewer: {STATIC_RESUME_URL}
					</span>
				</div>
			</div>
		</div>
	);
}
