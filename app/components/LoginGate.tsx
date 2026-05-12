"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, Lock, User, Key, AlertCircle, ChevronRight } from "lucide-react";

type State = "checking" | "locked" | "unlocked";

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("checking");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) setState("unlocked");
        else setState("locked");
      } catch {
        setState("locked");
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    if (state === "locked") inputRef.current?.focus();
  }, [state]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setState("unlocked");
      } else {
        setError(data.error || "Invalid username or password");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (state === "unlocked") return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060f2a] overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Premium Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000" />
      <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] rounded-full bg-amber-500/10 blur-[80px]" />

      <div className={`relative w-full max-w-md p-8 sm:p-12 transition-all duration-500 ${state === 'checking' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Decorative Ring */}
        <div className="absolute inset-0 rounded-[40px] border border-white/[0.05] bg-white/[0.02] backdrop-blur-3xl shadow-2xl shadow-black/50" />
        
        <div className="relative flex flex-col items-center text-center">
          {/* Logo/Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/20 rotate-3 transition-transform hover:rotate-0">
            <Lock className="text-white" size={32} />
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Portal</h2>
          <p className="text-white/40 text-sm mb-10 font-medium">Restricted access for school administrators</p>

          {state === 'checking' ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="animate-spin text-amber-500" size={32} />
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Authenticating Session...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className={`w-full space-y-4 ${shake ? "animate-shake" : ""}`}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="text-white/20 group-focus-within:text-amber-500/50 transition-colors" size={18} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Key className="text-white/20 group-focus-within:text-amber-500/50 transition-colors" size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-medium"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-[#060f2a] font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-12 flex items-center gap-3 text-white/10">
            <div className="h-px w-8 bg-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pathfinder College</span>
            <div className="h-px w-8 bg-current" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}
