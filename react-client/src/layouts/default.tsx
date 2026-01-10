import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-4">
        {children}
      </main>
      <footer className="w-full py-12 border-t border-default-200 bg-default-50 mt-12">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-lg text-foreground">ECTA</p>
            <p className="text-sm text-default-500">
              Inspired by the Election Commission of India
            </p>
          </div>

          <div className="flex gap-6">
            <Link
              className="text-default-500 hover:text-primary text-sm"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-default-500 hover:text-primary text-sm"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-default-500 hover:text-primary text-sm"
              href="#"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="container mx-auto max-w-7xl px-6 mt-8 text-center">
          <p className="text-xs text-default-400 opacity-70">
            Disclaimer: This is a UI prototype / research project. Not an
            official government website.
          </p>
        </div>
      </footer>
    </div>
  );
}
