import React from 'react';
import { Club, User, FacultyMember, EventItem, FacultyPostItem, ActivityLogItem } from '../../../types';
import {
  ShieldAlert,
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

interface AdminOverviewViewProps {
  clubs: Club[];
  students: User[];
  facultyList: FacultyMember[];
  events: EventItem[];
  facultyPosts: FacultyPostItem[];
  activityLogs: ActivityLogItem[];
  onNavigateTab: (tab: 'clubs' | 'students' | 'faculty' | 'moderation' | 'audit') => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  clubs,
  students,
  facultyList,
  events,
  facultyPosts,
  activityLogs,
  onNavigateTab,
}) => {
  const restrictedClubsCount = clubs.filter((c) => c.isRestricted || !c.isActive).length;
  const restrictedStudentsCount = students.filter((s) => s.isBlocked || s.isActive === false).length;
  const restrictedFacultyCount = facultyList.filter((f) => f.isRestricted).length;
  const restrictedPostsCount = facultyPosts.filter((p) => p.isRestricted).length;
  const restrictedEventsCount = events.filter((e) => e.isRestricted || !e.isPublished).length;

  const totalRestrictedCount =
    restrictedClubsCount +
    restrictedStudentsCount +
    restrictedFacultyCount +
    restrictedPostsCount +
    restrictedEventsCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Dean's Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-indigo-900/40">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider uppercase border border-indigo-500/30">
              Campus Operations & Disciplinary Command
            </span>
            <span className="text-xs text-indigo-200/80">Dean's Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Administrative Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Welcome, Dr. Arthur Vance. As College Administrator & Dean, you hold centralized oversight over all collegiate clubs, student activities, faculty notices, and institutional disciplinary moderation.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigateTab('clubs')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shadow-md transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Inspect All Clubs ({clubs.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('students')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Inspect All Students ({students.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('moderation')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Restricted Activities ({totalRestrictedCount})</span>
            </button>
          </div>
        </div>

        {/* Ambient Decorative Background */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-4 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateTab('clubs')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {clubs.length - restrictedClubsCount} Active
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
            {clubs.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">Campus Clubs</div>
        </div>

        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {students.length - restrictedStudentsCount} Active
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
            {students.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">Students</div>
        </div>

        <div
          onClick={() => onNavigateTab('faculty')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {facultyList.length} Active
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
            {facultyList.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">Faculty Members</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              Upcoming
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{events.length}</div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">Campus Events</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
              Notices
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{facultyPosts.length}</div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">Faculty Circulars</div>
        </div>

        <div
          onClick={() => onNavigateTab('moderation')}
          className={`p-4 rounded-2xl border shadow-xs transition-all cursor-pointer group ${
            totalRestrictedCount > 0
              ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400 hover:shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                totalRestrictedCount > 0
                  ? 'bg-rose-200 text-rose-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Actionable
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 group-hover:scale-105 transition-transform">
            {totalRestrictedCount}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-0.5">Restricted Items</div>
        </div>
      </div>

      {/* Moderation Shortcuts & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Administrative Disciplinary Log */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Recent Administrative & Disciplinary Logs
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View Full Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activityLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No administrative restrictions recorded in current session.
            </div>
          ) : (
            <div className="space-y-2.5">
              {activityLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          log.actionType.startsWith('RESTRICT') || log.actionType.startsWith('BLOCK')
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {log.actionType.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-slate-900">{log.targetName}</span>
                      <span className="text-[10px] text-slate-400">({log.targetType})</span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-1">
                      Reason: {log.reason}
                    </p>
                  </div>

                  <div className="text-right shrink-0 text-[10px] text-slate-400">
                    <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="font-medium text-slate-500">{log.adminName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Dean Directives & Quick Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Dean's Disciplinary Powers</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Under Collegiate Statute 42(B), the Dean holds final executive discretion to approve, restrict, or suspend any campus activity, club charter, or user account.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div
                onClick={() => onNavigateTab('clubs')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">Review Club Charters</div>
                  <div className="text-[11px] text-slate-400">Manage all {clubs.length} registered campus clubs</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => onNavigateTab('students')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">Audit Student Activities</div>
                  <div className="text-[11px] text-slate-400">Inspect RSVPs, comments, and memberships</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => onNavigateTab('faculty')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">Faculty Publication Desk</div>
                  <div className="text-[11px] text-slate-400">Review notices, circulars, and hackathons</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <span className="font-bold block mb-0.5">Autonomous Synchronization:</span>
            All disciplinary blocks and unblock decisions immediately reflect live across public directories and student portals.
          </div>
        </div>
      </div>
    </div>
  );
};
