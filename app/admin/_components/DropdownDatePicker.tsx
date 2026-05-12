"use client";

import { useState, useEffect } from "react";

interface DropdownDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  name: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  minYear?: number;
  maxYear?: number;
  required?: boolean;
  className?: string;
}

export default function DropdownDatePicker({
  label,
  value,
  name,
  onChange,
  minYear = 2013,
  maxYear = new Date().getFullYear() + 5,
  required = false,
  className = ""
}: DropdownDatePickerProps) {
  const years: number[] = [];
  const startYear = Math.min(minYear, maxYear);
  const endYear = Math.max(minYear, maxYear);
  
  if (minYear > maxYear) {
    // Descending (birthdays)
    for (let y = minYear; y >= maxYear; y--) years.push(y);
  } else {
    // Ascending (events/deadlines)
    for (let y = minYear; y <= maxYear; y++) years.push(y);
  }
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Parse current value (YYYY-MM-DD)
  const [internalY, setInternalY] = useState("");
  const [internalM, setInternalM] = useState("");
  const [internalD, setInternalD] = useState("");

  // Sync internal state when value prop changes from outside (e.g. initial load or reset)
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setInternalY(y || "");
      setInternalM(String(Number(m)) || "");
      setInternalD(String(Number(d)) || "");
    } else {
      setInternalY("");
      setInternalM("");
      setInternalD("");
    }
  }, [value]);

  const handlePartChange = (part: 'y' | 'm' | 'd', val: string) => {
    let nY = internalY, nM = internalM, nD = internalD;
    if (part === 'y') { nY = val; setInternalY(val); }
    if (part === 'm') { nM = val; setInternalM(val); }
    if (part === 'd') { nD = val; setInternalD(val); }
    
    if (nY && nM && nD) {
      onChange({ target: { name, value: `${nY}-${nM.padStart(2, '0')}-${nD.padStart(2, '0')}` } });
    } else if (!nY && !nM && !nD) {
      onChange({ target: { name, value: "" } });
    }
    // Note: If incomplete, we don't call parent onChange yet, but our local state is updated
  };

  const labelCls = "block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1.5";
  const selectCls = "bg-white/[0.06] border border-white/[0.06] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all appearance-none cursor-pointer";

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className={labelCls}>
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-2">
        <div className="relative group">
          <select 
            value={internalY} 
            onChange={(e) => handlePartChange('y', e.target.value)}
            className={`${selectCls} w-full pr-8`}
          >
            <option value="" className="bg-[#1e293b]">Year</option>
            {years.map(yr => <option key={yr} value={String(yr)} className="bg-[#1e293b]">{yr}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/10 group-hover:text-white/30 transition-colors">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div className="relative group">
          <select 
            value={internalM} 
            onChange={(e) => handlePartChange('m', e.target.value)}
            className={`${selectCls} w-full pr-8`}
          >
            <option value="" className="bg-[#1e293b]">Month</option>
            {months.map((mon, i) => <option key={mon} value={String(i + 1)} className="bg-[#1e293b]">{mon}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/10 group-hover:text-white/30 transition-colors">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div className="relative group">
          <select 
            value={internalD} 
            onChange={(e) => handlePartChange('d', e.target.value)}
            className={`${selectCls} w-full pr-8`}
          >
            <option value="" className="bg-[#1e293b]">Day</option>
            {days.map(day => <option key={day} value={String(day)} className="bg-[#1e293b]">{day}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/10 group-hover:text-white/30 transition-colors">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
