import React from 'react';
import { EventItem } from '../../types';
import { Calendar, Clock, MapPin, Tag, ExternalLink } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onRegisterClick?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegisterClick }) => {
  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegisterClick) {
      onRegisterClick(event);
    } else if (event.registrationLink) {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id={`event-card-${event.id}`}
      className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Event Poster Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={event.poster}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs border border-white/40">
          {event.category}
        </span>

        {/* Club Tag */}
        <span className="absolute bottom-3 left-3 text-xs font-semibold text-indigo-200 tracking-wide">
          {event.clubName}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Logistics Data */}
          <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-medium text-slate-800">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                >
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Register Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Free Campus Access</span>
          <button
            id={`btn-register-event-${event.id}`}
            onClick={handleRegister}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <span>Register Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
