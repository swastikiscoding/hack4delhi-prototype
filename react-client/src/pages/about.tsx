import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Link } from "react-router-dom";
import {
  Shield2,
  UserMultiple4,
  Link2AngularRight,
  CheckCircle1,
  Key1,
  FileMultiple,
  TrendUp1,
  Gear1,
} from "lineicons-react";

import DefaultLayout from "@/layouts/default";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Team ECTA",
      role: "Hack4Delhi 2026",
      description: "Building the future of democratic infrastructure",
    },
  ];

  const milestones = [
    {
      title: "Problem Identified",
      description:
        "Recognized the challenges in inter-state voter migration and electoral roll management",
      icon: <TrendUp1 className="w-5 h-5" />,
    },
    {
      title: "Smart Contract Development",
      description:
        "Developed and deployed UnifiedElectoralRoll.sol on Sepolia testnet",
      icon: <FileMultiple className="w-5 h-5" />,
    },
    {
      title: "Multi-tier Authority System",
      description:
        "Implemented hierarchical role-based access: ECI → State EC → ERO → BLO",
      icon: <UserMultiple4 className="w-5 h-5" />,
    },
    {
      title: "Citizen Portal Launch",
      description:
        "Created user-friendly interface for voters to track migration status",
      icon: <CheckCircle1 className="w-5 h-5" />,
    },
  ];

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-orange-500/15 via-orange-400/5 to-transparent rounded-full blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-gradient-to-tl from-green-500/15 via-green-400/5 to-transparent rounded-full blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center px-4">
          <Chip
            classNames={{
              base: "bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 backdrop-blur-sm mb-6",
              content: "text-blue-600 dark:text-blue-400 font-semibold text-xs",
            }}
            startContent={<Shield2 className="w-3.5 h-3.5" />}
            variant="flat"
          >
            About ECTA
          </Chip>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Transforming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-green-500">
              Electoral Infrastructure
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-default-500 leading-relaxed max-w-2xl mx-auto">
            ECTA (Electoral Coordination and Transfer Automation) is a
            blockchain-based solution designed to modernize India's electoral
            roll management system, making voter migration seamless,
            transparent, and tamper-proof.
          </p>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 border-y border-default-200/50 bg-default-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* The Problem */}
            <Card className="bg-background border border-default-200 shadow-sm">
              <CardBody className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center text-danger mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">The Problem</h3>
                <ul className="space-y-3 text-default-600">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 flex-shrink-0" />
                    <span>Manual voter migration process takes 3-6 months</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 flex-shrink-0" />
                    <span>Duplicate entries across state electoral rolls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 flex-shrink-0" />
                    <span>Lack of transparency in the migration status</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 flex-shrink-0" />
                    <span>Paperwork-heavy process prone to errors</span>
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Our Solution */}
            <Card className="bg-background border border-default-200 shadow-sm">
              <CardBody className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success mb-6">
                  <CheckCircle1 className="w-6 h-6 text-success [&_path]:fill-current" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                <ul className="space-y-3 text-default-600">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                    <span>Blockchain-based unified electoral roll</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                    <span>Real-time migration tracking for citizens</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                    <span>Automated verification through smart contracts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                    <span>Immutable audit trail for every transaction</span>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How ECTA Works
            </h2>
            <p className="text-default-500 text-lg max-w-2xl mx-auto">
              A hierarchical system that mirrors India&apos;s electoral
              structure while leveraging blockchain for transparency
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                level: "1",
                title: "ECI",
                subtitle: "Election Commission of India",
                description: "Root authority that grants State EC permissions",
                color: "blue",
                icon: (
                  <Shield2 className="w-6 h-6 text-blue-600 [&_path]:fill-current" />
                ),
              },
              {
                level: "2",
                title: "State EC",
                subtitle: "State Election Commission",
                description: "Manages EROs and BLOs within their state",
                color: "orange",
                icon: (
                  <UserMultiple4 className="w-6 h-6 text-orange-600 [&_path]:fill-current" />
                ),
              },
              {
                level: "3",
                title: "ERO",
                subtitle: "Electoral Registration Officer",
                description: "Approves or rejects migration requests",
                color: "green",
                icon: (
                  <FileMultiple className="w-6 h-6 text-green-600 [&_path]:fill-current" />
                ),
              },
              {
                level: "4",
                title: "BLO",
                subtitle: "Booth Level Officer",
                description: "Verifies citizen documents on ground",
                color: "purple",
                icon: (
                  <CheckCircle1 className="w-6 h-6 text-purple-600 [&_path]:fill-current" />
                ),
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="bg-background border border-default-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <CardBody className="p-6 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center
                      ${item.color === "blue" ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" : ""}
                      ${item.color === "orange" ? "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400" : ""}
                      ${item.color === "green" ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" : ""}
                      ${item.color === "purple" ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400" : ""}
                    `}
                  >
                    {item.icon}
                  </div>
                  <div
                    className={`text-xs font-bold mb-2 
                      ${item.color === "blue" ? "text-blue-600 dark:text-blue-400" : ""}
                      ${item.color === "orange" ? "text-orange-600 dark:text-orange-400" : ""}
                      ${item.color === "green" ? "text-green-600 dark:text-green-400" : ""}
                      ${item.color === "purple" ? "text-purple-600 dark:text-purple-400" : ""}
                    `}
                  >
                    LEVEL {item.level}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-default-400 mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-default-500">{item.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Connection arrows */}
          <div className="hidden md:flex justify-center items-center gap-4 mt-8">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 h-0.5 bg-gradient-to-r from-default-200 to-default-300" />
                <Link2AngularRight className="w-4 h-4 text-default-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 border-y border-default-200/50 bg-default-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built With Modern Tech
            </h2>
            <p className="text-default-500 text-lg">
              Enterprise-grade technology stack for reliability and scale
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Solidity",
                desc: "Smart Contracts",
                icon: (
                  <Gear1 className="w-6 h-6 text-yellow-600 [&_path]:fill-current" />
                ),
              },
              {
                name: "Ethereum",
                desc: "Sepolia Testnet",
                icon: (
                  <Link2AngularRight className="w-6 h-6 text-purple-600 [&_path]:fill-current" />
                ),
              },
              {
                name: "React",
                desc: "Frontend UI",
                icon: (
                  <FileMultiple className="w-6 h-6 text-green-600 [&_path]:fill-current" />
                ),
              },
              {
                name: "Node.js",
                desc: "Backend API",
                icon: (
                  <Key1 className="w-6 h-6 text-blue-600 [&_path]:fill-current" />
                ),
              },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-6 bg-background rounded-2xl border border-default-200 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {tech.icon}
                </div>
                <h4 className="font-bold text-foreground">{tech.name}</h4>
                <p className="text-sm text-default-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Development Journey
            </h2>
            <p className="text-default-500 text-lg">
              Key milestones in building ECTA
            </p>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {milestone.icon}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-default-200 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h4 className="font-bold text-lg text-foreground">
                    {milestone.title}
                  </h4>
                  <p className="text-default-500">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-default-50/50 to-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-default-500 text-lg mb-8 max-w-2xl mx-auto">
            Join us in building a more transparent and efficient electoral
            system for India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              as={Link}
              className="font-bold px-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
              radius="full"
              size="lg"
              to="/login"
            >
              Access Voter Portal
            </Button>
            <Button
              as="a"
              className="font-semibold"
              href="https://github.com"
              radius="full"
              size="lg"
              target="_blank"
              variant="bordered"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
