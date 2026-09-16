import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Club, EventItem, HiringItem, ClubMembership } from '../../types';
import {
  Calendar,
  Users,
  Briefcase,
  MessageSquare,
  Edit3,
  PlusCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Send,
  X,
  Sparkles,
  UserCheck,
  UserPlus,
  LayoutDashboard,
  Filter,
  Check,
  FileText,
  Phone,
  Mail,
  Building,
  Building2,
  GraduationCap,
  Globe,
  Share2,
  Eye,
} from 'lucide-react';

interface ClubLeaderDashboardProps {
  onNavigateHome: () => void;
  initialTab?: 'events' | 'members' | 'profile' | 'groups' | 'hiring' | 'overview';
}

interface ClubGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  timestamp: string;
}

const PRESET_EVENT_POSTERS = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
];

const PRESET_HIRING_POSTERS = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
];

export const PRESET_CLUB_LOGOS = [
  { label: 'Coding / Tech', url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=200&auto=format&fit=crop&q=80' },
  { label: 'Robotics / AI', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Cultural & Arts', url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=200&auto=format&fit=crop&q=80' },
  { label: 'Sports & Athletics', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&auto=format&fit=crop&q=80' },
  { label: 'Design & Media', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=200&auto=format&fit=crop&q=80' },
  { label: 'Literary & Debating', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=200&auto=format&fit=crop&q=80' },
];

export const PRESET_CLUB_BANNERS = [
  { label: 'Coding & Hackathon Lab', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Tech Campus & Students', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Club Meetup & Teamwork', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Auditorium & Stage', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80' },
];

export const ClubLeaderDashboard: React.FC<ClubLeaderDashboardProps> = ({
  onNavigateHome,
  initialTab = 'events',
}) => {
  const { user, token, logout, updateUser } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'events' | 'members' | 'profile' | 'groups' | 'hiring' | 'overview'>(
    initialTab
  );

  // Club context info (defaults to Competitive Coding Club if user is Rahul Verma or club_12)
  const primaryMembership = user?.clubMemberships?.[0];
  const clubId = primaryMembership?.clubId || 'club_12';
  const clubPosition = primaryMembership?.position || 'President';
  const [clubDetails, setClubDetails] = useState<Club | null>(null);

  // Data states
  const [events, setEvents] = useState<EventItem[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [hiringList, setHiringList] = useState<HiringItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Group chat states
  const [groups, setGroups] = useState<ClubGroup[]>([
    {
      id: 'grp_club_core',
      name: 'Core Executive Committee',
      description: 'Central strategy, budgets, event approvals, and administration with faculty mentors.',
      category: 'Leadership',
      memberCount: 8,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'All approvals for the annual hackathon venue are sorted!',
      lastMessageTime: '10:15 AM',
    },
    {
      id: 'grp_club_events',
      name: 'HackMITS Organizing & Ops Wing',
      description: 'Logistics, guest speakers, refreshments, stage management, and sponsor relations.',
      category: 'Event Ops',
      memberCount: 24,
      avatar: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Poster and registration links are live on the dashboard.',
      lastMessageTime: 'Yesterday',
    },
    {
      id: 'grp_club_dsa',
      name: 'Competitive Programming & ICPC Cohort',
      description: 'Daily algorithmic problem discussions, contest editorials, and weekly mock battles.',
      category: 'Technical',
      memberCount: 45,
      avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Check out problem D from yesterday Codeforces Div 2 round.',
      lastMessageTime: '2 days ago',
    },
  ]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp_club_core');
  const [messages, setMessages] = useState<Record<string, GroupMessage[]>>({
    grp_club_core: [
      {
        id: 'msg_1',
        groupId: 'grp_club_core',
        senderId: 'usr_stu_01',
        senderName: 'Rahul Verma',
        senderRole: 'President',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        content: 'Good morning leads! Please submit your final requirements for the upcoming workshop.',
        timestamp: 'Yesterday, 04:30 PM',
      },
      {
        id: 'msg_2',
        groupId: 'grp_club_core',
        senderId: 'usr_stu_03',
        senderName: 'Priya Nair',
        senderRole: 'Technical Head',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        content: 'Reviewed! We have prepared the problem set and lab setup for SAC Hall.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Event schedule & track outline verified',
        timestamp: 'Yesterday, 05:15 PM',
      },
      {
        id: 'msg_3',
        groupId: 'grp_club_core',
        senderId: 'usr_stu_01',
        senderName: 'Rahul Verma',
        senderRole: 'President',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        content: 'All approvals for the annual hackathon venue are sorted!',
        timestamp: 'Today, 10:15 AM',
      },
    ],
    grp_club_events: [
      {
        id: 'msg_201',
        groupId: 'grp_club_events',
        senderId: 'usr_stu_01',
        senderName: 'Rahul Verma',
        senderRole: 'President',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        content: 'Poster and registration links are live on the dashboard.',
        timestamp: 'Yesterday, 11:45 AM',
      },
    ],
    grp_club_dsa: [
      {
        id: 'msg_301',
        groupId: 'grp_club_dsa',
        senderId: 'usr_stu_02',
        senderName: 'Hariom Gupta',
        senderRole: 'Technical Member',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        content: 'Check out problem D from yesterday Codeforces Div 2 round.',
        timestamp: '2 days ago',
      },
    ],
  });

  const [chatInput, setChatInput] = useState('');
  const [chatImageInput, setChatImageInput] = useState('');
  const [showImageAttachment, setShowImageAttachment] = useState(false);

  // Modals
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showCreateHiringModal, setShowCreateHiringModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Forms
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Technical',
    date: '2026-09-25',
    time: '10:00 AM - 04:00 PM',
    venue: 'SAC Auditorium, MITS Gwalior',
    poster: PRESET_EVENT_POSTERS[0],
    registrationLink: 'https://forms.google.com/mits-coding-contest',
    description: '',
    tags: 'DSA, Algorithms, Coding, Competition',
  });

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    year: '2nd Year',
    position: 'Executive Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    canCreateEvents: false,
    canManageHiring: false,
    canManageMembers: false,
  });

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'Project Team',
    initialMessage: 'Welcome to our newly formed team channel! Let us collaborate effectively.',
  });

  const [newHiring, setNewHiring] = useState({
    position: '',
    description: '',
    eligibility: 'Open to 2nd & 3rd Year B.Tech Students (All Branches)',
    requiredSkills: 'Data Structures, Problem Solving, Git, Communication',
    applicationLink: 'https://forms.google.com/mits-club-recruitment-2026',
    deadline: '2026-10-15',
    poster: PRESET_HIRING_POSTERS[0],
  });

  // Club Profile Form state (for editing club's name, logo, banner, tagline, description, category, advisor, contacts)
  const [clubProfileForm, setClubProfileForm] = useState({
    name: 'Competitive Coding Club',
    code: 'CCC',
    tagline: 'Code, Compete, Conquer - Empowering Student Programmers',
    category: 'Technical' as Club['category'],
    description: 'The premier competitive programming and algorithmic problem-solving society of MITS Gwalior. Organizing coding marathons, hackathons, and DSA workshops.',
    logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    email: 'codingclub@college.edu',
    facultyAdvisor: 'Dr. Akhilesh Tiwari',
    website: 'https://mitsgwalior.in/clubs/ccc',
    meetingSchedule: 'Every Wednesday & Friday at 5:00 PM • SAC Lab 3',
    instagram: 'instagram.com/ccc_mits',
    linkedin: 'linkedin.com/company/ccc-mits',
    github: 'github.com/ccc-mits',
  });

  // Profile Form state for leader info
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Rahul Verma',
    email: user?.email || 'rahul.verma@college.edu',
    department: user?.department || 'Computer Science',
    year: user?.year || '3rd Year',
    studentId: user?.studentId || 'STU-2023-CS042',
    phone: user?.phone || '+91 98765 43210',
    bio: user?.bio || 'President of Competitive Coding Club. Passionate about algorithms, distributed systems, and empowering student engineers.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  });

  // Flash feedback banner
  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Initial data loading
  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, hiringRes, membersRes, clubRes] = await Promise.all([
        api.getEvents(undefined, undefined, clubId),
        api.getHiring(clubId),
        api.getClubMembers(clubId),
        api.getClubById(clubId),
      ]);

      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
      }
      if (hiringRes.success && hiringRes.data) {
        setHiringList(hiringRes.data);
      }
      if (membersRes.success && membersRes.data) {
        setMembers(membersRes.data);
      } else {
        // Fallback default sample members if empty
        setMembers([
          {
            id: 'cm_01',
            clubId: clubId,
            studentName: 'Rahul Verma',
            studentEmail: 'rahul.verma@college.edu',
            position: 'President',
            department: 'Computer Science',
            year: '3rd Year',
            joiningDate: '2023-08-15',
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
          },
          {
            id: 'cm_02',
            clubId: clubId,
            studentName: 'Priya Nair',
            studentEmail: 'priya.nair@college.edu',
            position: 'Technical Head',
            department: 'Electronics & Comm.',
            year: '3rd Year',
            joiningDate: '2023-09-01',
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          },
          {
            id: 'cm_03',
            clubId: clubId,
            studentName: 'Hariom Gupta',
            studentEmail: 'hariom@college.edu',
            position: 'Technical Member',
            department: 'Information Technology',
            year: '2nd Year',
            joiningDate: '2024-01-10',
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          },
        ]);
      }
      if (clubRes.success && clubRes.data) {
        const c = clubRes.data;
        setClubDetails(c);
        setClubProfileForm({
          name: c.name || 'Competitive Coding Club',
          code: c.code || 'CCC',
          tagline: c.tagline || '',
          category: c.category || 'Technical',
          description: c.description || '',
          logo: c.logo || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=200&auto=format&fit=crop&q=80',
          banner: c.banner || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
          email: c.email || `${c.code?.toLowerCase() || 'codingclub'}@college.edu`,
          facultyAdvisor: c.facultyAdvisor || '',
          website: c.website || '',
          meetingSchedule: (c as any).meetingSchedule || 'Every Wednesday & Friday at 5:00 PM • SAC Lab 3',
          instagram: (c as any).instagram || 'instagram.com/ccc_mits',
          linkedin: (c as any).linkedin || 'linkedin.com/company/ccc-mits',
          github: (c as any).github || 'github.com/ccc-mits',
        });
      }
    } catch (e) {
      console.error('Error fetching club data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clubId]);

  // Handle Event Creation
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) {
      showNotification('Please enter an event title.', 'error');
      return;
    }

    const payload = {
      title: newEvent.title.trim(),
      description: newEvent.description.trim() || 'Join us for this premier club event at MITS Gwalior.',
      poster: newEvent.poster || PRESET_EVENT_POSTERS[0],
      date: newEvent.date,
      time: newEvent.time,
      venue: newEvent.venue,
      registrationLink: newEvent.registrationLink,
      category: newEvent.category as any,
      tags: newEvent.tags.split(',').map((t) => t.trim()).filter(Boolean),
      clubId: clubId,
      clubName: clubDetails?.name || 'Competitive Coding Club',
    };

    try {
      const res = await api.createEvent(payload, token || 'mock-jwt-token');
      if (res.success && res.data) {
        setEvents((prev) => [res.data!, ...prev]);
        showNotification(`Event "${payload.title}" created and published successfully!`);
      } else {
        // Optimistic fallback
        const mockItem: EventItem = {
          id: `evt_${Date.now()}`,
          ...payload,
        };
        setEvents((prev) => [mockItem, ...prev]);
        showNotification(`Event "${payload.title}" created successfully!`);
      }
      setShowCreateEventModal(false);
      setNewEvent({
        title: '',
        category: 'Technical',
        date: '2026-09-25',
        time: '10:00 AM - 04:00 PM',
        venue: 'SAC Auditorium, MITS Gwalior',
        poster: PRESET_EVENT_POSTERS[0],
        registrationLink: 'https://forms.google.com/mits-coding-contest',
        description: '',
        tags: 'DSA, Algorithms, Coding, Competition',
      });
    } catch (err: any) {
      showNotification(err.message || 'Failed to create event', 'error');
    }
  };

  // Handle Remove Event
  const handleRemoveEvent = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to remove the event "${eventTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      if (token) {
        await api.deleteEvent(eventId, token);
      }
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showNotification(`Event "${eventTitle}" has been removed.`);
    } catch (err: any) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showNotification(`Event removed successfully.`);
    }
  };

  // Handle Add Club Member & Assign Role
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) {
      showNotification('Please provide student name and college email.', 'error');
      return;
    }

    const memberPayload = {
      clubId,
      userId: `usr_stu_${Date.now()}`,
      studentName: newMember.name.trim(),
      studentEmail: newMember.email.trim(),
      position: newMember.position,
      department: newMember.department,
      year: newMember.year,
      avatar: newMember.avatar,
      permissions: {
        canCreateEvents: newMember.canCreateEvents,
        canManageHiring: newMember.canManageHiring,
        canManageMembers: newMember.canManageMembers,
        canPostAchievements: true,
      },
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    try {
      if (token) {
        const res = await api.addClubMember(memberPayload, token);
        if (res.success && res.data) {
          setMembers((prev) => [...prev, res.data]);
        } else {
          setMembers((prev) => [...prev, { ...memberPayload, id: `cm_${Date.now()}` }]);
        }
      } else {
        setMembers((prev) => [...prev, { ...memberPayload, id: `cm_${Date.now()}` }]);
      }
      showNotification(`Member ${memberPayload.studentName} added with role "${memberPayload.position}"!`);
      setShowAddMemberModal(false);
      setNewMember({
        name: '',
        email: '',
        department: 'Computer Science',
        year: '2nd Year',
        position: 'Executive Member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        canCreateEvents: false,
        canManageHiring: false,
        canManageMembers: false,
      });
    } catch (err: any) {
      showNotification(err.message || 'Failed to add member', 'error');
    }
  };

  // Handle Update Member Role
  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      if (token) {
        await api.updateClubMember(memberId, { position: newRole }, token);
      }
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, position: newRole } : m))
      );
      showNotification(`Role updated to ${newRole}!`);
    } catch {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, position: newRole } : m))
      );
      showNotification(`Role updated to ${newRole}!`);
    }
  };

  // Handle Remove Member
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this club?`)) {
      return;
    }

    try {
      if (token) {
        await api.removeClubMember(memberId, token);
      }
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showNotification(`${memberName} has been removed from club membership.`);
    } catch {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showNotification(`${memberName} has been removed from club membership.`);
    }
  };

  // Handle Save Club Profile (Name, Logo, Banner, Category, Tagline, Description, Contacts, Mentors)
  const handleSaveClubProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubProfileForm.name.trim()) {
      showNotification('Please enter a club name.', 'error');
      return;
    }

    const updatedData: Partial<Club> = {
      name: clubProfileForm.name.trim(),
      code: clubProfileForm.code.trim().toUpperCase(),
      tagline: clubProfileForm.tagline.trim(),
      category: clubProfileForm.category,
      description: clubProfileForm.description.trim(),
      logo: clubProfileForm.logo,
      banner: clubProfileForm.banner,
      email: clubProfileForm.email.trim(),
      facultyAdvisor: clubProfileForm.facultyAdvisor.trim(),
      website: clubProfileForm.website.trim(),
    };

    try {
      if (token) {
        await api.updateClub(clubId, updatedData, token);
      }
      setClubDetails((prev) => (prev ? { ...prev, ...updatedData } : ({ id: clubId, ...updatedData } as any)));
      showNotification(`Club profile for "${updatedData.name}" has been updated successfully!`);
    } catch {
      setClubDetails((prev) => (prev ? { ...prev, ...updatedData } : ({ id: clubId, ...updatedData } as any)));
      showNotification(`Club profile for "${updatedData.name}" has been updated successfully!`);
    }
  };

  // Handle Save Leader Personal Profile (Optional)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: profileForm.name,
      email: profileForm.email,
      department: profileForm.department,
      year: profileForm.year,
      studentId: profileForm.studentId,
      phone: profileForm.phone,
      bio: profileForm.bio,
      avatar: profileForm.avatar,
    });
    showNotification('Leader profile details saved successfully!');
  };

  // Handle Create New Group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name.trim()) {
      showNotification('Please enter a group name.', 'error');
      return;
    }

    const newGroupId = `grp_club_${Date.now()}`;
    const groupItem: ClubGroup = {
      id: newGroupId,
      name: newGroup.name.trim(),
      description: newGroup.description.trim() || 'Collaborative team group for club members.',
      category: newGroup.category,
      memberCount: members.length || 12,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
      lastMessage: newGroup.initialMessage || 'Channel created by Club President.',
      lastMessageTime: 'Just now',
    };

    const initialMsg: GroupMessage = {
      id: `msg_${Date.now()}`,
      groupId: newGroupId,
      senderId: user?.id || 'usr_stu_01',
      senderName: user?.name || 'Rahul Verma',
      senderRole: clubPosition,
      senderAvatar: user?.avatar || profileForm.avatar,
      content: newGroup.initialMessage || 'Welcome everyone to our new group!',
      timestamp: 'Just now',
    };

    setGroups((prev) => [groupItem, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newGroupId]: [initialMsg],
    }));
    setSelectedGroupId(newGroupId);
    setShowCreateGroupModal(false);
    setNewGroup({
      name: '',
      description: '',
      category: 'Project Team',
      initialMessage: 'Welcome to our newly formed team channel! Let us collaborate effectively.',
    });
    showNotification(`New group "${groupItem.name}" created successfully!`);
  };

  // Handle Remove Group
  const handleRemoveGroup = (groupId: string, groupName: string) => {
    if (groups.length <= 1) {
      showNotification('You must keep at least one active group channel for the club.', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the group "${groupName}"? Chat history will be lost.`)) {
      return;
    }

    setGroups((prev) => {
      const remaining = prev.filter((g) => g.id !== groupId);
      if (selectedGroupId === groupId && remaining.length > 0) {
        setSelectedGroupId(remaining[0].id);
      }
      return remaining;
    });

    setMessages((prev) => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });

    showNotification(`Group "${groupName}" was deleted.`);
  };

  // Handle Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !chatImageInput.trim()) return;

    const newMsg: GroupMessage = {
      id: `msg_${Date.now()}`,
      groupId: selectedGroupId,
      senderId: user?.id || 'usr_stu_01',
      senderName: user?.name || 'Rahul Verma',
      senderRole: clubPosition,
      senderAvatar: user?.avatar || profileForm.avatar,
      content: chatInput.trim() || 'Attached an image update.',
      imageUrl: chatImageInput.trim() || undefined,
      imageCaption: chatImageInput.trim() ? 'Attachment shared by Leader' : undefined,
      timestamp: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [selectedGroupId]: [...(prev[selectedGroupId] || []), newMsg],
    }));

    // Update group preview
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId
          ? {
              ...g,
              lastMessage: chatInput.trim() || 'Shared an image',
              lastMessageTime: 'Just now',
            }
          : g
      )
    );

    setChatInput('');
    setChatImageInput('');
    setShowImageAttachment(false);
  };

  // Handle Create Hiring
  const handleCreateHiring = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHiring.position.trim()) {
      showNotification('Please provide a hiring position title.', 'error');
      return;
    }

    const payload = {
      clubId,
      position: newHiring.position.trim(),
      description: newHiring.description.trim() || 'Key leadership position for the upcoming tenure.',
      eligibility: newHiring.eligibility.trim(),
      requiredSkills: newHiring.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      deadline: newHiring.deadline,
      poster: newHiring.poster || PRESET_HIRING_POSTERS[0],
      applicationLink: newHiring.applicationLink.trim() || 'https://forms.google.com/mits-recruitment',
      status: 'OPEN' as const,
    };

    try {
      if (token) {
        const res = await api.createHiring(payload, token);
        if (res.success && res.data) {
          setHiringList((prev) => [res.data!, ...prev]);
        } else {
          setHiringList((prev) => [{ ...payload, id: `hire_${Date.now()}`, clubName: 'Competitive Coding Club' } as any, ...prev]);
        }
      } else {
        setHiringList((prev) => [{ ...payload, id: `hire_${Date.now()}`, clubName: 'Competitive Coding Club' } as any, ...prev]);
      }
      showNotification(`Recruitment drive for "${payload.position}" is now live!`);
      setShowCreateHiringModal(false);
      setNewHiring({
        position: '',
        description: '',
        eligibility: 'Open to 2nd & 3rd Year B.Tech Students (All Branches)',
        requiredSkills: 'Data Structures, Problem Solving, Git, Communication',
        applicationLink: 'https://forms.google.com/mits-club-recruitment-2026',
        deadline: '2026-10-15',
        poster: PRESET_HIRING_POSTERS[0],
      });
    } catch (err: any) {
      showNotification(err.message || 'Failed to post hiring', 'error');
    }
  };

  // Handle Remove Hiring
  const handleRemoveHiring = async (hiringId: string, positionTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete the hiring listing for "${positionTitle}"?`)) {
      return;
    }

    try {
      if (token) {
        await api.deleteHiring(hiringId, token);
      }
      setHiringList((prev) => prev.filter((h) => h.id !== hiringId));
      showNotification(`Hiring post "${positionTitle}" has been removed.`);
    } catch {
      setHiringList((prev) => prev.filter((h) => h.id !== hiringId));
      showNotification(`Hiring post removed.`);
    }
  };

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const activeGroupMessages = messages[selectedGroupId] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-700 ml-4 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Club Leader Hero Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || profileForm.avatar}
                alt={user?.name || 'Club Leader'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-xs border border-slate-200"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-lg shadow-xs" title="Club Leader">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {user?.name || profileForm.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  {clubPosition}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                  <img
                    src={clubDetails?.logo || clubProfileForm.logo}
                    alt="Club Logo"
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                  <span>{clubDetails?.name || clubProfileForm.name || 'Competitive Coding Club'}</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {user?.email || profileForm.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-slate-400" />
                  {user?.department || profileForm.department} ({user?.year || profileForm.year})
                </span>
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Full RBAC Club Leadership Privileges
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons in Hero */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              id="hero-create-event-btn"
              onClick={() => {
                setActiveTab('events');
                setShowCreateEventModal(true);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-200 transition-all hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </button>

            <button
              id="hero-add-member-btn"
              onClick={() => {
                setActiveTab('members');
                setShowAddMemberModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>Add Member</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              title="Return to public site"
            >
              Public Site
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

      {/* NAVIGATION SECTION TABS (The Requested Nav Sec) */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
          {[
            { id: 'events', label: 'Events & Posters', count: events.length, icon: Calendar },
            { id: 'members', label: 'Club Members & Roles', count: members.length, icon: Users },
            { id: 'profile', label: 'Edit Club Profile', icon: Building2 },
            { id: 'groups', label: 'Member Groups & Chat', count: groups.length, icon: MessageSquare },
            { id: 'hiring', label: 'Club Hiring & Roles', count: hiringList.length, icon: Briefcase },
            { id: 'overview', label: 'Overview Metrics', icon: LayoutDashboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
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

      {/* ============================================================ */}
      {/* TAB 1: CREATE EVENT & REMOVE EVENT (WITH POSTER, LINK, TITLE) */}
      {/* ============================================================ */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Club Events & Poster Management</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Publish events with custom posters, registration forms, dates, and remove expired or cancelled events.
              </p>
            </div>

            <button
              id="open-create-event-modal"
              onClick={() => setShowCreateEventModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No events published yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ready to organize a hackathon, coding contest, or technical workshop? Click below to publish your first event!
              </p>
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Create Event Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all"
                >
                  {/* Poster Image */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={evt.poster}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                        {evt.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {/* REMOVE EVENT BUTTON */}
                      <button
                        onClick={() => handleRemoveEvent(evt.id, evt.title)}
                        className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-semibold backdrop-blur-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                        title="Remove this event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-1.5 pt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>

                      {evt.tags && evt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {evt.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Registration Link & Remove Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {evt.registrationLink ? (
                        <a
                          href={evt.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Registration Form</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">On-spot Entry</span>
                      )}

                      <button
                        onClick={() => handleRemoveEvent(evt.id, evt.title)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: CLUB MEMBERS (ADD MEMBERS, GIVE ROLLS, REMOVE OPTION) */}
      {/* ============================================================ */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Club Roster & Role Assignments</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Add your club members, assign executive and operational roles, update responsibilities, or remove members.
              </p>
            </div>

            <button
              id="open-add-member-modal"
              onClick={() => setShowAddMemberModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Club Member</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">Member Name & Email</th>
                    <th className="py-3.5 px-4">Department & Year</th>
                    <th className="py-3.5 px-4">Assigned Role (Roll)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Quick Role Change</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${m.studentName}`}
                            alt={m.studentName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{m.studentName}</div>
                            <div className="text-[11px] text-slate-500">{m.studentEmail}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        <span className="font-medium text-slate-800">{m.department || 'Engineering'}</span>
                        <span className="block text-[11px] text-slate-400">{m.year || 'Student Member'}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                            m.position === 'President'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : m.position.includes('Lead') || m.position.includes('Head')
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : m.position.includes('Coordinator')
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.position}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {m.status || 'ACTIVE'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={m.position}
                          onChange={(e) => handleUpdateMemberRole(m.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="President">President</option>
                          <option value="Vice President">Vice President</option>
                          <option value="Technical Head">Technical Head</option>
                          <option value="Event Coordinator">Event Coordinator</option>
                          <option value="PR & Outreach Head">PR & Outreach Head</option>
                          <option value="Design & Media Lead">Design & Media Lead</option>
                          <option value="Core Member">Core Member</option>
                          <option value="Technical Member">Technical Member</option>
                          <option value="Executive Member">Executive Member</option>
                        </select>
                      </td>

                      <td className="py-4 px-5 text-right">
                        {/* REMOVE MEMBER OPTION */}
                        <button
                          onClick={() => handleRemoveMember(m.id, m.studentName)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                          title="Remove member from club"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: EDIT CLUB PROFILE                                     */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>Edit Club Profile & Identity</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Customize your club's official public name, avatar logo, banner cover, description, category, and contact channels.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authorized as <strong>{clubPosition}</strong></span>
              </div>
            </div>
          </div>

          {/* Live Public Profile Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Live Public Preview: How Students See Your Club
              </span>
              <span className="text-[11px] text-slate-500">Live Campus Directory Card</span>
            </div>

            {/* Banner preview */}
            <div className="relative h-44 sm:h-52 w-full bg-slate-800 overflow-hidden">
              <img
                src={clubProfileForm.banner}
                alt="Club Banner Preview"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Badges on banner */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 shadow-sm backdrop-blur-xs">
                  {clubProfileForm.category}
                </span>
                {clubProfileForm.code && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-600 text-white shadow-sm">
                    {clubProfileForm.code}
                  </span>
                )}
              </div>

              {/* Floating logo and club headline */}
              <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end gap-4 text-white">
                <img
                  src={clubProfileForm.logo}
                  alt={clubProfileForm.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/90 shadow-lg bg-white shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold truncate drop-shadow-sm">
                    {clubProfileForm.name || 'Your Club Name'}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                    {clubProfileForm.tagline || 'Club tagline and motto'}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Footer Info */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 bg-white">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Faculty Advisor</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  {clubProfileForm.facultyAdvisor || 'Faculty Advisor / Mentor'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Official Email</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  {clubProfileForm.email || 'club@college.edu'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Regular Meetings</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  {clubProfileForm.meetingSchedule || 'Weekly meetings'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSaveClubProfile} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
            {/* 1. VISUAL BRANDING (LOGO & BANNER) */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>1. Club Branding & Visual Assets</span>
              </h3>

              {/* Club Logo / Avatar Picker */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={clubProfileForm.logo}
                    alt="Club Logo"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-xs border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-xs font-bold text-slate-700 block">Club Avatar / Logo URL</label>
                    <input
                      type="url"
                      required
                      value={clubProfileForm.logo}
                      onChange={(e) => setClubProfileForm({ ...clubProfileForm, logo: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://..."
                    />
                    <p className="text-[11px] text-slate-500">
                      Square ratio image recommended (PNG or JPG, minimum 200x200).
                    </p>
                  </div>
                </div>

                {/* Logo Preset Picker */}
                <div className="border-t border-slate-200/80 pt-3">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">Preset Club Logos:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_CLUB_LOGOS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setClubProfileForm({ ...clubProfileForm, logo: item.url })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          clubProfileForm.logo === item.url
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <img src={item.url} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Club Banner Cover Picker */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Club Banner / Cover Photo URL</label>
                    <span className="text-[11px] text-slate-500">Wide banner ratio (1200x400)</span>
                  </div>
                  <input
                    type="url"
                    required
                    value={clubProfileForm.banner}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, banner: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://..."
                  />
                </div>

                {/* Banner Preset Picker */}
                <div className="border-t border-slate-200/80 pt-3">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">Preset Club Banners:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_CLUB_BANNERS.map((banner) => (
                      <button
                        key={banner.label}
                        type="button"
                        onClick={() => setClubProfileForm({ ...clubProfileForm, banner: banner.url })}
                        className={`group relative rounded-xl overflow-hidden border text-left cursor-pointer transition-all ${
                          clubProfileForm.banner === banner.url
                            ? 'ring-2 ring-indigo-600 border-indigo-600'
                            : 'border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <img src={banner.url} alt={banner.label} className="w-full h-16 object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-1 text-[10px] text-white font-medium truncate text-center">
                          {banner.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CLUB IDENTITY & BASIC INFO */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>2. Club Identity & Overview</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Club Official Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clubProfileForm.name}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="e.g., Competitive Coding Club"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Club Acronym / Code</label>
                  <input
                    type="text"
                    value={clubProfileForm.code}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono font-medium uppercase"
                    placeholder="e.g., CCC"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category / Domain</label>
                  <select
                    value={clubProfileForm.category}
                    onChange={(e) =>
                      setClubProfileForm({ ...clubProfileForm, category: e.target.value as Club['category'] })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Literary">Literary</option>
                    <option value="Social">Social</option>
                    <option value="Professional Society">Professional Society</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Club Tagline / Motto</label>
                  <input
                    type="text"
                    value={clubProfileForm.tagline}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="e.g., Code, Compete, Conquer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Club Full Description & Mission</label>
                <textarea
                  rows={4}
                  value={clubProfileForm.description}
                  onChange={(e) => setClubProfileForm({ ...clubProfileForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium leading-relaxed"
                  placeholder="Describe your club's primary purpose, regular workshops, hackathons, and achievements..."
                />
              </div>
            </div>

            {/* 3. FACULTY MENTORSHIP & ADMINISTRATIVE CONTACTS */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>3. Faculty Mentorship & Meeting Logistics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Advisor / Mentor</label>
                  <input
                    type="text"
                    value={clubProfileForm.facultyAdvisor}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, facultyAdvisor: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="e.g., Dr. Akhilesh Tiwari (Prof. CSE)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Club Email</label>
                  <input
                    type="email"
                    value={clubProfileForm.email}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="e.g., codingclub@college.edu"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Schedule & Location</label>
                  <input
                    type="text"
                    value={clubProfileForm.meetingSchedule}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, meetingSchedule: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="e.g., Every Wednesday & Friday at 5:00 PM • SAC Lab 3"
                  />
                </div>
              </div>
            </div>

            {/* 4. WEB & SOCIAL MEDIA PRESENCE */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>4. Web & Social Media Links</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Club Website / Link</label>
                  <input
                    type="text"
                    value={clubProfileForm.website}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="https://mitsgwalior.in/clubs/ccc"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Organization</label>
                  <input
                    type="text"
                    value={clubProfileForm.github}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, github: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="github.com/ccc-mits"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Organization</label>
                  <input
                    type="text"
                    value={clubProfileForm.linkedin}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="linkedin.com/company/ccc-mits"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={clubProfileForm.instagram}
                    onChange={(e) => setClubProfileForm({ ...clubProfileForm, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium"
                    placeholder="instagram.com/ccc_mits"
                  />
                </div>
              </div>
            </div>

            {/* Form Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <span className="text-[11px] text-slate-500">
                Changes saved here reflect in the college clubs directory, event cards, and hiring posts.
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (clubDetails) {
                      setClubProfileForm({
                        name: clubDetails.name || '',
                        code: clubDetails.code || '',
                        tagline: clubDetails.tagline || '',
                        category: clubDetails.category || 'Technical',
                        description: clubDetails.description || '',
                        logo: clubDetails.logo || PRESET_CLUB_LOGOS[0].url,
                        banner: clubDetails.banner || PRESET_CLUB_BANNERS[0].url,
                        email: clubDetails.email || '',
                        facultyAdvisor: clubDetails.facultyAdvisor || '',
                        website: clubDetails.website || '',
                        meetingSchedule: (clubDetails as any).meetingSchedule || 'Every Wednesday & Friday at 5:00 PM • SAC Lab 3',
                        instagram: (clubDetails as any).instagram || '',
                        linkedin: (clubDetails as any).linkedin || '',
                        github: (clubDetails as any).github || '',
                      });
                      showNotification('Club profile reset to loaded data.');
                    }
                  }}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  id="save-club-profile-btn"
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Club Profile Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MEMBER GROUPS & CHAT (CHAT, CREATE NEW GROUP, AND REMOVE GROUP)     */}
      {/* ========================================================================= */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Club Channels, Teams & Group Chat</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Collaborate with core leads, organizing committees, create dedicated sub-teams, share images and posters in real-time.
              </p>
            </div>

            <button
              id="open-create-group-modal"
              onClick={() => setShowCreateGroupModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Group</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-h-[550px]">
            {/* Left Col: Groups List (4 cols) */}
            <div className="lg:col-span-4 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Club Channels ({groups.length})
                </span>
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
                {groups.map((grp) => {
                  const isSelected = grp.id === selectedGroupId;
                  return (
                    <div
                      key={grp.id}
                      onClick={() => setSelectedGroupId(grp.id)}
                      className={`p-4 cursor-pointer transition-colors relative group flex items-start gap-3 ${
                        isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={grp.avatar}
                        alt={grp.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{grp.name}</h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{grp.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{grp.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white border border-slate-200 text-slate-600">
                            {grp.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {grp.memberCount} members
                          </span>
                        </div>
                      </div>

                      {/* REMOVE GROUP OPTION */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGroup(grp.id, grp.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all absolute right-3 top-4 cursor-pointer"
                        title="Delete this group channel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Active Chat Room (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-slate-50/30">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeGroup.avatar}
                    alt={activeGroup.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{activeGroup.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                        {activeGroup.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{activeGroup.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveGroup(activeGroup.id, activeGroup.name)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                    title="Remove group"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Group</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[380px]">
                {activeGroupMessages.map((msg) => {
                  const isMe = msg.senderName === (user?.name || profileForm.name) || msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 mt-1"
                      />
                      <div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="font-bold text-slate-900">{msg.senderName}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                            {msg.senderRole}
                          </span>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                          }`}
                        >
                          <p>{msg.content}</p>

                          {msg.imageUrl && (
                            <div className="mt-2.5 rounded-xl overflow-hidden border border-white/20">
                              <img
                                src={msg.imageUrl}
                                alt="Attachment"
                                className="w-full max-h-52 object-cover"
                              />
                              {msg.imageCaption && (
                                <p className={`p-1.5 text-[10px] font-medium ${isMe ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                  {msg.imageCaption}
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

              {/* Message Input Bar */}
              <div className="p-4 border-t border-slate-200 bg-white">
                {showImageAttachment && (
                  <div className="mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <ImageIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <input
                      type="url"
                      placeholder="Paste image or poster URL (https://...)"
                      value={chatImageInput}
                      onChange={(e) => setChatImageInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowImageAttachment(false);
                        setChatImageInput('');
                      }}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImageAttachment(!showImageAttachment)}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      showImageAttachment
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title="Attach poster or image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    placeholder={`Message #${activeGroup.name}...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />

                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    disabled={!chatInput.trim() && !chatImageInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: YOUR HIRING (CREATE HIRING WITH TITLE, ROLLS, AND REMOVE HIRING)    */}
      {/* ========================================================================= */}
      {activeTab === 'hiring' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>Club Recruitment & Leadership Hiring</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Post open positions with role requirements, skill tags, application links, and remove listings when recruitment concludes.
              </p>
            </div>

            <button
              id="open-create-hiring-modal"
              onClick={() => setShowCreateHiringModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Hiring</span>
            </button>
          </div>

          {hiringList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active recruitment drives</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Need developers, organizers, designers, or PR coordinators for your club? Publish a hiring drive right here!
              </p>
              <button
                onClick={() => setShowCreateHiringModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Create Hiring Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hiringList.map((hire) => (
                <div
                  key={hire.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          {hire.status || 'OPEN'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                          {hire.position}
                        </h3>
                        <p className="text-xs text-indigo-700 font-semibold">
                          @{hire.clubName || 'Competitive Coding Club'}
                        </p>
                      </div>

                      {/* REMOVE HIRING OPTION */}
                      <button
                        onClick={() => handleRemoveHiring(hire.id, hire.position)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        title="Remove hiring post"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {hire.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="font-semibold text-slate-700">Eligibility:</div>
                      <div className="text-slate-600">{hire.eligibility}</div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Required Skills:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {hire.requiredSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-700 font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: <strong className="text-slate-700">{hire.deadline}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={hire.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        <span>Apply / View Form</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: OVERVIEW METRICS                                      */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium text-slate-500">Club Members</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{members.length}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Registered student talent</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium text-slate-500">Active Events</span>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{events.length}</div>
              <span className="text-[11px] text-blue-600 font-medium">Published on campus</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium text-slate-500">Open Recruitments</span>
                <Briefcase className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{hiringList.length}</div>
              <span className="text-[11px] text-purple-600 font-medium">Leadership positions</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium text-slate-500">Member Channels</span>
                <MessageSquare className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{groups.length}</div>
              <span className="text-[11px] text-amber-600 font-medium">Active discussion groups</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Your RBAC Authority & Club Governance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
                  Assigned Administrative Powers
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Create & Remove Events
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Add Members & Assign Roles
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Create & Delete Group Channels
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Publish & Remove Hiring Drives
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <span className="font-bold text-indigo-950 block text-xs uppercase tracking-wider">
                  Club Advisor Verification
                </span>
                <p className="text-slate-700">
                  Faculty Advisor: <strong>Dr. Ranjeet Kumar Singh</strong>
                </p>
                <p className="text-slate-600 text-[11px]">
                  All published events and certifications are officially synchronized with the Dean of Student Welfare (DSW) office.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE EVENT (WITH POSTER, TITLE, REGISTRATION LINK)   */}
      {/* ============================================================ */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Create New Event</h3>
              </div>
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeStorm 2026: Annual Algorithmic Contest"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Category
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Competition">Competition</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Venue / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SAC Auditorium / CSE Labs"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM - 04:00 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Event Poster Input + Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Poster / Banner Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newEvent.poster}
                    onChange={(e) => setNewEvent({ ...newEvent, poster: e.target.value })}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>

                {/* Poster Preview */}
                {newEvent.poster && (
                  <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-slate-200 relative">
                    <img src={newEvent.poster} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded">
                      Poster Preview
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-500">
                  <span className="font-semibold">Preset Posters:</span>
                  {PRESET_EVENT_POSTERS.slice(0, 3).map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewEvent({ ...newEvent, poster: url })}
                      className="text-indigo-600 hover:underline cursor-pointer"
                    >
                      Poster {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registration Link (Google Form / Portal)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://forms.google.com/..."
                    value={newEvent.registrationLink}
                    onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the contest rules, prize pool, eligibility, and schedule..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keywords & Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="DSA, Python, Hackathon, Cash Prizes"
                  value={newEvent.tags}
                  onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD CLUB MEMBER & ASSIGN ROLE ("GIVE ROLLS")          */}
      {/* ============================================================ */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Add Club Member & Assign Role</h3>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Sharma"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="aman.sharma@college.edu"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Year
                  </label>
                  <select
                    value={newMember.year}
                    onChange={(e) => setNewMember({ ...newMember, year: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* GIVE ROLLS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign Club Role (Roll) *
                </label>
                <select
                  value={newMember.position}
                  onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold cursor-pointer"
                >
                  <option value="Vice President">Vice President</option>
                  <option value="Technical Head">Technical Head</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="PR & Outreach Head">PR & Outreach Head</option>
                  <option value="Design & Media Lead">Design & Media Lead</option>
                  <option value="Web & App Lead">Web & App Lead</option>
                  <option value="Core Member">Core Member</option>
                  <option value="Technical Member">Technical Member</option>
                  <option value="Executive Member">Executive Member</option>
                  <option value="Junior Volunteer">Junior Volunteer</option>
                </select>
              </div>

              {/* Permissions Checklist */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Permissions
                </span>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.canCreateEvents}
                    onChange={(e) => setNewMember({ ...newMember, canCreateEvents: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Can Create & Edit Events</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.canManageHiring}
                    onChange={(e) => setNewMember({ ...newMember, canManageHiring: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Can Manage Club Hiring</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE NEW GROUP CHANNEL                              */}
      {/* ============================================================ */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Create New Member Group</h3>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Group / Channel Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart India Hackathon 2026 Core Sprint"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category / Team Scope
                </label>
                <select
                  value={newGroup.category}
                  onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium cursor-pointer"
                >
                  <option value="Project Team">Project Team</option>
                  <option value="Event Ops">Event Ops</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Open Discussion">Open Discussion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Group Purpose & Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe what members will collaborate on in this channel..."
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Welcome Message
                </label>
                <input
                  type="text"
                  placeholder="Welcome everyone! Let us kick off this project."
                  value={newGroup.initialMessage}
                  onChange={(e) => setNewGroup({ ...newGroup, initialMessage: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: POST NEW HIRING ("GIVE TITLE AND ROLLS ALL THING REQ")  */}
      {/* ============================================================ */}
      {showCreateHiringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Post Club Hiring & Roles</h3>
              </div>
              <button
                onClick={() => setShowCreateHiringModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHiring} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Position / Role Title * (give title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Developer & Technical Lead"
                  value={newHiring.position}
                  onChange={(e) => setNewHiring({ ...newHiring, position: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Roles & Responsibilities * (and rolls all thing req)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the duties, expected weekly hours, code repos to maintain, and mentoring responsibilities..."
                  value={newHiring.description}
                  onChange={(e) => setNewHiring({ ...newHiring, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Eligibility Criteria *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Open to 2nd & 3rd Year B.Tech Students"
                    value={newHiring.eligibility}
                    onChange={(e) => setNewHiring({ ...newHiring, eligibility: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={newHiring.deadline}
                    onChange={(e) => setNewHiring({ ...newHiring, deadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Skills & Tags (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, TypeScript, Node.js, Problem Solving"
                  value={newHiring.requiredSkills}
                  onChange={(e) => setNewHiring({ ...newHiring, requiredSkills: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Form Link (Google Form / Portal) *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    placeholder="https://forms.google.com/..."
                    value={newHiring.applicationLink}
                    onChange={(e) => setNewHiring({ ...newHiring, applicationLink: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateHiringModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Post Hiring Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
