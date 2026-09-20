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
      <button onClick={onCancel} className="text-slate-500 dark:text-slate-400 flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 mb-6 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Campaigns
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {isEditing ? `Edit: ${formData.name || campaign.name}` : 'New campaign'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {isEditing 
            ? 'Adjust active channels or toggle specific agents for this campaign.'
            : 'Saved as a draft until you activate it — no outreach fires yet.'}
        </p>
      </div>

      <Card className="p-6 md:p-8 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        
        {!isEditing && (
          <>
            <div className="mb-8">
              <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-2">Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Campaign name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. US SaaS CTO Outreach" 
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Owner</label>
                  <Input 
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    placeholder="e.g. you" 
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full flex min-h-[100px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white px-3 py-2 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 resize-none shadow-sm transition-colors" 
                  placeholder="One or two lines on the objective of this campaign."
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-2">Targeting</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">ICP</label>
                  <Input 
                    name="icp"
                    value={formData.icp}
                    onChange={handleInputChange}
                    placeholder="e.g. SaaS company CTOs" 
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Geography</label>
                  <Input 
                    name="geography"
                    value={formData.geography}
                    onChange={handleInputChange}
                    placeholder="e.g. United States" 
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Target roles</label>
                  <Input 
                    name="target_roles"
                    value={formData.target_roles}
                    onChange={handleInputChange}
                    placeholder="e.g. CTO, VP Engineering" 
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Company criteria</label>
                  <Input 
                    name="company_criteria"
                    value={formData.company_criteria}
                    onChange={handleInputChange}
                    placeholder="e.g. 50–500 employees" 
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Exclusion criteria</label>
                <Input 
                  name="exclusion_criteria"
                  value={formData.exclusion_criteria}
                  onChange={handleInputChange}
                  placeholder="e.g. existing customers, competitors" 
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                />
              </div>
            </div>
          </>
        )}

        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-2">Agents Enabled</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAgents.map(agent => {
              const isActive = enabledAgents.includes(agent);
              return (
                <div 
                  key={agent} 
                  className={`flex items-center space-x-3 p-4 rounded-md border transition-colors cursor-pointer ${
                    isActive ? 'border-sky-200 bg-[#F4F9FD] dark:border-sky-900 dark:bg-sky-900/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                  }`}
                  onClick={() => toggleAgent(agent)}
                >
                  <Checkbox 
                    id={agent} 
                    checked={isActive} 
                    onCheckedChange={() => toggleAgent(agent)}
                    className={isActive ? 'border-slate-900 bg-slate-900 text-white dark:bg-sky-500 dark:border-sky-500' : 'border-slate-300 dark:border-slate-700'}
                  />
                  <label htmlFor={agent} className="text-sm font-medium leading-none text-slate-800 dark:text-slate-200 cursor-pointer">
                    {agent}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-2">Channels & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Active channels</label>
              <select 
                name="active_channels"
                value={formData.active_channels}
                onChange={handleInputChange}
                className="w-full flex h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors"
              >
                <option value="Email + LinkedIn">Email + LinkedIn</option>
                <option value="Email Only">Email Only</option>
                <option value="LinkedIn Only">LinkedIn Only</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Daily contact limit</label>
              <Input 
                name="daily_contact_limit"
                value={formData.daily_contact_limit}
                onChange={handleInputChange}
                placeholder="e.g. 50 / day" 
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
          <Button variant="outline" onClick={onCancel} className="border-slate-200 dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm">
            Cancel
          </Button>
          {!isEditing && (
            <Button variant="outline" onClick={() => handleSubmit(true)} className="border-slate-200 dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm">
              Save as draft
            </Button>
          )}
          <Button onClick={() => handleSubmit(false)} className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm border-0">
            {isEditing ? 'Save changes' : 'Activate campaign'}
          </Button>
        </div>

      </Card>
    </div>
  );
}