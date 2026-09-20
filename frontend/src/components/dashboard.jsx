import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from './utils/axios';
import CampaignList from './dashboard/CampaignList';
import CampaignDetail from './dashboard/CampaignDetail';
import CampaignForm from './dashboard/CampaignForm';

export default function Dashnboard() {
  const [currentView, setCurrentView] = useState('list');
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Fetch campaigns using Axios
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns');
        if (response.data.success) {
          const formattedData = response.data.data.map(c => ({
            id: c.campaign_id,
            name: c.name,
            subtitle: "Target Audience", 
            status: c.status || 'Draft',
            prospects: parseInt(c.total_prospects) || 0,
            outreach: 0, 
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

    if (currentView === 'list') {
      fetchCampaigns();
    }
  }, [currentView]);

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
      await api.patch(`/campaigns/${campaignId}/status`, { status: newStatus });
      
      // Update the UI instantly without reloading the page
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(c => c.id === campaignId ? { ...c, status: newStatus } : c)
      );
      
      // Also update the detail view if it's currently open
      if (selectedCampaign && selectedCampaign.id === campaignId) {
        setSelectedCampaign(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Post the form data to backend using Axios
  const handleSave = async (formData, isDraft = false) => {
    try {
      formData.status = isDraft ? 'Draft' : 'Live';
      
      if (formData.id) {
        // Edit existing campaign
        await api.put(`/campaigns/${formData.id}`, formData);
      } else {
        // Create new campaign
        await api.post('/campaigns', formData);
      }
      
      // Force the component to re-render the list view and trigger the useEffect fetch
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
      {currentView === 'list' && (
        <CampaignList campaigns={campaigns} onSelect={handleSelect} onNew={handleNew} onToggleStatus={handleToggleStatus}/>
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