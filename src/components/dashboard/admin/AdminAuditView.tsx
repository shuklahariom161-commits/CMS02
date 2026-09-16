import React, { useState } from 'react';
import { ActivityLogItem } from '../../../types';
import { Clock, Shield, Search, Filter, ShieldAlert, CheckCircle2, Lock, Unlock, Trash2 } from 'lucide-react';

interface AdminAuditViewProps {
  activityLogs: ActivityLogItem[];
  onClearLogs?: () => void;
}

export const AdminAuditView: React.FC<AdminAuditViewProps> = ({ activityLogs, onClearLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.targetName.toLowerCase().includes(q) ||
      log.reason.toLowerCase().includes(q) ||
      log.actionType.toLowerCase().includes(q) ||
      log.adminName.toLowerCase().includes(q);

    const matchesType = targetTypeFilter === 'ALL' || log.targetType === targetTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by entity, reason, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Target Types</option>
            <option value="CLUB">Clubs</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="POST">Posts</option>
            <option value="EVENT">Events</option>
            <option value="COMMENT">Comments</option>
          </select>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors"
            >
              Reset Session Logs
            </button>
          )}
        </div>
      </div>

      {/* Logs Table / List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          No audit entries matching search query.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit Trail Records ({filteredLogs.length})
            </h3>
            <span className="text-[11px] text-slate-400">Chronological Administrative Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const isRestricted =
                log.actionType.startsWith('RESTRICT') || log.actionType.startsWith('BLOCK');

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isRestricted
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {isRestricted ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                        {log.actionType.replace('_', ' ')}
                      </span>

                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {log.targetType}
                      </span>

                      <span className="font-bold text-slate-900">{log.targetName}</span>
                    </div>

                    <p className="text-slate-600 text-xs">
                      <strong className="text-slate-700">Recorded Reason:</strong> {log.reason}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between text-[11px] text-slate-400 shrink-0">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="font-medium text-slate-600">Admin: {log.adminName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
