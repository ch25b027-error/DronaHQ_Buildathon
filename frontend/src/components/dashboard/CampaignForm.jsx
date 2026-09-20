import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Loader2 } from 'lucide-react';
import api from '../utils/axios';

const availableAgents = [
  'ICP Fitment Agent', 
  'Lead Research & Enrichment Agent', 
  'Outreach Strategy Agent', 
  'Personalisation / Email Agent',
  'Conversation Agent',
  'Voice SDR Agent',
  'Follow-up Agent'
];

export default function CampaignForm({ campaign, onCancel, onSave }) {
  const isEditing = !!campaign;
  const [isLoading, setIsLoading] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    name: '', owner: '', description: '', icp: '', geography: '', 
    target_roles: '', company_criteria: '', exclusion_criteria: '', 
    daily_contact_limit: '', active_channels: 'Email + LinkedIn'
  });

  const [enabledAgents, setEnabledAgents] = useState(availableAgents.slice(0, 4));

  // Fetch actual data from DB if editing
  useEffect(() => {
    if (isEditing && campaign.id) {
      api.get(`/campaigns/${campaign.id}`)
        .then(res => {
          if (res.data.success) {
            const dbData = res.data.data;
            setFormData(prev => ({
              ...prev,
              ...dbData,
              daily_contact_limit: dbData.daily_contact_limit || '',
              active_channels: dbData.active_channels || 'Email + LinkedIn'
            }));
            if (dbData.agents && dbData.agents.length > 0) {
              setEnabledAgents(dbData.agents);
            }
          }
        })
        .catch(err => console.error("Error fetching campaign details:", err))
        .finally(() => setIsLoading(false));
    }
  }, [campaign, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAgent = (agent) => {
    setEnabledAgents(prev => 
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  };

  const handleSubmit = (isDraft) => {
    const payload = {
      ...formData,
      id: campaign?.id,
      status: isDraft ? 'Draft' : 'Live',
      agents: enabledAgents
    };
    onSave(payload, isDraft);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onCancel} className="text-slate-500 flex items-center gap-1 hover:text-slate-900 mb-6 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Campaigns
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isEditing ? `Edit: ${formData.name || campaign.name}` : 'New campaign'}
        </h1>
        <p className="text-slate-500 text-sm">
          {isEditing 
            ? 'Adjust active channels or toggle specific agents for this campaign.'
            : 'Saved as a draft until you activate it — no outreach fires yet.'}
        </p>
      </div>

      <Card className="p-6 md:p-8 shadow-sm border-slate-200 bg-white">
        
        {/* Only show Identity & Targeting if creating a NEW campaign */}
        {!isEditing && (
          <>
            {/* Identity & Targeting sections stay exactly the same as before */}
            {/* ... omitting for brevity, keep your existing code here ... */}
          </>
        )}

        {/* AGENTS SECTION */}
        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-100 pb-2">Agents Enabled</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAgents.map(agent => {
              const isActive = enabledAgents.includes(agent);
              return (
                <div 
                  key={agent} 
                  className={`flex items-center space-x-3 p-4 rounded-md border transition-colors cursor-pointer ${
                    isActive ? 'border-sky-200 bg-[#F4F9FD]' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleAgent(agent)}
                >
                  <Checkbox 
                    id={agent} 
                    checked={isActive} 
                    onCheckedChange={() => toggleAgent(agent)}
                    className={isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'}
                  />
                  <label htmlFor={agent} className="text-sm font-medium leading-none text-slate-800 cursor-pointer">
                    {agent}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHANNELS SECTION */}
        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-100 pb-2">Channels & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Active channels</label>
              <select 
                name="active_channels"
                value={formData.active_channels}
                onChange={handleInputChange}
                className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="Email + LinkedIn">Email + LinkedIn</option>
                <option value="Email Only">Email Only</option>
                <option value="LinkedIn Only">LinkedIn Only</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Daily contact limit</label>
              <Input 
                name="daily_contact_limit"
                value={formData.daily_contact_limit}
                onChange={handleInputChange}
                placeholder="e.g. 50 / day" 
                className="bg-white border-slate-200 focus-visible:ring-sky-500" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={onCancel} className="border-slate-200 shadow-sm">
            Cancel
          </Button>
          {!isEditing && (
            <Button variant="outline" onClick={() => handleSubmit(true)} className="border-slate-200 shadow-sm">
              Save as draft
            </Button>
          )}
          <Button onClick={() => handleSubmit(false)} className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
            {isEditing ? 'Save changes' : 'Activate campaign'}
          </Button>
        </div>

      </Card>
    </div>
  );
}