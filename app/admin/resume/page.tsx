"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRequireAuth } from "../../../hooks/use-auth";
import { db } from "@/app/db";

const RESUME_COLLECTION = "resume_settings";
const RESUME_DOC_ID = "current";
const RESUME_STORAGE_PATH = "resume/current-resume.pdf";
const FALLBACK_RESUME_URL = "/Resume1.pdf";

export default function ResumePage() {
	const [currentResumeUrl, setCurrentResumeUrl] = useState(FALLBACK_RESUME_URL);
	const [currentResumeName, setCurrentResumeName] = useState("Resume1.pdf");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedPreviewUrl, setSelectedPreviewUrl] = useState("");
	const [selectedFileError, setSelectedFileError] = useState("");
	const [uploading, setUploading] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const { authReady, user } = useRequireAuth();

	useEffect(() => {
		if (!authReady || !user) return;
		const fetchCurrentResume = async () => {
			try {
				setErrorMessage("");
				const snapshot = await getDoc(doc(db, RESUME_COLLECTION, RESUME_DOC_ID));

				if (snapshot.exists()) {
					const data = snapshot.data() as { url?: string; fileName?: string };

					if (data.url) {
						setCurrentResumeUrl(data.url);
					}

					if (data.fileName) {
						setCurrentResumeName(data.fileName);
					}
				}
			} catch {
				setErrorMessage("Unable to load the saved resume. Check Firestore permissions.");
			}
		};

		fetchCurrentResume();
	}, [authReady, user]);

	useEffect(() => {
		if (!selectedFile) {
			setSelectedPreviewUrl("");
			return;
		}

		const previewUrl = URL.createObjectURL(selectedFile);
		setSelectedPreviewUrl(previewUrl);

		return () => {
			URL.revokeObjectURL(previewUrl);
		};
	}, [selectedFile]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;

		if (!file) {
			setSelectedFile(null);
			setSelectedFileError("");
			return;
		}

		if (file.type !== "application/pdf") {
			setSelectedFile(null);
			setSelectedPreviewUrl("");
			setSelectedFileError("Please select a PDF file.");
			return;
		}

		setSelectedFileError("");
		setSelectedFile(file);
	};

	const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();

	if (!user) {
		setStatusMessage("Please wait for authentication to finish loading.");
		return;
	}

	if (!selectedFile) {
		setSelectedFileError("Choose a PDF before uploading.");
		return;
	}

	// ✅ Validate PDF (important)
	if (selectedFile.type !== "application/pdf") {
		setSelectedFileError("Only PDF files are allowed.");
		return;
	}

	try {
		setUploading(true);
		setStatusMessage("");
		setErrorMessage("");

		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
		const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

		if (!cloudName || !uploadPreset) {
			throw new Error("Cloudinary not configured.");
		}

		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("upload_preset", uploadPreset);

		// ✅ Use AUTO (better than raw)
		const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

		const res = await fetch(endpoint, {
			method: "POST",
			body: formData,
		});

		const data = await res.json();

		if (!res.ok) {
			console.error(data);
			throw new Error(data.error?.message || "Upload failed");
		}

		const url = data.secure_url;
		const storagePath = `cloudinary:${data.public_id}`;

		if (!url) throw new Error("Upload did not return a URL.");

		await setDoc(doc(db, RESUME_COLLECTION, RESUME_DOC_ID), {
			url,
			fileName: selectedFile.name,
			storagePath,
			updatedAt: serverTimestamp(),
		});

		setCurrentResumeUrl(url);
		setCurrentResumeName(selectedFile.name);
		setSelectedFile(null);
		setSelectedPreviewUrl("");
		setStatusMessage("Resume updated successfully.");
	} catch (err: any) {
		console.error(err);
		setErrorMessage(err?.message || "Upload failed.");
	} finally {
		setUploading(false);
	}
};

	if (!authReady) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 md:p-10">
				<div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
					Loading resume manager...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
			<div className="mx-auto max-w-6xl space-y-8">
				<div>
					<h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
						Manage Resume
					</h2>
					<p className="mt-2 text-gray-600">
						Preview the live resume, then upload a new PDF to replace it.
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
					<section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
						<div className="mb-4 flex items-center justify-between gap-4">
							<div>
								<h3 className="text-xl font-bold text-gray-800">Current Resume Preview</h3>
								<p className="text-sm text-gray-500">{currentResumeName}</p>
							</div>
							<a
								href={currentResumeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
							>
								Open Resume
							</a>
						</div>

						{errorMessage && (
							<div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
								{errorMessage}
							</div>
						)}

						<div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
							<iframe
								src={currentResumeUrl}
								title="Current resume preview"
								className="h-[72vh] w-full"
							/>
						</div>
					</section>

					<section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
						<h3 className="text-xl font-bold text-gray-800">Upload New Resume</h3>
						<p className="mt-2 text-sm text-gray-500">
							Upload a PDF to update the resume used across the portfolio.
						</p>

						<form onSubmit={handleUpload} className="mt-6 space-y-5">
							<label className="block">
								<span className="mb-2 block text-sm font-medium text-gray-700">Resume PDF</span>
								<input
									type="file"
									accept="application/pdf"
									onChange={handleFileChange}
									className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 focus:border-blue-500 focus:outline-none"
								/>
							</label>

							{selectedFileError && (
								<p className="text-sm font-medium text-red-600">{selectedFileError}</p>
							)}

							{statusMessage && (
								<p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
									{statusMessage}
								</p>
							)}

							{selectedFile && selectedPreviewUrl && (
								<div className="space-y-3">
									<div className="flex items-center justify-between text-sm text-gray-600">
										<span className="font-medium text-gray-800">Selected file preview</span>
										<span>{selectedFile.name}</span>
									</div>
									<div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
										<iframe
											src={selectedPreviewUrl}
											title="Selected resume preview"
											className="h-80 w-full"
										/>
									</div>
								</div>
							)}

							<button
								type="submit"
								disabled={uploading}
								className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{uploading ? "Uploading..." : "Upload Resume"}
							</button>
						</form>
					</section>
				</div>
			</div>
		</div>
	);
}
