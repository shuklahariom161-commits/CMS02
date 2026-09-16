import React, { useState } from 'react';
import { Club, User, FacultyMember, FacultyPostItem, EventItem, CommentItem } from '../../../types';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Building2,
  GraduationCap,
  BookOpen,
  FileText,
  Calendar,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Filter,
} from 'lucide-react';

interface AdminModerationViewProps {
  clubs: Club[];
  students: User[];
  facultyList: FacultyMember[];
  facultyPosts: FacultyPostItem[];
  events: EventItem[];
  allComments: CommentItem[];
  onOpenRestrictionModal: (
    action: 'RESTRICT' | 'UNBLOCK',
    targetType: 'CLUB' | 'STUDENT' | 'FACULTY' | 'POST' | 'EVENT' | 'COMMENT',
    targetId: string,
    targetName: string
  ) => void;
  onDeleteComment?: (id: string) => void;
}

export const AdminModerationView: React.FC<AdminModerationViewProps> = ({
  clubs,
  students,
  facultyList,
  facultyPosts,
  events,
  allComments,
  onOpenRestrictionModal,
  onDeleteComment,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const restrictedClubs = clubs.filter((c) => c.isRestricted || !c.isActive);
  const restrictedStudents = students.filter((s) => s.isBlocked || s.isActive === false);
  const restrictedFaculty = facultyList.filter((f) => f.isRestricted);
  const restrictedPosts = facultyPosts.filter((p) => p.isRestricted || p.isPinned === false && (p as any).isRestricted);
  const restrictedEvents = events.filter((e) => e.isRestricted || !e.isPublished);
  const restrictedComments = allComments.filter((c) => c.isRestricted);

  const totalRestrictedCount =
    restrictedClubs.length +
    restrictedStudents.length +
    restrictedFaculty.length +
    restrictedPosts.length +
    restrictedEvents.length +
    restrictedComments.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Moderation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-rose-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-500/30 text-rose-300 shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-200 text-[10px] font-bold tracking-wide uppercase">
                  Collegiate Disciplinary Center
                </span>
                <span className="text-xs text-rose-200/80">Dean's Administrative Council</span>
              </div>
              <h2 className="text-xl font-black">Restricted & Blocked Activities Center</h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1">
                Centralized oversight for all blocked clubs, suspended students, restricted faculty notices, cancelled events, and flagged forum discussions.
              </p>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-xs px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0">
            <div className="text-2xl font-black text-rose-400">{totalRestrictedCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Restricted Items
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, reason, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({totalRestrictedCount})
          </button>
          <button
            onClick={() => setFilterType('CLUBS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'CLUBS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Clubs ({restrictedClubs.length})
          </button>
          <button
            onClick={() => setFilterType('STUDENTS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'STUDENTS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Students ({restrictedStudents.length})
          </button>
          <button
            onClick={() => setFilterType('POSTS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'POSTS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Posts ({restrictedPosts.length})
          </button>
          <button
            onClick={() => setFilterType('EVENTS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'EVENTS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Events ({restrictedEvents.length})
          </button>
          <button
            onClick={() => setFilterType('COMMENTS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === 'COMMENTS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Comments ({restrictedComments.length})
          </button>
        </div>
      </div>

      {totalRestrictedCount === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900">Campus Status Pristine</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no active disciplinary restrictions, blocked clubs, or flagged items across the college portal.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Restricted Clubs */}
          {(filterType === 'ALL' || filterType === 'CLUBS') && restrictedClubs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Restricted Clubs ({restrictedClubs.length})
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restrictedClubs.map((club) => (
                  <div
                    key={club.id}
                    className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                            {club.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{club.name}</span>
                        </div>

                        <button
                          onClick={() =>
                            onOpenRestrictionModal('UNBLOCK', 'CLUB', club.id, club.name)
                          }
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unblock Club</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-rose-900 mb-2">
                        <strong>Restriction Reason:</strong>{' '}
                        {club.restrictionReason || 'Violations of college event conduct guidelines.'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-rose-100 flex items-center justify-between">
                      <span>Advisor: {club.facultyAdvisor || 'Academic Staff'}</span>
                      {club.restrictedAt && (
                        <span>Flagged {new Date(club.restrictedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Suspended Students */}
          {(filterType === 'ALL' || filterType === 'STUDENTS') && restrictedStudents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Suspended / Restricted Students ({restrictedStudents.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restrictedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{student.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {student.studentId || 'STU-MITS'} • {student.department}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            onOpenRestrictionModal('UNBLOCK', 'STUDENT', student.id, student.name)
                          }
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Reinstate</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-rose-900 mb-2">
                        <strong>Disciplinary Reason:</strong>{' '}
                        {student.blockReason || 'Student disciplinary suspension.'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-rose-100 flex items-center justify-between">
                      <span>{student.email}</span>
                      {student.blockedAt && (
                        <span>Blocked {new Date(student.blockedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Restricted Faculty */}
          {(filterType === 'ALL' || filterType === 'FACULTY') && restrictedFaculty.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Restricted Faculty Accounts ({restrictedFaculty.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restrictedFaculty.map((faculty) => (
                  <div
                    key={faculty.id}
                    className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{faculty.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {faculty.designation} • {faculty.department}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            onOpenRestrictionModal('UNBLOCK', 'FACULTY', faculty.id, faculty.name)
                          }
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Reinstate</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-rose-900 mb-2">
                        <strong>Administrative Note:</strong>{' '}
                        {faculty.restrictionReason || 'Administrative audit pending.'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-rose-100">
                      <span>{faculty.email} • Cabin {faculty.cabin}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Restricted Posts */}
          {(filterType === 'ALL' || filterType === 'POSTS') && restrictedPosts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Blocked / Unpublished Notices & Posts ({restrictedPosts.length})
                </h3>
              </div>

              <div className="space-y-3">
                {restrictedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">
                          {post.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{post.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{post.content}</p>
                      {post.restrictionReason && (
                        <div className="text-[11px] text-rose-700 font-semibold">
                          Reason: {post.restrictionReason}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400">
                        Posted by {post.facultyName} ({post.department})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          onOpenRestrictionModal('UNBLOCK', 'POST', post.id, post.title)
                        }
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Restore Post</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Restricted Events */}
          {(filterType === 'ALL' || filterType === 'EVENTS') && restrictedEvents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Cancelled / Blocked Events ({restrictedEvents.length})
                </h3>
              </div>

              <div className="space-y-3">
                {restrictedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">
                          {evt.clubName}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {evt.date} • {evt.venue}
                      </div>
                      {evt.restrictionReason && (
                        <div className="text-[11px] text-rose-700 font-semibold">
                          Reason: {evt.restrictionReason}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        onOpenRestrictionModal('UNBLOCK', 'EVENT', evt.id, evt.title)
                      }
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Reinstate Event</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Restricted Comments */}
          {(filterType === 'ALL' || filterType === 'COMMENTS') && restrictedComments.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Flagged & Removed Discussion Comments ({restrictedComments.length})
                </h3>
              </div>

              <div className="space-y-3">
                {restrictedComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900">{comment.userName}</span>
                        <span className="text-slate-400">({comment.userRole})</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-rose-800 bg-white p-2.5 rounded-xl border border-rose-200 line-through">
                        "{comment.content}"
                      </p>
                      {comment.restrictionReason && (
                        <div className="text-[11px] text-rose-700 font-semibold">
                          Reason: {comment.restrictionReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          onOpenRestrictionModal('UNBLOCK', 'COMMENT', comment.id, `Comment by ${comment.userName}`)
                        }
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>

                      {onDeleteComment && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                          title="Permanently remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
