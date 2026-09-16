import React, { useState, useMemo } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Send,
  Search,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Award,
  Calendar,
  Building,
  MoreHorizontal,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { FacultyPostItem, FacultyMember, User } from '../../../types';

interface StudentFacultyPostsTabProps {
  user: User | null;
  profileName: string;
  profileAvatar: string;
  facultyPosts: FacultyPostItem[];
  facultyList: FacultyMember[];
  postLikesMap: Record<string, { total: number; hasLiked: boolean }>;
  postCommentsMap: Record<string, any[]>;
  activeCommentPostId: string | null;
  commentInput: string;
  submittingComment: boolean;
  onToggleLike: (postId: string) => void;
  onOpenComments: (postId: string) => void;
  onCommentInputChange: (val: string) => void;
  onAddComment: (postId: string) => void;
  onRefreshPosts?: () => void;
  isRefreshing?: boolean;
}

export const StudentFacultyPostsTab: React.FC<StudentFacultyPostsTabProps> = ({
  user,
  profileName,
  profileAvatar,
  facultyPosts,
  facultyList,
  postLikesMap,
  postCommentsMap,
  activeCommentPostId,
  commentInput,
  submittingComment,
  onToggleLike,
  onOpenComments,
  onCommentInputChange,
  onAddComment,
  onRefreshPosts,
  isRefreshing = false,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cms_saved_faculty_posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [doubleClickedHeartId, setDoubleClickedHeartId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = [
    'All',
    'Academic',
    'Research & Patents',
    'Hackathon / Contest',
    'Guest Lecture',
    'Exam & Guidelines',
  ];

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleBookmark = (postId: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
      try {
        localStorage.setItem('cms_saved_faculty_posts', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('Saved to your reading collection!');
  };

  const handleDoubleTapImage = (postId: string) => {
    setDoubleClickedHeartId(postId);
    setTimeout(() => setDoubleClickedHeartId(null), 800);
    const info = postLikesMap[postId];
    if (!info?.hasLiked) {
      onToggleLike(postId);
    }
  };

  const handleShare = (post: FacultyPostItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Faculty Circular from ${post.facultyName} (${post.department}): "${post.title}"\n${window.location.href}`
      );
      showToast('Circular link copied to clipboard!');
    }
  };

  const handleAddEmoji = (emoji: string) => {
    onCommentInputChange((commentInput ? commentInput + ' ' : '') + emoji);
  };

  // Filtered stream
  const filteredPosts = useMemo(() => {
    return facultyPosts.filter((post) => {
      const matchCat =
        categoryFilter === 'All' ||
        post.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchDept =
        deptFilter === 'All' ||
        post.department.toLowerCase().includes(deptFilter.toLowerCase());
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.facultyName.toLowerCase().includes(q) ||
        post.department.toLowerCase().includes(q);
      return matchCat && matchDept && matchSearch;
    });
  }, [facultyPosts, categoryFilter, deptFilter, search]);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100/80 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Faculty Social Board</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Faculty Posts & Department Feed
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Whenever professors and heads of departments publish circulars, research opportunities, or academic notices, they appear here. Engage directly via likes, comments, and inquiries!
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            {onRefreshPosts && (
              <button
                onClick={onRefreshPosts}
                disabled={isRefreshing}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                title="Refresh faculty posts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
                <span>{isRefreshing ? 'Loading Posts...' : 'Refresh Feed'}</span>
              </button>
            )}

            <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>{facultyPosts.length} Faculty Updates</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="All">All Departments</option>
              {departments.filter((d) => d !== 'All').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notices or faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stream of Big Instagram-like Cards */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs max-w-2xl mx-auto">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No faculty posts found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your department or category filters. Whenever faculty members publish announcements, they appear right here in this feed!
          </p>
          {(search || categoryFilter !== 'All' || deptFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setDeptFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">
          {filteredPosts.map((post) => {
            const likesInfo = postLikesMap[post.id] || {
              total: post.likesCount || 0,
              hasLiked: false,
            };
            const isCommentsOpen = activeCommentPostId === post.id;
            const currentComments = postCommentsMap[post.id] || [];
            const isBookmarked = bookmarkedIds.includes(post.id);

            // Determine faculty member avatar
            const facultyObj = facultyList.find(
              (f) => f.id === post.facultyId || f.name.toLowerCase() === post.facultyName.toLowerCase()
            );
            const facultyImg =
              (post as any).facultyAvatar ||
              facultyObj?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.facultyName
              )}&background=4f46e5&color=fff&size=160`;

            const cardMediaImage =
              post.image ||
              (post as any).imageUrl;

            return (
              <article
                key={post.id}
                id={`post-card-${post.id}`}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* 1. Instagram-Style Header */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Faculty Profile Picture with Instagram-like Gradient Ring */}
                    <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 shadow-xs shrink-0">
                      <div className="p-0.5 bg-white rounded-full">
                        <img
                          src={facultyImg}
                          alt={post.facultyName}
                          className="w-11 h-11 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {post.facultyName}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100" />
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80 ml-1">
                          Faculty
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {post.department} •{' '}
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>

                  {/* Category Pill & Dot Menu */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {post.category}
                    </span>
                    <button
                      onClick={() => handleShare(post)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Share options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. BIG CARD MEDIA (Instagram style) */}
                <div
                  className="relative w-full overflow-hidden bg-slate-900 cursor-pointer select-none"
                  onDoubleClick={() => handleDoubleTapImage(post.id)}
                >
                  {cardMediaImage ? (
                    <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden bg-slate-100">
                      <img
                        src={cardMediaImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    /* Fallback High-Impact Visual Banner for Notice/Research Posts */
                    <div className="relative aspect-16/9 w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col justify-between text-white overflow-hidden">
                      {/* Geometric background accents */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                          <Building className="w-4 h-4" />
                          <span>MITS Gwalior · Department Official Circular</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 border border-white/10">
                          {post.category}
                        </span>
                      </div>

                      <div className="relative z-10 space-y-2 my-auto py-3">
                        <h4 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight">
                          {post.title}
                        </h4>
                        <p className="text-xs text-indigo-100/80 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200/80">
                        <span>Issued by {post.facultyName}</span>
                        <span>Official Communication</span>
                      </div>
                    </div>
                  )}

                  {/* Double Click Animated Heart Popup */}
                  {doubleClickedHeartId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
                      <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-pulse" />
                    </div>
                  )}
                </div>

                {/* 3. Instagram-Style Action Bar */}
                <div className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center justify-between">
                    {/* Left Actions (Like, Comment, Share) */}
                    <div className="flex items-center gap-4">
                      {/* Like Heart Button */}
                      <button
                        id={`btn-like-${post.id}`}
                        onClick={() => onToggleLike(post.id)}
                        className="group flex items-center gap-1.5 transition-transform active:scale-125 cursor-pointer"
                        title="Like post"
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${
                            likesInfo.hasLiked
                              ? 'fill-rose-500 text-rose-500 scale-110'
                              : 'text-slate-700 hover:text-rose-500'
                          }`}
                        />
                      </button>

                      {/* Comment Speech Bubble Button */}
                      <button
                        id={`btn-comment-${post.id}`}
                        onClick={() => onOpenComments(post.id)}
                        className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="View and add comments"
                      >
                        <MessageSquare className="w-6 h-6" />
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => handleShare(post)}
                        className="text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Share notice"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Right Action (Bookmark) */}
                    <button
                      onClick={() => handleToggleBookmark(post.id)}
                      className={`cursor-pointer transition-colors ${
                        isBookmarked
                          ? 'text-indigo-600 fill-indigo-600'
                          : 'text-slate-700 hover:text-indigo-600'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
                    </button>
                  </div>

                  {/* Likes Count Line */}
                  <div className="mt-3 text-xs font-bold text-slate-900">
                    {likesInfo.total === 0 ? (
                      <span className="text-slate-500 font-normal">Be the first student to like this post</span>
                    ) : (
                      <span>
                        Liked by{' '}
                        <span className="text-slate-900 font-extrabold">
                          {likesInfo.hasLiked ? (profileName || 'You') : 'MITS Students'}
                        </span>
                        {likesInfo.total > 1 && (
                          <>
                            {' '}
                            and{' '}
                            <span className="text-slate-900 font-extrabold">
                              {likesInfo.total - 1} {likesInfo.total - 1 === 1 ? 'other' : 'others'}
                            </span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Caption & Post Content */}
                  <div className="mt-2 space-y-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <p>
                      <span className="font-bold text-slate-950 mr-2">{post.facultyName}</span>
                      <span className="font-semibold text-slate-900">{post.title}</span>
                    </p>
                    <p className="text-xs sm:text-[13px] text-slate-600 whitespace-pre-line pt-0.5">
                      {post.content}
                    </p>

                    {post.link && (
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1"
                      >
                        <span>Official Notice / Attachment Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Comments Count / Toggle text */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onOpenComments(post.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      {currentComments.length > 0
                        ? `View all ${currentComments.length} comments`
                        : 'No comments yet • Leave a query or response'}
                    </button>
                  </div>
                </div>

                {/* 4. Instagram-Style Expandable Comments Section */}
                {isCommentsOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 bg-slate-50/70 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                    {/* Comments List */}
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {currentComments.map((cmt: any) => (
                        <div
                          key={cmt.id}
                          className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs shadow-2xs"
                        >
                          <img
                            src={
                              cmt.userAvatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                cmt.userName || 'Student'
                              )}&background=6366f1&color=fff&size=60`
                            }
                            alt={cmt.userName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{cmt.userName}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                                    cmt.userRole === 'FACULTY'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-indigo-100 text-indigo-800'
                                  }`}
                                >
                                  {cmt.userRole}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {cmt.createdAt
                                  ? new Date(cmt.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Just now'}
                              </span>
                            </div>
                            <p className="text-slate-700 mt-0.5 leading-relaxed">{cmt.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Emojis Bar */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {['❤️', '👏', '🔥', '💡', '🎓', '👍', '🙌'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAddEmoji(emoji)}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {/* Instagram Comment Input Box */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
                      <img
                        src={profileAvatar}
                        alt="Your profile"
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => onCommentInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onAddComment(post.id);
                          }
                        }}
                        placeholder={`Add a comment for ${post.facultyName}...`}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-800 placeholder:text-slate-400"
                      />
                      <button
                        onClick={() => onAddComment(post.id)}
                        disabled={submittingComment || !commentInput.trim()}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        {submittingComment ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
