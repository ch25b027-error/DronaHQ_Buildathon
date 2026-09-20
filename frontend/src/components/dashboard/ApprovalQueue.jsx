import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Send, Inbox } from 'lucide-react';
import api from '../utils/axios';

export default function ApprovalQueue() {
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHitlEnabled, setIsHitlEnabled] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, setRes] = await Promise.all([
        api.get('/approvals'),
        api.get('/approvals/settings')
      ]);

      if (setRes.data.success) {
        setIsHitlEnabled(setRes.data.humanInTheLoop);
      }

      if (appRes.data.success) {
        setApprovals(appRes.data.data);
        if (appRes.data.data.length > 0 && !selectedId) {
          setSelectedId(appRes.data.data[0].id);
          setEditedContent(appRes.data.data[0].draft_content);
        }
      }
    } catch (err) {
      console.error("Error fetching approvals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHitl = async () => {
    const newState = !isHitlEnabled;
    setIsHitlEnabled(newState);
    try {
      await api.put('/approvals/settings', { enabled: newState });
    } catch (err) {
      console.error("Error toggling HITL:", err);
      setIsHitlEnabled(!newState); // revert on error
    }
  };

  const selectedApproval = approvals.find(a => a.id === selectedId);

  const handleSelect = (approval) => {
    setSelectedId(approval.id);
    setEditedContent(approval.draft_content);
  };

  const handleAction = async (status) => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      await api.put(`/approvals/${selectedId}`, {
        status,
        draft_content: editedContent
      });
      // Remove from list
      const newList = approvals.filter(a => a.id !== selectedId);
      setApprovals(newList);
      if (newList.length > 0) {
        setSelectedId(newList[0].id);
        setEditedContent(newList[0].draft_content);
      } else {
        setSelectedId(null);
        setEditedContent('');
      }
    } catch (err) {
      console.error(`Error updating approval status to ${status}:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Approval Queue</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review AI-generated outreach before it sends.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-4 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Human-in-the-Loop</span>
            <span className="text-[10px] text-slate-500">{isHitlEnabled ? 'Agents wait for approval' : 'Agents send automatically'}</span>
          </div>
          <button 
            onClick={toggleHitl}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isHitlEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isHitlEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {approvals.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">All caught up!</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">
            There are no AI-generated drafts pending your review at this time. When campaigns go live, drafts will appear here.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-220px)] md:min-h-[500px]">
          {/* Sidebar List */}
          <Card className="w-full md:w-1/3 flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-h-[250px] md:max-h-none">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/50">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pending Review ({approvals.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {approvals.map(approval => (
                <div 
                  key={approval.id} 
                  onClick={() => handleSelect(approval)}
                  className={`p-4 cursor-pointer transition-colors ${selectedId === approval.id ? 'bg-sky-50 dark:bg-sky-900/10 border-l-2 border-l-sky-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-2 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-200 text-sm">{approval.prospect_name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${approval.channel === 'LinkedIn' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {approval.channel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {approval.prospect_title} at {approval.prospect_company}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Editor Pane */}
          {selectedApproval && (
            <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-h-[500px] md:min-h-0">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-white dark:bg-slate-900">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Draft for {selectedApproval.prospect_name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Review and edit the AI-generated message below before sending.</p>
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-3">Message Content</label>
                <textarea
                  className="flex-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-slate-200 p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none transition-colors"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => handleAction('rejected')}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm"
                  onClick={() => handleAction('approved')}
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" /> Approve & Send
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

