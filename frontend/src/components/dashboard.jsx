import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from './utils/axios';
import CampaignList from './dashboard/CampaignList';
import CampaignDetail from './dashboard/CampaignDetail';
import CampaignForm from './dashboard/CampaignForm';
import ApprovalQueue from './dashboard/ApprovalQueue';

export default function Dashnboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentView, setCurrentView] = useState('list');
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [approvalCount, setApprovalCount] = useState(0);

  useEffect(() => {
    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('refreshCampaigns', triggerRefresh);
    return () => window.removeEventListener('refreshCampaigns', triggerRefresh);
  }, []);

  // Fetch campaigns and approvals count
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns');
        if (response.data.success) {
          const formattedData = response.data.data.map(c => ({
            id: c.campaign_id,
            name: c.name,
            owner: c.owner,
            icp: c.icp,
            subtitle: c.icp || "Target Audience", 
            status: c.status || 'Draft',
            prospects: parseInt(c.total_prospects) || 0,
            outreach: parseInt(c.outreach_sent) || 0, 
            meetings: 0  
          }));
          setCampaigns(formattedData);
        }
      } catch (err) {
        console.error("Network error fetching campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchApprovalCount = async () => {
      try {
        const response = await api.get('/approvals');
        if (response.data.success) {
          setApprovalCount(response.data.data.length);
        }
      } catch (err) {
        // Ignore error if route doesn't exist yet
      }
    };

    if (currentView === 'list') {
      fetchCampaigns();
    }
    fetchApprovalCount();
  }, [currentView, refreshTrigger]);

  const handleSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setCurrentView('detail');
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setCurrentView('form');
  };

  const handleNew = () => {
    setSelectedCampaign(null);
    setCurrentView('form');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedCampaign(null);
  };

  const handleToggleStatus = async (campaignId, newStatus) => {
    try {
      // 1. Update the status in the database
      await api.patch(`/campaigns/${campaignId}/status`, { status: newStatus });
      
      // 2. If we are turning it LIVE, trigger the live AI agent pipeline!
      if (newStatus === 'Live') {
        const pipelineRes = await api.post(`/campaigns/${campaignId}/test-pipeline`);
        console.log("AI Pipeline triggered on activation:", pipelineRes.data);
      }
      
      // Update UI state instantly
      setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: newStatus } : c));
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Error updating status or triggering pipeline:", err);
    }
  };

  // Post the form data to backend using Axios
  const handleSave = async (formData, isDraft = false) => {
    try {
      formData.status = isDraft ? 'Draft' : 'Live';
      
      if (formData.id) {
        await api.put(`/campaigns/${formData.id}`, formData);
      } else {
        await api.post('/campaigns', formData);
      }
      
      setCurrentView('list');
      setSelectedCampaign(null);
    } catch (err) {
      console.error("Error saving campaign", err);
    }
  };

  // Inside your component, update the loading return:
  if (isLoading) {
    return (
      <div className="max-w-screen mx-auto min-h-[85vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-4" />
        <p className="text-slate-500 text-sm">Loading campaigns...</p>
      </div>
    );
  }

  // Update the main return wrapper:
  return (
    <div className="max-w-screen mx-auto p-6 md:p-8 font-sans bg-slate-50 dark:bg-slate-950 min-h-[85vh] transition-colors duration-200">
      
      {['list', 'approvals'].includes(currentView) && (
        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button 
            className={`pb-3 text-sm font-medium ${currentView === 'list' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            onClick={() => setCurrentView('list')}
          >
            Campaigns
          </button>
          <button 
            className={`pb-3 text-sm font-medium flex items-center gap-2 ${currentView === 'approvals' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            onClick={() => setCurrentView('approvals')}
          >
            Approval Queue
            {approvalCount > 0 && (
              <span className="bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400 py-0.5 px-2 rounded-full text-[10px]">
                {approvalCount}
              </span>
            )}
          </button>
        </div>
      )}

      {currentView === 'list' && (
        <CampaignList campaigns={campaigns} onSelect={handleSelect} onNew={handleNew} onToggleStatus={handleToggleStatus}/>
      )}
      {currentView === 'approvals' && (
        <ApprovalQueue />
      )}
      {currentView === 'detail' && selectedCampaign && (
        <CampaignDetail campaign={selectedCampaign} onBack={handleBack} onEdit={() => handleEdit(selectedCampaign)} onToggleStatus={handleToggleStatus}/>
      )}
      {currentView === 'form' && (
        <CampaignForm campaign={selectedCampaign} onCancel={selectedCampaign ? () => setCurrentView('detail') : handleBack} onSave={handleSave} />
      )}
    </div>
  );
}