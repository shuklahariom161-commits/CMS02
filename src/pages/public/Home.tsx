import React, { useState, useEffect, useMemo } from 'react';
import { Club, AchievementItem, FacultyMember } from '../../types';
import { api } from '../../services/api';
import { ClubCard } from '../../components/cards/ClubCard';
import { FacultyCard } from '../../components/cards/FacultyCard';
import { AchievementCard } from '../../components/cards/AchievementCard';
import { mitsClubs } from '../../data/mitsClubs';
import { MITS_FACULTY_DIRECTORY } from '../../data/mitsFaculty';
import {
  ArrowRight,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Search,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Building,
  LogIn,
  Mail,
  Phone,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenLogin }) => {
  const [clubs, setClubs] = useState<Club[]>(mitsClubs);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(MITS_FACULTY_DIRECTORY);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [achievementTab, setAchievementTab] = useState<'ALL' | 'COLLEGE' | 'STUDENT' | 'CLUB'>('ALL');

  // Club filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [clubSearch, setClubSearch] = useState<string>('');

  // Faculty filters
  const [facultyDept, setFacultyDept] = useState<string>('All Branches');
  const [facultyDesig, setFacultyDesig] = useState<string>('All');
  const [facultySearch, setFacultySearch] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clubsRes, achRes, facRes] = await Promise.all([
          api.getClubs(),
          api.getAchievements(),
          api.getFaculty(),
        ]);

        if (clubsRes.success && clubsRes.data && clubsRes.data.length > 0) {
          setClubs(clubsRes.data);
        } else {
          setClubs(mitsClubs);
        }

        if (achRes.success) setAchievements(achRes.data || []);

        if (facRes.success && facRes.data && facRes.data.length > 0) {
          setFacultyList(facRes.data);
        } else {
          setFacultyList(MITS_FACULTY_DIRECTORY);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
        setClubs(mitsClubs);
        setFacultyList(MITS_FACULTY_DIRECTORY);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const clubCategories = ['All', 'Technical', 'Cultural', 'Literary', 'Sports', 'Social', 'Professional Society'];

  const facultyBranches = [
    'All Branches',
    'Department of Engineering Mathematics & Computing',
    'Masters in Computer Applications',
    'Department of Computer Science & Engineering',
    'Department of Computer Science and Design',
    'Department of Information Technology',
    'Centre for Artificial Intelligence',
    'Centre for Internet of Things',
    'Department of Electronics Engineering',
    'Department of Electronics and Telecommunications Engineering',
    'Department of Electrical Engineering',
    'School of Mechanical Engineering',
    'Department of Civil Engineering',
    'Department of Chemical Engineering',
    'Department of Architecture & Planning',
    'Department of Humanities and Management',
    'School of Applied Mathematics',
  ];

  const facultyDesignations = [
    { label: 'All Roles', value: 'All' },
    { label: 'Deans / Directors', value: 'Dean' },
    { label: 'Department Heads (HODs)', value: 'HOD' },
    { label: 'Professors', value: 'Professor' },
    { label: 'Associate Professors', value: 'Associate' },
    { label: 'Assistant Professors', value: 'Assistant' },
  ];

  // Filter clubs based on category and search
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesCat =
        selectedCategory === 'All' ||
        club.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = clubSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        club.name.toLowerCase().includes(q) ||
        club.code.toLowerCase().includes(q) ||
        club.tagline?.toLowerCase().includes(q) ||
        club.facultyAdvisor?.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [clubs, selectedCategory, clubSearch]);

  // Filter faculty based on branch, designation, and search
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((faculty) => {
      const matchesBranch =
        facultyDept === 'All Branches' ||
        faculty.department.toLowerCase().includes(facultyDept.toLowerCase());

      const matchesDesig =
        facultyDesig === 'All' ||
        (facultyDesig === 'Dean' &&
          (faculty.designation.includes('Dean') || faculty.designation.includes('Director'))) ||
        (facultyDesig === 'HOD' &&
          (faculty.designation.includes('HOD') || faculty.designation.includes('Head'))) ||
        (facultyDesig === 'Professor' &&
          faculty.designation.includes('Professor') &&
          !faculty.designation.includes('Associate') &&
          !faculty.designation.includes('Assistant')) ||
        (facultyDesig === 'Associate' &&
          faculty.designation.includes('Associate')) ||
        (facultyDesig === 'Assistant' &&
          faculty.designation.includes('Assistant'));

      const q = facultySearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        faculty.name.toLowerCase().includes(q) ||
        faculty.department.toLowerCase().includes(q) ||
        faculty.designation.toLowerCase().includes(q) ||
        faculty.qualification.toLowerCase().includes(q) ||
        faculty.cabin.toLowerCase().includes(q) ||
        faculty.specialization.some((s) => s.toLowerCase().includes(q)) ||
        (faculty.advisedClubs && faculty.advisedClubs.some((c) => c.toLowerCase().includes(q)));

      return matchesBranch && matchesDesig && matchesSearch;
    });
  }, [facultyList, facultyDept, facultyDesig, facultySearch]);

  const filteredAchievements =
    achievementTab === 'ALL'
      ? achievements
      : achievements.filter((a) => a.category === achievementTab);

  const totalHods = useMemo(
    () => facultyList.filter((f) => f.designation.includes('HOD') || f.designation.includes('Head')).length,
    [facultyList]
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Full Campus Image Background with Transparent Dark Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/campus-bg.jpg"
            alt="MITS Gwalior Campus Building"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/65 to-slate-950/90" />
          <div className="absolute inset-0 bg-indigo-950/35 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-4">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            College Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-white">Management System</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-medium text-indigo-200 tracking-tight">
            "One Platform. One College Community."
          </p>


          {/* Call to Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-explore-clubs-btn"
              onClick={() => onNavigate('clubs')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Explore 84 Clubs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-view-faculty-btn"
              onClick={() => onNavigate('faculty')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-indigo-200 border border-indigo-500/40 font-semibold text-sm transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Faculty & HOD Directory</span>
            </button>

            <button
              id="hero-login-btn"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all cursor-pointer backdrop-blur-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Portal Access</span>
            </button>
          </div>

          {/* Faculty & Academic Advisory Highlight */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-indigo-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Academic leadership under {totalHods} Department Heads (HODs) & 84 faculty mentored clubs</span>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold font-mono text-white">84</div>
              <div className="text-xs text-indigo-200 font-medium">Official Student Clubs</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold font-mono text-white">190+</div>
              <div className="text-xs text-indigo-200 font-medium">Distinguished Faculty</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold font-mono text-white">16</div>
              <div className="text-xs text-indigo-200 font-medium">Academic Branches</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold font-mono text-white">24/7</div>
              <div className="text-xs text-indigo-200 font-medium">Centralized Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FACULTY & DEPARTMENT HEADS SECTION */}
      <section id="faculty-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
              <GraduationCap className="w-4 h-4" />
              <span>MITS Gwalior • Academic Faculty Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Faculty Directory (Branch-wise &amp; Department-wise)
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Meet distinguished faculty members, Deans, Heads of Departments (HODs), Professors, and Assistant Professors across all 16 academic branches at MITS Gwalior.
            </p>
          </div>

          <button
            id="view-all-faculty-btn"
            onClick={() => onNavigate('faculty')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors self-start sm:self-auto cursor-pointer border border-indigo-200"
          >
            <span>View Full Faculty Directory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls: Search by Name/Branch + Designation Filter Buttons */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input for Faculty Name / Branch / Specialization */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="home-faculty-search-input"
                type="text"
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                placeholder="Search faculty name (e.g. DR. RAJNI RANJAN SINGH MAKWANA, DR. TEJ SINGH)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            {/* Designation Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {facultyDesignations.map((des) => (
                <button
                  key={des.value}
                  onClick={() => setFacultyDesig(des.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    facultyDesig === des.value
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {des.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium shrink-0">
              Showing <span className="font-semibold text-slate-800">{filteredFaculty.length}</span> faculty
            </div>
          </div>

          {/* Branch / Department Filter Pills */}
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Filter by Branch / Department:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {facultyBranches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setFacultyDept(branch)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    facultyDept === branch
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        {filteredFaculty.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500">
            No faculty found matching "{facultySearch}". Try adjusting search terms or branch filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.slice(0, 6).map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        )}

        {filteredFaculty.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('faculty')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore all {filteredFaculty.length} Faculty Members in Directory</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 3. CLUBS DIRECTORY SECTION (Official MITS Clubs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
              <Users className="w-4 h-4" />
              <span>MITS Gwalior Official Student Bodies • Session 2026–27</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Campus Clubs & Professional Societies
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Discover all 84 recognized student organizations, technical chapters, cultural guilds, and athletic councils supervised by our faculty advisors.
            </p>
          </div>

          <button
            id="view-all-clubs-btn"
            onClick={() => onNavigate('clubs')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors self-start sm:self-auto cursor-pointer border border-indigo-200"
          >
            <span>Explore All 84 Clubs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls: Search by Name & Category Filter Pills */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input for Club Name */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="home-club-search-input"
                type="text"
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                placeholder="Search club name (e.g., Robotics, Coding, GDGoC, Music, ACM)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium shrink-0">
              Showing <span className="font-semibold text-slate-800">{filteredClubs.length}</span> of {clubs.length} clubs
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {clubCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm text-slate-500">
            No club found matching "{clubSearch}". Try searching for another name or reset filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.slice(0, 6).map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onViewClub={() => onNavigate('clubs')}
              />
            ))}
          </div>
        )}

        {filteredClubs.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('clubs')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>View all {filteredClubs.length} clubs in Directory</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 4. ACHIEVEMENTS SECTION (College, Student, Club) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs tracking-wider uppercase">
                <Award className="w-4 h-4" />
                <span>Hall of Honors</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                College & Student Achievements
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Celebrating outstanding excellence across our institution, academic departments, and student clubs.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
              {(['ALL', 'COLLEGE', 'STUDENT', 'CLUB'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAchievementTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    achievementTab === tab
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. ROLE CONNECTIVITY CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Role-Based Access Control Built-In
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              One Unified Interface For The Entire Campus
            </h3>
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
              Whether you are a student exploring clubs and hiring, a faculty member sharing research notices, a club coordinator submitting official proposals, or an administrator supervising the platform — CMS provides dedicated, role-specific tools with full RBAC protection.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="callout-login-btn"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-semibold text-sm hover:bg-indigo-50 shadow-md transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Access Your Dashboard</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>Learn How CMS Works</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
