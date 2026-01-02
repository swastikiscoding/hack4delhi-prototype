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
    </Routes>
  );
}

export default App;
