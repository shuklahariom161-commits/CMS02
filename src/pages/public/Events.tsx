import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types';
import { api } from '../../services/api';
import { EventCard } from '../../components/cards/EventCard';
import { Calendar, Search, Tag, Filter } from 'lucide-react';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Sports',
    'Workshop',
    'Competition',
    'Seminar',
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.getEvents(category, search);
        if (res.success) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>College Calendar</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Events & Activities
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Discover all upcoming college competitions, technical workshops, sports fixtures, and cultural nights. Open to all students.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="events-search-input"
            type="text"
            placeholder="Search events by title, venue, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

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

      {/* Events Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Loading scheduled events...</div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-600">No events found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
};
