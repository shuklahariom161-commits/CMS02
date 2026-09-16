import React, { useState, useEffect } from 'react';
import { AchievementItem } from '../../types';
import { api } from '../../services/api';
import { AchievementCard } from '../../components/cards/AchievementCard';
import { Award, Building, User, Users } from 'lucide-react';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [category, setCategory] = useState<'ALL' | 'COLLEGE' | 'STUDENT' | 'CLUB'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const res = await api.getAchievements(category);
        if (res.success) {
          setAchievements(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Pride of the College</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Achievements & Honors
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Commemorating our college milestones, research accolades, national hackathon trophies, and individual student honors.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'ALL', label: 'All Achievements', icon: Award },
          { id: 'COLLEGE', label: 'College Honors', icon: Building },
          { id: 'STUDENT', label: 'Student Laurels', icon: User },
          { id: 'CLUB', label: 'Club Trophies', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = category === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Loading achievements...</div>
      ) : achievements.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-600">No achievements recorded under this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
};
