import React from 'react';
import { FacultyMember } from '../../types';
import {
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  Phone,
  ShieldCheck,
  Building,
  Award,
} from 'lucide-react';

interface FacultyCardProps {
  faculty: FacultyMember;
  onSelect?: (faculty: FacultyMember) => void;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  // Designation badge color styling
  const isHOD = faculty.designation.includes('HOD') || faculty.designation.includes('Head');
  const isDean = faculty.designation.includes('Dean');
  const isProfessor = faculty.designation === 'Professor';
  const isAssocProf = faculty.designation.includes('Associate');
  const isAsstProf = faculty.designation.includes('Assistant');

  const getBadgeStyle = () => {
    if (isDean) {
      return 'bg-purple-100 text-purple-900 border-purple-300 ring-1 ring-purple-400/30 font-semibold';
    }
    if (isHOD) {
      return 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400/30 font-bold';
    }
    if (isProfessor) {
      return 'bg-indigo-100 text-indigo-900 border-indigo-200 font-semibold';
    }
    if (isAssocProf) {
      return 'bg-blue-100 text-blue-800 border-blue-200 font-semibold';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold';
  };

  return (
    <div
      id={`faculty-card-${faculty.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top: Avatar, Name & Designation */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={faculty.avatar}
              alt={faculty.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  faculty.name
                )}&background=4f46e5&color=fff&size=200`;
              }}
            />
            {isHOD && (
              <span
                title="Head of Department"
                className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-xs text-[10px]"
              >
                <Award className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] border ${getBadgeStyle()}`}
              >
                {isHOD && <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />}
                <span>{faculty.designation}</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1 group-hover:text-indigo-600 transition-colors leading-snug break-words">
              {faculty.name}
            </h3>

            {/* Department / Branch Mention */}
            <div className="mt-1.5 flex items-start gap-1.5 text-xs bg-indigo-50/90 text-indigo-900 px-2.5 py-1.5 rounded-lg border border-indigo-100/90">
              <Building className="w-3.5 h-3.5 shrink-0 text-indigo-600 mt-0.5" />
              <div className="min-w-0 leading-tight">
                <span className="text-[9px] uppercase tracking-wider text-indigo-600 font-bold block">
                  Department / Branch
                </span>
                <span className="text-xs font-semibold text-slate-800 line-clamp-2">
                  {faculty.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details: Qualification, Cabin, Phone */}
        <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Qualification: </span>
              <span className="text-slate-600 leading-snug">{faculty.qualification}</span>
            </div>
          </div>

          {faculty.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">Phone: </span>
                <a
                  href={`tel:${faculty.phone}`}
                  className="text-slate-700 hover:text-indigo-600 font-mono text-[11px]"
                >
                  {faculty.phone}
                </a>
              </div>
            </div>
          )}

          {faculty.cabin && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Location: </span>
                <span className="text-slate-600 leading-snug">{faculty.cabin}</span>
              </div>
            </div>
          )}
        </div>

        {/* Area of Interest / Specialization tags */}
        {faculty.specialization && faculty.specialization.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Area of Interest
            </span>
            <div className="flex flex-wrap gap-1.5">
              {faculty.specialization.map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md text-[11px] font-medium border border-slate-200/70 transition-colors"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mentored / Advised Club */}
        {faculty.advisedClubs && faculty.advisedClubs.length > 0 && (
          <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-700">Faculty Advisor:</span>
            <span className="text-slate-600 truncate">{faculty.advisedClubs.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Footer Contact Bar with E-Mail */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={`mailto:${faculty.email}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors truncate"
          title={`Email ${faculty.name}`}
        >
          <Mail className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
          <span className="truncate">{faculty.email}</span>
        </a>

        {faculty.phone && (
          <a
            href={`tel:${faculty.phone}`}
            className="text-slate-400 hover:text-emerald-600 text-xs shrink-0 p-1 transition-colors"
            title={`Call ${faculty.phone}`}
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
