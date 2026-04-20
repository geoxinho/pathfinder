// app/admin/layout.tsx
// This layout hides the global Navbar, Footer, and WhatsApp float
// so the admin panel can take over the full viewport.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* Hide site chrome on all /admin routes */
        body > header          { display: none !important; }
        body > footer          { display: none !important; }
        body > main            { padding-top: 0 !important; }
        /* Hide WhatsApp float */
        body > a[href*="wa.me"],
        body > div:last-child a[href*="wa.me"] { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
