"use client";
import { useState, useEffect, useRef } from "react";

const PASSCODE    = process.env.NEXT_PUBLIC_ADMIN_PASSCODE ?? "admin123";
const SESSION_KEY = "pf_admin_unlocked";

type State = "checking" | "locked" | "unlocked";

export default function PasscodeGate({ children }: { children: React.ReactNode }) {
  // Start in "checking" — same on server & client, no hydration mismatch
  const [state,  setState] = useState<State>("checking");
  const [input,  setInput] = useState("");
  const [error,  setError] = useState(false);
  const [shake,  setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // After mount: check sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setState("unlocked");
    } else {
      setState("locked");
    }
  }, []);

  // Focus input when gate becomes interactive
  useEffect(() => {
    if (state === "locked") inputRef.current?.focus();
  }, [state]);

  const attempt = () => {
    if (input === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setState("unlocked");
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 600);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") attempt();
  };

  // Only show children when fully unlocked
  if (state === "unlocked") return <>{children}</>;

  // "checking" and "locked" both render the gate overlay
  // position:fixed + z-index:9999 covers navbar, footer — everything
  const isChecking = state === "checking";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden !important; }

        /* Full-screen fixed overlay — sits above navbar/footer */
        .pg-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #060f2a 0%, #0b2057 50%, #071d4a 100%);
          font-family: 'Inter', 'Segoe UI', sans-serif;
          overflow: hidden;
        }

        /* Animated background orbs */
        .pg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: pgFloat 8s ease-in-out infinite;
          pointer-events: none;
        }
        .pg-orb-1 {
          width: 420px; height: 420px;
          background: #0E539C;
          top: -120px; left: -80px;
          animation-delay: 0s;
        }
        .pg-orb-2 {
          width: 320px; height: 320px;
          background: #1a70cc;
          bottom: -100px; right: -60px;
          animation-delay: -3s;
        }
        .pg-orb-3 {
          width: 200px; height: 200px;
          background: #3b82f6;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -5s;
        }
        @keyframes pgFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-24px) scale(1.06); }
        }

        /* Card */
        .pg-card {
          position: relative; z-index: 10;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 24px;
          padding: 48px 44px 44px;
          width: 100%; max-width: 420px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.55),
                      0 0 0 1px rgba(255,255,255,0.06) inset;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
        }
        @media (max-width: 480px) {
          .pg-card { padding: 36px 22px 32px; margin: 16px; }
        }

        /* Lock icon */
        .pg-icon-wrap {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0E539C, #1a70cc);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 22px;
          box-shadow: 0 8px 32px rgba(14,83,156,0.55);
        }
        .pg-icon { font-size: 30px; line-height: 1; }

        /* Spinner (checking phase) */
        .pg-spinner {
          width: 32px; height: 32px;
          border: 3px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: pgSpin .7s linear infinite;
        }
        @keyframes pgSpin { to { transform: rotate(360deg); } }

        /* Text */
        .pg-title {
          font-size: 22px; font-weight: 800;
          color: #fff; letter-spacing: -0.3px;
          margin-bottom: 6px;
        }
        .pg-sub {
          font-size: 13px; color: rgba(255,255,255,0.48);
          line-height: 1.5; margin-bottom: 32px;
        }
        .pg-sub strong { color: rgba(255,255,255,0.72); font-weight: 600; }

        /* Input group */
        .pg-input-wrap {
          width: 100%; position: relative; margin-bottom: 14px;
        }
        .pg-input {
          width: 100%;
          padding: 14px 18px 14px 48px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          color: #fff;
          font-size: 16px;
          font-family: inherit;
          letter-spacing: 4px;
          outline: none;
          transition: border-color .2s, background .2s;
          -webkit-text-security: disc;
        }
        .pg-input::placeholder {
          letter-spacing: 1px; color: rgba(255,255,255,0.28); font-size: 13px;
        }
        .pg-input:focus {
          border-color: rgba(14,83,156,0.8);
          background: rgba(255,255,255,0.10);
          box-shadow: 0 0 0 3px rgba(14,83,156,0.22);
        }
        .pg-input.error {
          border-color: rgba(239,68,68,0.7);
          background: rgba(239,68,68,0.07);
        }
        .pg-input-icon {
          position: absolute; left: 15px; top: 50%;
          transform: translateY(-50%);
          font-size: 18px; pointer-events: none; opacity: 0.45;
        }

        /* Error message */
        .pg-error {
          font-size: 11.5px; color: #f87171;
          margin-bottom: 16px; margin-top: -4px;
          display: flex; align-items: center; gap: 5px;
          align-self: flex-start;
        }

        @keyframes pgShake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
        .pg-shake { animation: pgShake .5s ease; }

        /* Button */
        .pg-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #0E539C, #1a70cc);
          border: none; border-radius: 12px;
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          transition: all .2s;
          box-shadow: 0 4px 18px rgba(14,83,156,0.45);
          letter-spacing: .3px;
        }
        .pg-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(14,83,156,0.55); }
        .pg-btn:active { transform: translateY(0); }

        /* Footer line */
        .pg-footer {
          margin-top: 28px;
          font-size: 11px; color: rgba(255,255,255,0.22);
          display: flex; align-items: center; gap: 6px;
        }
      `}</style>

      <div className="pg-root">
        <div className="pg-orb pg-orb-1" />
        <div className="pg-orb pg-orb-2" />
        <div className="pg-orb pg-orb-3" />

        <div className="pg-card">
          <div className="pg-icon-wrap">
            {isChecking
              ? <div className="pg-spinner" />
              : <span className="pg-icon">🔐</span>
            }
          </div>

          <div className="pg-title">
            {isChecking ? "Loading…" : "Restricted Access"}
          </div>
          <div className="pg-sub">
            {isChecking
              ? "Please wait."
              : <>This section is for <strong>authorised staff</strong> only.<br />Enter your passcode to continue.</>
            }
          </div>

          {!isChecking && (
            <>
              <div className={`pg-input-wrap${shake ? " pg-shake" : ""}`}>
                <span className="pg-input-icon">🔑</span>
                <input
                  ref={inputRef}
                  type="password"
                  className={`pg-input${error ? " error" : ""}`}
                  placeholder="Enter passcode"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(false); }}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                  spellCheck={false}
                />
              </div>

              {error && (
                <div className="pg-error">
                  <span>⚠️</span> Incorrect passcode. Please try again.
                </div>
              )}

              <button className="pg-btn" onClick={attempt}>
                Unlock →
              </button>
            </>
          )}

          <div className="pg-footer">
            <span>🏫</span>
            <span>Pathfinder College Admin Portal</span>
          </div>
        </div>
      </div>
    </>
  );
}
