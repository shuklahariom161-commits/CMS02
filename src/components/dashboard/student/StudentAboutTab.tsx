import React from 'react';
import {
  Info,
  GraduationCap,
  Shield,
  BookOpen,
  Award,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Building,
  HeartHandshake,
  Cpu,
} from 'lucide-react';

export const StudentAboutTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Institutional Legacy & Information</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          About Madhav Institute of Technology & Science (MITS Gwalior)
        </h2>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Established in 1957 by His Highness Late Sir Jiwaji Rao Scindia, Maharaja of Gwalior, MITS is a premier government-aided autonomous engineering institution in central India. Accredited with NAAC A++ and recognized by UGC & AICTE, the institute champions technological innovation, research leadership, and vibrant student development.
        </p>

        {/* Quick Institutional Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Established</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">1957</p>
            <p className="text-[11px] text-slate-500">67+ Years of Legacy</p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Accreditation</span>
            <p className="text-lg font-bold text-indigo-700 mt-0.5">NAAC A++</p>
            <p className="text-[11px] text-indigo-600/80">Highest Quality Tier</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Campus Area</span>
            <p className="text-lg font-bold text-emerald-700 mt-0.5">47+ Acres</p>
            <p className="text-[11px] text-emerald-600/80">State-of-the-art</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Active Clubs</span>
            <p className="text-lg font-bold text-amber-700 mt-0.5">80+ Clubs</p>
            <p className="text-[11px] text-amber-600/80">Tech & Cultural</p>
          </div>
        </div>
      </div>

      {/* Campus Pillars & Key Student Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Student Activity Center */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Student Activity Center (SAC)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The beating heart of campus student life. SAC hosts club meeting chambers, innovation workshops, rehearsal studios for music and dance, and the central open amphitheater.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Behind Academic Block 2 · Open 8:00 AM – 9:00 PM</span>
          </div>
        </div>

        {/* Card 2: Innovation & Incubation Cell */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Centre for Innovation & Incubation (CIIE)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Supporting student entrepreneurs with seed grants, 3D printing labs, IoT testing equipment, patent drafting assistance, and mentor matchmaking with alumni founders.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>MITS Technology Park · ciie@mitsgwalior.in</span>
          </div>
        </div>
      </div>

      {/* Student Code of Conduct & Honor Code */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Student Honor Code & Campus Ethics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Academic Integrity</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict adherence to original submissions for lab reports, assignments, and semester projects. Zero tolerance for plagiarism.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Ragging Policy</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              MITS enforces a 100% ragging-free campus. The Anti-Ragging Squad and 24x7 helpline safeguard all junior scholars.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Campus Discipline</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wear student ID badges at all times. Adhere to institutional laboratory safety guidelines and respect college property.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts & Student Welfare Desk */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Student Welfare & Emergency Helpline</h3>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Reach out anytime to student counselors, Dean of Student Welfare, or campus emergency medical services.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dean, Student Welfare</span>
            <p className="text-xs font-bold text-white mt-1">Dr. Rajeev Walker</p>
            <p className="text-[11px] text-indigo-300 mt-0.5">dsw@mitsgwalior.in</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Anti-Ragging Squad</span>
            <p className="text-xs font-bold text-white mt-1">24x7 Emergency Line</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">1800-180-5522 / +91-751-2409300</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Campus Address</span>
            <p className="text-xs font-bold text-white mt-1">Race Course Road</p>
            <p className="text-[11px] text-amber-300 mt-0.5">Gola Ka Mandir, Gwalior (M.P.) 474005</p>
          </div>
        </div>
      </div>
    </div>
  );
};
