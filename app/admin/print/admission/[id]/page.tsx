"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Printer, ArrowLeft } from "lucide-react";

export default function AdmissionPrintPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold text-xl uppercase tracking-widest">Admission Record Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:p-0 print:bg-white">
      {/* Controls - Hidden on Print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => window.close()} 
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg font-bold text-sm"
        >
          <Printer size={18} /> Print Application
        </button>
      </div>

      {/* Printable Area */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl p-[20mm] print:shadow-none print:p-0">
        {/* Letterhead */}
        <div className="flex items-center gap-6 border-b-4 border-blue-900 pb-6 mb-8">
          <div className="w-24 h-24 bg-blue-900 flex items-center justify-center flex-shrink-0">
             <span className="text-white font-black text-4xl">P</span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter leading-none mb-1">Pathfinder College</h1>
            <p className="text-xs text-blue-800 font-bold uppercase tracking-widest mb-2">Creche • Nursery • Primary • Secondary</p>
            <div className="text-[10px] text-gray-500 space-y-0.5 font-medium">
              <p>Opposite Jesus is King Ministries, Sango, U.I. Road, Samonda, Ibadan</p>
              <p>Email: info@pathfindercollege.edu.ng | Web: www.pathfindercollege.edu.ng</p>
              <p>Phone: +234 (0) 801 234 5678, +234 (0) 805 123 4567</p>
            </div>
          </div>
          <div className="text-right flex flex-col justify-end">
            <div className="bg-blue-900 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest inline-block">
              {type} ADMISSION FORM
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-mono">{data.paymentReference}</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {/* Top Section: Photo + Basic Info */}
          <div className="flex gap-10">
            <div className="w-40 h-48 border-4 border-gray-100 p-1 flex-shrink-0">
              {data.passportPhoto ? (
                <img src={data.passportPhoto} alt="Student" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200 text-xs">NO PHOTO</div>
              )}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <PrintField label="Surname" value={data.surname} />
                <PrintField label="Other Names" value={data.otherNames} />
                <PrintField label="Date of Birth" value={new Date(data.dateOfBirth).toLocaleDateString('en-NG', { dateStyle: 'long' })} />
                <PrintField label="Sex" value={data.sex} />
                <PrintField label="Nationality" value={data.nationality} />
                <PrintField label="State of Origin" value={data.state} />
                <PrintField label="LGA" value={data.lga} />
                <PrintField label="Home Town" value={data.homeTown} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
             {/* Left Column */}
             <div className="space-y-8">
                <PrintSection title="A. Personal Information">
                   <PrintField label="Religion" value={data.religion} />
                   <PrintField label="Family Position" value={data.positionInFamily} />
                   <PrintField label="Language Spoken" value={data.language} />
                   <PrintField label="Current Address" value={data.residentialAddress} />
                </PrintSection>

                <PrintSection title="B. Health Information">
                   <PrintField label="Food Allergy" value={data.foodAllergy} />
                   <PrintField label="Drug Allergy" value={data.drugAllergy} />
                   <PrintField label="Medical History" value={data.medicalHistory} />
                   <PrintField label="Medical Practitioner" value={data.medicalPractitioner} />
                </PrintSection>
             </div>

             {/* Right Column */}
             <div className="space-y-8">
                <PrintSection title="C. Parent / Guardian Information">
                   <PrintField label="Full Name" value={`${data.parentSurname} ${data.parentOtherNames}`} />
                   <PrintField label="Occupation" value={data.parentsOccupation} />
                   <PrintField label="Father Phone" value={data.fatherPhone} />
                   <PrintField label="Mother Phone" value={data.motherPhone} />
                   <PrintField label="Emergency Contact" value={data.contactPerson} />
                </PrintSection>

                <PrintSection title="D. Payment / Submission">
                   <PrintField label="Status" value={data.paymentStatus} highlight />
                   <PrintField label="Reference" value={data.paymentReference} />
                   <PrintField label="Submission Date" value={new Date(data.submittedAt).toLocaleString('en-NG')} />
                </PrintSection>
             </div>
          </div>

          {/* Footer Signature Area */}
          <div className="mt-20 pt-12 border-t border-gray-100 flex justify-between">
            <div className="text-center">
              <div className="w-48 border-b-2 border-gray-300 mb-2"></div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parent / Guardian Signature</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b-2 border-gray-300 mb-2"></div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registrar / Official Seal</p>
            </div>
          </div>

          <p className="text-center text-[9px] text-gray-300 mt-10 uppercase tracking-[0.2em] font-medium italic">
            This is an official document generated from the Pathfinder College Admission Portal. 
            Verification ID: {data._id}
          </p>
        </div>
      </div>
    </div>
  );
}

function PrintSection({ title, children }: any) {
  return (
    <div>
      <h3 className="text-xs font-black text-blue-900 border-b-2 border-gray-100 pb-1 mb-4 uppercase tracking-widest">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function PrintField({ label, value, highlight }: any) {
  return (
    <div>
      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-[11px] font-bold text-gray-800 ${highlight ? 'text-blue-600' : ''}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}
