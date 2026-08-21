import { useState } from "react";
import { C } from "../lib/tokens";
import { Sidebar, Topbar } from "../components/layout";
import DomainPrepPage from "../pages/DomainPrepPage";
import LinkedInAnalyzerPage from "../pages/LinkedInAnalyzerPage";
import MockInterviewPage from "../pages/MockInterviewPage";
import NotFoundPage from "../pages/NotFoundPage";
import NotificationsPage from "../pages/NotificationsPage";
import ProfilePage from "../pages/ProfilePage";
import ProgressDashboardPage from "../pages/ProgressDashboardPage";
import ProjectAnalyzerPage from "../pages/ProjectAnalyzerPage";
import ReportsPage from "../pages/ReportsPage";
import ResumeAnalyzerPage from "../pages/ResumeAnalyzerPage";
import RoadmapPage from "../pages/RoadmapPage";
import SettingsPage from "../pages/SettingsPage";
import SubjectPrepPage from "../pages/SubjectPrepPage";

function Footer() {
  return (
    <footer className="px-6 py-3 flex items-center justify-between flex-shrink-0"
      style={{ borderTop: `1px solid ${C.border}`, background: C.card }}>
      <div className="flex items-center gap-2">
        <svg width={12} height={12} viewBox="0 0 18 18" fill="none">
          <path d="M11 2L5 10h5l-2 6 8-9h-5.5L11 2z" fill="url(#footerGrad)" />
          <defs><linearGradient id="footerGrad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#A855F7"/><stop offset="1" stopColor="#22D3EE"/></linearGradient></defs>
        </svg>
        <span className="text-xs font-semibold" style={{ backgroundImage: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CrackIt</span>
        <span className="text-xs" style={{ color: C.muted }}>© 2025 · All rights reserved.</span>
      </div>
      <div className="flex gap-4">
        {["Privacy Policy", "Terms of Service", "Help Center"].map((label) => <a key={label} href="#" className="text-xs hover:text-white transition-colors" style={{ color: C.muted }}>{label}</a>)}
      </div>
    </footer>
  );
}

type Page = "dashboard" | "resume" | "linkedin" | "projects" | "subject" | "domain" | "mock" | "roadmap" | "reports" | "notifications" | "profile" | "settings" | "404";
const ALL_PAGES: Page[] = ["dashboard", "resume", "linkedin", "projects", "subject", "domain", "mock", "roadmap", "reports", "notifications", "profile", "settings", "404"];

export default function App() {
  const [col, setCol] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const toggleSidebar = () => setCol((isCollapsed) => !isCollapsed);
  const handleNav = (id: string) => setPage(ALL_PAGES.includes(id as Page) ? id as Page : "404");

  return (
    <div className="flex h-screen overflow-hidden dark" style={{ background: C.bg, fontFamily: "'Inter',sans-serif", color: C.text }}>
      <Sidebar col={col} active={page} onNav={handleNav} onToggle={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onToggle={toggleSidebar} />
        <div className="flex flex-1 overflow-hidden">
          {page === "dashboard" && <ProgressDashboardPage />}
          {page === "resume" && <ResumeAnalyzerPage />}
          {page === "linkedin" && <LinkedInAnalyzerPage />}
          {page === "projects" && <ProjectAnalyzerPage />}
          {page === "subject" && <SubjectPrepPage />}
          {page === "domain" && <DomainPrepPage />}
          {page === "mock" && <MockInterviewPage onFinish={() => setPage("reports")} />}
          {page === "roadmap" && <RoadmapPage />}
          {page === "reports" && <ReportsPage onRetake={() => setPage("mock")} />}
          {page === "notifications" && <NotificationsPage />}
          {page === "profile" && <ProfilePage />}
          {page === "settings" && <SettingsPage />}
          {page === "404" && <NotFoundPage onHome={() => setPage("dashboard")} />}
        </div>
        <Footer />
      </div>
    </div>
  );
}
