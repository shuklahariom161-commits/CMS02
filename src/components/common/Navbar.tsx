import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Users,
  Calendar,
  Award,
  Info,
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Shield,
  BookOpen,
  PlusCircle,
  FileText,
  Building2,
  MessageSquare,
  Edit3,
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenLogin }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const baseLinks = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'clubs', label: 'Clubs', icon: Users },
    { id: 'faculty', label: 'Faculty', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'about', label: 'About', icon: Info },
  ];

  const navLinks = isAuthenticated
    ? user?.role === 'FACULTY'
      ? [
          { id: 'home', label: 'Home', icon: GraduationCap },
          { id: 'faculty-dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'clubs', label: 'Clubs', icon: Users },
          { id: 'faculty', label: 'Directory', icon: BookOpen },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'achievements', label: 'Achievements', icon: Award },
        ]
      : user?.role === 'STUDENT'
      ? [
          { id: 'home', label: 'Home', icon: GraduationCap },
          { id: 'clubs', label: 'Clubs', icon: Users },
          { id: 'faculty', label: 'Faculty', icon: BookOpen },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'about', label: 'About', icon: Info },
          { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
        ]
      : baseLinks
    : [
        { id: 'home', label: 'Home', icon: GraduationCap },
        { id: 'clubs', label: 'Clubs', icon: Users },
        { id: 'faculty', label: 'Faculty', icon: BookOpen },
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'about', label: 'About', icon: Info },
      ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDashboardTarget = () => {
    if (!user) return 'student-dashboard';
    switch (user.role) {
      case 'ADMIN':
        return 'admin-dashboard';
      case 'FACULTY':
        return 'faculty-dashboard';
      case 'CLUB_MANAGEMENT':
        return 'club-dashboard';
      case 'STUDENT':
      default:
        return 'student-dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer group py-1"
          >
            <img
              src="/campusone-mits-logo.svg"
              alt="CampusOne · MITS Gwalior"
              className="h-10 sm:h-11 md:h-12 w-auto max-w-[240px] sm:max-w-[280px] object-contain transition-transform group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                currentPage === link.id ||
                (link.id === 'student-dashboard' && (currentPage === 'dashboard' || currentPage === 'student-dashboard'));
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-indigo-700 bg-indigo-50/90 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Auth Section Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user?.role === 'FACULTY' && (
              <button
                id="nav-faculty-create-post-btn"
                onClick={() => {
                  handleNavClick('faculty-dashboard');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-200 transition-all hover:shadow-md cursor-pointer"
                title="Create a new post or notice"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Post</span>
              </button>
            )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="nav-user-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-left"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 leading-tight max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-medium text-indigo-600 leading-none">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    id="nav-profile-dropdown"
                    className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      id="nav-menu-dashboard"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNavClick(getDashboardTarget());
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                      Open {user.role === 'ADMIN' ? 'Admin' : user.role === 'FACULTY' ? 'Faculty' : 'Student'} Dashboard
                    </button>

                    {user.role === 'FACULTY' && (
                      <>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('faculty-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                        >
                          <PlusCircle className="w-4 h-4 text-indigo-600" />
                          + Create Post
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('faculty-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          Your Posts & Delete Option
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('faculty-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Building2 className="w-4 h-4 text-slate-500" />
                          Associated Clubs (Add/Remove)
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('faculty-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500" />
                          Student Groups & Chat
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('faculty-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Award className="w-4 h-4 text-slate-500" />
                          Your Achievements (Add/Remove)
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('faculty-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Edit3 className="w-4 h-4 text-slate-500" />
                          Edit Profile
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      id="nav-menu-logout"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-200 transition-all hover:shadow-md hover:shadow-indigo-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            {!isAuthenticated && (
              <button
                id="nav-mobile-login-quick"
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                Login
              </button>
            )}
            <button
              id="nav-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="nav-mobile-menu" className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              currentPage === link.id ||
              (link.id === 'student-dashboard' && (currentPage === 'dashboard' || currentPage === 'student-dashboard'));
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {link.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-3.5 py-2 bg-slate-50 rounded-lg">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-semibold text-slate-900">{user.name}</span>
                    <span className="text-[11px] text-indigo-600 font-medium">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick(getDashboardTarget())}
                  className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Open {user.role === 'FACULTY' ? 'Faculty Dashboard' : 'Dashboard'}
                </button>

                {user.role === 'FACULTY' && (
                  <button
                    onClick={() => handleNavClick('faculty-dashboard')}
                    className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200"
                  >
                    <PlusCircle className="w-4 h-4 text-indigo-600" />
                    + Create Faculty Post
                  </button>
                )}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Login to CMS
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
