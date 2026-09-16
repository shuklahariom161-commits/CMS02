import React, { useState } from 'react';
import { FacultyMember, FacultyPostItem, CommentItem, Club } from '../../../types';
import {
  BookOpen,
  FileText,
  MessageSquare,
  Building2,
  Search,
  Lock,
  Unlock,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ExternalLink,
  Clock,
  Pin,
  GraduationCap,
} from 'lucide-react';

interface AdminFacultyViewProps {
  facultyList: FacultyMember[];
  facultyPosts: FacultyPostItem[];
  allComments: CommentItem[];
  clubs: Club[];
  onOpenRestrictionModal: (
    action: 'RESTRICT' | 'UNBLOCK',
    targetType: 'FACULTY' | 'POST',
    targetId: string,
    targetName: string
  ) => void;
  onDeleteFacultyPost?: (id: string) => void;
}

export const AdminFacultyView: React.FC<AdminFacultyViewProps> = ({
  facultyList,
  facultyPosts,
  allComments,
  clubs,
  onOpenRestrictionModal,
  onDeleteFacultyPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESTRICTED'>('ALL');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<'posts' | 'comments' | 'clubs'>('posts');

  const selectedFaculty = facultyList.find((f) => f.id === selectedFacultyId);

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Centre for Artificial Intelligence',
  ];

  const filteredFaculty = facultyList.filter((faculty) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      faculty.name.toLowerCase().includes(query) ||
      faculty.email.toLowerCase().includes(query) ||
      faculty.designation.toLowerCase().includes(query) ||
      faculty.department.toLowerCase().includes(query) ||
      faculty.cabin.toLowerCase().includes(query);

    const matchesDept = departmentFilter === 'All' || faculty.department === departmentFilter;
    const isRestricted = Boolean(faculty.isRestricted);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !isRestricted) ||
      (statusFilter === 'RESTRICTED' && isRestricted);

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Selected faculty activity
  const postsBySelectedFaculty = selectedFaculty
    ? facultyPosts.filter(
        (p) =>
          p.facultyId === selectedFaculty.id ||
          p.facultyName.toLowerCase() === selectedFaculty.name.toLowerCase()
      )
    : [];

  const postIds = new Set(postsBySelectedFaculty.map((p) => p.id));
  const commentsOnFacultyPosts = allComments.filter((c) => postIds.has(c.postId));

  const advisedClubsList = selectedFaculty
    ? clubs.filter(
        (c) =>
          c.facultyAdvisor?.toLowerCase().includes(selectedFaculty.name.toLowerCase()) ||
          selectedFaculty.advisedClubs?.includes(c.name)
      )
    : [];

  if (selectedFaculty) {
    const isRestricted = Boolean(selectedFaculty.isRestricted);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Back & Admin Disciplinary Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setSelectedFacultyId(null)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Faculty ({facultyList.length})</span>
          </button>

          <div className="flex items-center gap-3">
            {isRestricted ? (
              <button
                onClick={() =>
                  onOpenRestrictionModal(
                    'UNBLOCK',
                    'FACULTY',
                    selectedFaculty.id,
                    selectedFaculty.name
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Reinstate Faculty Privileges</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  onOpenRestrictionModal(
                    'RESTRICT',
                    'FACULTY',
                    selectedFaculty.id,
                    selectedFaculty.name
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Issue Disciplinary Restriction</span>
              </button>
            )}
          </div>
        </div>

        {/* Restriction Alert */}
        {isRestricted && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Faculty Account Under Disciplinary Audit
                </h4>
                {selectedFaculty.restrictedAt && (
                  <span className="text-[10px] text-rose-600">
                    Restricted on {new Date(selectedFaculty.restrictedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-700 mt-1">
                <strong>Disciplinary Reason:</strong>{' '}
                {selectedFaculty.restrictionReason || 'Under administrative inquiry for collegiate publishing standards.'}
              </p>
              <p className="text-[11px] text-rose-600 mt-0.5">
                Posting new circulars or approving club funding by this faculty account is paused.
              </p>
            </div>
          </div>
        )}

        {/* Faculty Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-inner">
                {selectedFaculty.avatar ? (
                  <img
                    src={selectedFaculty.avatar}
                    alt={selectedFaculty.name}
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
                    {selectedFaculty.designation}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    Cabin {selectedFaculty.cabin}
                  </span>
                  {isRestricted ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      RESTRICTED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-black text-slate-900">{selectedFaculty.name}</h2>
                <p className="text-xs text-slate-500">{selectedFaculty.department}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Qualification: {selectedFaculty.qualification}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <div className="text-center px-3">
                <div className="text-lg font-black text-slate-900">{postsBySelectedFaculty.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Notices</div>
              </div>
              <div className="text-center px-3 border-x border-slate-200">
                <div className="text-lg font-black text-slate-900">{commentsOnFacultyPosts.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Comments</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black text-slate-900">{advisedClubsList.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Advised</div>
              </div>
            </div>
          </div>

          {/* Contact Details & Specializations */}
          <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedFaculty.email}</span>
              </div>
              {selectedFaculty.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedFaculty.phone}</span>
                </div>
              )}
            </div>

            {selectedFaculty.specialization && selectedFaculty.specialization.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedFaculty.specialization.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveDossierTab('posts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'posts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Published Posts & Hackathons ({postsBySelectedFaculty.length})</span>
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
            <span>Discussion Threads & Student Replies ({commentsOnFacultyPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveDossierTab('clubs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDossierTab === 'clubs'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Advised Clubs ({advisedClubsList.length})</span>
          </button>
        </div>

        {/* Tab 1: Posts & Moderation */}
        {activeDossierTab === 'posts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  All Posts & Circulars Published by {selectedFaculty.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Admin can inspect and restrict any post violating college guidelines or advertising unverified links.
                </p>
              </div>
            </div>

            {postsBySelectedFaculty.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No posts published by this faculty member yet.
              </div>
            ) : (
              <div className="space-y-4">
                {postsBySelectedFaculty.map((post) => {
                  const isPostRestricted = Boolean(post.isRestricted);

                  return (
                    <div
                      key={post.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isPostRestricted
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                            {post.category}
                          </span>
                          {post.postType && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                              {post.postType}
                            </span>
                          )}
                          {isPostRestricted ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-extrabold text-[10px] flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              RESTRICTED / UNPUBLISHED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              LIVE
                            </span>
                          )}
                        </div>

                        {/* Admin Action */}
                        <div className="flex items-center gap-1.5">
                          {isPostRestricted ? (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal('UNBLOCK', 'POST', post.id, post.title)
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Restore Post</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onOpenRestrictionModal('RESTRICT', 'POST', post.id, post.title)
                              }
                              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1 hover:bg-rose-100 transition-colors"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Restrict Post</span>
                            </button>
                          )}

                          {onDeleteFacultyPost && (
                            <button
                              onClick={() => onDeleteFacultyPost(post.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete post permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-1">{post.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3 whitespace-pre-line">
                        {post.content}
                      </p>

                      {isPostRestricted && post.restrictionReason && (
                        <div className="p-2.5 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-[11px] mb-3">
                          <strong>Admin Disciplinary Note:</strong> {post.restrictionReason}
                        </div>
                      )}

                      {post.image && (
                        <div className="mb-3 max-w-sm rounded-xl overflow-hidden border border-slate-200">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-36 object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {post.commentsCount || 0} comments
                          </span>
                        </div>

                        {post.link && (
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
                          >
                            <span>External Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Comments on Faculty Posts */}
        {activeDossierTab === 'comments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Student Queries & Interaction on {selectedFaculty.name}'s Posts
            </h3>

            {commentsOnFacultyPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No student comments on this faculty member's posts yet.
              </div>
            ) : (
              <div className="space-y-3">
                {commentsOnFacultyPosts.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.userName} ({c.userRole})</span>
                      <span className="text-[11px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{c.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Advised Clubs */}
        {activeDossierTab === 'clubs' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Clubs Supervised by {selectedFaculty.name}
            </h3>

            {advisedClubsList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Not currently registered as primary faculty advisor for any specific club.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advisedClubsList.map((c) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 shrink-0 border border-slate-200">
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <p className="text-slate-500 line-clamp-1">{c.tagline}</p>
                      <div className="text-[10px] text-indigo-600 font-semibold mt-1">
                        Category: {c.category} • {c.memberCount} Members
                      </div>
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

  // Master Faculty List View
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, department, designation, or cabin..."
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
              All ({facultyList.length})
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
              onClick={() => setStatusFilter('RESTRICTED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'RESTRICTED'
                  ? 'bg-white shadow-xs text-rose-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Restricted
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((faculty) => {
          const isRestricted = Boolean(faculty.isRestricted);
          const publishedCount = facultyPosts.filter(
            (p) =>
              p.facultyId === faculty.id ||
              p.facultyName.toLowerCase() === faculty.name.toLowerCase()
          ).length;

          return (
            <div
              key={faculty.id}
              onClick={() => setSelectedFacultyId(faculty.id)}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isRestricted
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400 hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-inner">
                    {faculty.avatar ? (
                      <img
                        src={faculty.avatar}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-slate-400" />
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

                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {faculty.designation}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      Cabin {faculty.cabin}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {faculty.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {faculty.department}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {faculty.email}
                  </p>
                </div>

                {isRestricted && faculty.restrictionReason && (
                  <div className="p-2 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-[10px] mb-2 font-medium">
                    <strong>Reason:</strong> {faculty.restrictionReason}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    {publishedCount} notices
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

      {filteredFaculty.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          No faculty members found matching your search.
        </div>
      )}
    </div>
  );
};
