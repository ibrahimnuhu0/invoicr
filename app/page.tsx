import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-[#FAFAF7] text-[#0B0D10] overflow-x-hidden">
      {/* ===== NAV ===== */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0B0D10] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M5 7h8M5 10h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Invoicr
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[#0B0D10] hover:opacity-60 transition-opacity px-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-[#0B0D10] text-white px-5 py-2.5 rounded-full hover:bg-[#FF5A1F] transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#0B0D10] text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Built for getting paid
          </div>
          <h1
            className="text-[3rem] sm:text-[3.75rem] leading-[1.02] font-bold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Send the invoice.
            <br />
            <span className="text-[#FF5A1F]">Skip the chase.</span>
          </h1>
          <p className="text-lg text-[#6B7280] max-w-md mb-9 leading-relaxed">
            Invoicr is where freelancers and small businesses turn finished work into paid invoices — branded, tracked, and built to get a "yes" on payment, fast.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="bg-[#0B0D10] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#FF5A1F] transition-colors"
            >
              Create your first invoice
            </Link>
            <Link
              href="/login"
              className="font-bold px-7 py-3.5 rounded-full border-2 border-[#0B0D10] hover:bg-[#0B0D10] hover:text-white transition-colors"
            >
              Sign in
            </Link>
          </div>
          <p className="text-sm text-[#6B7280] mt-5">No card required. Your first invoice takes under 2 minutes.</p>
        </div>

        {/* Signature element: a real-looking invoice card, tilted, stamped PAID */}
        <div className="relative flex justify-center md:justify-end">
          <div className="absolute -inset-10 bg-[#FFD23F] rounded-[2.5rem] -z-10 rotate-[-3deg] opacity-60 hidden sm:block" />
          <div className="relative bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(11,13,16,0.25)] border border-black/5 p-7 w-full max-w-[380px] rotate-[2deg]">
            <div className="absolute top-6 right-6 border-3 border-[#FF5A1F] text-[#FF5A1F] font-bold text-xs px-3 py-1 rounded rotate-[-12deg] tracking-widest" style={{ borderWidth: "2.5px" }}>
              PAID
            </div>

            <div className="flex justify-between items-start mb-7">
              <div>
                <p className="font-bold text-base">Adamu Jibril</p>
                <p className="text-xs text-[#6B7280]">adamujibril@gmail.com</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">INV-0042</p>
                <p className="text-xs text-[#6B7280]">Due Jun 28</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Brand identity package</span>
                <span className="font-medium tabular-nums">₦450,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Social templates × 6</span>
                <span className="font-medium tabular-nums">₦120,000</span>
              </div>
            </div>

            <div className="border-t border-dashed border-black/15 pt-4 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Total</span>
              <span className="text-2xl font-bold tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                ₦570,000
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGO/TRUST STRIP — invoice line-item style ===== */}
      <section className="border-y border-black/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-6 text-sm text-[#6B7280]">
          <span className="font-medium text-[#0B0D10]">Trusted by people who hate chasing payments:</span>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-medium">
            <span>Freelance designers</span>
            <span>Dev studios</span>
            <span>Consultants</span>
            <span>Agencies</span>
            <span>Tutors</span>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — real 3-step sequence, numbering earned ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] mb-3">How it works</p>
          <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Three steps between you and your money.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              title: "Build the invoice",
              body: "Add your client, list what you did, set your tax rate. Invoicr totals it up as you type.",
            },
            {
              n: "02",
              title: "Send the link",
              body: "Your client gets a clean, branded invoice page — no login, no app, no friction. Just a link.",
            },
            {
              n: "03",
              title: "Watch it get paid",
              body: "They pay right from the page. Your dashboard updates the second it lands — no more 'did they pay yet?'",
            },
          ].map((step) => (
            <div key={step.n} className="bg-white border border-black/10 rounded-2xl p-7">
              <p
                className="text-5xl font-bold text-[#FFD23F] mb-5 leading-none"
                style={{ fontFamily: "var(--font-display)", WebkitTextStroke: "1.5px #0B0D10" }}
              >
                {step.n}
              </p>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURE GRID — line-item styled ===== */}
      <section className="bg-[#0B0D10] text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FFD23F] mb-3">What's on the invoice</p>
            <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Everything a freelancer or small business actually needs.
            </h2>
          </div>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {[
              { label: "Branded invoices", desc: "Your name or business name, your logo, your tone." },
              { label: "Client records", desc: "Every client and every invoice you've sent them, in one place." },
              { label: "Real-time status", desc: "Draft, sent, viewed, paid, overdue — always know where you stand." },
              { label: "Built-in payments", desc: "Clients pay directly on the invoice page. No separate links." },
              { label: "PDF on demand", desc: "Download any invoice as a clean, print-ready PDF, anytime." },
            ].map((f, i) => (
              <div key={f.label} className="flex items-center justify-between py-6 group">
                <div className="flex items-center gap-6">
                  <span className="text-[#6B7280] text-sm tabular-nums w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-bold text-lg">{f.label}</span>
                </div>
                <span className="text-[#6B7280] text-sm text-right max-w-xs hidden sm:block">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA — receipt strip ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-[#FF5A1F] rounded-3xl px-8 sm:px-14 py-16 text-center relative overflow-hidden">
          <h2
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your next invoice is two minutes away.
          </h2>
          <p className="text-white/85 max-w-md mx-auto mb-9">
            Free to start. No card, no setup calls, no spreadsheet. Just you, your client, and a total that's correct.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-[#0B0D10] font-bold px-8 py-4 rounded-full hover:bg-[#0B0D10] hover:text-white transition-colors"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* ===== FOOTER — receipt-style ===== */}
      <footer className="border-t border-black/10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0B0D10] rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5" />
                <path d="M5 7h8M5 10h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-sm">Invoicr</span>
          </div>
          <p className="text-sm text-[#6B7280]">© {new Date().getFullYear()} Invoicr. Get paid, not chased.</p>
          <div className="flex gap-5 text-sm font-medium">
            <Link href="/login" className="hover:text-[#FF5A1F] transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-[#FF5A1F] transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}