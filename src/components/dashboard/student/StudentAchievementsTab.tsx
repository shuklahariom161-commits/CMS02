import React, { useState } from 'react';
import {
  Award,
  Building,
  User as UserIcon,
  Users,
  PlusCircle,
  X,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { AchievementItem, User } from '../../../types';
import { AchievementCard } from '../../cards/AchievementCard';

interface StudentAchievementsTabProps {
  user: User | null;
  achievements: AchievementItem[];
  category: 'ALL' | 'COLLEGE' | 'STUDENT' | 'CLUB';
  onCategoryChange: (cat: 'ALL' | 'COLLEGE' | 'STUDENT' | 'CLUB') => void;
  onSubmitAchievement: (item: {
    title: string;
    category: 'COLLEGE' | 'STUDENT' | 'CLUB';
    date: string;
    description: string;
    image: string;
    tags: string;
  }) => Promise<void>;
  loading?: boolean;
}

export const StudentAchievementsTab: React.FC<StudentAchievementsTabProps> = ({
  user,
  achievements,
  category,
  onCategoryChange,
  onSubmitAchievement,
  loading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'STUDENT' as 'COLLEGE' | 'STUDENT' | 'CLUB',
    date: new Date().toISOString().split('T')[0],
    description: '',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    tags: 'Hackathon, Winner, Innovation, MITS',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmitAchievement(form);
      setIsModalOpen(false);
      setForm({
        title: '',
        category: 'STUDENT',
        date: new Date().toISOString().split('T')[0],
        description: '',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
        tags: 'Hackathon, Winner, Innovation, MITS',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = category === 'ALL'
    ? achievements
    : achievements.filter((a) => a.category.toUpperCase() === category);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Category Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Pride of MITS Gwalior</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Achievements, Awards & Honors
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Celebrating national hackathon victories, patent grants, research citations, and student honors.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Your Achievement</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Achievements', icon: Award },
            { id: 'COLLEGE', label: 'College Honors', icon: Building },
            { id: 'STUDENT', label: 'Student Laurels', icon: UserIcon },
            { id: 'CLUB', label: 'Club Trophies', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Achievements */}
      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading achievements...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No achievements recorded in this category</h3>
          <p className="text-xs text-slate-500">Be the first to submit your victory or project honor!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}

      {/* SUBMIT ACHIEVEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Submit Student Achievement</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 1st Prize at Smart India Hackathon 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="STUDENT">Student Laurels</option>
                    <option value="CLUB">Club Accolade</option>
                    <option value="COLLEGE">College Honor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date Awarded *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Event Details *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the achievement, organizing body, project summary, cash prize, or honor received..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo / Certificate Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keywords / Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Hackathon, First Place, AI, National Winner"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
