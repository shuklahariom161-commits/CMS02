import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Code,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & College Info */}
          <div className="space-y-4 lg:col-span-5">
            <button
              onClick={() => onNavigate('home')}
              className="inline-block bg-white p-2.5 rounded-xl shadow-md cursor-pointer text-left"
            >
              <img
                src="/campusone-mits-logo.svg"
                alt="CampusOne · MITS Gwalior"
                className="h-10 sm:h-11 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </button>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              One centralized platform connecting Students, College Faculty, Club Management Teams, Club Members, and Admin. Fostering collaborative campus life, technical growth, and cultural heritage.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>University Tech Campus, Academic Block 4, College Road</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>community@college.edu</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (800) 555-CAMPUS</span>
              </div>
            </div>
          </div>

          {/* Developers Section */}
          <div className="lg:col-span-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Developers</span>
            </h4>
            <div className="bg-slate-800/85 border border-slate-700/80 rounded-xl p-3 hover:border-indigo-500/60 transition-all group shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src="/hariom-shukla.jpg"
                    alt="Hariom Shukla"
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400/80 shadow-md group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"
                    title="Platform Developer"
                  />
                </div>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                    Hariom Shukla
                  </h5>
                  <p className="text-xs font-semibold text-indigo-300 leading-tight">
                    B.Tech
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium truncate">
                    Mathematics &amp; Computing
                  </p>
                  <p className="text-[10px] text-slate-400">
                    MITS Gwalior
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 text-[10px] text-indigo-300 font-medium bg-indigo-950/70 px-2 py-0.5 rounded-md border border-indigo-800/50">
                  Lead Developer
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-indigo-400 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links & System Status */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Community</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Stay connected with club activities, campus hackathons, and announcements.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="#github"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-300">CMS Core Engine Online</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">REST API &amp; Mongoose Active</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Developer signature */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2.5">
            <img
              src="/hariom-shukla.jpg"
              alt="Hariom Shukla"
              className="w-6 h-6 rounded-full object-cover border border-indigo-400/80 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span>
              Developed by <strong className="text-white font-semibold">Hariom Shukla</strong> — B.Tech (Mathematics &amp; Computing), MITS Gwalior
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-500 text-xs">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">College Portal Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

