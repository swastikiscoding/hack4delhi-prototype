import { Button } from "@heroui/button";
import { Card, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "react-router-dom";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between gap-12 min-h-[calc(100vh-5rem)] py-0 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

        <div className="flex flex-col gap-8 max-w-2xl z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-default-200 bg-default-50 w-fit">
            <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
            <span className="text-xs font-medium text-default-500">
              Live & Synchronized across 28 States
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Democracy, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Digitized.
            </span>
          </h1>

          <p className="text-xl text-default-600 leading-relaxed max-w-lg">
            The Unified Electoral Roll System ensures every vote counts,
            everywhere. Secure, transparent, and accessible for a mobile nation.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              as={Link}
              className="font-semibold px-8 shadow-xl shadow-primary/20"
              color="primary"
              radius="full"
              size="lg"
              to="/login"
            >
              Access Voter Portal
            </Button>
            <Button
              className="font-medium border-default-200"
              radius="full"
              size="lg"
              variant="bordered"
            >
              Learn How It Works
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-default-200 overflow-hidden"
                >
                  <img
                    alt="User"
                    className="w-full h-full object-cover"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Trusted by 950M+</span>
              <span className="text-xs text-default-500">
                Registered Citizens
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center relative z-10">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-default-100 bg-default-50">
            <Image
              alt="Indian Parliament House"
              className="w-full h-auto object-cover scale-105 hover:scale-110 transition-transform duration-700"
              height={400}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Glimpse_of_the_new_Parliament_Building%2C_in_New_Delhi.jpg/500px-Glimpse_of_the_new_Parliament_Building%2C_in_New_Delhi.jpg"
              width={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 text-white pointer-events-none">
              <p className="font-bold text-lg">Sansad Bhavan</p>
              <p className="text-sm opacity-80">Symbol of Indian Democracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-default-200/50 bg-default-50/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Registered Voters", value: "950M+" },
            { label: "Polling Stations", value: "1M+" },
            { label: "States & UTs", value: "36" },
            { label: "Electoral Roll", value: "Unified" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-default-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-32 px-6 bg-default-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="text-primary">Intelligent</span> <br />
                Electoral Infrastructure
              </h2>
              <p className="text-xl text-default-500 leading-relaxed">
                Reimagining the democratic process with blockchain-backed
                security and seamless accessibility.
              </p>
            </div>
            <Button
              className="font-semibold"
              color="primary"
              endContent={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              }
              radius="full"
              size="lg"
              variant="flat"
            >
              Explore Features
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
            {/* Card 1: Unified Roll (Large - 8 cols) */}
            <Card className="md:col-span-8 bg-background border border-default-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-visible">
              <CardHeader className="flex flex-col items-start p-8 z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-3">
                  One Nation, One Roll
                </h3>
                <p className="text-default-500 text-lg max-w-md">
                  A unified, real-time voter registry that eliminates
                  duplication and ensures every citizen is counted, regardless
                  of state boundaries.
                </p>
              </CardHeader>
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
              <Image
                alt="India Map Abstract"
                className="absolute right-[-50px] top-[50%] translate-y-[-50%] w-[400px] opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
              />
            </Card>

            {/* Card 2: Secure Migration (Small - 4 cols) */}
            <Card className="md:col-span-4 bg-background border border-default-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-col items-start justify-center h-full p-8 gap-6">
                <div className="w-full flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:rotate-12 transition-transform duration-300">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="px-3 py-1 rounded-full border border-default-200 text-xs font-medium text-default-500">
                    Instant
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Smart Migration</h3>
                  <p className="text-default-500">
                    Relocating? Your vote moves with you instantly. No
                    paperwork, no delays.
                  </p>
                </div>
              </CardHeader>
            </Card>

            {/* Card 3: Audit (Small - 4 cols) */}
            <Card className="md:col-span-4 bg-background border border-default-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-col items-start justify-center h-full p-8 gap-6">
                <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Immutable Audit</h3>
                  <p className="text-default-500">
                    Every change is recorded on a secure ledger. 100%
                    transparent and verifiable.
                  </p>
                </div>
              </CardHeader>
            </Card>

            {/* Card 4: Sync (Large - 8 cols) */}
            <Card className="md:col-span-8 bg-gradient-to-r from-blue-900 to-slate-900 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              <CardHeader className="flex flex-row items-center justify-between h-full p-8 z-10 relative">
                <div className="max-w-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-blue-200">
                      Live Synchronization
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    Federal-State Harmony
                  </h3>
                  <p className="text-blue-100/80 text-lg">
                    Seamless data exchange between the Election Commission of
                    India and State Commissions, paving the way for One Nation,
                    One Election.
                  </p>
                </div>
                <div className="hidden md:flex w-32 h-32 rounded-full border-4 border-white/10 items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg
                    className="w-12 h-12 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
          {/* Feature 1: Inclusive Democracy */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  alt="Indian woman showing inked finger"
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=800&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="font-bold text-2xl mb-2">Every Vote Counts</p>
                  <p className="text-white/80 text-sm max-w-xs">
                    Empowering the largest democracy in the world with
                    accessible technology.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Inclusivity First
                </span>
              </div>

              <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                Democracy that <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                  Reaches Everyone
                </span>
              </h3>

              <p className="text-xl text-default-500 leading-relaxed">
                Our system ensures that no eligible voter is left behind.
                Whether you are a migrant worker, a senior citizen, or living in
                a remote area, your right to vote is secured.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {[
                  {
                    title: "Remote Registration",
                    desc: "Register from anywhere",
                  },
                  { title: "Multi-language", desc: "12+ Regional languages" },
                  { title: "Easy Verification", desc: "AI-powered KYC" },
                  { title: "Accessibility", desc: "Screen reader friendly" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-default-50 border border-default-100 hover:border-orange-500/30 transition-colors"
                  >
                    <div className="mt-1 p-2 rounded-lg bg-orange-500/10 text-orange-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm text-default-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2: Efficient Administration */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  alt="Digital Dashboard"
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent mix-blend-multiply" />

                {/* Floating UI Element Mockup */}
                <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl max-w-xs shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">System Status</p>
                      <p className="text-green-400 text-xs">
                        All Systems Operational
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-green-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Uptime</span>
                      <span>99.99%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Next-Gen Admin
                </span>
              </div>

              <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                Streamlined <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Election Management
                </span>
              </h3>

              <p className="text-xl text-default-500 leading-relaxed">
                Empowering Election Registration Officers with AI-driven tools
                for deduplication, real-time analytics, and seamless roll
                updates. Reduce workload and eliminate errors.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-default-50 border-l-4 border-blue-500">
                  <div>
                    <h4 className="font-bold text-lg">
                      Automated Deduplication
                    </h4>
                    <p className="text-default-500">
                      AI detects and merges duplicate entries instantly.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-default-50 border-l-4 border-cyan-500">
                  <div>
                    <h4 className="font-bold text-lg">Real-time Analytics</h4>
                    <p className="text-default-500">
                      Live dashboards for voter turnout and demographics.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-fit font-semibold mt-4"
                color="primary"
                endContent={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                }
                size="lg"
              >
                View Admin Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-24 relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 to-black text-white text-center mb-12 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Commitment to Integrity
          </h3>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            The Unified Electoral Roll System is built on the principles of
            transparency, privacy, and constitutional alignment. We ensure that
            no personal data is exposed while maintaining a verifiable audit
            trail.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/10 transition-colors">
                <svg
                  className="w-7 h-7 text-zinc-300 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                256-bit Encryption
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/10 transition-colors">
                <svg
                  className="w-7 h-7 text-zinc-300 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                ISO 27001 Certified
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/10 transition-colors">
                <svg
                  className="w-7 h-7 text-zinc-300 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                Zero-Knowledge Proofs
              </span>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
