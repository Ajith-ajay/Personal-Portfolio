"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/db";

const RESUME_COLLECTION = "resume_settings";
const RESUME_DOC_ID = "current";
const FALLBACK_RESUME_URL = "/Resume1.pdf";
const STATIC_RESUME_URL = "/Ajith_Resume.pdf";

export default function ResumeRoutePage() {
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
		<div className="min-h-screen bg-neutral-950 text-white">
			<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
				<div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
					<div>
						<p className="text-xs uppercase tracking-[0.24em] text-white/60">Resume</p>
						<h1 className="text-lg font-semibold">Ajith G</h1>
					</div>
					<div className="flex flex-wrap gap-2 text-sm">
						<a
							href={resumeUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15"
						>
							Open PDF
						</a>
						<a
							href={resumeUrl}
							download
							className="rounded-full bg-white px-4 py-2 font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
						>
							Download
						</a>
					</div>
				</div>

				{errorMessage && (
					<div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
						{errorMessage}
					</div>
				)}

				<div className="relative flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111827] shadow-2xl">
					{loading ? (
						<div className="flex h-full min-h-[80vh] items-center justify-center text-sm text-white/60">
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
						Public link: {STATIC_RESUME_URL}
					</span>
				</div>
			</div>
		</div>
	);
}
