import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  FacultyPostItem,
  FacultyMember,
  HiringItem,
  EventItem,
  Club,
  AchievementItem,
} from '../../types';
import { MITS_FACULTY_DIRECTORY, MITS_DEPARTMENTS, MITS_DESIGNATIONS } from '../../data/mitsFaculty';
import { mitsClubs } from '../../data/mitsClubs';
import { StudentHomeTab } from './student/StudentHomeTab';
import { StudentClubsTab } from './student/StudentClubsTab';
import { StudentAchievementsTab } from './student/StudentAchievementsTab';
import { StudentAboutTab } from './student/StudentAboutTab';
import { StudentEventsTab } from './student/StudentEventsTab';
import { StudentFacultyPostsTab } from './student/StudentFacultyPostsTab';
import { StudentOpportunitiesTab } from './student/StudentOpportunitiesTab';
import { StudentProfileTab } from './student/StudentProfileTab';
import {
  FileText,
  Users,
  Briefcase,
  Calendar,
  User,
  Heart,
  MessageSquare,
  Send,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Award,
  Search,
  CheckCircle2,
  Bookmark,
  Camera,
  Upload,
  Globe,
  Github,
  Linkedin,
  X,
  ChevronRight,
  Filter,
  Check,
  Share2,
  Trash2,
  MessageCircle,
  Info,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateHome: () => void;
  onNavigate?: (page: string) => void;
  initialTab?: 'events' | 'faculty-posts' | 'opportunities' | 'profile' | 'home' | 'clubs' | 'faculty' | 'achievements' | 'about' | 'upcoming-events' | string;
  onSwitchToLeader?: () => void;
}

interface StudentMessageRecord {
  id: string;
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
  facultyDept: string;
  subject: string;
  topic: string;
  content: string;
  sentAt: string;
  status: 'Sent' | 'Delivered' | 'Replied';
  replyContent?: string;
  replyAt?: string;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateHome,
  onNavigate,
  initialTab = 'home',
  onSwitchToLeader,
}) => {
  const { user, token, logout, updateUser } = useAuth();

  const resolveInitialTab = (tab: string): 'events' | 'faculty-posts' | 'opportunities' | 'profile' | 'home' | 'clubs' | 'faculty' | 'achievements' | 'about' => {
    if (tab === 'events' || tab === 'upcoming-events') return 'events';
    if (tab === 'faculty-posts' || tab === 'faculty') return 'faculty-posts';
    if (tab === 'opportunities' || tab === 'hiring') return 'opportunities';
    if (tab === 'profile' || tab === 'my-profile') return 'profile';
    if (tab === 'clubs') return 'clubs';
    if (tab === 'achievements') return 'achievements';
    if (tab === 'about') return 'about';
    if (tab === 'home') return 'home';
    return 'events';
  };

  const [activeTab, setActiveTab] = useState<'events' | 'faculty-posts' | 'opportunities' | 'profile' | 'home' | 'clubs' | 'faculty' | 'achievements' | 'about'>(() =>
    resolveInitialTab(initialTab)
  );

  const [isRefreshingEvents, setIsRefreshingEvents] = useState(false);
  const [isRefreshingPosts, setIsRefreshingPosts] = useState(false);
  const [isRefreshingHiring, setIsRefreshingHiring] = useState(false);

  const [facultySubTab, setFacultySubTab] = useState<'posts' | 'directory'>(() => {
    if (initialTab === 'faculty') return 'directory';
    return 'posts';
  });

  const [clubsSubTab, setClubsSubTab] = useState<'all-clubs' | 'memberships' | 'hiring' | 'events'>(() => {
    if (initialTab === 'opportunities') return 'hiring';
    if (initialTab === 'upcoming-events') return 'events';
    return 'all-clubs';
  });

  // Data states
  const [facultyPosts, setFacultyPosts] = useState<FacultyPostItem[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(MITS_FACULTY_DIRECTORY);
  const [hiringOpportunities, setHiringOpportunities] = useState<HiringItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [clubsList, setClubsList] = useState<Club[]>(mitsClubs);
  const [achievementsList, setAchievementsList] = useState<AchievementItem[]>([]);
  const [achievementCategory, setAchievementCategory] = useState<'ALL' | 'COLLEGE' | 'STUDENT' | 'CLUB'>('ALL');
  const [loading, setLoading] = useState(true);

  // Like & Comment state per post
  const [postLikesMap, setPostLikesMap] = useState<Record<string, { total: number; hasLiked: boolean }>>({});
  const [postCommentsMap, setPostCommentsMap] = useState<Record<string, any[]>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Filters & Search
  const [postCategoryFilter, setPostCategoryFilter] = useState<string>('All');
  const [postSearch, setPostSearch] = useState<string>('');

  const [facultyDeptFilter, setFacultyDeptFilter] = useState<string>('All Departments');
  const [facultyDesigFilter, setFacultyDesigFilter] = useState<string>('All Designations');
  const [facultySearch, setFacultySearch] = useState<string>('');

  const [hiringDomainFilter, setHiringDomainFilter] = useState<string>('All');
  const [hiringSearch, setHiringSearch] = useState<string>('');

  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('All');
  const [eventSearch, setEventSearch] = useState<string>('');

  // Applied & RSVP state saved in localStorage
  const [appliedHiringIds, setAppliedHiringIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`cms_student_applied_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [rsvpdEventIds, setRsvpdEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`cms_student_rsvps_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Student to Faculty messaging state
  const [selectedFacultyForMsg, setSelectedFacultyForMsg] = useState<FacultyMember | null>(null);
  const [msgTopic, setMsgTopic] = useState('Academic Guidance & Course Doubts');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<StudentMessageRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`cms_student_sent_msgs_${user?.id || 'guest'}`);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'msg_init_01',
              facultyId: 'fac_cse_01',
              facultyName: 'Dr. Manish Dixit',
              facultyEmail: 'manish.dixit@mitsgwalior.in',
              facultyDept: 'Computer Science & Engineering',
              topic: 'Research Project & Paper Mentorship',
              subject: 'Inquiry regarding Machine Learning Paper Mentorship',
              content:
                'Respected Sir, I am interested in contributing to the upcoming research on computer vision under your guidance. I have completed projects in PyTorch.',
              sentAt: 'Yesterday, 02:40 PM',
              status: 'Replied',
              replyContent:
                'Hello Hariom, I reviewed your profile. Please visit my cabin (CS-204) this Thursday at 3:30 PM with your GitHub repository links.',
              replyAt: 'Yesterday, 05:15 PM',
            },
          ];
    } catch {
      return [];
    }
  });

  // Student Profile Form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileAvatar, setProfileAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  );
  const [profileDept, setProfileDept] = useState(user?.department || 'Information Technology');
  const [profileYear, setProfileYear] = useState(user?.year || '2nd Year');
  const [profileStudentId, setProfileStudentId] = useState(user?.studentId || 'STU-2024-IT019');
  const [profileBio, setProfileBio] = useState(
    () => localStorage.getItem(`cms_student_bio_${user?.id}`) || 'Enthusiastic developer and student exploring full-stack engineering, algorithms, and active college club events.'
  );
  const [profileGithub, setProfileGithub] = useState(
    () => localStorage.getItem(`cms_student_github_${user?.id}`) || 'https://github.com/student-dev'
  );
  const [profileLinkedin, setProfileLinkedin] = useState(
    () => localStorage.getItem(`cms_student_linkedin_${user?.id}`) || 'https://linkedin.com/in/student-dev'
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      const [postsRes, facultyRes, hiringRes, eventsRes, clubsRes, achievementsRes] = await Promise.all([
        api.getFacultyPosts(),
        api.getFaculty(),
        api.getHiring(),
        api.getEvents(),
        api.getClubs(),
        api.getAchievements(),
      ]);
      if (postsRes.success && postsRes.data) setFacultyPosts(postsRes.data);
      if (facultyRes.success && facultyRes.data && facultyRes.data.length > 0) setFacultyList(facultyRes.data);
      if (hiringRes.success && hiringRes.data) setHiringOpportunities(hiringRes.data);
      if (eventsRes.success && eventsRes.data) setEvents(eventsRes.data);
      if (clubsRes.success && clubsRes.data && clubsRes.data.length > 0) setClubsList(clubsRes.data);
      if (achievementsRes.success && achievementsRes.data) setAchievementsList(achievementsRes.data);
      showToast('Feed refreshed successfully!');
    } catch (err) {
      console.error('Failed to refresh data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [postsRes, facultyRes, hiringRes, eventsRes, clubsRes, achievementsRes] = await Promise.all([
          api.getFacultyPosts(),
          api.getFaculty(),
          api.getHiring(),
          api.getEvents(),
          api.getClubs(),
          api.getAchievements(),
        ]);

        if (postsRes.success && postsRes.data) {
          setFacultyPosts(postsRes.data);
          // Initialize likes map
          const lMap: Record<string, { total: number; hasLiked: boolean }> = {};
          postsRes.data.forEach((p) => {
            lMap[p.id] = { total: p.likesCount || 0, hasLiked: false };
          });
          setPostLikesMap(lMap);
        }

        if (facultyRes.success && facultyRes.data && facultyRes.data.length > 0) {
          setFacultyList(facultyRes.data);
        } else {
          setFacultyList(MITS_FACULTY_DIRECTORY);
        }

        if (hiringRes.success && hiringRes.data) {
          setHiringOpportunities(hiringRes.data);
        }

        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data);
        }

        if (clubsRes.success && clubsRes.data && clubsRes.data.length > 0) {
          setClubsList(clubsRes.data);
        }

        if (achievementsRes.success && achievementsRes.data) {
          setAchievementsList(achievementsRes.data);
        }
      } catch (err) {
        console.error('Error loading student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleSubmitAchievement = async (itemData: {
    title: string;
    category: 'COLLEGE' | 'STUDENT' | 'CLUB';
    date: string;
    description: string;
    image: string;
    tags: string;
  }) => {
    const item: AchievementItem = {
      id: `ach_stu_${Date.now()}`,
      title: itemData.title,
      category: itemData.category,
      date: itemData.date,
      description: itemData.description,
      image: itemData.image,
      studentName: profileName || user?.name || 'Student',
      department: profileDept || 'Campus',
      year: profileYear || 'Engineering',
      isApproved: true,
    };

    try {
      if (token) {
        await api.createAchievement(item, token);
      }
      setAchievementsList((prev) => [item, ...prev]);
      showToast('Achievement submitted successfully!');
    } catch (err) {
      console.error('Failed to submit achievement', err);
      setAchievementsList((prev) => [item, ...prev]);
      showToast('Achievement recorded locally in your feed!');
    }
  };

  // Save Applied & RSVPs
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`cms_student_applied_${user.id}`, JSON.stringify(appliedHiringIds));
    }
  }, [appliedHiringIds, user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`cms_student_rsvps_${user.id}`, JSON.stringify(rsvpdEventIds));
    }
  }, [rsvpdEventIds, user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`cms_student_sent_msgs_${user.id}`, JSON.stringify(sentMessages));
    }
  }, [sentMessages, user?.id]);

  // Handle Like Toggle
  const handleToggleLike = async (postId: string) => {
    const current = postLikesMap[postId] || { total: 0, hasLiked: false };
    const nextHasLiked = !current.hasLiked;
    const nextTotal = nextHasLiked ? current.total + 1 : Math.max(0, current.total - 1);

    // Optimistic update
    setPostLikesMap((prev) => ({
      ...prev,
      [postId]: { total: nextTotal, hasLiked: nextHasLiked },
    }));

    if (token) {
      try {
        await api.toggleLike(postId, token);
      } catch (e) {
        console.error('Like failed', e);
      }
    }
  };

  // Load comments for a post
  const handleOpenComments = async (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }
    setActiveCommentPostId(postId);
    try {
      const res = await api.getComments(postId);
      if (res.success && res.data) {
        setPostCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
      }
    } catch (e) {
      console.error('Failed to load comments', e);
    }
  };

  // Submit comment
  const handleAddComment = async (postId: string) => {
    if (!commentInput.trim()) return;
    setSubmittingComment(true);

    const tempComment = {
      id: `cmt_${Date.now()}`,
      postId,
      userId: user?.id || 'usr_stu_02',
      userName: user?.name || profileName || 'College Student',
      userRole: 'STUDENT',
      content: commentInput.trim(),
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setPostCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), tempComment],
    }));

    // Update faculty post comments count
    setFacultyPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p))
    );

    const textToSend = commentInput.trim();
    setCommentInput('');

    if (token) {
      try {
        await api.createComment(postId, textToSend, token);
        showToast('Your comment was posted successfully!');
      } catch (e) {
        console.error('Comment error', e);
      }
    }
    setSubmittingComment(false);
  };

  // Handle Faculty Message Submit
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacultyForMsg || !msgSubject.trim() || !msgContent.trim()) return;

    setMsgSending(true);
    const newMsg: StudentMessageRecord = {
      id: `smsg_${Date.now()}`,
      facultyId: selectedFacultyForMsg.id,
      facultyName: selectedFacultyForMsg.name,
      facultyEmail: selectedFacultyForMsg.email,
      facultyDept: selectedFacultyForMsg.department,
      topic: msgTopic,
      subject: msgSubject.trim(),
      content: msgContent.trim(),
      sentAt: 'Just now',
      status: 'Sent',
    };

    setTimeout(() => {
      setSentMessages((prev) => [newMsg, ...prev]);
      setMsgSending(false);
      setSelectedFacultyForMsg(null);
      setMsgSubject('');
      setMsgContent('');
      showToast(`Message sent to ${newMsg.facultyName}! Check your Messages tab.`);
    }, 600);
  };

  // Handle Hiring Apply
  const handleApplyHiring = (hiring: HiringItem) => {
    if (appliedHiringIds.includes(hiring.id)) {
      showToast(`You have already applied for ${hiring.position} at ${hiring.clubName}`);
      return;
    }
    setAppliedHiringIds((prev) => [...prev, hiring.id]);
    showToast(`Application submitted for ${hiring.position} at ${hiring.clubName}!`);
  };

  // Handle Event RSVP
  const handleToggleEventRSVP = (event: EventItem) => {
    if (rsvpdEventIds.includes(event.id)) {
      setRsvpdEventIds((prev) => prev.filter((id) => id !== event.id));
      showToast(`Removed RSVP for ${event.title}`);
    } else {
      setRsvpdEventIds((prev) => [...prev, event.id]);
      showToast(`Successfully registered for ${event.title}! Added to your events.`);
    }
  };

  const handleToggleEventRSVPById = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      handleToggleEventRSVP(ev);
    } else {
      if (rsvpdEventIds.includes(eventId)) {
        setRsvpdEventIds((prev) => prev.filter((id) => id !== eventId));
        showToast('Removed RSVP for event');
      } else {
        setRsvpdEventIds((prev) => [...prev, eventId]);
        showToast('Successfully registered for event!');
      }
    }
  };

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Please enter your full name');
      return;
    }

    setSavingProfile(true);
    try {
      const updated = {
        name: profileName.trim(),
        avatar: profileAvatar,
        department: profileDept,
        year: profileYear,
        studentId: profileStudentId,
      };

      // Save to AuthContext state & localStorage
      updateUser(updated);
      if (user?.id) {
        localStorage.setItem(`cms_student_bio_${user.id}`, profileBio);
        localStorage.setItem(`cms_student_github_${user.id}`, profileGithub);
        localStorage.setItem(`cms_student_linkedin_${user.id}`, profileLinkedin);
      }

      // Save to backend if token and id available
      if (user?.id && token) {
        await api.updateUser(user.id, updated, token);
      }

      showToast('Profile and avatar updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      showToast('Profile updated locally.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Filtered lists
  const filteredPosts = useMemo(() => {
    return facultyPosts.filter((post) => {
      const matchCat =
        postCategoryFilter === 'All' ||
        post.category.toLowerCase() === postCategoryFilter.toLowerCase();
      const matchSearch =
        !postSearch.trim() ||
        post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
        post.content.toLowerCase().includes(postSearch.toLowerCase()) ||
        post.facultyName.toLowerCase().includes(postSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [facultyPosts, postCategoryFilter, postSearch]);

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      const matchDept =
        facultyDeptFilter === 'All Departments' ||
        f.department.toLowerCase() === facultyDeptFilter.toLowerCase();
      const matchDesig =
        facultyDesigFilter === 'All Designations' ||
        f.designation.toLowerCase().includes(facultyDesigFilter.toLowerCase());
      const q = facultySearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.specialization.some((s) => s.toLowerCase().includes(q));
      return matchDept && matchDesig && matchSearch;
    });
  }, [facultyList, facultyDeptFilter, facultyDesigFilter, facultySearch]);

  const filteredHiring = useMemo(() => {
    return hiringOpportunities.filter((h) => {
      const matchDomain =
        hiringDomainFilter === 'All' ||
        h.position.toLowerCase().includes(hiringDomainFilter.toLowerCase()) ||
        h.requiredSkills.some((s) => s.toLowerCase().includes(hiringDomainFilter.toLowerCase()));
      const q = hiringSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        h.position.toLowerCase().includes(q) ||
        h.clubName.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q);
      return matchDomain && matchSearch;
    });
  }, [hiringOpportunities, hiringDomainFilter, hiringSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat =
        eventCategoryFilter === 'All' ||
        ev.category.toLowerCase() === eventCategoryFilter.toLowerCase();
      const q = eventSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.clubName.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [events, eventCategoryFilter, eventSearch]);

  return (
    <div className="min-h-screen bg-slate-50/80 pb-20">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Student Hero */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            {/* Student Info */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={profileAvatar}
                  alt={profileName || user?.name}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                />
                <button
                  onClick={() => setActiveTab('profile')}
                  title="Change Profile Picture"
                  className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {profileName || user?.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                    College Student
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {profileStudentId}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user?.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    {profileDept} ({profileYear})
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {onSwitchToLeader && (
                <button
                  onClick={onSwitchToLeader}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Club Leader Portal</span>
                </button>
              )}
              <button
                onClick={onNavigateHome}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Public Site
              </button>
              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Upcoming Events, Faculty Posts, Opportunities, My Profile, plus Home & Clubs) */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-4">
            {/* 1. Upcoming Events */}
            <button
              id="tab-student-events"
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming Events</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === 'events' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {events.length}
              </span>
            </button>

            {/* 2. Faculty Posts */}
            <button
              id="tab-student-faculty-posts"
              onClick={() => setActiveTab('faculty-posts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'faculty-posts' || activeTab === 'faculty'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Faculty Posts</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === 'faculty-posts' || activeTab === 'faculty' ? 'bg-rose-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {facultyPosts.length}
              </span>
            </button>

            {/* 3. Opportunities */}
            <button
              id="tab-student-opportunities"
              onClick={() => setActiveTab('opportunities')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'opportunities'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Opportunities</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === 'opportunities' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {hiringOpportunities.length}
              </span>
            </button>

            {/* 4. My Profile */}
            <button
              id="tab-student-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            {/* Separator */}
            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block shrink-0" />

            {/* Auxiliary Tab: Home */}
            <button
              id="tab-student-home"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {/* Auxiliary Tab: Clubs Directory */}
            <button
              id="tab-student-clubs"
              onClick={() => setActiveTab('clubs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'clubs'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Clubs</span>
            </button>

            {/* Auxiliary Tab: Achievements */}
            <button
              id="tab-student-achievements"
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'achievements'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Achievements</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* TAB 1: UPCOMING EVENTS (Club Uploads & RSVPs) */}
        {/* ========================================================= */}
        {activeTab === 'events' && (
          <StudentEventsTab
            events={events}
            rsvpdEventIds={rsvpdEventIds}
            clubsList={clubsList}
            onToggleRsvp={handleToggleEventRSVP}
            onRefreshEvents={handleRefreshAll}
            isRefreshing={isRefreshing}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 2: FACULTY POSTS (Instagram-style Big Cards, Likes & Comments) */}
        {/* ========================================================= */}
        {(activeTab === 'faculty-posts' || activeTab === 'faculty') && (
          <StudentFacultyPostsTab
            user={user}
            profileName={profileName}
            profileAvatar={profileAvatar}
            facultyPosts={facultyPosts}
            facultyList={facultyList}
            postLikesMap={postLikesMap}
            postCommentsMap={postCommentsMap}
            activeCommentPostId={activeCommentPostId}
            commentInput={commentInput}
            submittingComment={submittingComment}
            onToggleLike={handleToggleLike}
            onOpenComments={(id) => setActiveCommentPostId((prev) => (prev === id ? null : id))}
            onCommentInputChange={setCommentInput}
            onAddComment={handleAddComment}
            onRefreshPosts={handleRefreshAll}
            isRefreshing={isRefreshing}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 3: OPPORTUNITIES (Club Hiring Positions & Application) */}
        {/* ========================================================= */}
        {activeTab === 'opportunities' && (
          <StudentOpportunitiesTab
            user={user}
            profileName={profileName}
            profileStudentId={profileStudentId}
            profileDept={profileDept}
            profileYear={profileYear}
            hiringOpportunities={hiringOpportunities}
            appliedHiringIds={appliedHiringIds}
            onApplyHiring={handleApplyHiring}
            onRefreshOpportunities={handleRefreshAll}
            isRefreshing={isRefreshing}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 4: MY PROFILE (Editable Name, Avatar, Bio, Skills) */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <StudentProfileTab
            user={user}
            profileName={profileName}
            setProfileName={setProfileName}
            profileAvatar={profileAvatar}
            setProfileAvatar={setProfileAvatar}
            profileStudentId={profileStudentId}
            setProfileStudentId={setProfileStudentId}
            profileDept={profileDept}
            setProfileDept={setProfileDept}
            profileYear={profileYear}
            setProfileYear={setProfileYear}
            profileBio={profileBio}
            setProfileBio={setProfileBio}
            profileGithub={profileGithub}
            setProfileGithub={setProfileGithub}
            profileLinkedin={profileLinkedin}
            setProfileLinkedin={setProfileLinkedin}
            onSaveProfile={handleSaveProfile}
            savingProfile={savingProfile}
            avatarPresets={AVATAR_PRESETS}
            showToast={showToast}
          />
        )}

        {/* ========================================================= */}
        {/* AUXILIARY TAB: HOME (Dashboard Landing & Overview) */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <StudentHomeTab
            user={user}
            profileName={profileName}
            profileStudentId={profileStudentId}
            profileDept={profileDept}
            profileYear={profileYear}
            clubsCount={clubsList.length}
            hiringOpportunities={hiringOpportunities}
            appliedHiringIds={appliedHiringIds}
            events={events}
            rsvpdEventIds={rsvpdEventIds}
            facultyPosts={facultyPosts}
            achievementsCount={achievementsList.length}
            sentMessagesCount={sentMessages.length}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFacultyPost={(postId) => {
              setActiveTab('faculty');
              setFacultySubTab('posts');
              setActiveCommentPostId(postId);
            }}
            onToggleRsvp={handleToggleEventRSVPById}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 2: CLUBS (Directory, Memberships, Hiring, Events) */}
        {/* ========================================================= */}
        {activeTab === 'clubs' && (
          <StudentClubsTab
            user={user}
            clubs={clubsList}
            hiringOpportunities={hiringOpportunities}
            appliedHiringIds={appliedHiringIds}
            events={events}
            rsvpdEventIds={rsvpdEventIds}
            onApplyHiring={handleApplyHiring}
            onToggleRsvp={handleToggleEventRSVPById}
            initialSubTab={clubsSubTab}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 3: FACULTY (Faculty Posts, Directory, & Messaging) */}
        {/* ========================================================= */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            {/* Faculty Subtabs Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Faculty Postings, Notices & Mentors</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Interact with official department circulars or message professors directly for research, consultation, and course guidance.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                <button
                  id="subtab-faculty-posts"
                  onClick={() => setFacultySubTab('posts')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    facultySubTab === 'posts'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Faculty Posts & Notices ({facultyPosts.length})
                </button>
                <button
                  id="subtab-faculty-directory"
                  onClick={() => setFacultySubTab('directory')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    facultySubTab === 'directory'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Faculty Directory & Inquiries ({facultyList.length})
                </button>
              </div>
            </div>

            {facultySubTab === 'posts' ? (
              <div className="space-y-6">
            {/* Header & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>Faculty Posts & Academic Announcements</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Official notices, research calls, contest updates, and circulars directly from MITS professors. Like and comment to engage.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search notices or faculty..."
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={postCategoryFilter}
                    onChange={(e) => setPostCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Academic">Academic</option>
                    <option value="Research & Patents">Research & Patents</option>
                    <option value="Hackathon / Contest">Hackathon / Contest</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Exam & Guidelines">Exam & Guidelines</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-6">
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">No faculty notices found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try changing category filters or search query.</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const likesInfo = postLikesMap[post.id] || {
                    total: post.likesCount || 0,
                    hasLiked: false,
                  };
                  const isCommentsOpen = activeCommentPostId === post.id;
                  const currentComments = postCommentsMap[post.id] || [];

                  return (
                    <article
                      key={post.id}
                      id={`post-${post.id}`}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all overflow-hidden"
                    >
                      {/* Post Header */}
                      <div className="p-5 sm:p-6 pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                post.facultyAvatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  post.facultyName
                                )}&background=4f46e5&color=fff&size=120`
                              }
                              alt={post.facultyName}
                              className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900">{post.facultyName}</h3>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                  Faculty
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">
                                {post.department} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                              </p>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {post.category}
                          </span>
                        </div>

                        {/* Title & Body */}
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-4 leading-snug">
                          {post.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>

                        {/* Attached Image if any */}
                        {post.imageUrl && (
                          <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 max-h-96">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-auto object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post Footer Action Bar (Like & Comment buttons) */}
                      <div className="px-5 sm:px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          {/* Like Button */}
                          <button
                            id={`btn-like-${post.id}`}
                            onClick={() => handleToggleLike(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              likesInfo.hasLiked
                                ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold shadow-xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200'
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                likesInfo.hasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                              }`}
                            />
                            <span>{likesInfo.total}</span>
                            <span className="hidden sm:inline">{likesInfo.hasLiked ? 'Liked' : 'Like'}</span>
                          </button>

                          {/* Comment Toggle Button */}
                          <button
                            id={`btn-comment-${post.id}`}
                            onClick={() => handleOpenComments(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              isCommentsOpen
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                                : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200'
                            }`}
                          >
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span>{post.commentsCount || currentComments.length || 0}</span>
                            <span className="hidden sm:inline">Comments</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(window.location.href);
                              showToast('Notice link copied to clipboard!');
                            }
                          }}
                          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>

                      {/* Expandable Comment Section */}
                      {isCommentsOpen && (
                        <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200/80 space-y-4 animate-in fade-in duration-150">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Discussion & Inquiries ({currentComments.length})
                          </h5>

                          {/* Existing comments list */}
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {currentComments.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-2">
                                No comments yet. Be the first student to ask a question or leave feedback!
                              </p>
                            ) : (
                              currentComments.map((cmt: any) => (
                                <div
                                  key={cmt.id}
                                  className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-slate-900">{cmt.userName}</span>
                                      <span
                                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                                          cmt.userRole === 'FACULTY'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}
                                      >
                                        {cmt.userRole}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {cmt.createdAt ? new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed">{cmt.content}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Comment Input Box */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                            <img
                              src={profileAvatar}
                              alt="Your avatar"
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                            />
                            <input
                              type="text"
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(post.id);
                                }
                              }}
                              placeholder="Write a comment or ask a question..."
                              className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              id={`submit-comment-${post.id}`}
                              disabled={submittingComment || !commentInput.trim()}
                              onClick={() => handleAddComment(post.id)}
                              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Post</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Faculty Directory & Direct Messaging</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Explore professor profiles, cabins, specializations, and send direct academic guidance inquiries.
                  </p>
                </div>

                {/* Sent Messages Quick Trigger */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    <span className="font-bold text-indigo-600">{sentMessages.length}</span> Inquiries Sent
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by faculty name or subject..."
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <select
                  value={facultyDeptFilter}
                  onChange={(e) => setFacultyDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {MITS_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  value={facultyDesigFilter}
                  onChange={(e) => setFacultyDesigFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {MITS_DESIGNATIONS.map((desig) => (
                    <option key={desig} value={desig}>
                      {desig}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sent Inquiries Drawer / Summary if any */}
            {sentMessages.length > 0 && (
              <div className="bg-indigo-50/60 rounded-2xl border border-indigo-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                    <span>Your Recent Sent Inquiries & Faculty Responses</span>
                  </h3>
                  <span className="text-[11px] text-indigo-700 font-semibold">{sentMessages.length} Messages</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sentMessages.slice(0, 2).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">To: {msg.facultyName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            msg.status === 'Replied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <p className="font-medium text-indigo-700 text-[11px]">{msg.subject}</p>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{msg.content}</p>

                      {msg.replyContent && (
                        <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-[11px] space-y-1">
                          <span className="font-bold block text-emerald-800">Faculty Response:</span>
                          <p>{msg.replyContent}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faculty Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFaculty.map((faculty) => (
                <div
                  key={faculty.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Photo & Name */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={faculty.avatar}
                        alt={faculty.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{faculty.name}</h3>
                        <p className="text-xs text-indigo-700 font-semibold mt-0.5">{faculty.designation}</p>
                        <p className="text-[11px] text-slate-500">{faculty.department}</p>
                      </div>
                    </div>

                    {/* Cabin & Contacts */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">Cabin:</span>
                        <span>{faculty.cabin}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{faculty.email}</span>
                      </div>
                      {faculty.consultationHours && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-[11px] text-slate-500 truncate">{faculty.consultationHours}</span>
                        </div>
                      )}
                    </div>

                    {/* Specializations */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Areas of Expertise
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {faculty.specialization.slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Message Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      id={`btn-msg-faculty-${faculty.id}`}
                      onClick={() => {
                        setSelectedFacultyForMsg(faculty);
                        setMsgSubject(`Inquiry from ${profileName || user?.name || 'Student'}`);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message / Inquire</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    {/* ========================================================= */}
    {/* TAB 4: ACHIEVEMENTS (Pride of MITS, Laurels & Accolades) */}
    {/* ========================================================= */}
    {activeTab === 'achievements' && (
      <StudentAchievementsTab
        user={user}
        achievements={achievementsList}
        category={achievementCategory}
        onCategoryChange={setAchievementCategory}
        onSubmitAchievement={handleSubmitAchievement}
      />
    )}

    {/* ========================================================= */}
    {/* TAB 5: ABOUT (Institutional Legacy & Information) */}
    {/* ========================================================= */}
    {activeTab === 'about' && <StudentAboutTab />}

        {/* ========================================================= */}
        {/* TAB 3: OPPORTUNITIES (Club Hiring) */}
        {/* ========================================================= */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            {/* Header & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <span>Club Hiring & Leadership Opportunities</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Open recruitments posted by Club Presidents and Core Leads across technical, cultural, and sports societies.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search roles or clubs..."
                      value={hiringSearch}
                      onChange={(e) => setHiringSearch(e.target.value)}
                      className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-60"
                    />
                  </div>

                  <select
                    value={hiringDomainFilter}
                    onChange={(e) => setHiringDomainFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="All">All Domains</option>
                    <option value="Technical">Technical & Coding</option>
                    <option value="Design">UI/UX & Design</option>
                    <option value="Management">Event Ops & Management</option>
                    <option value="Content">Content & PR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredHiring.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">No open recruitment postings found</h3>
                  <p className="text-xs text-slate-500 mt-1">Check back soon when clubs begin seasonal recruitments.</p>
                </div>
              ) : (
                filteredHiring.map((hire) => {
                  const isApplied = appliedHiringIds.includes(hire.id);

                  return (
                    <div
                      key={hire.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                              @{hire.clubName}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-2">{hire.position}</h3>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active Hiring
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{hire.description}</p>

                        {/* Skills required */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Required Skills & Stack
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {hire.requiredSkills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-0.5 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {hire.perks && hire.perks.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">Perks:</span>
                            {hire.perks.join(' • ')}
                          </div>
                        )}
                      </div>

                      {/* Apply Action */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400">
                          Deadline: {hire.deadline || 'Open until filled'}
                        </span>

                        <button
                          id={`btn-apply-hire-${hire.id}`}
                          onClick={() => handleApplyHiring(hire)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Application Submitted</span>
                            </>
                          ) : (
                            <>
                              <span>Apply for Role</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: UPCOMING EVENTS (Club Leader event posts) */}
        {/* ========================================================= */}
        {activeTab === 'upcoming-events' && (
          <div className="space-y-6">
            {/* Header & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>Upcoming Club Events & Hackathons</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Workshops, coding leagues, cultural nights, and competitions organized by college club leaders.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search events or venues..."
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-60"
                    />
                  </div>

                  <select
                    value={eventCategoryFilter}
                    onChange={(e) => setEventCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">No upcoming events scheduled</h3>
                  <p className="text-xs text-slate-500 mt-1">Check back later or browse other categories.</p>
                </div>
              ) : (
                filteredEvents.map((ev) => {
                  const isRsvpd = rsvpdEventIds.includes(ev.id);

                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Event Poster */}
                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={
                              ev.poster ||
                              'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
                            }
                            alt={ev.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-900 shadow-xs">
                            {ev.category}
                          </div>
                          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white font-medium">
                            @{ev.clubName}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                          <h3 className="text-base font-bold text-slate-900 leading-snug">{ev.title}</h3>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{ev.description}</p>

                          {/* Logistics */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span className="font-semibold text-slate-800">{ev.date}</span>
                              {ev.time && <span>• {ev.time}</span>}
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="truncate">{ev.venue}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {ev.tags && ev.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {ev.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RSVP / Registration Action */}
                      <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3 pt-4">
                        <button
                          id={`btn-rsvp-event-${ev.id}`}
                          onClick={() => handleToggleEventRSVP(ev)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isRsvpd
                              ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 shadow-2xs'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          {isRsvpd ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Registered & RSVP Confirmed</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4" />
                              <span>Register / RSVP for Event</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: STUDENT PROFILE (Add/Change Name & Profile Pic) */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>Student Profile & Identity</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Customize your student name, upload your profile picture or select an avatar preset, and update your academic identity.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar Section */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Profile Picture & Avatar
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <img
                      src={profileAvatar}
                      alt="Student Avatar Preview"
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
                    />

                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <span className="text-xs font-medium text-slate-600 block mb-1">
                          Direct Image URL:
                        </span>
                        <input
                          type="url"
                          value={profileAvatar}
                          onChange={(e) => setProfileAvatar(e.target.value)}
                          placeholder="https://example.com/your-photo.jpg"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* File upload local simulation */}
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Upload From Computer</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (uploadEvent) => {
                                  if (uploadEvent.target?.result) {
                                    setProfileAvatar(uploadEvent.target.result as string);
                                    showToast('Local photo loaded! Click Save to apply.');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <span className="text-[11px] text-slate-400">JPG, PNG, WebP supported</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick-Pick Avatar Presets */}
                  <div className="pt-3 border-t border-slate-200/80">
                    <span className="text-xs font-medium text-slate-600 block mb-2">
                      Or Quick-Pick an Avatar Preset:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProfileAvatar(preset)}
                          className={`w-11 h-11 rounded-xl overflow-hidden ring-2 transition-all ${
                            profileAvatar === preset ? 'ring-indigo-600 scale-105 shadow-sm' : 'ring-transparent hover:ring-slate-300 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name & Academic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Hariom Gupta"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College Email (Verified)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'student@college.edu'}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enrollment / Student ID
                    </label>
                    <input
                      type="text"
                      value={profileStudentId}
                      onChange={(e) => setProfileStudentId(e.target.value)}
                      placeholder="e.g. STU-2024-IT019"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={profileYear}
                      onChange={(e) => setProfileYear(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year">4th Year (Senior)</option>
                      <option value="Postgraduate">Postgraduate / M.Tech</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department / Branch
                    </label>
                    <select
                      value={profileDept}
                      onChange={(e) => setProfileDept(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                    >
                      <option value="Information Technology">Information Technology</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Applied Science">Applied Science</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Bio & Goals
                    </label>
                    <textarea
                      rows={3}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder="Briefly describe your academic interests, tech stack, or club goals..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GitHub Profile URL
                    </label>
                    <div className="relative">
                      <Github className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        value={profileGithub}
                        onChange={(e) => setProfileGithub(e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <div className="relative">
                      <Linkedin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        value={profileLinkedin}
                        onChange={(e) => setProfileLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Dashboard & Portal Information */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Student Portal Identity</h4>
                    <p className="text-[11px] text-slate-500">Your profile details are visible to college clubs, faculty mentors, and event organizers.</p>
                  </div>
                </div>

                {/* Save Profile Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    id="btn-save-student-profile"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
                  >
                    {savingProfile ? (
                      <span>Saving Changes...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Profile & Avatar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: DIRECT FACULTY MESSAGE DIALOG */}
      {/* ========================================================= */}
      {selectedFacultyForMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedFacultyForMsg.avatar}
                  alt={selectedFacultyForMsg.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-bold leading-tight">Message {selectedFacultyForMsg.name}</h3>
                  <p className="text-[11px] text-indigo-200">
                    {selectedFacultyForMsg.designation} • {selectedFacultyForMsg.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFacultyForMsg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Sender:</span> {profileName || user?.name} (
                  {profileStudentId})
                </div>
                <span className="text-indigo-600 font-medium">Cabin: {selectedFacultyForMsg.cabin}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Topic</label>
                <select
                  value={msgTopic}
                  onChange={(e) => setMsgTopic(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                >
                  <option value="Academic Guidance & Course Doubts">Academic Guidance & Course Doubts</option>
                  <option value="Research Project & Paper Mentorship">Research Project & Paper Mentorship</option>
                  <option value="Club Activity & Event Guidance">Club Activity & Event Guidance</option>
                  <option value="Internship / Recommendation Request">Internship / Recommendation Request</option>
                  <option value="General Office Consultation">General Office Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="e.g. Project Guidance in Machine Learning"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message / Inquiry</label>
                <textarea
                  required
                  rows={4}
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  placeholder="State your question or proposal clearly. Include details of courses or project background..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedFacultyForMsg(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={msgSending || !msgSubject.trim() || !msgContent.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{msgSending ? 'Sending...' : 'Send Message to Faculty'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
