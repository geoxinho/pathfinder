"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about#story" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Leadership", href: "/about#leadership" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Junior School", href: "/academics#junior" },
      { label: "Senior School", href: "/academics#senior" },
      { label: "Facilities", href: "/academics#facilities" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return (
    pathname === href ||
    pathname.startsWith(href + "/") ||
    pathname.startsWith(href + "#")
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
      setOpenMobileDropdown(null);
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown((prev) => (prev === label ? null : label));
  };

  // Smoothly scroll to a hash anchor; handle same-page vs cross-page navigation
  const handleHashNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return; // no hash — let the router handle it normally
    const basePath = href.slice(0, hashIndex);
    const hash = href.slice(hashIndex + 1);
    if (basePath === pathname || basePath === "") {
      // Already on the target page — just scroll
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
      setOpenDropdown(null);
      setOpenMobileDropdown(null);
    }
    // Different page — let Next.js navigate then the browser will jump to the hash
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4">
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/Blue_logo.png"
            alt="Pathfinder College"
            width={200}
            height={70}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname);
            return link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl font-poppins font-medium text-sm transition-colors ${
                    active
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-gray-700 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                  />
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
                {openDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-1 z-50">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                      <Link
                        href={link.href}
                        className="block px-4 py-2.5 text-sm text-primary font-poppins font-semibold hover:bg-primary/5 transition-colors border-b border-gray-100 mb-1"
                      >
                        Overview
                      </Link>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={(e) => handleHashNav(e, child.href)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 font-poppins transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl font-poppins font-medium text-sm transition-colors ${
                  active
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-gray-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+2348012345678"
            className="flex items-center gap-2 text-sm font-poppins font-medium text-gray-600 hover:text-primary transition-colors"
          >
            <Phone size={14} />
            Call Us
          </a>
          <Link href="/admissions" className="btn-primary text-sm px-5 py-2.5">
            Apply Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl text-primary hover:bg-primary/5 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="container-custom py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, pathname);
              const mobileOpen = openMobileDropdown === link.label;
              return (
                <div key={link.label}>
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      onClick={() => !link.children && setIsOpen(false)}
                      className={`flex-1 flex items-center px-4 py-3 rounded-xl font-poppins font-medium text-sm transition-colors ${
                        active
                          ? "text-primary bg-primary/10 font-semibold border-l-4 border-primary"
                          : "text-gray-700 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <button
                        onClick={() => toggleMobileDropdown(link.label)}
                        aria-label={`Toggle ${link.label} submenu`}
                        className={`p-2 mr-1 rounded-xl transition-colors ${
                          mobileOpen
                            ? "bg-primary/10 text-primary"
                            : "text-gray-500 hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile sub-menu — toggled */}
                  {link.children && mobileOpen && (
                    <div className="ml-4 mt-1 border-l-2 border-primary/20 pl-3 mb-2 flex flex-col gap-0.5">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-primary text-xs font-poppins font-semibold hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        Overview
                      </Link>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={(e) => handleHashNav(e, child.href)}
                          className="block px-3 py-2 text-gray-500 hover:text-primary text-xs font-poppins hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-3 border-t border-gray-100 mt-2">
              <Link
                href="/admissions"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center text-sm py-3"
              >
                Apply Now — 2025/2026
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
