import React, { useState, useEffect, useMemo } from 'react';
import { FacultyMember } from '../../types';
import { api } from '../../services/api';
import { FacultyCard } from '../../components/cards/FacultyCard';
import { MITS_FACULTY_DIRECTORY, MITS_DEPARTMENTS, MITS_DESIGNATIONS } from '../../data/mitsFaculty';
import {
  GraduationCap,
  Search,
  Building,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  Mail,
  Phone,
  Sparkles,
  Layers,
  LayoutGrid,
  Filter,
} from 'lucide-react';

interface FacultyProps {
  onNavigate?: (page: string) => void;
}

export const Faculty: React.FC<FacultyProps> = () => {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(MITS_FACULTY_DIRECTORY);
  const [department, setDepartment] = useState<string>('All Departments');
  const [designation, setDesignation] = useState<string>('All Designations');
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grouped' | 'grid'>('grouped');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await api.getFaculty(department, designation, search);
        if (res.success && res.data && res.data.length > 0) {
          setFacultyList(res.data);
        } else {
          setFacultyList(MITS_FACULTY_DIRECTORY);
        }
      } catch (err) {
        console.error('Failed to load faculty:', err);
        setFacultyList(MITS_FACULTY_DIRECTORY);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [department, designation, search]);

  // Client-side filtering fallback for instant responsiveness
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((faculty) => {
      const matchesDept =
        department === 'All Departments' ||
        faculty.department.toLowerCase() === department.toLowerCase();

      const matchesDesig =
        designation === 'All Designations' ||
        faculty.designation.toLowerCase().includes(designation.toLowerCase()) ||
        (designation === 'Head of Department (HOD)' &&
          (faculty.designation.includes('HOD') || faculty.designation.includes('Head'))) ||
        (designation === 'Dean / Director' &&
          (faculty.designation.includes('Dean') || faculty.designation.includes('Director'))) ||
        (designation === 'Professor' &&
          faculty.designation.includes('Professor') &&
          !faculty.designation.includes('Associate') &&
          !faculty.designation.includes('Assistant')) ||
        (designation === 'Associate Professor' &&
          faculty.designation.includes('Associate')) ||
        (designation === 'Assistant Professor' &&
          faculty.designation.includes('Assistant')) ||
        (designation === 'Visiting Faculty' &&
          (faculty.designation.includes('Visiting') || faculty.designation.includes('Adjunct')));

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        faculty.name.toLowerCase().includes(q) ||
        faculty.department.toLowerCase().includes(q) ||
        faculty.designation.toLowerCase().includes(q) ||
        faculty.qualification.toLowerCase().includes(q) ||
        faculty.cabin.toLowerCase().includes(q) ||
        faculty.specialization.some((s) => s.toLowerCase().includes(q)) ||
        (faculty.advisedClubs && faculty.advisedClubs.some((c) => c.toLowerCase().includes(q)));

      return matchesDept && matchesDesig && matchesSearch;
    });
  }, [facultyList, department, designation, search]);

  // Group faculty members branch-wise / department-wise
  const branchWiseGroups = useMemo(() => {
    const groups: { [dept: string]: FacultyMember[] } = {};

    filteredFaculty.forEach((faculty) => {
      const deptName = faculty.department || 'Other Department';
      if (!groups[deptName]) {
        groups[deptName] = [];
      }
      groups[deptName].push(faculty);
    });

    return groups;
  }, [filteredFaculty]);

  const uniqueBranchesCount = useMemo(() => {
    const set = new Set(facultyList.map((f) => f.department));
    return set.size;
  }, [facultyList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>MITS Gwalior Academic Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            MITS Gwalior Faculty Directory
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Comprehensive branch-wise and department-wise directory of distinguished faculty members, Deans, Heads of Departments (HODs), Professors, Associate Professors, and Assistant Professors across all academic branches at Madhav Institute of Technology &amp; Science, Gwalior.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-indigo-200">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>
                <strong className="text-white">{facultyList.length}</strong> Faculty Members
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-300" />
              <span>
                <strong className="text-white">{uniqueBranchesCount}</strong> Departments &amp; Branches
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>
                <strong className="text-white">Branch-wise &amp; Department-wise</strong> Organization
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="faculty-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by full name, branch, specialization, or designation..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Designation Selector */}
            <select
              id="faculty-designation-select"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium cursor-pointer"
            >
              {MITS_DESIGNATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* View Mode Toggle: Branch-wise Grouped vs Flat Grid */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === 'grouped'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View faculty organized by branch and department"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Branch-wise</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View all faculty in a grid"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
                <span>All Grid</span>
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Showing <strong className="text-slate-900">{filteredFaculty.length}</strong> faculty
            </span>
          </div>
        </div>

        {/* Department / Branch Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Filter by Branch / Department
            </span>
            {department !== 'All Departments' && (
              <button
                onClick={() => setDepartment('All Departments')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Reset to All Branches
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {MITS_DEPARTMENTS.map((dept) => {
              const count =
                dept === 'All Departments'
                  ? facultyList.length
                  : facultyList.filter((f) => f.department.toLowerCase() === dept.toLowerCase()).length;
              return (
                <button
                  key={dept}
                  onClick={() => setDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    department === dept
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span>{dept}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      department === dept ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Faculty Content */}
      {filteredFaculty.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500">
          No faculty found matching the selected criteria. Try adjusting your search query or department filter.
        </div>
      ) : viewMode === 'grouped' && department === 'All Departments' ? (
        /* Branch-wise Grouped View */
        <div className="space-y-10">
          {(Object.entries(branchWiseGroups) as [string, FacultyMember[]][]).map(([deptName, members]) => (
            <section
              key={deptName}
              id={`branch-section-${deptName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="space-y-4"
            >
              {/* Branch / Department Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {deptName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Academic Branch / Department • {members.length} Faculty Member{members.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDepartment(deptName)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto cursor-pointer"
                >
                  Filter only this department →
                </button>
              </div>

              {/* Members in this Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((faculty) => (
                  <FacultyCard key={faculty.id} faculty={faculty} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Flat Grid View or Single Department View */
        <div className="space-y-4">
          {department !== 'All Departments' && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-medium">
              <Building className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Showing faculty for branch / department: <strong>{department}</strong> ({filteredFaculty.length} members)
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
