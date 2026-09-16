import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  FacultyPostItem,
  AchievementItem,
  Club,
  StudentGroup,
  GroupMessage,
} from '../../types';
import { mitsClubs } from '../../data/mitsClubs';
import {
  FileText,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  Award,
  Users,
  MessageSquare,
  Send,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  X,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Paperclip,
  Code,
  Tag,
  AlertCircle,
  ArrowLeft,
  LogOut,
} from 'lucide-react';

interface FacultyDashboardProps {
  onNavigateHome: () => void;
  initialTab?: 'posts' | 'clubs' | 'groups' | 'achievements' | 'profile' | 'overview';
  openCreatePostInitially?: boolean;
}

const INITIAL_GROUPS: StudentGroup[] = [
  {
    id: 'grp_01',
    name: 'M.Tech AI & Research Scholars 2026',
    description: 'Faculty research lab group for deep learning, NLP projects, and paper submissions.',
    facultyId: 'usr_fac_01',
    facultyName: 'Prof. Ramesh Sharma',
    department: 'Computer Science & Engineering',
    memberCount: 18,
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01',
    lastMessage: 'Sir, we uploaded the revised paper draft for IEEE review.',
    lastMessageTime: '10:45 AM',
    students: [
      { id: 's1', name: 'Rahul Verma', enrollment: '0901CS221045', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
      { id: 's2', name: 'Priya Nair', enrollment: '0901CS221089', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      { id: 's3', name: 'Hariom Gupta', enrollment: '0901IT231019', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'grp_02',
    name: 'HackMITS 2026 Core Mentorship Cohort',
    description: 'Direct advisory room for students preparing for national hackathons and smart India hackathon.',
    facultyId: 'usr_fac_01',
    facultyName: 'Prof. Ramesh Sharma',
    department: 'Computer Science & Engineering',
    memberCount: 32,
    avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-08-15',
    lastMessage: 'Here is the preliminary poster for the 36-hour hackathon!',
    lastMessageTime: 'Yesterday',
    students: [
      { id: 's1', name: 'Rahul Verma', enrollment: '0901CS221045', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
      { id: 's4', name: 'Amitabh Sen', enrollment: '0901EC221012', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    ],
  },
];

const INITIAL_MESSAGES: Record<string, GroupMessage[]> = {
  grp_01: [
    {
      id: 'm1',
      groupId: 'grp_01',
      senderId: 'usr_fac_01',
      senderName: 'Prof. Ramesh Sharma',
      senderRole: 'FACULTY',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      content: 'Welcome everyone! Please make sure the literature survey for your thesis is completed by Friday 5 PM.',
      timestamp: 'Yesterday, 04:15 PM',
    },
    {
      id: 'm2',
      groupId: 'grp_01',
      senderId: 's1',
      senderName: 'Rahul Verma',
      senderRole: 'STUDENT',
      senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      content: 'Understood Sir! We also verified the benchmark datasets on GPU cluster 3.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      imageCaption: 'Benchmark results on CIFAR & ImageNet test accuracy',
      timestamp: 'Yesterday, 05:30 PM',
    },
    {
      id: 'm3',
      groupId: 'grp_01',
      senderId: 'usr_fac_01',
      senderName: 'Prof. Ramesh Sharma',
      senderRole: 'FACULTY',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      content: 'Excellent progress. I have reviewed section 3 and left comments. Keep it up!',
      timestamp: 'Today, 09:12 AM',
    },
    {
      id: 'm4',
      groupId: 'grp_01',
      senderId: 's2',
      senderName: 'Priya Nair',
      senderRole: 'STUDENT',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'Sir, we uploaded the revised paper draft for IEEE review.',
      timestamp: 'Today, 10:45 AM',
    },
  ],
  grp_02: [
    {
      id: 'm201',
      groupId: 'grp_02',
      senderId: 'usr_fac_01',
      senderName: 'Prof. Ramesh Sharma',
      senderRole: 'FACULTY',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      content: 'Here is the national hackathon poster guidelines. Register your teams before the portal closes!',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      imageCaption: 'HackMITS 2026 Official Event Poster & Tracks',
      timestamp: 'Yesterday, 11:20 AM',
    },
    {
      id: 'm202',
      groupId: 'grp_02',
      senderId: 's1',
      senderName: 'Rahul Verma',
      senderRole: 'STUDENT',
      senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      content: 'Thank you Sir! Our team has drafted the problem statement presentation.',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      imageCaption: 'Team Architecture Diagram for AI Track',
      timestamp: 'Yesterday, 02:40 PM',
    },
  ],
};

const SAMPLE_POSTERS = [
  { label: 'Hackathon Banner', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tech Seminar Flyer', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' },
  { label: 'Research Notice', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Campus Innovation', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' },
];

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  onNavigateHome,
  initialTab = 'posts',
  openCreatePostInitially = false,
}) => {
  const { user, token, logout, updateUser } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'posts' | 'clubs' | 'groups' | 'achievements' | 'profile' | 'overview'
  >(initialTab);

  // Data states
  const [posts, setPosts] = useState<FacultyPostItem[]>([]);
  const [postFilter, setPostFilter] = useState<'ALL' | 'HACKATHON' | 'NOTICE' | 'LINK'>('ALL');
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // Associated clubs
  const [associatedClubs, setAssociatedClubs] = useState<string[]>(() => {
    return user?.advisedClubs && user.advisedClubs.length > 0
      ? user.advisedClubs
      : ['The AI Club', 'Google Developer Groups (GDGoC)', 'Competitive Coding Club'];
  });
  const [showAddClubModal, setShowAddClubModal] = useState<boolean>(false);
  const [selectedClubToAdd, setSelectedClubToAdd] = useState<string>('');
  const [clubAdvisoryRole, setClubAdvisoryRole] = useState<string>('Faculty Advisor');

  // Achievements
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [showAddAchievementModal, setShowAddAchievementModal] = useState<boolean>(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    category: 'COLLEGE' as 'COLLEGE' | 'STUDENT' | 'CLUB',
    department: user?.department || 'MITS Gwalior',
    date: new Date().toISOString().split('T')[0],
    image: '/mits-campus.jpg',
  });

  // Student Groups & Chat
  const [groups, setGroups] = useState<StudentGroup[]>(() => {
    const saved = localStorage.getItem(`cms_faculty_groups_${user?.id || 'default'}`);
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'grp_01');
  const [messages, setMessages] = useState<Record<string, GroupMessage[]>>(() => {
    const saved = localStorage.getItem(`cms_group_messages_${user?.id || 'default'}`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [messageInput, setMessageInput] = useState<string>('');
  const [chatImageUrl, setChatImageUrl] = useState<string>('');
  const [chatImageCaption, setChatImageCaption] = useState<string>('');
  const [showAttachModal, setShowAttachModal] = useState<boolean>(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupDesc, setNewGroupDesc] = useState<string>('');

  // Create Post Modal State
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(openCreatePostInitially);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    postType: 'HACKATHON' as 'HACKATHON' | 'NOTICE' | 'LINK',
    category: 'Hackathon',
    image: SAMPLE_POSTERS[0].url,
    link: '',
    deadline: '',
    prizePool: '',
  });
  const [isSubmittingPost, setIsSubmittingPost] = useState<boolean>(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Prof. Ramesh Sharma',
    designation: user?.designation || 'Professor & HOD',
    department: user?.department || 'Computer Science & Engineering',
    email: user?.email || 'faculty.sharma@college.edu',
    phone: user?.phone || '+91 751 2409300',
    cabin: user?.cabin || 'CS Block, Room 204',
    qualification: user?.qualification || 'Ph.D. in AI & Machine Learning, IIT Roorkee; M.Tech, NIT Trichy',
    specialization: user?.specialization?.join(', ') || 'Artificial Intelligence, Machine Learning, Distributed Algorithms, Cloud Architecture',
    bio: user?.bio || 'Professor & Researcher with over 18 years of experience mentoring student societies, authoring IEEE papers, and heading institutional computing laboratories.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  });
  const [profileSavedToast, setProfileSavedToast] = useState<boolean>(false);

  // Load posts & achievements
  useEffect(() => {
    loadPosts();
    loadAchievements();
  }, []);

  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await api.getFacultyPosts();
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadAchievements = async () => {
    try {
      const res = await api.getAchievements();
      if (res.success && res.data) {
        setAchievements(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sync groups & messages to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`cms_faculty_groups_${user.id}`, JSON.stringify(groups));
      localStorage.setItem(`cms_group_messages_${user.id}`, JSON.stringify(messages));
    }
  }, [groups, messages, user]);

  // Handle Create Post
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert('Please fill in both title and description for the post.');
      return;
    }

    setIsSubmittingPost(true);
    try {
      const payload: Partial<FacultyPostItem> = {
        title: newPost.title,
        content: newPost.content,
        postType: newPost.postType,
        category:
          newPost.postType === 'HACKATHON'
            ? 'Hackathon'
            : newPost.postType === 'LINK'
            ? 'Website Link'
            : newPost.category || 'Academic Notice',
        image: newPost.image,
        link: newPost.link,
        deadline: newPost.deadline,
        prizePool: newPost.prizePool,
        department: user?.department || 'Computer Science & Engineering',
        facultyName: user?.name || 'Prof. Ramesh Sharma',
      };

      const res = await api.createFacultyPost(payload, token || '');
      if (res.success && res.data) {
        setPosts([res.data, ...posts]);
        setShowCreatePostModal(false);
        setActiveTab('posts');
        setNewPost({
          title: '',
          content: '',
          postType: 'HACKATHON',
          category: 'Hackathon',
          image: SAMPLE_POSTERS[0].url,
          link: '',
          deadline: '',
          prizePool: '',
        });
      } else {
        alert(res.message || 'Failed to publish post');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) {
      return;
    }

    try {
      const res = await api.deleteFacultyPost(postId, token || '');
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        // Optimistically remove if backend in-memory
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error(err);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  // Handle Add Associated Club
  const handleAddAssociatedClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClubToAdd) return;
    if (associatedClubs.includes(selectedClubToAdd)) {
      alert('This club is already in your associated list.');
      return;
    }
    const updated = [...associatedClubs, selectedClubToAdd];
    setAssociatedClubs(updated);
    updateUser({ advisedClubs: updated });
    setShowAddClubModal(false);
    setSelectedClubToAdd('');
  };

  // Handle Remove Associated Club
  const handleRemoveAssociatedClub = (clubName: string) => {
    if (window.confirm(`Are you sure you want to remove your advisory affiliation with "${clubName}"?`)) {
      const updated = associatedClubs.filter((c) => c !== clubName);
      setAssociatedClubs(updated);
      updateUser({ advisedClubs: updated });
    }
  };

  // Handle Add Achievement
  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.title || !newAchievement.description) {
      alert('Title and description are required.');
      return;
    }

    try {
      const res = await api.createAchievement(
        {
          ...newAchievement,
          department: newAchievement.department || 'MITS Gwalior',
        },
        token || ''
      );
      if (res.success && res.data) {
        setAchievements([res.data, ...achievements]);
        setShowAddAchievementModal(false);
        setNewAchievement({
          title: '',
          description: '',
          category: 'COLLEGE',
          department: user?.department || 'MITS Gwalior',
          date: new Date().toISOString().split('T')[0],
          image: '/mits-campus.jpg',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Achievement
  const handleDeleteAchievement = async (id: string) => {
    if (!window.confirm('Delete this achievement from records?')) return;
    try {
      await api.deleteAchievement(id, token || '');
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Handle Create Group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGrp: StudentGroup = {
      id: `grp_${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'Academic and mentorship group for MITS students.',
      facultyId: user?.id || 'usr_fac_01',
      facultyName: user?.name || 'Prof. Ramesh Sharma',
      department: user?.department || 'Computer Science & Engineering',
      memberCount: 1,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      lastMessage: 'Group created by faculty.',
      lastMessageTime: 'Just now',
      students: [
        { id: 's1', name: 'Rahul Verma', enrollment: '0901CS221045', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
      ],
    };

    setGroups([newGrp, ...groups]);
    setSelectedGroupId(newGrp.id);
    setMessages((prev) => ({
      ...prev,
      [newGrp.id]: [
        {
          id: `m_${Date.now()}`,
          groupId: newGrp.id,
          senderId: user?.id || 'usr_fac_01',
          senderName: user?.name || 'Prof. Ramesh Sharma',
          senderRole: 'FACULTY',
          senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          content: `Welcome students to ${newGrp.name}! You can ask questions, discuss project milestones, and share event posters here.`,
          timestamp: 'Just now',
        },
      ],
    }));

    setShowCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  // Handle Send Chat Message (Faculty)
  const handleSendMessage = (role: 'FACULTY' | 'STUDENT' = 'FACULTY') => {
    if (!messageInput.trim() && !chatImageUrl) return;

    const activeGrp = groups.find((g) => g.id === selectedGroupId);
    const newMsg: GroupMessage = {
      id: `m_${Date.now()}`,
      groupId: selectedGroupId,
      senderId: role === 'FACULTY' ? (user?.id || 'usr_fac_01') : 's1',
      senderName: role === 'FACULTY' ? (user?.name || 'Prof. Ramesh Sharma') : 'Rahul Verma',
      senderRole: role,
      senderAvatar:
        role === 'FACULTY'
          ? (user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80')
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      content: messageInput.trim(),
      imageUrl: chatImageUrl || undefined,
      imageCaption: chatImageCaption || undefined,
      timestamp: 'Just now',
    };

    const currentList = messages[selectedGroupId] || [];
    const updated = [...currentList, newMsg];

    setMessages((prev) => ({ ...prev, [selectedGroupId]: updated }));

    // Update group preview
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId
          ? {
              ...g,
              lastMessage: newMsg.imageUrl ? '📷 Shared a poster / image' : newMsg.content,
              lastMessageTime: 'Just now',
            }
          : g
      )
    );

    setMessageInput('');
    setChatImageUrl('');
    setChatImageCaption('');
    setShowAttachModal(false);
  };

  // Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFields = {
      name: profileForm.name,
      designation: profileForm.designation,
      department: profileForm.department,
      email: profileForm.email,
      phone: profileForm.phone,
      cabin: profileForm.cabin,
      qualification: profileForm.qualification,
      specialization: profileForm.specialization
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      bio: profileForm.bio,
      avatar: profileForm.avatar,
    };

    updateUser(updatedFields);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    if (postFilter === 'ALL') return true;
    if (postFilter === 'HACKATHON') return p.postType === 'HACKATHON' || p.category.toLowerCase().includes('hack');
    if (postFilter === 'LINK') return p.postType === 'LINK' || Boolean(p.link);
    if (postFilter === 'NOTICE') return p.postType === 'NOTICE' || p.category.toLowerCase().includes('notice');
    return true;
  });

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const activeGroupMessages = messages[selectedGroupId] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Faculty Profile Hero Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || profileForm.avatar}
                alt={user?.name || 'Faculty'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-sm border border-slate-200"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user?.name || profileForm.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {user?.role || 'FACULTY'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                  {profileForm.designation}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  {profileForm.department}
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email || profileForm.email}
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profileForm.cabin}
                </span>
              </div>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setShowCreatePostModal(true);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-200 transition-all hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              title="Return to college website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Main Site</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Faculty Dashboard Navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
          {[
            { id: 'posts', label: 'Your Posts', count: posts.length, icon: FileText },
            { id: 'clubs', label: 'Associated Clubs', count: associatedClubs.length, icon: Building2 },
            { id: 'groups', label: 'Student Groups & Chat', count: groups.length, icon: MessageSquare },
            { id: 'achievements', label: 'Your Achievements', count: achievements.length, icon: Award },
            { id: 'profile', label: 'Edit Profile', icon: Edit3 },
            { id: 'overview', label: 'Overview Metrics', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: YOUR POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Your Published Posts & Announcements</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Post hackathon banners with posters, academic notices, or resource website links for campus students.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowCreatePostModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Post</span>
              </button>
            </div>
          </div>

          {/* Post Filter Bar */}
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Posts' },
              { id: 'HACKATHON', label: 'Hackathons & Events' },
              { id: 'NOTICE', label: 'Academic Notices' },
              { id: 'LINK', label: 'Website Links' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setPostFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  postFilter === f.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loadingPosts ? (
            <div className="p-12 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">
              Loading faculty posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-4">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">No posts under this category</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Share a new hackathon poster, academic examination notice, or website resource link.
                </p>
              </div>
              <button
                onClick={() => setShowCreatePostModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create First Post</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => {
                const isHackathon = post.postType === 'HACKATHON' || post.category.toLowerCase().includes('hack');
                const isLink = post.postType === 'LINK' || Boolean(post.link);
                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
                  >
                    {post.image && (
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        <span
                          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border ${
                            isHackathon
                              ? 'bg-purple-600 text-white border-purple-500'
                              : isLink
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-amber-500 text-white border-amber-400'
                          }`}
                        >
                          {isHackathon ? '⚡ Hackathon' : isLink ? '🌐 Website Link' : '📢 Academic Notice'}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        {!post.image && (
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                isHackathon
                                  ? 'bg-purple-100 text-purple-800'
                                  : isLink
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {post.category}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>

                        {post.prizePool && (
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Prize Pool: <strong>{post.prizePool}</strong></span>
                          </div>
                        )}

                        {post.link && (
                          <div className="pt-1">
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>{post.link}</span>
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500">
                          By <span className="font-medium text-slate-700">{post.facultyName}</span> ({post.department})
                        </div>

                        {/* DELETE POST OPTION */}
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold transition-colors cursor-pointer border border-rose-200/60"
                          title="Delete this post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSOCIATED CLUBS (ADD & REMOVE) */}
      {activeTab === 'clubs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Your Associated Clubs & Societies</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Clubs and campus organizations where you serve as Faculty Advisor, Mentor, or Chief Patron. You can add and remove clubs at any time.
              </p>
            </div>

            <button
              onClick={() => setShowAddClubModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Associated Club</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associatedClubs.map((clubName, index) => {
              const clubData = mitsClubs.find(
                (c) => c.name.toLowerCase() === clubName.toLowerCase() || c.code.toLowerCase() === clubName.toLowerCase()
              );
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg overflow-hidden shrink-0">
                        {clubData?.logo ? (
                          <img src={clubData.logo} alt={clubName} className="w-full h-full object-cover" />
                        ) : (
                          clubName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active Advisory
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{clubName}</h4>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">Role: Faculty Advisor & Chief Mentor</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {clubData?.description || 'Active student society dedicated to campus technical and cultural enrichment.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {clubData?.memberCount || '60+'} Active Members
                    </span>

                    {/* REMOVE CLUB BUTTON */}
                    <button
                      onClick={() => handleRemoveAssociatedClub(clubName)}
                      className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold hover:bg-rose-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                      title="Remove from associated clubs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Club</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT GROUPS & GROUP CHAT */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Student Cohorts & Interactive Group Chat</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Create student cohorts, mentor research papers, and chat directly with students. Both faculty and students can send text messages, images, and event posters!
              </p>
            </div>

            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Student Group</span>
            </button>
          </div>

          {/* Group Chat Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[560px]">
            {/* Left: Groups List */}
            <div className="lg:col-span-4 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Your Student Groups ({groups.length})
                </span>
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  + New Group
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {groups.map((grp) => {
                  const isSelected = grp.id === selectedGroupId;
                  return (
                    <div
                      key={grp.id}
                      onClick={() => setSelectedGroupId(grp.id)}
                      className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                        isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={grp.avatar}
                        alt={grp.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{grp.name}</h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{grp.lastMessageTime || '10:45 AM'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {grp.lastMessage || grp.description}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                          {grp.memberCount} members
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Group Chat */}
            <div className="lg:col-span-8 flex flex-col h-[580px] bg-slate-50/40">
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeGroup.avatar}
                    alt={activeGroup.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{activeGroup.name}</h3>
                    <p className="text-[11px] text-slate-500">
                      {activeGroup.memberCount} students & mentors • {activeGroup.department}
                    </p>
                  </div>
                </div>

                {/* Simulation helper button */}
                <button
                  onClick={() => handleSendMessage('STUDENT')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 flex items-center gap-1 cursor-pointer"
                  title="Simulate a reply as a student in this group"
                >
                  <Users className="w-3 h-3 text-indigo-600" />
                  <span>Reply as Student</span>
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {activeGroupMessages.map((msg) => {
                  const isFaculty = msg.senderRole === 'FACULTY';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${isFaculty ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />

                      <div className="space-y-1">
                        <div className={`flex items-center gap-1.5 text-[11px] ${isFaculty ? 'justify-end' : ''}`}>
                          <span className="font-bold text-slate-900">{msg.senderName}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              isFaculty ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {msg.senderRole}
                          </span>
                          <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isFaculty
                              ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                          }`}
                        >
                          {msg.content && <p>{msg.content}</p>}

                          {/* IMAGE / POSTER DISPLAY */}
                          {msg.imageUrl && (
                            <div className="mt-2.5 rounded-xl overflow-hidden border border-black/10 bg-black/5">
                              <img
                                src={msg.imageUrl}
                                alt="Poster attachment"
                                className="max-h-56 w-full object-cover rounded-lg hover:opacity-95 transition-opacity"
                              />
                              {msg.imageCaption && (
                                <p
                                  className={`p-2 text-[11px] font-medium ${
                                    isFaculty ? 'text-indigo-100 bg-indigo-700/60' : 'text-slate-600 bg-slate-50'
                                  }`}
                                >
                                  📷 {msg.imageCaption}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200">
                {chatImageUrl && (
                  <div className="mb-2 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img src={chatImageUrl} alt="Poster preview" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="text-xs truncate">
                        <span className="font-bold text-slate-800">Poster / Image attached</span>
                        <p className="text-[11px] text-slate-500 truncate">{chatImageCaption || chatImageUrl}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setChatImageUrl('');
                        setChatImageCaption('');
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Attach Image / Poster Button */}
                  <button
                    onClick={() => setShowAttachModal(true)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                    title="Send Poster or Image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage('FACULTY');
                      }
                    }}
                    placeholder={`Message ${activeGroup.name} (Press Enter to send)...`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />

                  <button
                    onClick={() => handleSendMessage('FACULTY')}
                    disabled={!messageInput.trim() && !chatImageUrl}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: YOUR ACHIEVEMENTS (ADD & REMOVE) */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Departmental & Faculty Achievements</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Record and manage college honors, research grants, awards, and accreditations.
              </p>
            </div>

            <button
              onClick={() => setShowAddAchievementModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Achievement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <img src={ach.image} alt={ach.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {ach.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="font-bold text-slate-900 text-base leading-snug">{ach.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {ach.description}
                    </p>
                    {ach.department && (
                      <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        🏛️ {ach.department}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {new Date(ach.date).toLocaleDateString()}
                  </span>

                  {/* REMOVE ACHIEVEMENT BUTTON */}
                  <button
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold hover:bg-rose-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                    title="Remove this achievement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EDIT PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>Edit Faculty Profile & Credentials</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Update your designation, research background, office hours, and public contact information.
              </p>
            </div>

            {profileSavedToast && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Profile Updated!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Designation / Academic Rank
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.designation}
                  onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Office / Cabin Location
                </label>
                <input
                  type="text"
                  value={profileForm.cabin}
                  onChange={(e) => setProfileForm({ ...profileForm, cabin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Phone / Extension
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Highest Qualifications & Degrees
              </label>
              <input
                type="text"
                value={profileForm.qualification}
                onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Research Specializations (comma separated)
              </label>
              <input
                type="text"
                value={profileForm.specialization}
                onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Faculty Bio / Research Statement
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Profile Photo URL
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={profileForm.avatar}
                  alt="Preview"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <input
                  type="url"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block mb-1">Associated Clubs</span>
              <div className="text-2xl font-bold font-mono text-slate-900">{associatedClubs.length}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Active societies</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block mb-1">Your Posts</span>
              <div className="text-2xl font-bold font-mono text-slate-900">{posts.length}</div>
              <span className="text-[11px] text-blue-600 font-medium">Published on feed</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block mb-1">Student Groups</span>
              <div className="text-2xl font-bold font-mono text-slate-900">{groups.length}</div>
              <span className="text-[11px] text-purple-600 font-medium">Active cohorts</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block mb-1">Accolades & Honors</span>
              <div className="text-2xl font-bold font-mono text-slate-900">{achievements.length}</div>
              <span className="text-[11px] text-amber-600 font-medium">Recorded honors</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RBAC Authority Matrix</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              As a verified faculty member of MITS Gwalior, your cryptographic token permits managing advisory clubs, broadcasting hackathons and notices, initiating student group channels, and certifying college achievements.
            </p>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create New Faculty Post</h3>
                  <p className="text-xs text-slate-500">Publish to the public feed & student dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishPost} className="p-6 space-y-5">
              {/* Post Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Post Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'HACKATHON', label: 'Hackathon Post', desc: 'With image / poster banner', icon: Code },
                    { id: 'NOTICE', label: 'Academic Notice', desc: 'Examinations & announcements', icon: FileText },
                    { id: 'LINK', label: 'Website Link', desc: 'Resource or portal URL', icon: LinkIcon },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSel = newPost.postType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setNewPost({
                            ...newPost,
                            postType: t.id as any,
                            category: t.id === 'HACKATHON' ? 'Hackathon' : t.id === 'LINK' ? 'Website Link' : 'Academic Notice',
                          })
                        }
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSel
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${isSel ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold block">{t.label}</span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder={
                    newPost.postType === 'HACKATHON'
                      ? 'e.g. HackMITS 2026: 36-Hour National Hackathon'
                      : newPost.postType === 'LINK'
                      ? 'e.g. IEEE Research Portal Access & Digital Library Credentials'
                      : 'e.g. Minor Project Review-1 Schedule for CSE B.Tech 6th Sem'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Description / Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Post Details / Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Provide comprehensive details, instructions, eligibility criteria, and deliverables..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Type specific fields */}
              {newPost.postType === 'HACKATHON' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Prize Pool (Optional)
                    </label>
                    <input
                      type="text"
                      value={newPost.prizePool}
                      onChange={(e) => setNewPost({ ...newPost, prizePool: e.target.value })}
                      placeholder="e.g. ₹2,50,000 + Tech Internship Offers"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registration / Portal Link
                    </label>
                    <input
                      type="url"
                      value={newPost.link}
                      onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                      placeholder="https://hackmits.mits.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {newPost.postType === 'LINK' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Website Resource URL
                  </label>
                  <input
                    type="url"
                    required
                    value={newPost.link}
                    onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                    placeholder="https://ieeexplore.ieee.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Image / Poster Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Poster Image / Banner
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {SAMPLE_POSTERS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewPost({ ...newPost, image: s.url })}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer ${
                        newPost.image === s.url
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={newPost.image}
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPost ? 'Publishing...' : 'Publish Post Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ASSOCIATED CLUB MODAL */}
      {showAddClubModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">Add Associated Club</h3>
              <button onClick={() => setShowAddClubModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAssociatedClub} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Club / Society
                </label>
                <select
                  required
                  value={selectedClubToAdd}
                  onChange={(e) => setSelectedClubToAdd(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Choose from 84 MITS Clubs --</option>
                  {mitsClubs
                    .filter((c) => !associatedClubs.includes(c.name))
                    .map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Advisory Title
                </label>
                <input
                  type="text"
                  value={clubAdvisoryRole}
                  onChange={(e) => setClubAdvisoryRole(e.target.value)}
                  placeholder="e.g. Faculty Advisor & Technical Mentor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClubModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedClubToAdd}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Add Club to Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE STUDENT GROUP MODAL */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">Create Student Mentorship Group</h3>
              <button onClick={() => setShowCreateGroupModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab Cohort B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Group Purpose / Description
                </label>
                <textarea
                  rows={3}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Mentorship cohort for lab evaluations, project checkpoints, and student queries..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create Group Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHAT ATTACH POSTER/IMAGE MODAL */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Attach Poster or Image to Chat</span>
              </h3>
              <button onClick={() => setShowAttachModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Preset Campus Poster
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_POSTERS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setChatImageUrl(s.url);
                        setChatImageCaption(s.label);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                        chatImageUrl === s.url ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200'
                      }`}
                    >
                      <img src={s.url} alt={s.label} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-[11px] font-semibold text-slate-800 line-clamp-1">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Enter Image URL
                </label>
                <input
                  type="url"
                  value={chatImageUrl}
                  onChange={(e) => setChatImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Poster Caption / Description
                </label>
                <input
                  type="text"
                  value={chatImageCaption}
                  onChange={(e) => setChatImageCaption(e.target.value)}
                  placeholder="e.g. HackMITS 2026 Official Poster"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowAttachModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAttachModal(false)}
                  disabled={!chatImageUrl}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-50"
                >
                  Ready to Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD ACHIEVEMENT MODAL */}
      {showAddAchievementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">Add New Achievement</h3>
              <button onClick={() => setShowAddAchievementModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAchievement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Achievement Title
                </label>
                <input
                  type="text"
                  required
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="e.g. Best Faculty Researcher in Deep Learning 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newAchievement.category}
                  onChange={(e) => setNewAchievement({ ...newAchievement, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="COLLEGE">College Honor</option>
                  <option value="STUDENT">Student Laurels</option>
                  <option value="CLUB">Club Accolade</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Details of the accolade, awarding agency, and citations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department / Affiliation
                  </label>
                  <input
                    type="text"
                    value={newAchievement.department}
                    onChange={(e) => setNewAchievement({ ...newAchievement, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAchievementModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Record Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
