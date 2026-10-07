import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle, XCircle, Edit3, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { fetchPendingReviews, processReviewAction, type PendingReviewItem } from '../services/api';


export const ReviewDashboardPage: React.FC = () => {
  const [pendingItems, setPendingItems] = useState<PendingReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{ item: PendingReviewItem; action: string } | null>(null);
  const [reviewerComment, setReviewerComment] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingReviews();
      setPendingItems(data);
    } catch (err) {
      console.error('Failed to load review items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAction = async () => {
    if (!actionModal) return;
    setProcessing(true);
    try {
      await processReviewAction(
        actionModal.item.type,
        actionModal.item.id,
        actionModal.action,
        reviewerComment
      );
      setActionModal(null);
      setReviewerComment('');
      await loadPending();
    } catch (err) {
      alert('Failed to update review status');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="review-dashboard-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/repository" className="inline-flex items-center text-xs text-amber-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Portal
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-amber-400" />
                Scientific Reviewer Portal
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Quality control gate: Verify scientific accuracy, provenance metadata, and approve repository submissions.
              </p>
            </div>
            <button
              onClick={loadPending}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading review queue...</div>
        ) : pendingItems.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Review Queue is Empty!</h3>
            <p className="text-xs text-slate-400">All submitted scientific records have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{pendingItems.length} records awaiting scientific review</span>
            </div>

            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {item.type}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Expedition: {item.expedition_id || 'General'}</span>
                    <span className="text-xs text-slate-500">• Submitted: {item.created_at ? item.created_at.substring(0, 10) : 'Today'}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-300">Authors: {item.authors || 'NCPOR Researcher'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActionModal({ item, action: 'APPROVE' })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => setActionModal({ item, action: 'REQUEST_CHANGES' })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shadow"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Request Changes
                  </button>
                  <button
                    onClick={() => setActionModal({ item, action: 'REJECT' })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-red-900 hover:bg-red-800 text-red-200 font-medium text-xs transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Confirm Review Action: {actionModal.action}
            </h3>

            <p className="text-xs text-slate-300">
              Item: <strong>{actionModal.item.title}</strong> ({actionModal.item.type.toUpperCase()})
            </p>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">Reviewer Comments / Audit Notes</label>
              <textarea
                rows={3}
                placeholder="Enter feedback for the author or reason for approval/rejection..."
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessAction}
                disabled={processing}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold shadow transition-colors"
              >
                {processing ? 'Saving...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
