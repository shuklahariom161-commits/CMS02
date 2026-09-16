import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Clock,
  CheckCircle2,
  Check,
  Building2,
  Users,
  Award,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Send,
  X,
  FileText,
} from 'lucide-react';
import { HiringItem, User } from '../../../types';

interface StudentOpportunitiesTabProps {
  user: User | null;
  profileName: string;
  profileStudentId: string;
  profileDept: string;
  profileYear: string;
  hiringOpportunities: HiringItem[];
  appliedHiringIds: string[];
  onApplyHiring: (item: HiringItem, applicationData?: any) => void;
  onRefreshOpportunities?: () => void;
  isRefreshing?: boolean;
}

export const StudentOpportunitiesTab: React.FC<StudentOpportunitiesTabProps> = ({
  user,
  profileName,
  profileStudentId,
  profileDept,
  profileYear,
  hiringOpportunities,
  appliedHiringIds,
  onApplyHiring,
  onRefreshOpportunities,
  isRefreshing = false,
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [selectedHireForApply, setSelectedHireForApply] = useState<HiringItem | null>(null);

  // Application Modal Form State
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantStatement, setApplicantStatement] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const domains = ['All', 'Technical', 'Design', 'Management', 'Content', 'Media'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredHiring = useMemo(() => {
    return hiringOpportunities.filter((h) => {
      const matchDomain =
        domainFilter === 'All' ||
        h.position.toLowerCase().includes(domainFilter.toLowerCase()) ||
        h.requiredSkills.some((s) => s.toLowerCase().includes(domainFilter.toLowerCase())) ||
        (h.description && h.description.toLowerCase().includes(domainFilter.toLowerCase()));
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        h.position.toLowerCase().includes(q) ||
        h.clubName.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.requiredSkills.some((s) => s.toLowerCase().includes(q));
      return matchDomain && matchSearch;
    });
  }, [hiringOpportunities, domainFilter, search]);

  const handleOpenApplyModal = (item: HiringItem) => {
    setSelectedHireForApply(item);
    setApplicantStatement('');
    setApplicantPortfolio('');
    setApplicantPhone('');
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHireForApply) return;

    setSubmittingApp(true);
    setTimeout(() => {
      onApplyHiring(selectedHireForApply, {
        name: profileName || user?.name,
        email: user?.email,
        studentId: profileStudentId,
        department: profileDept,
        year: profileYear,
        phone: applicantPhone,
        portfolio: applicantPortfolio,
        statement: applicantStatement,
      });
      setSubmittingApp(false);
      setSelectedHireForApply(null);
      showToast(`Application submitted to ${selectedHireForApply.clubName} successfully!`);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/80 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recruitments & Club Cores</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Opportunities & Club Hiring
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              If any college club opens recruitment for technical cores, graphic design, management, or social leads, it reflects right here in your student dashboard. Apply with your verified profile!
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            {onRefreshOpportunities && (
              <button
                onClick={onRefreshOpportunities}
                disabled={isRefreshing}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                title="Fetch latest club recruitment notices"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
                <span>{isRefreshing ? 'Checking...' : 'Refresh Openings'}</span>
              </button>
            )}

            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{hiringOpportunities.length} Active Openings</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setDomainFilter(dom)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  domainFilter === dom
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles, skills, or clubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      {filteredHiring.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No recruitment notices match</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {search || domainFilter !== 'All'
              ? 'No open club roles match your filter criteria. Try searching for other skills or select "All".'
              : 'Clubs have not posted any active hiring notices at this moment. During recruitment weeks, new openings will automatically appear here!'}
          </p>
          {(search || domainFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setDomainFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHiring.map((hire) => {
            const isApplied = appliedHiringIds.includes(hire.id);

            return (
              <div
                key={hire.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70 inline-flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-emerald-600" />
                        <span>@{hire.clubName}</span>
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2.5 group-hover:text-emerald-700 transition-colors">
                        {hire.position}
                      </h3>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{hire.deadline || 'Ongoing'}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {hire.description}
                  </p>

                  {/* Required Skills Chips */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Required Skills & Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hire.requiredSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Perks & Benefits */}
                  {hire.perks && hire.perks.length > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 flex items-center gap-2 text-[11px] text-emerald-800">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">Perks:</span>
                      <span className="truncate">{hire.perks.join(' • ')}</span>
                    </div>
                  )}
                </div>

                {/* Apply Action Bottom */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Verified Club Recruitment
                  </span>

                  <button
                    id={`btn-apply-hire-${hire.id}`}
                    onClick={() => handleOpenApplyModal(hire)}
                    disabled={isApplied}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Application Submitted ✓</span>
                      </>
                    ) : (
                      <>
                        <span>Apply for Role</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: COMPREHENSIVE CLUB RECRUITMENT APPLICATION */}
      {/* ========================================================= */}
      {selectedHireForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Join Club Leadership Team
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
                  Apply for {selectedHireForApply.position}
                </h3>
                <p className="text-xs text-emerald-100/80">
                  @{selectedHireForApply.clubName} • Deadline: {selectedHireForApply.deadline}
                </p>
              </div>

              <button
                onClick={() => setSelectedHireForApply(null)}
                className="p-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Applicant Card Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{profileName || user?.name}</span>
                  <span className="font-mono text-[11px] text-slate-500">{profileStudentId}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {profileDept} • {profileYear}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub / Portfolio / Resume Link (Google Drive / Notion)
                </label>
                <input
                  type="url"
                  value={applicantPortfolio}
                  onChange={(e) => setApplicantPortfolio(e.target.value)}
                  placeholder="https://github.com/username or https://drive.google.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Why do you want to join this club and what makes you a great fit? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={applicantStatement}
                  onChange={(e) => setApplicantStatement(e.target.value)}
                  placeholder="Briefly describe your relevant skills, prior experience, or enthusiasm for this club's activities..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedHireForApply(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingApp || !applicantStatement.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-200 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingApp ? 'Submitting Application...' : 'Confirm & Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
