import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Club,
  User,
  FacultyMember,
  EventItem,
  FacultyPostItem,
  HiringItem,
  AchievementItem,
  CommentItem,
  ClubMembership,
  ActivityLogItem,
} from '../../types';
import { MITS_FACULTY_DIRECTORY } from '../../data/mitsFaculty';
import { mitsClubs } from '../../data/mitsClubs';
import { AdminOverviewView } from './admin/AdminOverviewView';
import { AdminClubsView } from './admin/AdminClubsView';
import { AdminStudentsView } from './admin/AdminStudentsView';
import { AdminFacultyView } from './admin/AdminFacultyView';
import { AdminModerationView } from './admin/AdminModerationView';
import { AdminAuditView } from './admin/AdminAuditView';
import { AdminRestrictionModal } from './admin/AdminRestrictionModal';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  Lock,
  Unlock,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Clock,
  Sparkles,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onNavigate?: (page: string) => void;
  initialTab?: 'overview' | 'clubs' | 'students' | 'faculty' | 'moderation' | 'audit';
}

const INITIAL_AUDIT_LOGS: ActivityLogItem[] = [
  {
    id: 'log_01',
    actionType: 'RESTRICT_EVENT',
    targetType: 'EVENT',
    targetId: 'evt_04',
    targetName: 'Late Night Unapproved DJ & Rave',
    reason: 'Campus curfew and decibel violation outside permitted student center hours',
    adminName: 'Dr. Arthur Vance (Dean)',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'log_02',
    actionType: 'RESTRICT_POST',
    targetType: 'POST',
    targetId: 'pst_03',
    targetName: 'Third Party Commercial Course Promotion',
    reason: 'Unauthorized commercial advertisement posted without Dean academic review',
    adminName: 'Dr. Arthur Vance (Dean)',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'log_03',
    actionType: 'UNBLOCK_CLUB',
    targetType: 'CLUB',
    targetId: 'club_aeromodelling',
    targetName: 'Aeromodelling Club',
    reason: 'Reinstated after submission of verified faculty safety advisor audit report',
    adminName: 'Dr. Arthur Vance (Dean)',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateHome,
  onNavigate,
  initialTab = 'overview',
}) => {
  const { user, logout, token } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'clubs' | 'students' | 'faculty' | 'moderation' | 'audit'
  >(initialTab);

  // Core Data State
  const [clubs, setClubs] = useState<Club[]>(mitsClubs);
  const [students, setStudents] = useState<User[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(MITS_FACULTY_DIRECTORY);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [facultyPosts, setFacultyPosts] = useState<FacultyPostItem[]>([]);
  const [allComments, setAllComments] = useState<CommentItem[]>([]);
  const [hiring, setHiring] = useState<HiringItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [clubMembers, setClubMembers] = useState<ClubMembership[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_AUDIT_LOGS);

  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackToast, setFeedbackToast] = useState<{
    message: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  // Modal State for Restricting / Unblocking
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'RESTRICT' | 'UNBLOCK';
    targetType: 'CLUB' | 'STUDENT' | 'FACULTY' | 'POST' | 'EVENT' | 'COMMENT' | 'HIRING';
    targetId: string;
    targetName: string;
    loading: boolean;
  }>({
    isOpen: false,
    action: 'RESTRICT',
    targetType: 'CLUB',
    targetId: '',
    targetName: '',
    loading: false,
  });

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  // Initial Data Fetch
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        clubsRes,
        usersRes,
        facultyRes,
        eventsRes,
        postsRes,
        commentsRes,
        hiringRes,
        achievementsRes,
        membersRes,
      ] = await Promise.all([
        api.getClubs(),
        api.getUsers('ALL'),
        api.getFaculty(),
        api.getEvents(),
        api.getFacultyPosts(),
        api.getAllComments(),
        api.getHiring(),
        api.getAchievements(),
        api.getClubMembers(),
      ]);

      if (clubsRes.success && clubsRes.data && clubsRes.data.length > 0) {
        setClubs(clubsRes.data);
      }
      if (usersRes.success && usersRes.data) {
        const studentUsers = usersRes.data.filter((u) => u.role === 'STUDENT');
        setStudents(studentUsers.length > 0 ? studentUsers : usersRes.data);
      }
      if (facultyRes.success && facultyRes.data && facultyRes.data.length > 0) {
        setFacultyList(facultyRes.data);
      }
      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
      }
      if (postsRes.success && postsRes.data) {
        setFacultyPosts(postsRes.data);
      }
      if (commentsRes.success && commentsRes.data) {
        setAllComments(commentsRes.data);
      }
      if (hiringRes.success && hiringRes.data) {
        setHiring(hiringRes.data);
      }
      if (achievementsRes.success && achievementsRes.data) {
        setAchievements(achievementsRes.data);
      }
      if (membersRes.success && membersRes.data) {
        setClubMembers(membersRes.data);
      }
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Open Modal Helper
  const handleOpenRestrictionModal = (
    action: 'RESTRICT' | 'UNBLOCK',
    targetType: 'CLUB' | 'STUDENT' | 'FACULTY' | 'POST' | 'EVENT' | 'COMMENT' | 'HIRING',
    targetId: string,
    targetName: string
  ) => {
    setModalState({
      isOpen: true,
      action,
      targetType,
      targetId,
      targetName,
      loading: false,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, loading: false }));
  };

  // Confirm Administrative Action (Block / Unblock)
  const handleConfirmAction = async (reason: string) => {
    const { action, targetType, targetId, targetName } = modalState;
    const isRestricting = action === 'RESTRICT';
    const currentToken = token || localStorage.getItem('token') || '';

    setModalState((prev) => ({ ...prev, loading: true }));

    try {
      if (targetType === 'CLUB') {
        const res = await api.updateClub(
          targetId,
          {
            isActive: !isRestricting,
            isRestricted: isRestricting,
            restrictionReason: isRestricting ? reason : undefined,
            restrictedAt: isRestricting ? new Date().toISOString() : undefined,
          },
          currentToken
        );
        if (res.success) {
          setClubs((prev) =>
            prev.map((c) =>
              c.id === targetId
                ? {
                    ...c,
                    isActive: !isRestricting,
                    isRestricted: isRestricting,
                    restrictionReason: isRestricting ? reason : undefined,
                    restrictedAt: isRestricting ? new Date().toISOString() : undefined,
                  }
                : c
            )
          );
        }
      } else if (targetType === 'STUDENT') {
        const res = await api.updateUser(
          targetId,
          {
            isActive: !isRestricting,
            isBlocked: isRestricting,
            blockReason: isRestricting ? reason : undefined,
            blockedAt: isRestricting ? new Date().toISOString() : undefined,
          },
          currentToken
        );
        if (res.success) {
          setStudents((prev) =>
            prev.map((s) =>
              s.id === targetId
                ? {
                    ...s,
                    isActive: !isRestricting,
                    isBlocked: isRestricting,
                    blockReason: isRestricting ? reason : undefined,
                    blockedAt: isRestricting ? new Date().toISOString() : undefined,
                  }
                : s
            )
          );
        }
      } else if (targetType === 'FACULTY') {
        setFacultyList((prev) =>
          prev.map((f) =>
            f.id === targetId
              ? {
                  ...f,
                  isRestricted: isRestricting,
                  restrictionReason: isRestricting ? reason : undefined,
                  restrictedAt: isRestricting ? new Date().toISOString() : undefined,
                }
              : f
          )
        );
      } else if (targetType === 'POST') {
        const res = await api.updateFacultyPost(
          targetId,
          {
            isRestricted: isRestricting,
            restrictionReason: isRestricting ? reason : undefined,
            restrictedAt: isRestricting ? new Date().toISOString() : undefined,
          },
          currentToken
        );
        if (res.success) {
          setFacultyPosts((prev) =>
            prev.map((p) =>
              p.id === targetId
                ? {
                    ...p,
                    isRestricted: isRestricting,
                    restrictionReason: isRestricting ? reason : undefined,
                    restrictedAt: isRestricting ? new Date().toISOString() : undefined,
                  }
                : p
            )
          );
        }
      } else if (targetType === 'EVENT') {
        const res = await api.updateEvent(
          targetId,
          {
            isPublished: !isRestricting,
            isRestricted: isRestricting,
            restrictionReason: isRestricting ? reason : undefined,
            restrictedAt: isRestricting ? new Date().toISOString() : undefined,
          },
          currentToken
        );
        if (res.success) {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === targetId
                ? {
                    ...e,
                    isPublished: !isRestricting,
                    isRestricted: isRestricting,
                    restrictionReason: isRestricting ? reason : undefined,
                    restrictedAt: isRestricting ? new Date().toISOString() : undefined,
                  }
                : e
            )
          );
        }
      } else if (targetType === 'COMMENT') {
        const res = await api.updateComment(
          targetId,
          {
            isRestricted: isRestricting,
            restrictionReason: isRestricting ? reason : undefined,
          },
          currentToken
        );
        if (res.success) {
          setAllComments((prev) =>
            prev.map((c) =>
              c.id === targetId
                ? {
                    ...c,
                    isRestricted: isRestricting,
                    restrictionReason: isRestricting ? reason : undefined,
                  }
                : c
            )
          );
        }
      } else if (targetType === 'HIRING') {
        const res = await api.updateHiring(
          targetId,
          {
            isRestricted: isRestricting,
            restrictionReason: isRestricting ? reason : undefined,
          },
          currentToken
        );
        if (res.success) {
          setHiring((prev) =>
            prev.map((h) =>
              h.id === targetId
                ? {
                    ...h,
                    isRestricted: isRestricting,
                    restrictionReason: isRestricting ? reason : undefined,
                  }
                : h
            )
          );
        }
      }

      // Add to Administrative Audit Logs
      const newLog: ActivityLogItem = {
        id: 'log_' + Date.now(),
        actionType: (isRestricting ? `RESTRICT_${targetType}` : `UNBLOCK_${targetType}`) as any,
        targetType: targetType as any,
        targetId,
        targetName,
        reason,
        adminName: user?.name || 'Dr. Arthur Vance (Dean)',
        timestamp: new Date().toISOString(),
      };
      setActivityLogs((prev) => [newLog, ...prev]);

      showToast(
        isRestricting
          ? `Disciplinary restriction applied to ${targetType.toLowerCase()} "${targetName}".`
          : `Reinstated active privileges for ${targetType.toLowerCase()} "${targetName}".`,
        isRestricting ? 'warning' : 'success'
      );
    } catch (err) {
      console.error('Error executing admin action:', err);
      showToast('Action failed. Please check server status.', 'error');
    } finally {
      handleCloseModal();
    }
  };

  // Permanent Delete Handlers
  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Permanently delete this event from the college database?')) return;
    try {
      const currentToken = token || localStorage.getItem('token') || '';
      await api.deleteEvent(id, currentToken);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast('Event permanently deleted.', 'warning');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFacultyPost = async (id: string) => {
    if (!window.confirm('Permanently remove this faculty post?')) return;
    try {
      const currentToken = token || localStorage.getItem('token') || '';
      await api.deleteFacultyPost(id, currentToken);
      setFacultyPosts((prev) => prev.filter((p) => p.id !== id));
      showToast('Faculty post permanently removed.', 'warning');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Delete this comment from discussion thread?')) return;
    try {
      const currentToken = token || localStorage.getItem('token') || '';
      await api.deleteComment(id, currentToken);
      setAllComments((prev) => prev.filter((c) => c.id !== id));
      showToast('Comment deleted from record.', 'warning');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHiring = async (id: string) => {
    if (!window.confirm('Delete this recruitment opening?')) return;
    try {
      const currentToken = token || localStorage.getItem('token') || '';
      await api.deleteHiring(id, currentToken);
      setHiring((prev) => prev.filter((h) => h.id !== id));
      showToast('Recruitment posting deleted.', 'warning');
    } catch (err) {
      console.error(err);
    }
  };

  // Counts for Badges
  const restrictedTotal =
    clubs.filter((c) => c.isRestricted || !c.isActive).length +
    students.filter((s) => s.isBlocked || s.isActive === false).length +
    facultyList.filter((f) => f.isRestricted).length +
    facultyPosts.filter((p) => p.isRestricted).length +
    events.filter((e) => e.isRestricted || !e.isPublished).length +
    allComments.filter((c) => c.isRestricted).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold text-white ${
              feedbackToast.type === 'warning'
                ? 'bg-amber-600 border-amber-500'
                : feedbackToast.type === 'error'
                ? 'bg-rose-600 border-rose-500'
                : 'bg-emerald-600 border-emerald-500'
            }`}
          >
            {feedbackToast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackToast.message}</span>
          </div>
        </div>
      )}

      {/* Admin Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Admin Identity */}
            <div className="flex items-center gap-4">
              <div
                onClick={onNavigateHome}
                className="flex items-center gap-2 cursor-pointer group"
                title="Go to Public Portal"
              >
                <img
                  src="/campusone-mits-logo.svg"
                  alt="CampusOne · MITS Gwalior"
                  className="h-9 w-auto max-w-[200px] object-contain transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-200" />

              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">
                      {user?.name || 'Dr. Arthur Vance (Dean)'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-extrabold uppercase tracking-wider">
                      COLLEGE DEAN & ADMIN
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Authority: Disciplinary Oversight & Charter Governance
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Global Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Sync All Campus Records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                <span className="hidden md:inline">Sync Data</span>
              </button>

              <button
                onClick={onNavigateHome}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Public Site</span>
              </button>

              <button
                onClick={logout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-100 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Command Pulse</span>
            </button>

            <button
              onClick={() => setActiveTab('clubs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'clubs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>All Clubs ({clubs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>All Students ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'faculty'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>All Faculty ({facultyList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'moderation'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Restricted Activities</span>
              {restrictedTotal > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    activeTab === 'moderation'
                      ? 'bg-white text-rose-700'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {restrictedTotal}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'audit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Audit Log ({activityLogs.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <AdminOverviewView
            clubs={clubs}
            students={students}
            facultyList={facultyList}
            events={events}
            facultyPosts={facultyPosts}
            activityLogs={activityLogs}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'clubs' && (
          <AdminClubsView
            clubs={clubs}
            events={events}
            hiring={hiring}
            achievements={achievements}
            clubMembers={clubMembers}
            onOpenRestrictionModal={handleOpenRestrictionModal}
            onDeleteEvent={handleDeleteEvent}
            onDeleteHiring={handleDeleteHiring}
          />
        )}

        {activeTab === 'students' && (
          <AdminStudentsView
            students={students}
            clubs={clubs}
            events={events}
            allComments={allComments}
            achievements={achievements}
            clubMembers={clubMembers}
            onOpenRestrictionModal={handleOpenRestrictionModal}
            onDeleteComment={handleDeleteComment}
          />
        )}

        {activeTab === 'faculty' && (
          <AdminFacultyView
            facultyList={facultyList}
            facultyPosts={facultyPosts}
            allComments={allComments}
            clubs={clubs}
            onOpenRestrictionModal={handleOpenRestrictionModal}
            onDeleteFacultyPost={handleDeleteFacultyPost}
          />
        )}

        {activeTab === 'moderation' && (
          <AdminModerationView
            clubs={clubs}
            students={students}
            facultyList={facultyList}
            facultyPosts={facultyPosts}
            events={events}
            allComments={allComments}
            onOpenRestrictionModal={handleOpenRestrictionModal}
            onDeleteComment={handleDeleteComment}
          />
        )}

        {activeTab === 'audit' && (
          <AdminAuditView
            activityLogs={activityLogs}
            onClearLogs={() => setActivityLogs([])}
          />
        )}
      </main>

      {/* Restriction / Moderation Modal */}
      <AdminRestrictionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        action={modalState.action}
        targetType={modalState.targetType}
        targetName={modalState.targetName}
        loading={modalState.loading}
      />
    </div>
  );
};
