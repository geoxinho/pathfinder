// app/studio/layout.tsx
// Protects all /studio/* routes with PasscodeGate
// and hides the public navbar/footer so only the Studio UI shows.
import PasscodeGate from "../components/PasscodeGate";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PasscodeGate>
      <style>{`
        /* Hide public site chrome inside /studio */
        body > header,
        body > footer { display: none !important; }
        body > main   { padding-top: 0 !important; }
      `}</style>
      {children}
    </PasscodeGate>
  );
}
