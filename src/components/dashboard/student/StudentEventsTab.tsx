import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  RefreshCw,
  Sparkles,
  Users,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { EventItem, Club } from '../../../types';

interface StudentEventsTabProps {
  events: EventItem[];
  rsvpdEventIds: string[];
  clubsList: Club[];
  onToggleRsvp: (event: EventItem) => void;
  onRefreshEvents?: () => void;
  isRefreshing?: boolean;
}

export const StudentEventsTab: React.FC<StudentEventsTabProps> = ({
  events,
  rsvpdEventIds,
  clubsList,
  onToggleRsvp,
  onRefreshEvents,
  isRefreshing = false,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Technical',
    'Workshop',
    'Hackathon',
    'Cultural',
    'Sports',
    'Seminar',
    'Competition',
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat =
        categoryFilter === 'All' ||
        ev.category.toLowerCase() === categoryFilter.toLowerCase();
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.clubName.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [events, categoryFilter, search]);

  const handleShare = (event: EventItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this college event: ${event.title} organized by ${event.clubName} on ${event.date} at ${event.venue}!`
      );
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Campus Life & Events</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Upcoming Events & Hackathons
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Whenever any college club uploads an event, hackathon, or cultural fest, it immediately reflects here. Register to secure your seat and receive verified entry!
            </p>
          </div>

          {/* Quick Stats & Refresh */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            {onRefreshEvents && (
              <button
                onClick={onRefreshEvents}
                disabled={isRefreshing}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                title="Fetch latest club events"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isRefreshing ? 'Checking for Events...' : 'Refresh Feed'}</span>
              </button>
            )}

            <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{events.length} Live Club Events</span>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event, club, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No events found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {search || categoryFilter !== 'All'
              ? 'No scheduled club events match your current filter criteria. Try clearing search or selecting "All".'
              : 'Club leaders have not uploaded any new events yet. As soon as a club publishes an event, it will appear here instantly!'}
          </p>
          {(search || categoryFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const isRsvpd = rsvpdEventIds.includes(ev.id);

            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Event Poster / Image Frame */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={
                        ev.poster ||
                        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/95 text-indigo-900 shadow-xs backdrop-blur-xs">
                        {ev.category}
                      </span>
                    </div>

                    {/* Club Tag */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs border border-white/10">
                        @{ev.clubName}
                      </span>
                    </div>

                    {/* Date Block Overlay */}
                    <div className="absolute bottom-3 left-3 text-white flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-xl bg-indigo-600/90 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ev.date}</span>
                      </div>
                      {ev.time && (
                        <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[11px] font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{ev.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>

                    {/* Logistics Venue Card */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate text-slate-700 font-medium">{ev.venue}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Open Entry
                      </span>
                    </div>

                    {/* Tags */}
                    {ev.tags && ev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {ev.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRsvp(ev)}
                      id={`btn-rsvp-event-${ev.id}`}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isRsvpd
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 shadow-2xs'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                      }`}
                    >
                      {isRsvpd ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Seat Registered & Confirmed ✓</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Register / RSVP for Event</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShare(ev)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors cursor-pointer shrink-0"
                      title="Share Event Details"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {copiedId === ev.id && (
                    <p className="text-[11px] text-emerald-600 text-center font-medium animate-in fade-in">
                      Event info copied to clipboard!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
