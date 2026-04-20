"use client";
import dynamic from "next/dynamic";

const JuniorAdmissionForm = dynamic(() => import("./JuniorAdmissionForm"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading admission form…</p>
    </div>
  ),
});

export default function JuniorAdmissionPage() {
  return <JuniorAdmissionForm />;
}
