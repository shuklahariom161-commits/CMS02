import React from 'react';
import {
  GraduationCap,
  Users,
  Briefcase,
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { FacultyPostItem, EventItem, HiringItem, Club, User } from '../../../types';

interface StudentHomeTabProps {
  user: User | null;
  profileName: string;
  profileStudentId: string;
  profileDept: string;
  profileYear: string;
  clubsCount: number;
  hiringOpportunities: HiringItem[];
  appliedHiringIds: string[];
  events: EventItem[];
  rsvpdEventIds: string[];
  facultyPosts: FacultyPostItem[];
  achievementsCount: number;
  sentMessagesCount: number;
  onSelectTab: (tab: 'home' | 'events' | 'faculty-posts' | 'opportunities' | 'clubs' | 'profile' | 'achievements' | 'about') => void;
  onOpenFacultyPost?: (postId: string) => void;
  onToggleRsvp: (eventId: string) => void;
}

export const StudentHomeTab: React.FC<StudentHomeTabProps> = ({
  user,
  profileName,
  profileStudentId,
  profileDept,
  profileYear,
  clubsCount,
  hiringOpportunities,
  appliedHiringIds,
  events,
  rsvpdEventIds,
  facultyPosts,
  achievementsCount,
  sentMessagesCount,
  onSelectTab,
  onOpenFacultyPost,
  onToggleRsvp,
}) => {
  const recentPosts = facultyPosts.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Madhav Institute of Technology & Science · Student Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back, {profileName || user?.name || 'Student'}!
          </h1>

          <p className="text-sm text-indigo-100/90 max-w-2xl leading-relaxed">
            Stay connected with campus life: explore verified faculty notices, join 20+ student clubs, register for hackathons, and connect directly with department mentors.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('events')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Upcoming Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectTab('faculty-posts')}
              className="px-4 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm border border-indigo-400/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Faculty Posts</span>
            </button>

            <button
              onClick={() => onSelectTab('opportunities')}
              className="px-4 py-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/60 text-indigo-200 font-semibold text-xs sm:text-sm border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-amber-300" />
              <span>Opportunities</span>
            </button>
          </div>
        </div>

        {/* Decorative background art */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[200px]">
          <GraduationCap className="w-10 h-10 text-indigo-200 mb-2" />
          <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">MITS Enrollment</span>
          <span className="text-base font-bold text-white mt-0.5">{profileStudentId || 'STU-2024'}</span>
          <span className="text-[11px] text-indigo-200/80 mt-1">{profileDept}</span>
          <span className="text-[10px] text-amber-300 font-semibold mt-0.5">{profileYear}</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Stat 1: Clubs */}
        <div
          onClick={() => onSelectTab('clubs')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clubs</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{clubsCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Active Societies</p>
        </div>

        {/* Stat 2: Hiring */}
        <div
          onClick={() => onSelectTab('opportunities')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Openings</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{hiringOpportunities.length}</div>
          <p className="text-[11px] text-purple-700 font-medium mt-0.5">{appliedHiringIds.length} Applied</p>
        </div>

        {/* Stat 3: Events */}
        <div
          onClick={() => onSelectTab('events')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Events</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{events.length}</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">{rsvpdEventIds.length} Registered</p>
        </div>

        {/* Stat 4: Faculty Notices */}
        <div
          onClick={() => onSelectTab('faculty-posts')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Faculty Feed</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{facultyPosts.length}</div>
          <p className="text-[11px] text-indigo-700 font-medium mt-0.5">Faculty Posts</p>
        </div>

        {/* Stat 5: Achievements */}
        <div
          onClick={() => onSelectTab('profile')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Profile</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{achievementsCount}</div>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Edit Profile & CV</p>
        </div>
      </div>

      {/* Two Column Layout: Latest Faculty Notices & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Faculty Announcements (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Latest Faculty Notices & Circulars</h2>
            </div>
            <button
              onClick={() => onSelectTab('faculty-posts')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({facultyPosts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recentPosts.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No faculty announcements posted yet.
              </div>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.facultyAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.facultyName}`}
                        alt={post.facultyName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{post.facultyName}</h4>
                        <p className="text-[11px] text-slate-500">{post.facultyDesignation} · {post.facultyDepartment}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 shrink-0">
                      {post.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{post.content}</p>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => {
                        onSelectTab('faculty-posts');
                        if (onOpenFacultyPost) onOpenFacultyPost(post.id);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read & Comment</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Events & Quick Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Events Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Upcoming Events & Hackathons</h2>
              </div>
              <button
                onClick={() => onSelectTab('events')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No upcoming events scheduled right now.
                </div>
              ) : (
                upcomingEvents.map((evt) => {
                  const isRsvpd = rsvpdEventIds.includes(evt.id);
                  return (
                    <div
                      key={evt.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-200 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {evt.category}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {evt.date}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{evt.title}</h4>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-[160px]">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {evt.venue}
                        </span>

                        <button
                          onClick={() => onToggleRsvp(evt.id)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            isRsvpd
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {isRsvpd ? 'Registered ✓' : 'RSVP Now'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Shortcuts Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectTab('clubs')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">Browse Clubs</p>
                <p className="text-[10px] text-slate-500">Technical & Cultural</p>
              </button>

              <button
                onClick={() => onSelectTab('faculty')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">Faculty Directory</p>
                <p className="text-[10px] text-slate-500">Cabins & Contacts</p>
              </button>

              <button
                onClick={() => onSelectTab('achievements')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 text-left transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">Achievements</p>
                <p className="text-[10px] text-slate-500">Awards & Honors</p>
              </button>

              <button
                onClick={() => onSelectTab('about')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4 text-slate-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">About MITS</p>
                <p className="text-[10px] text-slate-500">Guide & Helpline</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
