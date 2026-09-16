import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, Check, Lock, Unlock } from 'lucide-react';

interface AdminRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  action: 'RESTRICT' | 'UNBLOCK';
  targetType: 'CLUB' | 'STUDENT' | 'FACULTY' | 'POST' | 'EVENT' | 'COMMENT' | 'HIRING';
  targetName: string;
  loading?: boolean;
}

export const AdminRestrictionModal: React.FC<AdminRestrictionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  targetType,
  targetName,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [selectedQuickReason, setSelectedQuickReason] = useState<string>('');

  if (!isOpen) return null;

  const quickReasonsMap: Record<string, string[]> = {
    CLUB: [
      'Unauthorized external event / sponsorship',
      'Violation of campus code of conduct',
      'Pending executive committee election review',
      'Financial discrepancy under audit',
      'Administrative suspension',
    ],
    STUDENT: [
      'Inappropriate language or abusive comments',
      'Spamming forum discussions / hackathon portals',
      'Falsification of event attendance or certificates',
      'Violation of campus student disciplinary code',
      'Under Dean of Students inquiry',
    ],
    FACULTY: [
      'Unverified external links or commercial promotion',
      'Administrative policy review',
      'Notice posted outside departmental purview',
      'Administrative inquiry',
    ],
    POST: [
      'Inappropriate / unapproved content',
      'Dead or malicious external link',
      'Misleading hackathon / prize information',
      'Duplicate or spam announcement',
      'Violates collegiate communication guidelines',
    ],
    EVENT: [
      'Unauthorized venue booking',
      'Unapproved entry fee or external commercial ticketing',
      'Safety or campus security restriction',
      'Cancelled due to academic calendar clash',
    ],
    COMMENT: [
      'Abusive, hateful, or derogatory language',
      'Spam advertising or external recruitment link',
      'Off-topic harassment',
      'Impersonation of college officials',
    ],
    HIRING: [
      'Unauthorized stipend or recruitment terms',
      'Discriminatory eligibility criteria',
      'Expired or inactive drive',
    ],
  };

  const quickReasons = quickReasonsMap[targetType] || quickReasonsMap['POST'];

  const handleQuickSelect = (r: string) => {
    setSelectedQuickReason(r);
    setReason(r);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'RESTRICT' && !reason.trim()) return;
    onConfirm(reason.trim() || (action === 'UNBLOCK' ? 'Reinstated by College Dean' : 'Administrative restriction'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between text-white ${
            action === 'RESTRICT'
              ? 'bg-gradient-to-r from-rose-700 to-red-900'
              : 'bg-gradient-to-r from-emerald-700 to-teal-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              {action === 'RESTRICT' ? (
                <ShieldAlert className="w-5 h-5 text-rose-200" />
              ) : (
                <Unlock className="w-5 h-5 text-emerald-200" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold">
                {action === 'RESTRICT' ? 'Restrict & Block Activity' : 'Reinstate & Unblock Activity'}
              </h3>
              <p className="text-xs text-white/80">
                Dean & Administrator Disciplinary Action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                {targetType}
              </span>
              <span className="text-xs font-bold text-slate-900 truncate">
                {targetName}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {action === 'RESTRICT'
                ? `You are applying an official administrative restriction on this ${targetType.toLowerCase()}. It will be flagged or blocked from public visibility.`
                : `You are restoring active status for this ${targetType.toLowerCase()}. It will regain full campus privileges.`}
            </p>
          </div>

          {action === 'RESTRICT' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Restriction / Administrative Block <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter specific policy reason or disciplinary note..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 resize-none"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 mb-2 block">
                  Quick Select Regulatory Guidelines:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {quickReasons.map((qr) => (
                    <button
                      key={qr}
                      type="button"
                      onClick={() => handleQuickSelect(qr)}
                      className={`text-[11px] text-left px-2.5 py-1 rounded-lg border transition-all ${
                        selectedQuickReason === qr
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reinstatement Note (Optional)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Issue resolved after departmental review"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (action === 'RESTRICT' && !reason.trim())}
              className={`px-5 py-2 text-xs font-bold rounded-xl text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 ${
                action === 'RESTRICT'
                  ? 'bg-rose-600 hover:bg-rose-700 disabled:opacity-50'
                  : 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
              }`}
            >
              {action === 'RESTRICT' ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>{loading ? 'Restricting...' : 'Confirm Block & Restriction'}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{loading ? 'Reinstating...' : 'Confirm Reinstatement'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
