import React from 'react';
import { Club } from '../../types';
import { Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface ClubCardProps {
  club: Club;
  onViewClub?: (club: Club) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onViewClub }) => {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cultural':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Sports':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Literary':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id={`club-card-${club.id}`}
      className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Banner / Header */}
      <div className="relative h-28 w-full overflow-hidden bg-slate-100">
        <img
          src={club.banner || club.logo}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span
          className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-xs shadow-xs ${getCategoryBadgeClass(
            club.category
          )}`}
        >
          {club.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3.5 -mt-9 mb-3 relative z-10">
          <img
            src={club.logo}
            alt={`${club.name} logo`}
            className="w-13 h-13 rounded-xl border-2 border-white shadow-md bg-white object-cover shrink-0"
          />
          <div className="pt-4">
            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
              {club.name}
            </h3>
            <span className="text-xs text-slate-500 font-medium tracking-wide font-mono">
              [{club.code}]
            </span>
          </div>
        </div>

        {club.tagline && (
          <p className="text-xs font-semibold text-indigo-700 mb-2 italic line-clamp-1">
            "{club.tagline}"
          </p>
        )}

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-1">
          {club.description}
        </p>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{club.memberCount} members</span>
          </div>

          <button
            id={`btn-view-club-${club.id}`}
            onClick={() => onViewClub?.(club)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group/btn cursor-pointer"
          >
            <span>View Club</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
