import React, { useState } from 'react';
import { Club, EventItem, HiringItem, AchievementItem, ClubMembership } from '../../../types';
import {
  Users,
  Calendar,
  Briefcase,
  Award,
  Search,
  Filter,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Mail,
  Globe,
  Trash2,
  Eye,
  AlertTriangle,
  Building2,
  Clock,
  MapPin,
  Tag,
  PlusCircle,
} from 'lucide-react';

interface AdminClubsViewProps {
  clubs: Club[];
  events: EventItem[];
  hiring: HiringItem[];
  achievements: AchievementItem[];
  clubMembers: ClubMembership[];
  onOpenRestrictionModal: (
    action: 'RESTRICT' | 'UNBLOCK',
    targetType: 'CLUB' | 'EVENT' | 'HIRING',
    targetId: string,
    targetName: string
  ) => void;
  onDeleteEvent?: (id: string) => void;
  onDeleteHiring?: (id: string) => void;
}

export const AdminClubsView: React.FC<AdminClubsViewProps> = ({
  clubs,
  events,
  hiring,
  achievements,
  clubMembers,
  onOpenRestrictionModal,
  onDeleteEvent,
  onDeleteHiring,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESTRICTED'>('ALL');
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<'events' | 'hiring' | 'members' | 'achievements'>('events');

  const selectedClub = clubs.find((c) => c.id === selectedClubId);

  // Filtered Clubs
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.facultyAdvisor && club.facultyAdvisor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      club.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || club.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !club.isRestricted && club.isActive) ||
      (statusFilter === 'RESTRICTED' && (club.isRestricted || !club.isActive));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Sports',
    'Literary',
    'Social',
    'Professional Society',
  ];

  // Activities for selected club
  const clubEvents = selectedClub ? events.filter((e) => e.clubId === selectedClub.id) : [];
  const clubHiring = selectedClub ? hiring.filter((h) => h.clubId === selectedClub.id) : [];
  const clubAchievements = selectedClub
    ? achievements.filter((a) => a.category === 'CLUB' && (a.clubName === selectedClub.name || (a as any).clubId === selectedClub.id))
    : [];
  const members = selectedClub ? clubMembers.filter((m) => m.clubId === selectedClub.id) : [];

  if (selectedClub) {
    const isRestricted = Boolean(selectedClub.isRestricted || !selectedClub.isActive);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Navigation & Actions Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setSelectedClubId(null)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Clubs ({clubs.length})</span>
          </button>

          <div className="flex items-center gap-3">
            {isRestricted ? (
              <button
                onClick={() =>
                  onOpenRestrictionModal('UNBLOCK', 'CLUB', selectedClub.id, selectedClub.name)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Reinstate & Unblock Club</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  onOpenRestrictionModal('RESTRICT', 'CLUB', selectedClub.id, selectedClub.name)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Restrict / Block Club Activity</span>
              </button>
            )}
          </div>
        </div>

        {/* Restriction Alert Banner if Restricted */}
        {isRestricted && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Club Under Administrative Suspension / Restriction
                </h4>
                {selectedClub.restrictedAt && (
                  <span className="text-[10px] text-rose-600">
                    Restricted on {new Date(selectedClub.restrictedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-700 mt-1">
                <strong>Disciplinary / Audit Reason:</strong>{' '}
                {selectedClub.restrictionReason || 'Violations of collegiate organization policy or pending committee review.'}
              </p>
              <p className="text-[11px] text-rose-600 mt-0.5">
                New events, recruitments, and public announcements by this club are currently frozen.
              </p>
            </div>
          </div>
        )}

        {/* Club Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center p-2 shadow-inner">
                {selectedClub.logo ? (
                  <img
                    src={selectedClub.logo}
                    alt={selectedClub.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                    {selectedClub.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {selectedClub.category}
                  </span>
                  {isRestricted ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      RESTRICTED / BLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-black text-slate-900">{selectedClub.name}</h2>
                <p className="text-xs text-slate-500 line-clamp-1">{selectedClub.tagline}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <div className="text-center px-3">
                <div className="text-lg font-black text-slate-900">{clubEvents.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Events</div>
              </div>
              <div className="text-center px-3 border-x border-slate-200">
                <div className="text-lg font-black text-slate-900">{clubHiring.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Hiring</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black text-slate-900">
                  {members.length > 0 ? members.length : selectedClub.memberCount || 24}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Members</div>
              </div>
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="md:col-span-2">
              <span className="font-bold text-slate-800 block mb-1">Official Purpose & Overview:</span>
              <p className="text-slate-600 leading-relaxed">{selectedClub.description}</p>
            </div>
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Faculty Advisor
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedClub.facultyAdvisor || 'Assigned by Academic Council'}
                </span>
              </div>
              {selectedClub.email && (
                <div className="flex items-center gap-1.5 text-slate-600 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedClub.email}</span>
                </div>
              )}
              {selectedClub.website && (
                <div className="flex items-center gap-1.5 text-indigo-600 truncate">
                  <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <a
                    href={selectedClub.website}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline"
                  >
                    {selectedClub.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dossier Activity Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveDossierTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'events'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Club Events ({clubEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveDossierTab('hiring')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'hiring'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recruitments & Hiring ({clubHiring.length})</span>
          </button>

          <button
            onClick={() => setActiveDossierTab('members')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'members'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leadership & Officers ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveDossierTab('achievements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'achievements'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Honors & Trophies ({clubAchievements.length})</span>
          </button>
        </div>

        {/* Tab 1: Club Events */}
        {activeDossierTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                All Events Organized by {selectedClub.name}
              </h3>
              <span className="text-xs text-slate-500">
                Admin has full moderation control to restrict or cancel any unapproved event.
              </span>
            </div>

            {clubEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No events currently scheduled by this club.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubEvents.map((evt) => {
                  const eventRestricted = Boolean(evt.isRestricted || !evt.isPublished);

                  return (
                    <div
                      key={evt.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        eventRestricted
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                            {evt.category}
                          </span>
                          {eventRestricted ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              BLOCKED / RESTRICTED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              PUBLISHED
                            </span>
                          )}
                        </div>

                        {/* Admin Action for this Event */}
                        <div className="flex items-center gap-1.5">
                          {eventRestricted ? (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal('UNBLOCK', 'EVENT', evt.id, evt.title)
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Reinstate Event"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal('RESTRICT', 'EVENT', evt.id, evt.title)
                              }
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Restrict improper or unapproved event"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Restrict Event</span>
                            </button>
                          )}

                          {onDeleteEvent && (
                            <button
                              onClick={() => onDeleteEvent(evt.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Permanently remove event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1">{evt.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                        {evt.description}
                      </p>

                      {eventRestricted && evt.restrictionReason && (
                        <div className="p-2.5 rounded-xl bg-rose-100/60 border border-rose-200 text-rose-800 text-[11px] mb-3">
                          <strong>Admin Disciplinary Note:</strong> {evt.restrictionReason}
                        </div>
                      )}

                      <div className="space-y-1 text-xs text-slate-500 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{evt.venue}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Club Hiring */}
        {activeDossierTab === 'hiring' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Recruitment Drives & Openings
              </h3>
              <span className="text-xs text-slate-500">
                Admin can restrict unapproved recruitments or unauthorized roles.
              </span>
            </div>

            {clubHiring.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No active recruitment postings by this club.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubHiring.map((h) => {
                  const isHiringRestricted = Boolean(h.isRestricted);

                  return (
                    <div
                      key={h.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isHiringRestricted
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              h.status === 'OPEN'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            Status: {h.status}
                          </span>
                          {isHiringRestricted && (
                            <span className="ml-2 px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                              RESTRICTED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isHiringRestricted ? (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal('UNBLOCK', 'HIRING', h.id, h.position)
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal('RESTRICT', 'HIRING', h.id, h.position)
                              }
                              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1 hover:bg-rose-100"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Restrict</span>
                            </button>
                          )}

                          {onDeleteHiring && (
                            <button
                              onClick={() => onDeleteHiring(h.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1">{h.position}</h4>
                      <p className="text-xs text-slate-600 mb-3">{h.description}</p>

                      {isHiringRestricted && h.restrictionReason && (
                        <div className="p-2.5 rounded-xl bg-rose-100/60 border border-rose-200 text-rose-800 text-[11px] mb-3">
                          <strong>Admin Note:</strong> {h.restrictionReason}
                        </div>
                      )}

                      <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">Eligibility:</span>
                          <span>{h.eligibility}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Deadline: {h.deadline}</span>
                        </div>
                        {h.requiredSkills && h.requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {h.requiredSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Club Members */}
        {activeDossierTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Official Student Leadership & Members
              </h3>
              <span className="text-xs text-slate-500">
                Authorized club officers registered with the college Dean of Student Affairs.
              </span>
            </div>

            {members.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No formal membership records found for this club in database. Default roster: 24 active students.
              </div>
            ) : (
              <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Permissions</th>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{m.studentName}</div>
                          <div className="text-[11px] text-slate-400">{m.studentEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 font-bold text-indigo-700">
                            {m.position}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            {m.permissions?.canCreateEvents && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">Events</span>
                            )}
                            {m.permissions?.canManageHiring && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">Hiring</span>
                            )}
                            {m.permissions?.canManageMembers && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">Roster</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{m.joiningDate}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Achievements */}
        {activeDossierTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Verified Club Achievements & Honors
            </h3>
            {clubAchievements.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No achievements recorded for this club.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubAchievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex gap-3">
                    <img
                      src={ach.image}
                      alt={ach.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 flex-1 text-xs">
                      <div className="font-bold text-slate-900">{ach.title}</div>
                      <p className="text-slate-600 line-clamp-2">{ach.description}</p>
                      <div className="text-[10px] text-slate-400">Award Date: {ach.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Master Clubs List View
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clubs by name, code, category, or faculty advisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'ALL' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({clubs.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'ACTIVE' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('RESTRICTED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'RESTRICTED' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Restricted
            </button>
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClubs.map((club) => {
          const isRestricted = Boolean(club.isRestricted || !club.isActive);
          const clubEvts = events.filter((e) => e.clubId === club.id);
          const clubHires = hiring.filter((h) => h.clubId === club.id);

          return (
            <div
              key={club.id}
              onClick={() => setSelectedClubId(club.id)}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isRestricted
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400 hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center p-1.5 shadow-inner">
                    {club.logo ? (
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isRestricted ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        RESTRICTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* Club Titles */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {club.code}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {club.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {club.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {club.description}
                  </p>
                </div>

                {isRestricted && club.restrictionReason && (
                  <div className="p-2 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-[10px] mb-2 font-medium">
                    <strong>Reason:</strong> {club.restrictionReason}
                  </div>
                )}
              </div>

              {/* Footer / Stats & CTA */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {clubEvts.length} events
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    {clubHires.length} hiring
                  </span>
                </div>

                <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect Activity</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          No clubs found matching your search or filters.
        </div>
      )}
    </div>
  );
};
