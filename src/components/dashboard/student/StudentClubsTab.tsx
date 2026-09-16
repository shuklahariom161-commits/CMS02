import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Briefcase,
  Calendar,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Building2,
  Check,
  Award,
} from 'lucide-react';
import { Club, HiringItem, EventItem, User } from '../../../types';
import { ClubCard } from '../../cards/ClubCard';

interface StudentClubsTabProps {
  user: User | null;
  clubs: Club[];
  hiringOpportunities: HiringItem[];
  appliedHiringIds: string[];
  events: EventItem[];
  rsvpdEventIds: string[];
  onApplyHiring: (item: HiringItem) => void;
  onToggleRsvp: (eventId: string) => void;
  initialSubTab?: 'all-clubs' | 'memberships' | 'hiring' | 'events';
}

export const StudentClubsTab: React.FC<StudentClubsTabProps> = ({
  user,
  clubs,
  hiringOpportunities,
  appliedHiringIds,
  events,
  rsvpdEventIds,
  onApplyHiring,
  onToggleRsvp,
  initialSubTab = 'all-clubs',
}) => {
  const [subTab, setSubTab] = useState<'all-clubs' | 'memberships' | 'hiring' | 'events'>(initialSubTab);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Technical', 'Cultural', 'Literary', 'Sports', 'Social', 'Professional Society'];

  // Filtered Clubs
  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const matchCat = categoryFilter === 'All' || c.category.toLowerCase() === categoryFilter.toLowerCase();
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.tagline?.toLowerCase().includes(q) ||
        c.facultyAdvisor?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [clubs, categoryFilter, search]);

  // Student Memberships
  const memberships = user?.clubMemberships || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Clubs Navigation Sub-Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Student Societies & Community</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Clubs, Memberships & Opportunities
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore 20+ active student clubs at MITS Gwalior, join recruitments, or participate in college events.
            </p>
          </div>

          {/* Subtabs Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSubTab('all-clubs')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                subTab === 'all-clubs'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Clubs ({clubs.length})
            </button>

            <button
              onClick={() => setSubTab('memberships')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                subTab === 'memberships'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Memberships ({memberships.length})
            </button>

            <button
              onClick={() => setSubTab('hiring')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                subTab === 'hiring'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hiring ({hiringOpportunities.length})
            </button>

            <button
              onClick={() => setSubTab('events')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                subTab === 'events'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Events ({events.length})
            </button>
          </div>
        </div>

        {/* Search & Category Filter for All Clubs */}
        {subTab === 'all-clubs' && (
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clubs, code, advisor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* SUBTAB 1: ALL CLUBS */}
      {subTab === 'all-clubs' && (
        <div>
          {filteredClubs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No clubs found matching criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: MY MEMBERSHIPS */}
      {subTab === 'memberships' && (
        <div className="space-y-4">
          {memberships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-indigo-200 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active club memberships yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You have not joined any club official executive positions yet. Apply to open recruitment positions in the "Hiring" tab to join!
              </p>
              <button
                onClick={() => setSubTab('hiring')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                View Club Hiring Openings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberships.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {m.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Since {new Date(m.joiningDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{m.position}</h3>
                    <p className="text-xs text-slate-500">Club ID: {m.clubId}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-700">Permissions:</p>
                    <ul className="list-disc list-inside text-[10px] text-slate-500 space-y-0.5">
                      {m.permissions?.canCreateEvents && <li>Can propose events</li>}
                      {m.permissions?.canManageMembers && <li>Can coordinate members</li>}
                      {m.permissions?.canManageHiring && <li>Can manage recruitment</li>}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: HIRING & OPPORTUNITIES */}
      {subTab === 'hiring' && (
        <div className="space-y-4">
          {hiringOpportunities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No recruitment notices active right now</h3>
              <p className="text-xs text-slate-500 mt-1">Club leaders will post openings here during recruitment weeks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {hiringOpportunities.map((item) => {
                const isApplied = appliedHiringIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                            {item.clubName}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1.5">{item.position}</h3>
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Deadline: {item.deadline}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-700">Required Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.requiredSkills.map((skill, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Posted by Club Leadership
                      </span>

                      <button
                        onClick={() => onApplyHiring(item)}
                        disabled={isApplied}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {isApplied ? 'Application Submitted ✓' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: CLUB EVENTS */}
      {subTab === 'events' && (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No events scheduled</h3>
              <p className="text-xs text-slate-500 mt-1">Check back soon for new hackathons and campus workshops.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => {
                const isRsvpd = rsvpdEventIds.includes(evt.id);
                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="relative h-36 w-full bg-slate-100">
                        <img
                          src={evt.poster || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80'}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                          {evt.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span className="flex items-center gap-1 font-semibold text-indigo-600">
                            <Calendar className="w-3 h-3" />
                            {evt.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {evt.time}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => onToggleRsvp(evt.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isRsvpd
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isRsvpd ? 'Registration Confirmed ✓' : 'Register / RSVP'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
