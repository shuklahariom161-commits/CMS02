import React from 'react';
import { AchievementItem } from '../../types';
import { Award, Calendar, User, Users, Building } from 'lucide-react';

interface AchievementCardProps {
  achievement: AchievementItem;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'COLLEGE':
        return {
          label: 'College Honor',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'STUDENT':
        return {
          label: 'Student Laurels',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'CLUB':
        return {
          label: 'Club Accolade',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
        };
      default:
        return {
          label: 'Achievement',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        };
    }
  };

  const theme = getCategoryTheme(achievement.category);
  const descriptionLines = achievement.description
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div
      id={`achievement-card-${achievement.id}`}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
    >
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={achievement.image}
          alt={achievement.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${theme.badgeClass}`}
        >
          {theme.label}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2">
            {achievement.title}
          </h4>

          <div className="text-xs text-slate-600 leading-relaxed mb-4 space-y-2">
            {descriptionLines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold shrink-0 text-sm leading-none mt-0.5">•</span>
                <span className="flex-1">{line.replace(/^[•\-*]\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
          {achievement.studentName && (
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {achievement.studentName} {achievement.department ? `(${achievement.department})` : ''}
              </span>
            </div>
          )}

          {!achievement.studentName && achievement.department && (
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>{achievement.department}</span>
            </div>
          )}

          {achievement.clubName && (
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>{achievement.clubName}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
