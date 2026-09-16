import React, { useState } from 'react';
import {
  User,
  Camera,
  Upload,
  Check,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Mail,
  Building,
  Github,
  Linkedin,
  Globe,
  Phone,
  Tag,
  X,
  Plus,
} from 'lucide-react';
import { User as UserType } from '../../../types';

interface StudentProfileTabProps {
  user: UserType | null;
  profileName: string;
  setProfileName: (val: string) => void;
  profileAvatar: string;
  setProfileAvatar: (val: string) => void;
  profileStudentId: string;
  setProfileStudentId: (val: string) => void;
  profileDept: string;
  setProfileDept: (val: string) => void;
  profileYear: string;
  setProfileYear: (val: string) => void;
  profileBio: string;
  setProfileBio: (val: string) => void;
  profileGithub: string;
  setProfileGithub: (val: string) => void;
  profileLinkedin: string;
  setProfileLinkedin: (val: string) => void;
  onSaveProfile: (e: React.FormEvent) => void;
  savingProfile: boolean;
  avatarPresets: string[];
  showToast: (msg: string) => void;
}

export const StudentProfileTab: React.FC<StudentProfileTabProps> = ({
  user,
  profileName,
  setProfileName,
  profileAvatar,
  setProfileAvatar,
  profileStudentId,
  setProfileStudentId,
  profileDept,
  setProfileDept,
  profileYear,
  setProfileYear,
  profileBio,
  setProfileBio,
  profileGithub,
  setProfileGithub,
  profileLinkedin,
  setProfileLinkedin,
  onSaveProfile,
  savingProfile,
  avatarPresets,
  showToast,
}) => {
  // Additional profile fields
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem(`cms_student_phone_${user?.id}`) || '+91 98765 43210';
  });

  const [portfolioUrl, setPortfolioUrl] = useState(() => {
    return localStorage.getItem(`cms_student_portfolio_${user?.id}`) || '';
  });

  const [currentSemester, setCurrentSemester] = useState(() => {
    return localStorage.getItem(`cms_student_sem_${user?.id}`) || 'Semester 4';
  });

  // Skills chips
  const [skills, setSkills] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`cms_student_skills_${user?.id}`);
      return saved
        ? JSON.parse(saved)
        : ['React', 'TypeScript', 'Node.js', 'Python', 'UI/UX Design', 'Data Structures'];
    } catch {
      return ['React', 'TypeScript', 'Python', 'Data Structures'];
    }
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      const next = [...skills, trimmed];
      setSkills(next);
      if (user?.id) {
        try {
          localStorage.setItem(`cms_student_skills_${user.id}`, JSON.stringify(next));
        } catch {}
      }
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const next = skills.filter((s) => s !== skillToRemove);
    setSkills(next);
    if (user?.id) {
      try {
        localStorage.setItem(`cms_student_skills_${user.id}`, JSON.stringify(next));
      } catch {}
    }
  };

  const handleCustomSave = (e: React.FormEvent) => {
    if (user?.id) {
      localStorage.setItem(`cms_student_phone_${user.id}`, phoneNumber);
      localStorage.setItem(`cms_student_portfolio_${user.id}`, portfolioUrl);
      localStorage.setItem(`cms_student_sem_${user.id}`, currentSemester);
      localStorage.setItem(`cms_student_skills_${user.id}`, JSON.stringify(skills));
    }
    onSaveProfile(e);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        {/* Tab Title */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Account Settings</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Student Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize your full student name, upload your profile picture or pick an avatar preset, and update your academic details across the portal.
          </p>
        </div>

        <form onSubmit={handleCustomSave} className="space-y-6">
          {/* 1. Avatar & Photo Section */}
          <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Student Photo & Profile Picture
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Photo Preview Frame */}
              <div className="relative group shrink-0">
                <img
                  src={profileAvatar}
                  alt="Student Avatar Preview"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-xl shadow-md">
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              {/* Upload and URL controls */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Image URL:
                  </span>
                  <input
                    type="url"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-700"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* File Upload with FileReader */}
                  <label className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Photo from Device</span>
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
            <div className="pt-4 border-t border-slate-200/80">
              <span className="text-xs font-semibold text-slate-600 block mb-2.5">
                Or choose an avatar preset:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfileAvatar(preset)}
                    className={`w-12 h-12 rounded-2xl overflow-hidden ring-2 transition-all cursor-pointer ${
                      profileAvatar === preset
                        ? 'ring-indigo-600 scale-105 shadow-md'
                        : 'ring-transparent hover:ring-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset}
                      alt={`Preset ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Personal & Academic Fields */}
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
                value={user?.email || 'student@mitsgwl.ac.in'}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enrollment / Student ID *
              </label>
              <input
                type="text"
                value={profileStudentId}
                onChange={(e) => setProfileStudentId(e.target.value)}
                placeholder="e.g. 0901IT211045"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department / Branch *
              </label>
              <select
                value={profileDept}
                onChange={(e) => setProfileDept(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                <option value="Data Science & Artificial Intelligence">Data Science & Artificial Intelligence</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
                <option value="Applied Sciences">Applied Sciences</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Year
                </label>
                <select
                  value={profileYear}
                  onChange={(e) => setProfileYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate / M.Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Semester
                </label>
                <select
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Bio & Ambitions
              </label>
              <textarea
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Briefly describe your academic interests, tech stack, or campus goals..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* 3. Skills & Tech Stack Tags Editor */}
          <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Skills & Tech Stack Tags
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g. Flutter, C++, Figma)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* 4. Social & Portfolio Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Personal Portfolio / Website
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://myportfolio.dev"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={savingProfile}
              id="btn-save-student-profile"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
            >
              {savingProfile ? (
                <span>Saving Profile...</span>
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
  );
};
