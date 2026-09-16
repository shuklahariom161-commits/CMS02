import React from 'react';
import {
  GraduationCap,
  Shield,
  Users,
  Calendar,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
} from 'lucide-react';

interface AboutProps {
  onOpenLogin: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenLogin }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>About CMS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          College Community Management System
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          <strong>CMS</strong> is the centralized digital backbone for our institution, harmonizing club management, student opportunities, faculty discourse, and administrative governance.
        </p>
      </div>

      {/* Core Objective Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          <span>The CMS Mission & Vision</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Traditional college management is often fragmented across disorganized chat channels, separate event forms, and lost announcements. CMS combines these disparate threads into a single, cohesive institutional platform designed for five distinct stakeholders:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              1. Students
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discover clubs, apply for leadership openings, RSVP for events, celebrate peer achievements, and engage with verified faculty posts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              2. Club Management & Members
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Post authorized club events, recruit teammates with structured hiring workflows, assign positions (President, Tech Head, Coordinator), and publish club trophies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              3. College Faculty
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Issue verified academic updates, guest lecture notices, and capstone deadlines with interactive likes and moderated comments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              4. Administrators
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supervise user accounts, moderate posts, manage registered clubs, approve achievements, and view institution-wide analytical charts.
            </p>
          </div>
        </div>
      </div>

      {/* Security & RBAC */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Full-Stack Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-indigo-200">Enforced by backend JWT tokens & role authorization middleware</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          CMS does not depend on superficial frontend checks. Every critical API endpoint (such as event modification, hiring publishing, and member assignment) evaluates the requester's cryptographic JWT token, designated role, and specific club permissions.
        </p>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Production Mongoose Schemas & REST APIs Active</span>
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Open Login
          </button>
        </div>
      </div>

      {/* Developer Spotlight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Platform Development &amp; Engineering
              </h2>
              <p className="text-xs text-slate-500">
                Architected &amp; engineered for the MITS college community
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Development
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-md">
          <div className="relative shrink-0">
            <img
              src="/hariom-shukla.jpg"
              alt="Hariom Shukla"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-indigo-400/80 shadow-xl"
              referrerPolicy="no-referrer"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full"
              title="Online"
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-1.5">
                Lead Platform Developer
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Hariom Shukla
              </h3>
              <p className="text-sm font-semibold text-indigo-300 mt-0.5">
                B.Tech — Mathematics &amp; Computing
              </p>
              <p className="text-xs text-slate-400">
                Madhav Institute of Technology &amp; Science (MITS), Gwalior
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Engineered the College Community Management System (CampusOne) to unify 84 student societies, departmental faculties, club recruitments, real-time achievements, and role-based permissions into a single high-performance institutional portal.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 font-medium">
                Mathematics &amp; Computing
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 font-medium">
                Full-Stack Architecture
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 font-medium">
                MITS Gwalior
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
