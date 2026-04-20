"use client";
import { useState, useCallback } from "react";
import { usePaystackPayment } from "react-paystack";

const AMOUNT = 20000;

const initialForm = {
  email: "",
  surname: "",
  otherNames: "",
  dateOfBirth: "",
  sex: "",
  nationality: "",
  state: "",
  homeTown: "",
  lga: "",
  religion: "",
  language: "",
  schoolLastAttended: "",
  classCompleted: "",
  parentSurname: "",
  parentOtherNames: "",
  relationshipToChild: "",
  parentSignature: "",
  fatherPhone: "",
  motherPhone: "",
  officeAddress: "",
  contactAddress: "",
  residentialAddress: "",
  medicalHistory: "",
  medicalPractitioner: "",
  passportPhoto: "", // base64 data URL
};

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder = "",
  value,
  onChange,
  error,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        style={{ color: "#111827", backgroundColor: "#ffffff" }}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function RadioField({
  label,
  name,
  options,
  required,
  value,
  onChange,
  error,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex flex-wrap gap-4 mt-1">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className="accent-blue-600 w-4 h-4"
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TextArea({ label, name, rows = 2, required, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{ color: "#111827", backgroundColor: "#ffffff" }}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-bold text-blue-700 border-b border-blue-100 pb-2 mb-4">
      {children}
    </h2>
  );
}

export default function SeniorAdmissionForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  // Handle passport photo upload → convert to base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        passportPhoto: "Please upload a valid image file.",
      }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        passportPhoto: "Photo must be under 2 MB.",
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhotoPreview(dataUrl);
      setForm((prev) => ({ ...prev, passportPhoto: dataUrl }));
      setErrors((prev) => ({ ...prev, passportPhoto: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validate = () => {
    const required = [
      "email",
      "surname",
      "otherNames",
      "dateOfBirth",
      "sex",
      "nationality",
      "parentSurname",
      "parentOtherNames",
      "fatherPhone",
      "residentialAddress",
    ];
    const newErrors = {};
    required.forEach((field) => {
      if (!form[field]?.trim()) newErrors[field] = "This field is required.";
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.passportPhoto) {
      newErrors.passportPhoto =
        "Please upload a passport photograph of the student.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const paystackConfig = {
    reference: `SNR-${Date.now()}`,
    email: form.email,
    amount: AMOUNT * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleDownloadPDF = async () => {
    const el = document.getElementById("parent-print-area");
    if (!el) return;
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.97);
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pgW = pdf.internal.pageSize.getWidth();
      const pgH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pgW / canvas.width, pgH / canvas.height);
      pdf.addImage(
        imgData,
        "JPEG",
        (pgW - canvas.width * ratio) / 2,
        (pgH - canvas.height * ratio) / 2,
        canvas.width * ratio,
        canvas.height * ratio,
      );
      pdf.save(`${form.surname}_${form.otherNames}_Senior_Admission.pdf`);
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If amount is 0 (free), skip Paystack and submit directly
    if (AMOUNT === 0) {
      const ref = `SNR-FREE-${Date.now()}`;
      setPaymentRef(ref);
      setSubmitting(true);
      try {
        const res = await fetch("/api/admissions/senior", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            paymentReference: ref,
            paymentStatus: "free",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Submission failed");
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        alert("Submission failed. Please try again.");
        console.error(err);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    initializePayment({
      onSuccess: async (res) => {
        setPaymentRef(res.reference);
        setSubmitting(true);
        try {
          const response = await fetch("/api/admissions/senior", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              paymentReference: res.reference,
              paymentStatus: "paid",
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Submission failed");
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
          alert(
            `Payment successful (Ref: ${res.reference}) but submission failed. Please contact the school with this reference.`,
          );
          console.error(err);
        } finally {
          setSubmitting(false);
        }
      },
      onClose: () => {},
    });
  };

  if (submitted) {
    const dob = form.dateOfBirth ? new Date(form.dateOfBirth) : null;
    const dd = dob ? dob.getDate() : "";
    const mm = dob ? dob.getMonth() + 1 : "";
    const yy = dob ? dob.getFullYear() : "";
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #parent-print-area, #parent-print-area * { visibility: visible !important; }
            #parent-print-area { position: fixed !important; top: 0; left: 0; width: 210mm !important; height: 297mm !important; padding: 10mm 13mm 18mm !important; font-size: 12px !important; background: #fff !important; overflow: hidden !important; }
            .pp-no-print { display: none !important; }
            .pp-section { background: #eef3fc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .pp-official { background: #d8e9f8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { size: A4 portrait; margin: 0; }
          }
          #parent-print-area { font-family: 'Times New Roman', Times, serif; font-size: 12px; color: #111; line-height: 1.6; }
          .pp-header { display: flex; align-items: flex-start; gap: 14px; border-bottom: 3px double #1a3a6b; padding-bottom: 14px; margin-bottom: 8px; }
          .pp-logo { height: 72px; width: auto; object-fit: contain; flex-shrink: 0; }
          .pp-school-name { font-size: 21px; font-weight: bold; color: #1a3a6b; letter-spacing: .6px; line-height: 1.2; }
          .pp-school-sub { font-size: 10.5px; color: #1a3a6b; font-style: italic; margin-top: 3px; }
          .pp-school-addr { font-size: 9.5px; color: #444; margin-top: 4px; line-height: 1.4; }
          .pp-passport { width: 90px; height: 108px; border: 1.5px solid #888; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #aaa; text-align: center; flex-shrink: 0; overflow: hidden; }
          .pp-passport img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .pp-title { text-align: center; font-size: 16px; font-weight: bold; letter-spacing: 1.5px; margin: 12px 0 2px; }
          .pp-title-sub { text-align: center; font-size: 10px; letter-spacing: 3px; margin-bottom: 3px; }
          .pp-ref { text-align: center; font-size: 9px; color: #555; border-bottom: 1.5px solid #ccc; padding-bottom: 6px; margin-bottom: 10px; }
          .pp-section { font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; background: #eef3fc; border-left: 3px solid #1a3a6b; padding: 4px 8px; margin: 12px 0 7px; }
          .pp-subsec { font-weight: bold; font-size: 11px; margin: 10px 0 5px; }
          .pp-row { display: flex; align-items: flex-end; margin-bottom: 9px; gap: 3px; flex-wrap: nowrap; }
          .pp-n { min-width: 26px; font-size: 11px; flex-shrink: 0; font-weight: 600; }
          .pp-lbl { font-size: 11px; white-space: nowrap; }
          .pp-val { flex: 1; min-width: 40px; border-bottom: 1.5px dashed #333; margin: 0 4px; padding: 2px 3px; font-size: 11px; font-weight: 700; min-height: 20px; }
          .pp-box { display: inline-block; width: 30px; height: 22px; border: 1.5px solid #444; font-size: 11px; margin: 0 3px; vertical-align: bottom; flex-shrink: 0; font-weight: 700; text-align: center; line-height: 22px; }
          .pp-fl { display: flex; align-items: flex-end; margin-bottom: 9px; gap: 5px; }
          .pp-fl-lbl { font-size: 11px; white-space: nowrap; flex-shrink: 0; font-weight: 500; padding-bottom: 2px; }
          .pp-fl-val { flex: 1; min-width: 0; border-bottom: 1.5px dashed #333; font-size: 11px; font-weight: 700; padding: 2px 4px; min-height: 20px; }
          .pp-indent { padding-left: 20px; }
          .pp-official { margin-top: 14px; background: #d8e9f8; border: 1.5px solid #8ab4d8; padding: 10px 14px; }
          .pp-official-title { text-align: center; font-weight: bold; font-size: 11px; letter-spacing: 1.5px; margin-bottom: 8px; text-decoration: underline; }
          .pp-official-row { display: flex; gap: 24px; margin-bottom: 6px; }
          .pp-official-field { display: flex; align-items: flex-end; font-size: 10.5px; gap: 3px; }
          .pp-official-line { display: inline-block; width: 120px; border-bottom: 1px dashed #444; }
          .pp-official-line.wide { width: 220px; }
        `}</style>

        <div className="max-w-3xl mx-auto">
          {/* Success banner */}
          <div className="pp-no-print bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-6 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <h2 className="text-xl font-bold text-green-700 mb-1">
              Application Submitted!
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Your senior admission form has been received. Print or download a
              copy for your records.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => window.print()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 22px",
                  background: "linear-gradient(135deg,#0E539C,#1a70cc)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                🖨 Print Form
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 22px",
                  background: "linear-gradient(135deg,#059669,#10b981)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ⬇ Download PDF
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Ref:{" "}
              <span className="font-semibold text-gray-600">{paymentRef}</span>
            </p>
          </div>

          {/* A4 paper */}
          <div
            style={{
              background: "#fff",
              padding: "28px 32px 48px",
              boxShadow: "0 4px 32px rgba(0,0,0,.15)",
            }}
          >
            <div id="parent-print-area">
              {/* Header */}
              <div className="pp-header">
                <img
                  src="/Blue_logo.png"
                  alt="Pathfinder College"
                  className="pp-logo"
                />
                <div style={{ flex: 1 }}>
                  <div className="pp-school-name">PATHFINDER COLLEGE</div>
                  <div className="pp-school-sub">
                    JSS 1 – SS3 (SECONDARY SCHOOL)
                  </div>
                  <div className="pp-school-addr">
                    Opposite Jesus is King Ministries&apos;, Sango, U.I. Road,
                    Samonda, Ibadan, Nigeria.
                  </div>
                </div>
                <div className="pp-passport">
                  {form.passportPhoto ? (
                    <img src={form.passportPhoto} alt="Passport" />
                  ) : (
                    <span
                      style={{
                        fontSize: "7.5px",
                        color: "#aaa",
                        padding: "4px",
                      }}
                    >
                      Passport
                      <br />
                      Photo
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="pp-title">ADMISSION FORM</div>
              <div className="pp-title-sub">PCAF</div>
              <div className="pp-ref">
                Payment Ref: <strong>{paymentRef}</strong>&nbsp;|&nbsp;
                Submitted:{" "}
                <strong>
                  {new Date().toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </div>

              {/* Section 1: Biodata */}
              <div className="pp-section">1. Child&apos;s Biodata</div>
              <div className="pp-fl">
                <span className="pp-n">1.</span>
                <span className="pp-fl-lbl">Surname:</span>
                <span className="pp-fl-val">{form.surname}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">2.</span>
                <span className="pp-fl-lbl">Other Names:</span>
                <span className="pp-fl-val">{form.otherNames}</span>
              </div>
              <div className="pp-row">
                <span className="pp-n">3a.</span>
                <span className="pp-lbl">Date of Birth — Day</span>
                <span className="pp-box">{dd}</span>
                <span className="pp-lbl">Month</span>
                <span className="pp-box">{mm}</span>
                <span className="pp-lbl">Year</span>
                <span className="pp-box">{yy}</span>
                <span className="pp-lbl" style={{ marginLeft: 12 }}>
                  b. Sex (M/F)
                </span>
                <span className="pp-box">
                  {form.sex === "Male" ? "M" : form.sex === "Female" ? "F" : ""}
                </span>
              </div>
              <div className="pp-row">
                <span className="pp-n">4.</span>
                <span className="pp-lbl">Nationality</span>
                <span className="pp-val">{form.nationality}</span>
                <span className="pp-lbl">State</span>
                <span className="pp-val">{form.state}</span>
                <span className="pp-lbl">Town</span>
                <span className="pp-val">{form.homeTown}</span>
                <span className="pp-lbl">LGA</span>
                <span className="pp-val">{form.lga}</span>
              </div>
              <div className="pp-row">
                <span className="pp-n">5.</span>
                <span className="pp-lbl">Religion</span>
                <span className="pp-val">{form.religion}</span>
                <span className="pp-lbl">Language</span>
                <span className="pp-val">{form.language}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">6a.</span>
                <span className="pp-fl-lbl">School Last Attended:</span>
                <span className="pp-fl-val">{form.schoolLastAttended}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">b.</span>
                <span className="pp-fl-lbl">Class Completed:</span>
                <span className="pp-fl-val">{form.classCompleted}</span>
              </div>

              {/* Section 7: Parent */}
              <div className="pp-section">
                7. Information About Parent / Guardian
              </div>
              <div className="pp-fl">
                <span className="pp-n">1.</span>
                <span className="pp-fl-lbl">Surname of Parent/Guardian:</span>
                <span className="pp-fl-val">{form.parentSurname}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">2.</span>
                <span className="pp-fl-lbl">Other Names:</span>
                <span className="pp-fl-val">{form.parentOtherNames}</span>
              </div>
              <div className="pp-row">
                <span className="pp-n">3.</span>
                <span className="pp-lbl">Relationship</span>
                <span className="pp-val">{form.relationshipToChild}</span>
                <span className="pp-lbl">Signature</span>
                <span className="pp-val">{form.parentSignature}</span>
              </div>
              <div className="pp-row">
                <span className="pp-n">4.</span>
                <span className="pp-lbl">Father’s Phone</span>
                <span className="pp-val">{form.fatherPhone}</span>
                <span className="pp-lbl">Mother’s Phone</span>
                <span className="pp-val">{form.motherPhone}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">5.</span>
                <span className="pp-fl-lbl">Office Address:</span>
                <span className="pp-fl-val">{form.officeAddress}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">6.</span>
                <span className="pp-fl-lbl">Contact Address:</span>
                <span className="pp-fl-val">{form.contactAddress}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">7.</span>
                <span className="pp-fl-lbl">Residential Address:</span>
                <span className="pp-fl-val">{form.residentialAddress}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">8a.</span>
                <span className="pp-fl-lbl">Medical History:</span>
                <span className="pp-fl-val">{form.medicalHistory}</span>
              </div>
              <div className="pp-fl">
                <span className="pp-n">b.</span>
                <span className="pp-fl-lbl">Medical Practitioner:</span>
                <span className="pp-fl-val">{form.medicalPractitioner}</span>
              </div>

              {/* Official use */}
              <div className="pp-official">
                <div className="pp-official-title">FOR OFFICIAL USE ONLY</div>
                <div className="pp-official-row">
                  <div className="pp-official-field">
                    Admission No:&nbsp;
                    <span className="pp-official-line"></span>
                  </div>
                  <div className="pp-official-field">
                    Date Admitted:&nbsp;
                    <span className="pp-official-line"></span>
                  </div>
                </div>
                <div className="pp-official-row" style={{ marginTop: 6 }}>
                  <div className="pp-official-field" style={{ flex: 1 }}>
                    Authorising Officer&apos;s Signature:&nbsp;
                    <span className="pp-official-line wide"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img
              src="/Blue_logo.png"
              alt="Pathfinder College"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
            Pathfinder College
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            JSS 1 – SS3 (Secondary School)
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Opposite Jesus is King Ministries, Sango, U.I. Road, Samonda, Ibadan
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-5 py-2 rounded-full">
            Senior Admission Form (PCAF)
            <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">
              ₦20,000
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            A non-refundable application fee of ₦20,000 is required. Payment is
            secured by Paystack.
          </p>
        </div>

        {/* Passport Photo Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-6">
          <h2 className="text-base font-bold text-blue-700 border-b border-blue-100 pb-2 mb-4">
            📷 Student&apos;s Passport Photograph
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Preview box */}
            <div className="w-28 h-32 border-2 border-dashed border-blue-200 rounded-xl overflow-hidden flex items-center justify-center bg-blue-50 flex-shrink-0">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Passport preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-blue-300 text-center px-2">
                  Passport
                  <br />
                  Photo
                  <br />
                  Preview
                </span>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                Upload a clear, recent passport-size photograph of the student.
                <span className="block text-xs text-gray-400 mt-1">
                  Accepted formats: JPG, PNG, WEBP · Max size: 2 MB
                </span>
              </p>
              <label
                htmlFor="senior-passport-photo-input"
                className="inline-flex items-center gap-2 cursor-pointer bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {photoPreview ? "Change Photo" : "Upload Photo"}
              </label>
              <input
                id="senior-passport-photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {errors.passportPhoto && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.passportPhoto}
                </p>
              )}
              {photoPreview && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Photo uploaded successfully
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-red-700 mb-1">
              Please fix these errors:
            </p>
            <ul className="text-xs text-red-600 list-disc list-inside space-y-0.5">
              {Object.entries(errors).map(([key, val]) => (
                <li key={key}>{val}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
          {/* Contact */}
          <div>
            <SectionTitle>Contact Information</SectionTitle>
            <Field
              label="Parent Email Address"
              name="email"
              type="email"
              required
              placeholder="parent@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          {/* Child Biodata */}
          <div>
            <SectionTitle>1. Child&apos;s Biodata</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Surname"
                name="surname"
                required
                placeholder="e.g. Adeleke"
                value={form.surname}
                onChange={handleChange}
                error={errors.surname}
              />
              <Field
                label="Other Names"
                name="otherNames"
                required
                placeholder="e.g. Favour"
                value={form.otherNames}
                onChange={handleChange}
                error={errors.otherNames}
              />
              <Field
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
                value={form.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
              />
              <RadioField
                label="Sex"
                name="sex"
                options={["Male", "Female"]}
                required
                value={form.sex}
                onChange={handleChange}
                error={errors.sex}
              />
              <Field
                label="Nationality"
                name="nationality"
                required
                placeholder="e.g. Nigerian"
                value={form.nationality}
                onChange={handleChange}
                error={errors.nationality}
              />
              <Field
                label="State"
                name="state"
                placeholder="e.g. Oyo"
                value={form.state}
                onChange={handleChange}
                error={errors.state}
              />
              <Field
                label="Home Town"
                name="homeTown"
                placeholder="e.g. Ibadan"
                value={form.homeTown}
                onChange={handleChange}
                error={errors.homeTown}
              />
              <Field
                label="LGA"
                name="lga"
                placeholder="e.g. Ibadan North"
                value={form.lga}
                onChange={handleChange}
                error={errors.lga}
              />
              <Field
                label="Religion"
                name="religion"
                placeholder="e.g. Christianity"
                value={form.religion}
                onChange={handleChange}
                error={errors.religion}
              />
              <Field
                label="Language"
                name="language"
                placeholder="e.g. Yoruba"
                value={form.language}
                onChange={handleChange}
                error={errors.language}
              />
              <Field
                label="School Last Attended"
                name="schoolLastAttended"
                placeholder="School name"
                value={form.schoolLastAttended}
                onChange={handleChange}
                error={errors.schoolLastAttended}
              />
              <Field
                label="Class Completed"
                name="classCompleted"
                placeholder="e.g. JSS3"
                value={form.classCompleted}
                onChange={handleChange}
                error={errors.classCompleted}
              />
            </div>
          </div>

          {/* Parent Info */}
          <div>
            <SectionTitle>7. Information About Parent / Guardian</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Surname of Parent/Guardian"
                name="parentSurname"
                required
                placeholder="e.g. Adeleke"
                value={form.parentSurname}
                onChange={handleChange}
                error={errors.parentSurname}
              />
              <Field
                label="Other Names"
                name="parentOtherNames"
                required
                placeholder="e.g. John"
                value={form.parentOtherNames}
                onChange={handleChange}
                error={errors.parentOtherNames}
              />
              <Field
                label="Relationship to Child"
                name="relationshipToChild"
                placeholder="e.g. Father"
                value={form.relationshipToChild}
                onChange={handleChange}
                error={errors.relationshipToChild}
              />
              <Field
                label="Parent Signature"
                name="parentSignature"
                placeholder="Full name as signature"
                value={form.parentSignature}
                onChange={handleChange}
                error={errors.parentSignature}
              />
              <Field
                label="Father's Phone Number"
                name="fatherPhone"
                required
                placeholder="e.g. 08012345678"
                value={form.fatherPhone}
                onChange={handleChange}
                error={errors.fatherPhone}
              />
              <Field
                label="Mother's Phone Number"
                name="motherPhone"
                placeholder="e.g. 08012345678"
                value={form.motherPhone}
                onChange={handleChange}
                error={errors.motherPhone}
              />
            </div>
            <div className="space-y-4 mt-4">
              <TextArea
                label="Office Address"
                name="officeAddress"
                value={form.officeAddress}
                onChange={handleChange}
                error={errors.officeAddress}
              />
              <TextArea
                label="Contact Address"
                name="contactAddress"
                value={form.contactAddress}
                onChange={handleChange}
                error={errors.contactAddress}
              />
              <TextArea
                label="Detailed Residential Address"
                name="residentialAddress"
                rows={3}
                required
                value={form.residentialAddress}
                onChange={handleChange}
                error={errors.residentialAddress}
              />
              <TextArea
                label="Medical History"
                name="medicalHistory"
                rows={3}
                value={form.medicalHistory}
                onChange={handleChange}
                error={errors.medicalHistory}
              />
              <TextArea
                label="Name & Address of Medical Practitioner"
                name="medicalPractitioner"
                value={form.medicalPractitioner}
                onChange={handleChange}
                error={errors.medicalPractitioner}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="bg-green-50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-800">
                Form Fee: ₦20000
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                ₦20000 payment required. Click submit to send your application.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto bg-green-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
          <p className="text-xs text-center text-gray-400">
            🔒 Secured by Paystack — cards, bank transfer & USSD
          </p>
        </div>
      </div>
    </div>
  );
}
