import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card } from "@heroui/card";
import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
import { useVoterStore } from "@/store/voterStore";

export default function LoginPage() {
  const [epicId, setEpicId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, error } = useVoterStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(epicId, password);
      navigate("/citizen");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <Card className="w-full max-w-5xl h-[600px] shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Side: Branding / Illustration */}
            <div className="w-full md:w-1/2 bg-primary/10 relative flex flex-col items-center justify-center p-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 mix-blend-overlay" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-primary/30">
                  <svg
                    className="w-10 h-10 text-white"
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
                <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                <p className="text-default-500 text-lg max-w-xs mx-auto">
                  Secure access to ECTA.
                </p>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/2 bg-background p-8 md:p-12 flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-2">Citizen Login</h1>
                  <p className="text-default-500 text-sm">
                    Enter your EPIC ID and password to access your dashboard.
                  </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                  <Input
                    isRequired
                    label="EPIC Number"
                    placeholder="Enter your EPIC ID (e.g. ABC1234567)"
                    type="text"
                    value={epicId}
                    variant="bordered"
                    onChange={(e) => setEpicId(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      variant="bordered"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Link className="text-xs text-default-500 hover:text-primary cursor-pointer">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    className="w-full font-semibold shadow-lg shadow-primary/20"
                    color="primary"
                    isLoading={isLoading}
                    size="lg"
                    type="submit"
                  >
                    Login
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-xs text-default-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      className="text-xs font-semibold cursor-pointer"
                      href="#"
                    >
                      Register as New Voter
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
