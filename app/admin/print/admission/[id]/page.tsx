"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2, Printer, ArrowLeft, Download, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function AdmissionPrintPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admissions/get/${id}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          setType(json.type);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setPdfLoading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pgW = pdf.internal.pageSize.getWidth();
      const pgH = pdf.internal.pageSize.getHeight();
      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = pgW / imgW;
      let heightLeft = imgH * ratio;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, pgW, imgH * ratio);
      heightLeft -= pgH;

      // Additional pages if content overflows
      while (heightLeft > 0) {
        position -= pgH;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pgW, imgH * ratio);
        heightLeft -= pgH;
      }

      pdf.save(`${data.surname}_${data.otherNames}_Admission_Form.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Using browser print instead.");
      window.print();
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-700 mx-auto mb-4" size={40} />
          <p className="text-gray-500 text-sm font-medium">Loading application...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Record Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This admission record may have been deleted.</p>
          <button
            onClick={() => window.close()}
            className="text-blue-600 font-semibold text-sm hover:underline"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );

  const formatDate = (d: any) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white print:min-h-0">
      {/* ─── Floating Action Bar (hidden on print) ─── */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => window.close()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-semibold text-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 font-bold text-sm disabled:opacity-50"
            >
              {pdfLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {pdfLoading ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 font-bold text-sm"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print Form</span>
              <span className="sm:hidden">Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── A4 Printable Document ─── */}
      <div className="max-w-[900px] mx-auto py-6 sm:py-10 px-4 sm:px-6 print:p-0 print:max-w-none">
        <div
          ref={printRef}
          className="bg-white shadow-2xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden"
          style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}
        >
          {/* ─── HEADER / LETTERHEAD ─── */}
          <div className="bg-[#0E539C] text-white px-6 sm:px-10 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-[#0E539C] font-black text-2xl sm:text-3xl">P</span>
              </div>

              {/* School Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none">
                  Pathfinder College
                </h1>
                <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mt-1">
                  Crèche • Nursery • Primary • Secondary
                </p>
                <div className="mt-2 flex flex-col sm:flex-row flex-wrap items-center gap-x-4 gap-y-1 text-white/60 text-[9px] sm:text-[10px]">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    Opp. Jesus is King Ministries, Sango, U.I. Road, Samonda, Ibadan
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={10} />
                    +234 (0) 801 234 5678
                  </span>
                </div>
              </div>

              {/* Form Type Badge */}
              <div className="text-center sm:text-right flex-shrink-0">
                <div className="bg-[#d4af37] text-[#0E539C] px-4 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest inline-block shadow-lg">
                  {type} Admission Form
                </div>
                <p className="text-white/40 text-[9px] mt-2 font-mono tracking-wide">
                  REF: {data.paymentReference || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Gold accent line */}
          <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#e6c85b] to-[#d4af37]" />

          {/* ─── STUDENT PROFILE STRIP ─── */}
          <div className="px-6 sm:px-10 py-6 sm:py-8 bg-gray-50 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Passport Photo */}
              <div className="w-[120px] h-[150px] sm:w-[130px] sm:h-[160px] border-2 border-gray-200 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-md">
                {data.passportPhoto ? (
                  <img
                    src={data.passportPhoto}
                    alt="Student passport"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                    <span className="text-4xl mb-1">👤</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold">No Photo</span>
                  </div>
                )}
              </div>

              {/* Student Name & Quick Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {data.surname}{" "}
                  <span className="text-[#0E539C]">{data.otherNames}</span>
                </h2>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <InfoPill label="DOB" value={formatDate(data.dateOfBirth)} />
                  <InfoPill label="Sex" value={data.sex || "N/A"} />
                  <InfoPill label="Nationality" value={data.nationality || "N/A"} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <InfoPill label="State" value={data.state || "N/A"} />
                  <InfoPill label="LGA" value={data.lga || "N/A"} />
                  <InfoPill label="Home Town" value={data.homeTown || "N/A"} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-[#0E539C]/10 text-[#0E539C] text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {data.levelOfSchooling || type || "Junior"} School
                  </span>
                  {data.classAppliedFor && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Class: {data.classAppliedFor}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      data.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {data.paymentStatus || "pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── MAIN CONTENT SECTIONS ─── */}
          <div className="px-6 sm:px-10 py-6 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              {/* LEFT COLUMN */}
              <div className="space-y-8">
                {/* A: Personal Information */}
                <FormSection title="A" heading="Personal Information">
                  <FormField label="Religion" value={data.religion} />
                  <FormField label="Position in Family" value={data.positionInFamily} />
                  <FormField label="Language Spoken" value={data.language} />
                  {data.previousSchool && (
                    <FormField label="Previous School" value={data.previousSchool} />
                  )}
                  {data.previousClass && (
                    <FormField label="Previous Class" value={data.previousClass} />
                  )}
                </FormSection>

                {/* B: Address Information */}
                <FormSection title="B" heading="Address Information">
                  <FormField label="Residential Address" value={data.residentialAddress} />
                  <FormField label="Office Address" value={data.officeAddress} />
                </FormSection>

                {/* C: Health Information */}
                <FormSection title="C" heading="Health & Medical">
                  <FormField label="Food Allergy" value={data.foodAllergy || "None"} />
                  <FormField label="Drug Allergy" value={data.drugAllergy || "None"} />
                  <FormField label="Medical History" value={data.medicalHistory || "None"} />
                  <FormField label="Medical Practitioner" value={data.medicalPractitioner} />
                </FormSection>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8">
                {/* D: Parent / Guardian */}
                <FormSection title="D" heading="Parent / Guardian">
                  <FormField
                    label="Full Name"
                    value={`${data.parentSurname || ""} ${data.parentOtherNames || ""}`}
                  />
                  <FormField label="Occupation" value={data.parentsOccupation} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Father's Phone" value={data.fatherPhone} />
                    <FormField label="Mother's Phone" value={data.motherPhone} />
                  </div>
                  <FormField label="Emergency Contact" value={data.contactPerson} />
                  {data.parentEmail && (
                    <FormField label="Email Address" value={data.parentEmail} />
                  )}
                </FormSection>

                {/* E: Submission & Payment */}
                <FormSection title="E" heading="Submission & Payment">
                  <FormField label="Payment Status" value={data.paymentStatus} highlight />
                  <FormField label="Payment Reference" value={data.paymentReference} />
                  <FormField label="Amount Paid" value={data.amountPaid ? `₦${Number(data.amountPaid).toLocaleString()}` : "N/A"} />
                  <FormField
                    label="Date Submitted"
                    value={
                      data.submittedAt
                        ? new Date(data.submittedAt).toLocaleString("en-NG", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })
                        : "N/A"
                    }
                  />
                  {data.examDate && (
                    <FormField label="Exam Date" value={data.examDate} highlight />
                  )}
                </FormSection>

                {/* F: Declaration */}
                <FormSection title="F" heading="Declaration">
                  <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    I/We the parent(s)/guardian(s) of the above-named candidate hereby certify that all
                    information provided in this application form is true and correct to the best of
                    my/our knowledge. I/We understand that any false information may lead to the
                    cancellation of this application.
                  </p>
                </FormSection>
              </div>
            </div>
          </div>

          {/* ─── SIGNATURE AREA ─── */}
          <div className="px-6 sm:px-10 py-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-16">
              <div className="flex-1 text-center">
                <div className="h-16 border-b-2 border-gray-300 mb-3" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Parent / Guardian Signature
                </p>
                <p className="text-[9px] text-gray-300 mt-1">Date: ___________________</p>
              </div>
              <div className="flex-1 text-center">
                <div className="h-16 border-b-2 border-gray-300 mb-3" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Registrar Signature & Seal
                </p>
                <p className="text-[9px] text-gray-300 mt-1">Date: ___________________</p>
              </div>
            </div>
          </div>

          {/* ─── FOOTER ─── */}
          <div className="bg-gray-50 border-t border-gray-100 px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[8px] text-gray-300 uppercase tracking-[0.15em] font-medium text-center sm:text-left">
              Official Document — Pathfinder College Admission Portal
            </p>
            <p className="text-[8px] text-gray-300 font-mono text-center sm:text-right">
              ID: {data._id}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Print-Specific Styles ─── */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* Ensure backgrounds are printed */
          * {
            -webkit-print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Reusable Sub-Components ─── */

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-600">
      <span className="font-bold text-gray-400 uppercase tracking-wider">{label}:</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function FormSection({
  title,
  heading,
  children,
}: {
  title: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#0E539C] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-black">{title}</span>
        </div>
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.1em]">{heading}</h3>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <div className="space-y-3 pl-10">{children}</div>
    </div>
  );
}

function FormField({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p
        className={`text-[12px] font-semibold leading-snug ${
          highlight ? "text-[#0E539C] font-bold" : "text-gray-700"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
}
