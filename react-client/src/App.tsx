import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import LoginPage from "@/pages/login";
import CitizenDashboard from "@/pages/citizen/index";
import CitizenProfile from "@/pages/citizen/profile";
import CitizenApplications from "@/pages/citizen/applications";
import CitizenGrievances from "@/pages/citizen/grievances";
import BloDashboard from "@/pages/blo/index";
import EroDashboard from "@/pages/ero/index";
import StateEcDashboard from "@/pages/state-ec/index";
import EciDashboard from "@/pages/eci/index";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />

      {/* Citizen Portal Routes */}
      <Route element={<LoginPage />} path="/login" />
      <Route element={<CitizenDashboard />} path="/citizen" />
      <Route element={<CitizenProfile />} path="/citizen/profile" />
      <Route element={<CitizenApplications />} path="/citizen/applications" />
      <Route element={<CitizenGrievances />} path="/citizen/grievances" />

      {/* BLO Portal Routes */}
      <Route element={<BloDashboard />} path="/blo" />

      {/* ERO Portal Routes */}
      <Route element={<EroDashboard />} path="/ero" />

      {/* State EC Portal Routes */}
      <Route element={<StateEcDashboard />} path="/state-ec" />

      {/* ECI Portal Routes */}
      <Route element={<EciDashboard />} path="/eci" />
    </Routes>
  );
}

export default App;
