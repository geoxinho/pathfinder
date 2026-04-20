"use client";
import { useState } from "react";

/* ── Date helpers ── */
function dobDay(d)   { return d ? new Date(d).getDate()        : ""; }
function dobMonth(d) { return d ? new Date(d).getMonth() + 1   : ""; }
function dobYear(d)  { return d ? new Date(d).getFullYear()     : ""; }

/* ── Full-width labelled field row ── */
function FL({ n, label, value, note, long }) {
  return (
    <div className="pf-fl">
      {n     && <span className="pf-n">{n}.</span>}
      {label && (
        <span className="pf-fl-lbl">
          {label}
          {note && <em className="pf-note-sm"> {note}</em>}:
        </span>
      )}
      <span className={`pf-fl-val${long ? " long" : ""}`}>{value ?? ""}</span>
    </div>
  );
}

/* ════════════════════════════════════════════
   ADMIN CLIENT
════════════════════════════════════════════ */
export default function AdminClient({ junior: juniorInit, senior: seniorInit }) {
  const [tab,        setTab]        = useState("junior");
  const [selected,   setSelected]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [juniorList, setJuniorList] = useState(juniorInit);
  const [seniorList, setSeniorList] = useState(seniorInit);

  const list = tab === "junior" ? juniorList : seniorList;

  const switchTab = (t) => { setTab(t); setSelected(null); };

  /* ── Print ── */
  const handlePrint = () => window.print();

  /* ── Download PDF via jsPDF + html2canvas ── */
  const handleDownload = async () => {
    const el = document.getElementById("print-area");
    if (!el) return;
    setLoading(true);
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

      const imgData  = canvas.toDataURL("image/jpeg", 0.97);
      const pdf      = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pgW      = pdf.internal.pageSize.getWidth();
      const pgH      = pdf.internal.pageSize.getHeight();
      const ratio    = Math.min(pgW / canvas.width, pgH / canvas.height);
      const imgW     = canvas.width  * ratio;
      const imgH     = canvas.height * ratio;
      const offsetX  = (pgW - imgW) / 2;
      const offsetY  = (pgH - imgH) / 2;

      pdf.addImage(imgData, "JPEG", offsetX, offsetY, imgW, imgH);
      pdf.save(`${selected.surname}_${selected.otherNames}_Admission.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print(); // graceful fallback
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete application ── */
  const handleDelete = async () => {
    if (!selected) return;
    const confirmed = window.confirm(
      `Delete application for ${selected.surname} ${selected.otherNames}?\nThis action cannot be undone.`
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admissions/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected._id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      if (tab === "junior") setJuniorList((prev) => prev.filter((x) => x._id !== selected._id));
      else setSeniorList((prev) => prev.filter((x) => x._id !== selected._id));
      setSelected(null);
    } catch (err) {
      alert("Failed to delete application. Please try again.");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="ac-root">

      {/* ═══════════════════════════════════════════
          STYLES
      ═══════════════════════════════════════════ */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Shell ── */
        .ac-root {
          display: flex;
          height: 100vh; width: 100vw;
          overflow: hidden;
          background: #dde3ed;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        /* ══════════════════════════
           SIDEBAR
        ══════════════════════════ */
        .ac-sidebar {
          width: 255px; min-width: 255px;
          background: linear-gradient(170deg, #071d4a 0%, #0E539C 100%);
          display: flex; flex-direction: column;
          overflow: hidden;
          box-shadow: 3px 0 20px rgba(7,29,74,.35);
        }
        .ac-brand {
          display: flex; align-items: center; gap: 11px;
          padding: 18px 14px 14px;
          border-bottom: 1px solid rgba(255,255,255,.12);
          flex-shrink: 0;
        }
        .ac-brand img {
          width: 40px; height: 40px; object-fit: contain;
          border-radius: 8px; background: rgba(255,255,255,.12); padding: 3px;
        }
        .ac-brand-name { font-size: 13px; font-weight: 700; color: #fff; }
        .ac-brand-sub  { font-size: 10px; color: rgba(255,255,255,.48); margin-top: 1px; }

        /* Stats */
        .ac-stats { display: flex; gap: 6px; padding: 11px 12px; border-bottom: 1px solid rgba(255,255,255,.10); flex-shrink: 0; }
        .ac-stat  { flex: 1; background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.14); border-radius: 9px; padding: 7px 6px; text-align: center; }
        .ac-stat-num { font-size: 18px; font-weight: 700; color: #fff; line-height: 1; }
        .ac-stat-lbl { font-size: 8.5px; color: rgba(255,255,255,.50); margin-top: 2px; letter-spacing: .4px; }

        /* Tabs */
        .ac-tabs { display: flex; gap: 5px; padding: 10px 11px 7px; flex-shrink: 0; }
        .ac-tab {
          flex: 1; display: flex; align-items: center; justify-content: space-between;
          padding: 7px 10px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,.14); background: transparent;
          color: rgba(255,255,255,.58); font-size: 11px; font-weight: 500;
          cursor: pointer; transition: all .17s; font-family: inherit;
        }
        .ac-tab:hover { background: rgba(255,255,255,.09); color: #fff; }
        .ac-tab.on    { background: rgba(255,255,255,.18); border-color: rgba(255,255,255,.38); color: #fff; font-weight: 700; }
        .ac-badge { font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 20px; background: rgba(255,255,255,.18); color: #fff; }
        .ac-tab.on .ac-badge { background: #fff; color: #0E539C; }

        /* List */
        .ac-list { flex: 1; overflow-y: auto; padding: 5px 10px 14px; display: flex; flex-direction: column; gap: 4px; }
        .ac-list::-webkit-scrollbar { width: 3px; }
        .ac-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,.18); border-radius: 3px; }
        .ac-list-empty { font-size: 11px; color: rgba(255,255,255,.35); text-align: center; margin-top: 22px; }
        .ac-item {
          display: flex; flex-direction: column; gap: 2px;
          padding: 9px 11px; border-radius: 9px;
          border: 1px solid transparent; background: transparent;
          cursor: pointer; transition: all .16s;
          text-align: left; width: 100%; font-family: inherit;
        }
        .ac-item:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.15); }
        .ac-item.sel   { background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.36); }
        .ac-item-name  { font-size: 12px; font-weight: 600; color: #fff; }
        .ac-item-date  { font-size: 9.5px; color: rgba(255,255,255,.46); }
        .ac-item-ref   { font-size: 9px; color: rgba(255,255,255,.28); }

        /* ══════════════════════════
           MAIN
        ══════════════════════════ */
        .ac-main { flex: 1; overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; }
        .ac-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          color: #94a3b8; gap: 10px;
        }
        .ac-empty-icon { font-size: 48px; opacity: .4; }
        .ac-empty p    { font-size: 14px; }

        /* Card */
        .ac-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 24px rgba(0,0,0,.10);
          overflow: hidden;
          max-width: 780px;
          width: 100%; margin: 0 auto;
        }

        /* Toolbar */
        .ac-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 22px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(90deg, #f7f9fc, #eef3fa);
        }
        .ac-toolbar-left { display: flex; align-items: center; gap: 10px; }
        .ac-toolbar-left h2 { font-size: 14px; font-weight: 700; color: #1e293b; }
        .ac-type-badge {
          font-size: 10px; padding: 3px 10px; border-radius: 20px;
          background: #dbeafe; color: #0E539C; font-weight: 600;
        }
        .ac-actions { display: flex; gap: 8px; }

        /* Buttons */
        .ac-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border: none; border-radius: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all .18s;
          font-family: inherit; white-space: nowrap;
        }
        .ac-btn:hover   { transform: translateY(-1px); }
        .ac-btn:active  { transform: translateY(0); }
        .ac-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .ac-btn-print {
          background: linear-gradient(135deg, #0E539C, #1a70cc);
          color: #fff;
          box-shadow: 0 2px 8px rgba(14,83,156,.28);
        }
        .ac-btn-download {
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
          box-shadow: 0 2px 8px rgba(5,150,105,.28);
        }
        .ac-btn-delete {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: #fff;
          box-shadow: 0 2px 8px rgba(220,38,38,.28);
        }

        /* Form scroll wrapper */
        .ac-form-wrap {
          max-height: calc(100vh - 170px);
          overflow-y: auto;
          padding: 20px;
          background: #dde3ed;
        }
        .ac-form-wrap::-webkit-scrollbar { width: 5px; }
        .ac-form-wrap::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 5px; }

        /* A4 paper shadow on screen */
        .ac-a4-paper {
          background: #fff;
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          box-shadow: 0 4px 32px rgba(0,0,0,.18);
          padding: 28px 32px 48px;
        }

        /* ═══════════════════════════════════════════════
           PRINT FORM ELEMENTS  (shared: screen + @print)
        ═══════════════════════════════════════════════ */
        #print-area {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12px;
          color: #111;
          line-height: 1.6;
        }

        /* ── Header ── */
        .pf-header {
          display: flex; align-items: flex-start;
          gap: 14px;
          border-bottom: 3px double #1a3a6b;
          padding-bottom: 14px;
          margin-bottom: 8px;
        }
        .pf-logo { height: 72px; width: auto; object-fit: contain; flex-shrink: 0; }
        .pf-header-text { flex: 1; }
        .pf-school-name { font-size: 21px; font-weight: bold; color: #1a3a6b; letter-spacing: .6px; line-height: 1.2; }
        .pf-school-sub  { font-size: 10.5px; color: #1a3a6b; font-style: italic; margin-top: 3px; }
        .pf-school-addr { font-size: 9.5px; color: #444; margin-top: 4px; line-height: 1.4; }
        .pf-passport-box {
          width: 90px; height: 108px;
          border: 1.5px solid #888;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; color: #aaa; text-align: center;
          flex-shrink: 0; overflow: hidden;
        }
        .pf-passport-box img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── Form title ── */
        .pf-title {
          text-align: center;
          font-size: 16px; font-weight: bold;
          letter-spacing: 1.5px;
          margin: 12px 0 3px;
        }
        .pf-title-sub { font-size: 11px; font-weight: normal; letter-spacing: 2px; text-align: center; }
        .pf-ref {
          text-align: center;
          font-size: 9px; color: #555;
          border-bottom: 1.5px solid #ccc;
          padding-bottom: 6px; margin-bottom: 12px;
        }

        /* ── Section heading ── */
        .pf-section {
          font-weight: bold; font-size: 11px;
          text-transform: uppercase; letter-spacing: .5px;
          background: #eef3fc;
          border-left: 3px solid #1a3a6b;
          padding: 4px 8px;
          margin: 14px 0 8px;
        }
        .pf-subsec { font-weight: bold; font-size: 11px; margin: 12px 0 6px; }

        /* ── Inline row ── */
        .pf-row {
          display: flex; align-items: flex-end;
          flex-wrap: nowrap; margin-bottom: 10px; gap: 3px;
        }
        .pf-row-wrap { flex-wrap: wrap; }
        .pf-indent   { padding-left: 20px; }

        .pf-n   { min-width: 26px; font-size: 11px; flex-shrink: 0; font-weight: 600; }
        .pf-lbl { font-size: 11px; white-space: nowrap; }
        .pf-dot {
          flex: 1; min-width: 40px;
          border-bottom: 1.5px dashed #333;
          margin: 0 4px; padding: 2px 3px;
          font-size: 11px; font-weight: 700;
          min-height: 20px; vertical-align: bottom;
        }
        .pf-dot.long { min-width: 90px; }
        .pf-box {
          display: inline-block;
          width: 30px; height: 22px;
          border: 1.5px solid #444;
          font-size: 11px; margin: 0 3px;
          vertical-align: bottom; flex-shrink: 0;
          font-weight: 700;
          text-align: center;
          line-height: 22px;
        }

        /* ── Full-line field ── */
        .pf-fl {
          display: flex; align-items: flex-end;
          margin-bottom: 10px; gap: 5px;
        }
        .pf-fl-lbl  { font-size: 11px; white-space: nowrap; flex-shrink: 0; font-weight: 500; padding-bottom: 2px; }
        .pf-fl-val  {
          flex: 1; min-width: 0;
          border-bottom: 1.5px dashed #333;
          font-size: 11px; font-weight: 700;
          padding: 2px 4px; min-height: 20px;
        }
        .pf-fl-val.long { min-height: 30px; }
        .pf-note-sm { font-size: 8.5px; color: #888; font-style: normal; }

        /* ── Return note ── */
        .pf-return-note {
          margin-top: 14px;
          font-size: 9.5px;
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 8px 10px;
          background: #f9f9f9;
          line-height: 1.7;
        }

        /* ── Official footer ── */
        .pf-official {
          margin-top: 16px;
          background: #d8e9f8;
          border: 1.5px solid #8ab4d8;
          padding: 12px 14px;
        }
        .pf-official-title {
          text-align: center; font-weight: bold;
          font-size: 11px; letter-spacing: 1.5px;
          margin-bottom: 10px;
          text-decoration: underline;
        }
        .pf-official-row-top { display: flex; gap: 24px; margin-bottom: 8px; }
        .pf-official-field   { display: flex; align-items: flex-end; font-size: 10.5px; gap: 3px; }
        .pf-official-line    { display: inline-block; width: 120px; border-bottom: 1px dashed #444; }
        .pf-official-line.wide { width: 220px; }

        /* Score grid */
        .pf-scores { display: flex; gap: 6px; margin: 10px 0 6px; }
        .pf-score-box {
          flex: 1; border: 1.5px solid #6a8fae;
          background: #fff; text-align: center; font-size: 9.5px;
        }
        .pf-score-space { height: 44px; border-bottom: 1px solid #bcd; }
        .pf-score-lbl  { padding: 3px 2px; font-weight: bold; font-size: 9px; }

        /* Exam slip */
        .pf-slip {
          margin-top: 10px;
          border-top: 2px dashed #7a9cc0;
          padding-top: 8px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          grid-template-rows: auto auto;
          gap: 4px;
        }
        .pf-slip-dnd    { font-size: 8.5px; font-style: italic; color: #666; grid-column: 1; grid-row: 1; }
        .pf-slip-title  { font-weight: bold; font-size: 10px; letter-spacing: .5px; text-align: center; grid-column: 2; grid-row: 1; }
        .pf-slip-photo  { width: 56px; height: 68px; border: 1px solid #888; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #aaa; text-align: center; grid-column: 3; grid-row: 1 / 3; }
        .pf-slip-fields { grid-column: 1 / 3; grid-row: 2; font-size: 10px; display: flex; flex-direction: column; gap: 5px; }
        .pf-slip-ln     { display: inline-block; border-bottom: 1px dashed #555; vertical-align: bottom; }
        .pf-slip-ln.w150 { width: 150px; }
        .pf-slip-ln.w80  { width: 80px; }
        .pf-slip-row    { display: flex; gap: 8px; align-items: flex-end; }
        .pf-slip-note   { font-size: 8.5px; color: #666; font-style: italic; }

        /* ═══════════════════════════
           @media print
        ═══════════════════════════ */
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          body *              { visibility: hidden !important; }
          #print-area,
          #print-area *       { visibility: visible !important; }
          #print-area {
            position: fixed !important;
            top: 0; left: 0;
            width: 210mm !important;
            height: 297mm !important;
            padding: 10mm 13mm 18mm !important;
            font-size: 12px !important;
            background: #fff !important;
            overflow: hidden !important;
          }
          .no-print           { display: none !important; }
          .pf-section         { background: #eef3fc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .pf-official        { background: #d8e9f8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .pf-return-note     { background: #f9f9f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .pf-score-box       { background: #fff    !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .ac-a4-paper        { box-shadow: none !important; padding: 0 !important; max-width: 100% !important; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <aside className="ac-sidebar">
        <div className="ac-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Pathfinder College" />
          <div>
            <div className="ac-brand-name">Pathfinder College</div>
            <div className="ac-brand-sub">Admissions Panel</div>
          </div>
        </div>

        <div className="ac-stats">
          <div className="ac-stat"><div className="ac-stat-num">{juniorList.length}</div><div className="ac-stat-lbl">JUNIOR</div></div>
          <div className="ac-stat"><div className="ac-stat-num">{seniorList.length}</div><div className="ac-stat-lbl">SENIOR</div></div>
          <div className="ac-stat"><div className="ac-stat-num">{juniorList.length + seniorList.length}</div><div className="ac-stat-lbl">TOTAL</div></div>
        </div>

        <div className="ac-tabs">
          <button onClick={() => switchTab("junior")} className={`ac-tab${tab === "junior" ? " on" : ""}`}>
            <span>Junior</span><span className="ac-badge">{juniorList.length}</span>
          </button>
          <button onClick={() => switchTab("senior")} className={`ac-tab${tab === "senior" ? " on" : ""}`}>
            <span>Senior</span><span className="ac-badge">{seniorList.length}</span>
          </button>
        </div>

        <div className="ac-list">
          {list.length === 0
            ? <p className="ac-list-empty">No submissions yet.</p>
            : list.map((item) => (
              <button
                key={item._id}
                onClick={() => setSelected(item)}
                className={`ac-item${selected?._id === item._id ? " sel" : ""}`}
              >
                <span className="ac-item-name">{item.surname} {item.otherNames}</span>
                <span className="ac-item-date">
                  {new Date(item.submittedAt).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <span className="ac-item-ref">Ref: {item.paymentReference}</span>
              </button>
            ))
          }
        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN
      ══════════════════════════════ */}
      <div className="ac-main">
        {!selected
          ? (
            <div className="ac-empty">
              <div className="ac-empty-icon">📄</div>
              <p>Select an applicant to view &amp; print their form</p>
            </div>
          )
          : (
            <div className="ac-card">

              {/* Toolbar */}
              <div className="ac-toolbar no-print">
                <div className="ac-toolbar-left">
                  <h2>{selected.surname} {selected.otherNames}</h2>
                  <span className="ac-type-badge">
                    {selected._type === "juniorAdmission" ? "Junior" : "Senior"}
                  </span>
                </div>
                <div className="ac-actions">
                  <button onClick={handleDelete} disabled={deleting} className="ac-btn ac-btn-delete">
                    {deleting ? "⏳ Deleting…" : "🗑 Delete"}
                  </button>
                  <button onClick={handleDownload} disabled={loading} className="ac-btn ac-btn-download">
                    {loading ? "⏳ Generating…" : "⬇ Download PDF"}
                  </button>
                  <button onClick={handlePrint} className="ac-btn ac-btn-print">
                    🖨 Print A4
                  </button>
                </div>
              </div>

              {/* Scrollable A4 preview */}
              <div className="ac-form-wrap">
                <div className="ac-a4-paper">
                  <div id="print-area">

                    {/* ── SCHOOL HEADER ── */}
                    <div className="pf-header">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo.png" alt="Pathfinder College" className="pf-logo" />
                      <div className="pf-header-text">
                        <div className="pf-school-name">PATHFINDER COLLEGE</div>
                        {selected._type === "juniorAdmission" && <div className="pf-school-sub">CRECHE / NURSERY / PRIMARY SCHOOL</div>}
                        {selected._type === "seniorAdmission" && <div className="pf-school-sub">SECONDARY SCHOOL</div>}
                        <div className="pf-school-addr">
                          Opposite Jesus is King Ministries', Sango, U.I. Road, Samonda, Ibadan, Nigeria.
                        </div>
                      </div>
                      <div className="pf-passport-box">
                        {selected.passportPhoto
                          ? <img src={selected.passportPhoto} alt="Passport" />
                          : <span style={{ fontSize: "7.5px", color: "#aaa", textAlign: "center", padding: "4px" }}>Passport<br />Photo</span>}
                      </div>
                    </div>

                    {/* ── FORM TITLE ── */}
                    <div className="pf-title">
                      ADMISSION FORM
                      {selected._type === "seniorAdmission" && <div className="pf-title-sub">PCAF</div>}
                    </div>
                    <div className="pf-ref">
                      Payment Ref: <strong>{selected.paymentReference}</strong>
                      &nbsp;|&nbsp;
                      Submitted: <strong>
                        {new Date(selected.submittedAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
                      </strong>
                    </div>

                    {/* Exam date banner — junior only */}
                    {selected._type === "juniorAdmission" && selected.examDate && (
                      <div style={{
                        textAlign: "center",
                        margin: "6px 0 10px",
                        padding: "6px 10px",
                        border: "1.5px solid #1a3a6b",
                        background: "#eef3fc",
                        fontSize: "11px",
                        fontWeight: "bold",
                        letterSpacing: ".4px",
                      }}>
                        📅 COMMON ENTRANCE EXAMINATION DATE:&nbsp;
                        <span style={{ color: "#1a3a6b", fontSize: "12px" }}>{selected.examDate}</span>
                      </div>
                    )}

                    {/* ══════════════════════════════════
                        JUNIOR FORM
                    ══════════════════════════════════ */}
                    {selected._type === "juniorAdmission" && (
                      <>
                        <div className="pf-section">A. Child&apos;s Biodata</div>

                        <FL n="1" label="Surname"     value={selected.surname} />
                        <FL n="2" label="Other Names" value={selected.otherNames} />

                        <div className="pf-row">
                          <span className="pf-n">3a.</span><span className="pf-lbl">Date of Birth — Day</span>
                          <span className="pf-box">{dobDay(selected.dateOfBirth)}</span>
                          <span className="pf-lbl">Month</span>
                          <span className="pf-box">{dobMonth(selected.dateOfBirth)}</span>
                          <span className="pf-lbl">Year</span>
                          <span className="pf-box">{dobYear(selected.dateOfBirth)}</span>
                          <span className="pf-lbl" style={{ marginLeft: 12 }}>b. Sex (M/F)</span>
                          <span className="pf-box">{selected.sex}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">4a.</span><span className="pf-lbl">Nationality</span>
                          <span className="pf-dot">{selected.nationality}</span>
                          <span className="pf-lbl">b. State</span>
                          <span className="pf-dot">{selected.state}</span>
                          <span className="pf-lbl">c. Home Town</span>
                          <span className="pf-dot">{selected.homeTown}</span>
                          <span className="pf-lbl">d. LGA</span>
                          <span className="pf-dot">{selected.lga}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">5a.</span><span className="pf-lbl">Religion</span>
                          <span className="pf-dot">{selected.religion}</span>
                          <span className="pf-lbl">b. Position in family</span>
                          <span className="pf-dot">{selected.positionInFamily}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">6a.</span><span className="pf-lbl">Food allergy</span>
                          <span className="pf-dot">{selected.foodAllergy}</span>
                          <span className="pf-lbl">Drug allergy</span>
                          <span className="pf-dot">{selected.drugAllergy}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">7.</span>
                          <span className="pf-lbl">Exclusive Breastfeeding? Yes / No</span>
                          <span className="pf-box">{selected.exclusiveBreastfeeding}</span>
                          <span className="pf-lbl" style={{ marginLeft: 12 }}>No Water? Yes / No</span>
                          <span className="pf-box">{selected.noWater}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">8a.</span>
                          <span className="pf-lbl">Immunization completed? Yes / No</span>
                          <span className="pf-box">{selected.immunizationCompleted}</span>
                          <span className="pf-lbl" style={{ marginLeft: 12 }}>Any reaction? Yes / No</span>
                          <span className="pf-box">{selected.anyReaction}</span>
                        </div>
                        <div className="pf-row">
                          <span className="pf-n">b.</span>
                          <span className="pf-lbl">Evidence of immunization (to be attached to this form)</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">9.</span><span className="pf-lbl">Level of schooling:</span>
                          <span className="pf-lbl" style={{ marginLeft: 8 }}>Crèche</span>
                          <span className="pf-box">{selected.levelOfSchooling === "Creche"  ? "✓" : ""}</span>
                          <span className="pf-lbl">Nursery</span>
                          <span className="pf-box">{selected.levelOfSchooling === "Nursery" ? "✓" : ""}</span>
                          <span className="pf-lbl">Primary</span>
                          <span className="pf-box">{selected.levelOfSchooling === "Primary" ? "✓" : ""}</span>
                        </div>

                        <div className="pf-section">B. Parent / Guardian Biodata</div>

                        <FL n="1" label="Surname"     value={selected.parentSurname} />
                        <FL n="2" label="Other Names" value={selected.parentOtherNames} />

                        <div className="pf-subsec">3. Parents&apos; Signatures</div>
                        <div className="pf-row pf-indent">
                          <span className="pf-lbl" style={{ minWidth: 48 }}>Father:</span>
                          <span className="pf-dot long">{selected.fatherSignature}</span>
                          <span className="pf-lbl">Phone Number:</span>
                          <span className="pf-dot">{selected.fatherPhone}</span>
                        </div>
                        <div className="pf-row pf-indent">
                          <span className="pf-lbl" style={{ minWidth: 48 }}>Mother:</span>
                          <span className="pf-dot long">{selected.motherSignature}</span>
                          <span className="pf-lbl">Phone Number:</span>
                          <span className="pf-dot">{selected.motherPhone}</span>
                        </div>

                        <FL n="4"  label="Office Address"                           value={selected.officeAddress} />
                        <FL n="5"  label="Detailed Residential Address"             value={selected.residentialAddress} long />
                        <FL n="6"  label="Parents&apos; Occupation"                 value={selected.parentsOccupation} />
                        <FL n="7"  label="Contact person in case of emergency"     value={selected.contactPerson} />
                        <FL n="8a" label="Medical History (physical/mental defect)" value={selected.medicalHistory} long />
                        <FL n="b"  label="Child&apos;s Medical Practitioner"        value={selected.medicalPractitioner} long />


                      </>
                    )}

                    {/* ══════════════════════════════════
                        SENIOR FORM
                    ══════════════════════════════════ */}
                    {selected._type === "seniorAdmission" && (
                      <>
                        <FL n="1" label="Surname"     value={selected.surname}     note="(Block Letters)" />
                        <FL n="2" label="Other Names" value={selected.otherNames} />

                        <div className="pf-row">
                          <span className="pf-n">3.</span>
                          <span className="pf-lbl">(a) Date of Birth — Day</span>
                          <span className="pf-box">{dobDay(selected.dateOfBirth)}</span>
                          <span className="pf-lbl">Month</span>
                          <span className="pf-box">{dobMonth(selected.dateOfBirth)}</span>
                          <span className="pf-lbl">Year</span>
                          <span className="pf-box">{dobYear(selected.dateOfBirth)}</span>
                          <span className="pf-lbl" style={{ marginLeft: 12 }}>(b) Sex (M/F)</span>
                          <span className="pf-box">{selected.sex}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">4.</span>
                          <span className="pf-lbl">(a) Nationality</span><span className="pf-dot">{selected.nationality}</span>
                          <span className="pf-lbl">(b) State</span><span className="pf-dot">{selected.state}</span>
                          <span className="pf-lbl">(c) Home Town</span><span className="pf-dot">{selected.homeTown}</span>
                          <span className="pf-lbl">(d) LGA</span><span className="pf-dot">{selected.lga}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">5.</span>
                          <span className="pf-lbl">(a) Religion</span><span className="pf-dot">{selected.religion}</span>
                          <span className="pf-lbl">(b) Language spoken at home</span><span className="pf-dot">{selected.language}</span>
                        </div>

                        <div className="pf-row">
                          <span className="pf-n">6.</span>
                          <span className="pf-lbl">(a) School Last Attended</span>
                          <span className="pf-dot">{selected.schoolLastAttended}</span>
                        </div>
                        <div className="pf-row pf-indent">
                          <span className="pf-lbl">(b) Class/Level Completed</span>
                          <span className="pf-dot">{selected.classCompleted}</span>
                        </div>

                        <div className="pf-section">7. Information About Parent / Guardian</div>

                        <FL label="Surname of Parent / Guardian" value={selected.parentSurname} />
                        <div className="pf-row">
                          <span className="pf-lbl" style={{ minWidth: 90 }}>Other Names:</span>
                          <span className="pf-dot">{selected.parentOtherNames}</span>
                          <span className="pf-lbl">Relationship to Child:</span>
                          <span className="pf-dot">{selected.relationshipToChild}</span>
                        </div>
                        <FL label="Parent / Guardian Signature(s)" value="" />

                        <div className="pf-row">
                          <span className="pf-n">8.</span>
                          <span className="pf-lbl">Tel. (Father)</span><span className="pf-dot">{selected.fatherPhone}</span>
                          <span className="pf-lbl">Tel. (Mother)</span><span className="pf-dot">{selected.motherPhone}</span>
                        </div>

                        <FL label="Office Address"    value={selected.officeAddress} />
                        <FL label="Contact Address"   value={selected.contactAddress} />
                        <FL label="Residential Address (detailed)" value={selected.residentialAddress} long />
                        <FL label="9.  Head Teacher&apos;s Signature &amp; School Stamp" value="" long />

                        <div className="pf-row pf-row-wrap" style={{ marginTop: 4 }}>
                          <span className="pf-n">10.</span>
                          <span className="pf-lbl">(a) Medical History: Please give details of any physical/mental defect, illness, or other matter the school ought to know.</span>
                        </div>
                        <FL value={selected.medicalHistory} long />

                        <div className="pf-row pf-row-wrap pf-indent" style={{ marginTop: 4 }}>
                          <span className="pf-lbl">(b) Name &amp; Address of Child&apos;s Medical Practitioner who may be consulted when necessary.</span>
                        </div>
                        <FL value={selected.medicalPractitioner} long />


                      </>
                    )}

                    {/* ══════════════════════════════════
                        FOR OFFICIAL USE ONLY
                    ══════════════════════════════════ */}
                    <div className="pf-official">
                      <div className="pf-official-title">FOR OFFICIAL USE ONLY</div>

                      <div className="pf-official-row-top">
                        <div className="pf-official-field">
                          Admission No:&nbsp;<span className="pf-official-line"></span>
                        </div>
                        <div className="pf-official-field">
                          Date Admitted:&nbsp;<span className="pf-official-line"></span>
                        </div>
                      </div>

                      {selected._type === "seniorAdmission" && (
                        <>
                          <div className="pf-scores">
                            <div className="pf-score-box"><div className="pf-score-space"></div><div className="pf-score-lbl">1. USE OF ENGLISH</div></div>
                            <div className="pf-score-box"><div className="pf-score-space"></div><div className="pf-score-lbl">2. MATHEMATICS</div></div>
                            <div className="pf-score-box"><div className="pf-score-space"></div><div className="pf-score-lbl">3. TOTAL</div></div>
                            <div className="pf-score-box"><div className="pf-score-space"></div><div className="pf-score-lbl">4. REMARKS</div></div>
                          </div>

                          <div className="pf-slip">
                            <div className="pf-slip-dnd">DO NOT DETACH</div>
                            <div className="pf-slip-title">EXAMINATION SLIP — PCAF 001</div>
                            <div className="pf-slip-photo"><span>Passport<br />Photo</span></div>
                            <div className="pf-slip-fields">
                              <div>NAME:&nbsp;<span className="pf-slip-ln w150"></span></div>
                              <div>EXAMINATION DATE:&nbsp;<span className="pf-slip-ln w80"></span></div>
                              <div className="pf-slip-row">
                                <span>OFFICER&apos;S SIGNATURE:&nbsp;<span className="pf-slip-ln w80"></span></span>
                                <span>TIME:&nbsp;<span className="pf-slip-ln w80"></span></span>
                              </div>
                              <div className="pf-slip-note">
                                Candidates should bring this slip and writing materials to the Examination Hall.
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {selected._type === "juniorAdmission" && (
                        <div className="pf-official-row-top" style={{ marginTop: 8 }}>
                          <div className="pf-official-field" style={{ flex: 1 }}>
                            Authorising Officer&apos;s Signature:&nbsp;
                            <span className="pf-official-line wide"></span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>{/* end #print-area */}
                </div>{/* end .ac-a4-paper */}
              </div>{/* end .ac-form-wrap */}

            </div>/* end .ac-card */
          )
        }
      </div>{/* end .ac-main */}

    </div>/* end .ac-root */
  );
}