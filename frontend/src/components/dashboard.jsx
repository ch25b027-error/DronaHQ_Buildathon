import React, { useState } from 'react';
import CampaignList from './dashboard/CampaignList';
import CampaignDetail from './dashboard/CampaignDetail';
import CampaignForm from './dashboard/CampaignForm';

// Mock Data
const initialCampaigns = [
  { id: 1, name: "Enterprise Expansion", subtitle: "Existing customers, upsell", status: "Draft", prospects: 0, outreach: 0, meetings: 0 },
  { id: 2, name: "EU Fintech Compliance", subtitle: "Heads of Compliance, EU fintech", status: "Completed", prospects: 410, outreach: 198, meetings: 14 },
  { id: 3, name: "India BFSI CIO Outreach", subtitle: "BFSI CIOs, enterprise", status: "Paused", prospects: 642, outreach: 211, meetings: 11 },
  { id: 4, name: "US SaaS CTO Outreach", subtitle: "SaaS CTOs, 50-500 employees", status: "Live", prospects: 1284, outreach: 426, meetings: 18 },
  { id: 5, name: "Voice AI Founders", subtitle: "Founders at voice-AI startups", status: "Live", prospects: 389, outreach: 142, meetings: 9 },
];

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'form'
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

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

  const handleSave = (savedCampaign) => {
    // Logic to save/update campaign in backend goes here
    setCurrentView(savedCampaign.id ? 'detail' : 'list');
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 font-sans bg-slate-50 min-h-[85vh]">
      {currentView === 'list' && (
        <CampaignList 
          campaigns={campaigns} 
          onSelect={handleSelect} 
          onNew={handleNew} 
        />
      )}
      {currentView === 'detail' && selectedCampaign && (
        <CampaignDetail 
          campaign={selectedCampaign} 
          onBack={handleBack} 
          onEdit={() => handleEdit(selectedCampaign)} 
        />
      )}
      {currentView === 'form' && (
        <CampaignForm 
          campaign={selectedCampaign} 
          onCancel={selectedCampaign ? () => setCurrentView('detail') : handleBack} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}