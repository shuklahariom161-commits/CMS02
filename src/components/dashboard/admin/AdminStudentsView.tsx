import React, { useState } from 'react';
import { User, EventItem, HiringItem, AchievementItem, CommentItem, ClubMembership, Club } from '../../../types';
import {
  GraduationCap,
  Calendar,
  MessageSquare,
  Briefcase,
  Award,
  Search,
  Lock,
  Unlock,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Building2,
  ChevronRight,
  Clock,
  MapPin,
  ExternalLink,
  Phone,
  UserX,
  UserCheck,
} from 'lucide-react';

interface AdminStudentsViewProps {
  students: User[];
  clubs: Club[];
  events: EventItem[];
  allComments: CommentItem[];
  achievements: AchievementItem[];
  clubMembers: ClubMembership[];
  onOpenRestrictionModal: (
    action: 'RESTRICT' | 'UNBLOCK',
    targetType: 'STUDENT' | 'COMMENT',
    targetId: string,
    targetName: string
  ) => void;
  onDeleteComment?: (id: string) => void;
}

export const AdminStudentsView: React.FC<AdminStudentsViewProps> = ({
  students,
  clubs,
  events,
  allComments,
  achievements,
  clubMembers,
  onOpenRestrictionModal,
  onDeleteComment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<'clubs' | 'events' | 'comments' | 'achievements'>('clubs');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      (student.studentId && student.studentId.toLowerCase().includes(query)) ||
      (student.department && student.department.toLowerCase().includes(query));

    const matchesDept = departmentFilter === 'All' || student.department === departmentFilter;
    const isBlocked = Boolean(student.isBlocked || student.isActive === false);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !isBlocked) ||
      (statusFilter === 'BLOCKED' && isBlocked);

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Selected Student Activities
  const studentMemberships = selectedStudent
    ? clubMembers.filter(
        (m) =>
          m.studentId === selectedStudent.id ||
          m.studentEmail === selectedStudent.email ||
          selectedStudent.clubMemberships?.some((cm) => cm.clubId === m.clubId)
      )
    : [];

  const studentComments = selectedStudent
    ? allComments.filter(
        (c) =>
          c.userId === selectedStudent.id ||
          c.userName.toLowerCase() === selectedStudent.name.toLowerCase()
      )
    : [];

  const studentAchievements = selectedStudent
    ? achievements.filter(
        (a) =>
          a.category === 'STUDENT' &&
          (a.studentName?.toLowerCase() === selectedStudent.name.toLowerCase() ||
            (a as any).studentId === selectedStudent.id)
      )
    : [];

  // Fallback demo RSVPs for student activity
  const studentEvents = selectedStudent
    ? events.slice(0, 3) // Demo registered events
    : [];

  if (selectedStudent) {
    const isBlocked = Boolean(selectedStudent.isBlocked || selectedStudent.isActive === false);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Back & Admin Disciplinary Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setSelectedStudentId(null)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Students ({students.length})</span>
          </button>

          <div className="flex items-center gap-3">
            {isBlocked ? (
              <button
                onClick={() =>
                  onOpenRestrictionModal(
                    'UNBLOCK',
                    'STUDENT',
                    selectedStudent.id,
                    selectedStudent.name
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Reinstate & Unblock Student</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  onOpenRestrictionModal(
                    'RESTRICT',
                    'STUDENT',
                    selectedStudent.id,
                    selectedStudent.name
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Suspend / Restrict Student Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Restriction Alert if Blocked */}
        {isBlocked && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Student Under Administrative Disciplinary Suspension
                </h4>
                {selectedStudent.blockedAt && (
                  <span className="text-[10px] text-rose-600">
                    Suspended on {new Date(selectedStudent.blockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-700 mt-1">
                <strong>Disciplinary Reason:</strong>{' '}
                {selectedStudent.blockReason || 'Disciplinary violation under review by the Dean of Student Affairs.'}
              </p>
              <p className="text-[11px] text-rose-600 mt-0.5">
                This student is currently barred from posting discussion comments, registering for new events, or applying for club leadership positions.
              </p>
            </div>
          </div>
        )}

        {/* Student Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-inner">
                {selectedStudent.avatar ? (
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <GraduationCap className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                    {selectedStudent.studentId || 'STU-MITS-2026'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {selectedStudent.year || '4th Year (Batch 2026)'}
                  </span>
                  {isBlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      SUSPENDED / BLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      GOOD STANDING
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-black text-slate-900">{selectedStudent.name}</h2>
                <p className="text-xs text-slate-500">{selectedStudent.department}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <div className="text-center px-3">
                <div className="text-lg font-black text-slate-900">
                  {studentMemberships.length > 0
                    ? studentMemberships.length
                    : selectedStudent.clubMemberships?.length || 1}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Clubs</div>
              </div>
              <div className="text-center px-3 border-x border-slate-200">
                <div className="text-lg font-black text-slate-900">{studentEvents.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">RSVPs</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black text-slate-900">{studentComments.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Comments</div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedStudent.email}</span>
            </div>
            {selectedStudent.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedStudent.phone}</span>
              </div>
            )}
            {selectedStudent.bio && (
              <div className="w-full text-slate-500 italic mt-1">
                "{selectedStudent.bio}"
              </div>
            )}
          </div>
        </div>

        {/* Activity Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveDossierTab('clubs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'clubs'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Club Memberships & Roles ({studentMemberships.length || 1})</span>
          </button>

          <button
            onClick={() => setActiveDossierTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'events'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Registrations & RSVPs ({studentEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveDossierTab('comments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'comments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discussion Activity & Comments ({studentComments.length})</span>
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
            <span>Student Honors ({studentAchievements.length})</span>
          </button>
        </div>

        {/* Tab 1: Clubs */}
        {activeDossierTab === 'clubs' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Clubs and Leadership Roles Held by {selectedStudent.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs.slice(0, 2).map((club, idx) => (
                <div
                  key={club.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 shrink-0 border border-slate-200">
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{club.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                        {idx === 0 ? 'Lead Executive' : 'Active Member'}
                      </span>
                    </div>
                    <p className="text-slate-500 line-clamp-2">{club.tagline}</p>
                    <div className="mt-2 text-[10px] text-slate-400">
                      Advisor: {club.facultyAdvisor || 'Academic Staff'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Event RSVPs */}
        {activeDossierTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Events Registered & Attended
              </h3>
              <span className="text-xs text-slate-500">
                Participation record for campus certificate eligibility.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                      {evt.clubName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      CONFIRMED RSVP
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Comments & Interactions (Admin Moderate Wrong Activity) */}
        {activeDossierTab === 'comments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Discussion Forum & Comment Activity
                </h3>
                <p className="text-xs text-slate-500">
                  All public interactions by this student. Admin has direct authority to delete or restrict inappropriate comments.
                </p>
              </div>
            </div>

            {studentComments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No discussion comments posted by this student yet.
              </div>
            ) : (
              <div className="space-y-3">
                {studentComments.map((comment) => {
                  const isCommentRestricted = Boolean(comment.isRestricted);

                  return (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCommentRestricted
                          ? 'bg-rose-50/60 border-rose-200'
                          : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              On Post: {comment.postTitle || 'Faculty Notice / Hackathon'}
                            </span>
                            {isCommentRestricted ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">
                                REMOVED BY ADMIN
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                                {comment.postCategory || 'Public Discussion'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(comment.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Admin Action */}
                        <div className="flex items-center gap-1.5">
                          {isCommentRestricted ? (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal(
                                  'UNBLOCK',
                                  'COMMENT',
                                  comment.id,
                                  `Comment by ${selectedStudent.name}`
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-700"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal(
                                  'RESTRICT',
                                  'COMMENT',
                                  comment.id,
                                  `Comment by ${selectedStudent.name}`
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1 hover:bg-rose-100"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Block Comment</span>
                            </button>
                          )}

                          {onDeleteComment && (
                            <button
                              onClick={() => onDeleteComment(comment.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete comment permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p
                        className={`text-xs p-3 rounded-xl ${
                          isCommentRestricted
                            ? 'bg-rose-100/50 text-rose-800 line-through'
                            : 'bg-slate-50 text-slate-700'
                        }`}
                      >
                        "{comment.content}"
                      </p>

                      {isCommentRestricted && comment.restrictionReason && (
                        <div className="text-[10px] text-rose-700 mt-1.5 font-semibold">
                          Reason: {comment.restrictionReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Achievements */}
        {activeDossierTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Student Accolades & Hackathon Trophies
            </h3>
            {studentAchievements.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No formal achievements submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentAchievements.map((ach) => (
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
                      <div className="text-[10px] text-slate-400">Awarded: {ach.date}</div>
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

  // Master Students List View
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by name, roll/student ID, department, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                Department: {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-white shadow-xs text-emerald-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('BLOCKED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'BLOCKED'
                  ? 'bg-white shadow-xs text-rose-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Suspended
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const isBlocked = Boolean(student.isBlocked || student.isActive === false);
          const commentsCount = allComments.filter(
            (c) =>
              c.userId === student.id ||
              c.userName.toLowerCase() === student.name.toLowerCase()
          ).length;

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isBlocked
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400 hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-inner">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isBlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        SUSPENDED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {student.studentId || 'STU-MITS'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {student.year || '4th Year'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {student.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {student.department}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {student.email}
                  </p>
                </div>

                {isBlocked && student.blockReason && (
                  <div className="p-2 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-[10px] mb-2 font-medium">
                    <strong>Reason:</strong> {student.blockReason}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    {commentsCount} comments
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

      {filteredStudents.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          No students found matching your criteria.
        </div>
      )}
    </div>
  );
};
