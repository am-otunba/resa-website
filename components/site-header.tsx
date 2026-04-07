const navItems = [
  { label: "Home", href: "#" },
  { label: "Our Story", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Policies", href: "#" },
];

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <a
        href="#"
        aria-label="Home"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/90 bg-white/65 shadow-[0_12px_30px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[20px] transition duration-150 ease-out hover:-translate-y-px hover:bg-white/80 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.98)]"
      >
        <span
          aria-hidden="true"
          className="-translate-y-px text-[1.9rem] leading-none font-light text-[#111827]"
        >
          +
        </span>
      </a>

      <nav
        aria-label="Primary navigation"
        className="hidden items-center gap-1 rounded-full border border-white/85 bg-white/55 p-2 shadow-[0_12px_40px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[22px] md:flex"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="inline-flex items-center justify-center rounded-full px-[1.15rem] py-[0.72rem] text-[0.8rem] font-medium text-[#111827d1] transition duration-150 ease-out hover:-translate-y-px hover:bg-white/50 hover:text-[#111827]"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a
        href="tel:+2340000000000"
        aria-label="Call us"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/90 bg-white/65 shadow-[0_12px_30px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-[20px] transition duration-150 ease-out hover:-translate-y-px hover:bg-white/80 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.98)]"
      >
        <span
          aria-hidden="true"
          className="rotate-45 text-base leading-none text-[#111827]"
        >
          ↗
        </span>
      </a>
    </header>
  );
}