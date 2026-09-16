import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/public/Home';
import { Clubs } from './pages/public/Clubs';
import { Events } from './pages/public/Events';
import { Achievements } from './pages/public/Achievements';
import { About } from './pages/public/About';
import { Faculty } from './pages/public/Faculty';
import { Login } from './pages/auth/Login';
import { DashboardViewer } from './components/dashboard/DashboardViewer';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    // Redirect to dashboard view
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'clubs':
        return <Clubs onNavigate={handleNavigate} />;
      case 'faculty':
        return <Faculty onNavigate={handleNavigate} />;
      case 'events':
        return <Events />;
      case 'achievements':
        return <Achievements />;
      case 'about':
        return <About onOpenLogin={handleOpenLogin} />;
      case 'dashboard':
      case 'student-dashboard':
      case 'faculty-dashboard':
      case 'club-dashboard':
      case 'admin-dashboard':
        return (
          <DashboardViewer
            onNavigateHome={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        );
      case 'home':
      default:
        return <Home onNavigate={handleNavigate} onOpenLogin={handleOpenLogin} />;
    }
  };

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

  const isDedicatedDashboard =
    currentPage === 'admin-dashboard' ||
    currentPage === 'faculty-dashboard' ||
    currentPage === 'club-dashboard' ||
    (currentPage === 'dashboard' && (user?.role === 'ADMIN' || user?.role === 'FACULTY'));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation - shown on all pages including Student Dashboard */}
      {!isDedicatedDashboard && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenLogin={handleOpenLogin}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer - hidden in Dedicated Dashboards */}
      {!isDedicatedDashboard && <Footer onNavigate={handleNavigate} />}

      {/* Login Authentication Modal */}
      <Login
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onSuccessRedirect={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
