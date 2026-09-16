import React, { useState, useEffect } from 'react';
import { Club } from '../../types';
import { api } from '../../services/api';
import { ClubCard } from '../../components/cards/ClubCard';
import { Users, Search, Filter, Sparkles, Building2 } from 'lucide-react';
import { mitsClubs } from '../../data/mitsClubs';

interface ClubsProps {
  onNavigate: (page: string) => void;
}

export const Clubs: React.FC<ClubsProps> = ({ onNavigate }) => {
  const [clubs, setClubs] = useState<Club[]>(mitsClubs);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const categories = ['All', 'Technical', 'Cultural', 'Literary', 'Sports', 'Social', 'Professional Society'];

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const res = await api.getClubs(category, search);
        if (res.success && res.data && res.data.length > 0) {
          setClubs(res.data);
        } else {
          // Client-side filter fallback from official MITS data
          let filtered = [...mitsClubs];
          if (category !== 'All') {
            filtered = filtered.filter(
              (c) => c.category.toLowerCase() === category.toLowerCase()
            );
          }
          if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
              (c) =>
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q) ||
                c.tagline?.toLowerCase().includes(q) ||
                c.facultyAdvisor?.toLowerCase().includes(q)
            );
          }
          setClubs(filtered);
        }
      } catch (err) {
        console.error(err);
        let filtered = [...mitsClubs];
        if (category !== 'All') {
          filtered = filtered.filter(
            (c) => c.category.toLowerCase() === category.toLowerCase()
          );
        }
        if (search.trim()) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.code.toLowerCase().includes(q) ||
              c.tagline?.toLowerCase().includes(q) ||
              c.facultyAdvisor?.toLowerCase().includes(q)
          );
        }
        setClubs(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Campus Societies</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Registered College Clubs
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Discover all recognized student organizations and specialized interest groups. Club management and members can organize events and open hiring calls.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="clubs-search-input"
            type="text"
            placeholder="Search clubs by name, code or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                category === cat
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
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Loading clubs directory...</div>
      ) : clubs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-600">No clubs match your selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
};
