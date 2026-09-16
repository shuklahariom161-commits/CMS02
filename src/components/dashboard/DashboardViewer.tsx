import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Club, EventItem, HiringItem, FacultyPostItem, AchievementItem } from '../../types';
import { FacultyDashboard } from './FacultyDashboard';
import { ClubLeaderDashboard } from './ClubLeaderDashboard';
import { StudentDashboard } from './StudentDashboard';
import { AdminDashboard } from './AdminDashboard';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  Award,
  Bell,
  CheckCircle2,
  FileText,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';

interface DashboardViewerProps {
  onNavigateHome: () => void;
  onNavigate?: (page: string) => void;
  initialTab?: string;
}

export const DashboardViewer: React.FC<DashboardViewerProps> = ({
  onNavigateHome,
  onNavigate,
  initialTab,
}) => {
  const { user, logout } = useAuth();
  const [healthData, setHealthData] = useState<any>(null);
  const [hiring, setHiring] = useState<HiringItem[]>([]);
  const [facultyPosts, setFacultyPosts] = useState<FacultyPostItem[]>([]);

  // Check if current user is a club leader (Rahul Verma / Club Management or President)
  const isClubLeader = Boolean(
    user &&
      (user.role === 'CLUB_MANAGEMENT' ||
        user.email === 'rahul.verma@college.edu' ||
        (user.role !== 'STUDENT' &&
          user.clubMemberships?.some(
            (m) =>
              m.position.toLowerCase().includes('president') ||
              m.position.toLowerCase().includes('vice president') ||
              m.position.toLowerCase().includes('club lead') ||
              m.position.toLowerCase().includes('club head')
          )))
  );

  const [viewMode, setViewMode] = useState<'club-leader' | 'student'>(
    isClubLeader ? 'club-leader' : 'student'
  );

  useEffect(() => {
    if (user?.role === 'FACULTY') return;
    const loadInfo = async () => {
      try {
        const [health, hireRes, postRes] = await Promise.all([
          api.getHealth(),
          api.getHiring(),
          api.getFacultyPosts(),
        ]);
        setHealthData(health);
        if (hireRes.success) setHiring(hireRes.data);
        if (postRes.success) setFacultyPosts(postRes.data);
      } catch (e) {
        console.error(e);
      }
    };
    loadInfo();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please login to access your CMS Dashboard.</h2>
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // If user is logged in as ADMIN, present the dedicated Administrative & Moderation Command Center
  if (user.role === 'ADMIN') {
    return (
      <AdminDashboard
        onNavigateHome={onNavigateHome}
        onNavigate={onNavigate}
        initialTab={(initialTab as any) || 'overview'}
      />
    );
  }

  // If user is logged in as FACULTY, present the rich dedicated Faculty Dashboard
  if (user.role === 'FACULTY') {
    return (
      <FacultyDashboard
        onNavigateHome={onNavigateHome}
        initialTab={(initialTab as any) || 'posts'}
      />
    );
  }

  // If user is a Club Leader and in club-leader mode, show dedicated Club Leader Dashboard
  if (isClubLeader && viewMode === 'club-leader') {
    return (
      <ClubLeaderDashboard
        onNavigateHome={onNavigateHome}
        initialTab={(initialTab as any) || 'events'}
      />
    );
  }

  // Normal Student Dashboard (Home, Clubs, Faculty, Achievements, About, Profile)
  return (
    <StudentDashboard
      onNavigateHome={onNavigateHome}
      onNavigate={onNavigate}
      initialTab={(initialTab as any) || 'home'}
      onSwitchToLeader={isClubLeader ? () => setViewMode('club-leader') : undefined}
    />
  );
};
