import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
    daily_contact_limit: '', active_channels: 'Email + LinkedIn',
    value_proposition: '', agent_tone: 'Professional & Direct'
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
              active_channels: dbData.active_channels || 'Email + LinkedIn',
              value_proposition: dbData.value_proposition || '',
              agent_tone: dbData.agent_tone || 'Professional & Direct'
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

  const isFormValid = isEditing 
    ? true // Name and all other fields are not mandatory when editing
    : formData.name?.trim() !== '' && 
      formData.owner?.trim() !== '' &&
      formData.target_roles?.trim() !== '' && 
      formData.company_criteria?.trim() !== '' && 
      formData.value_proposition?.trim() !== '';

  const handleSubmit = (isDraft) => {
    if (!isFormValid) return;
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
          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-2">Identity & Base Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Campaign name <span className="text-red-500">*</span></label>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. US SaaS CTO Outreach" 
                  className="h-11 mt-1.5 md:mt-2.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Owner <span className="text-red-500">*</span></label>
                <Input 
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  placeholder="e.g. you" 
                  className="h-11 mt-1.5 md:mt-2.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-2">Campaign Settings & ICP Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Target Role {isEditing ? '' : <span className="text-red-500">*</span>}</label>
              <Input 
                name="target_roles"
                value={formData.target_roles}
                onChange={handleInputChange}
                placeholder="e.g. VP of Engineering" 
                className="h-11 mt-1.5 md:mt-2.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Target Industry {isEditing ? '' : <span className="text-red-500">*</span>}</label>
              <Input 
                name="company_criteria"
                value={formData.company_criteria}
                onChange={handleInputChange}
                placeholder="e.g. Fintech in the Series B stage" 
                className="h-11 mt-1.5 md:mt-2.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
              />
            </div>
          </div>
          
          <div className="mb-4 space-y-3">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Value Proposition {isEditing ? '' : <span className="text-red-500">*</span>}</label>
            <Textarea
              name="value_proposition"
              value={formData.value_proposition}
              onChange={handleInputChange}
              placeholder="e.g. Our API reduces database latency by 40%"
              className="mt-1.5 md:mt-2.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500 resize-none h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Agent Tone</label>
              <select 
                name="agent_tone"
                value={formData.agent_tone}
                onChange={handleInputChange}
                className="w-full mt-1.5 md:mt-2.5 flex h-11 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors"
              >
                <option value="Professional & Direct">Professional & Direct</option>
                <option value="Casual & Friendly">Casual & Friendly</option>
                <option value="Urgent">Urgent</option>
                <option value="Consultative">Consultative</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Geography (Optional)</label>
              <Input 
                name="geography"
                value={formData.geography}
                onChange={handleInputChange}
                placeholder="e.g. United States" 
                className="h-11 mt-1.5 md:mt-2.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mb-6 p-4 rounded-lg bg-sky-50 border border-sky-100 dark:bg-sky-900/10 dark:border-sky-800/30">
            <h4 className="text-sm font-semibold text-sky-800 dark:text-sky-300">Edit Agents & Channels</h4>
            <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">You can dynamically change which AI agents run and what channels they use for this specific campaign.</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-2">Agents Enabled</h3>
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

        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-2">Channels & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Active channels</label>
              <select 
                name="active_channels"
                value={formData.active_channels}
                onChange={handleInputChange}
                className="w-full mt-1.5 md:mt-2.5 flex h-11 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors"
              >
                <option value="Email + LinkedIn">Email + LinkedIn</option>
                <option value="Email Only">Email Only</option>
                <option value="LinkedIn Only">LinkedIn Only</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Daily contact limit</label>
              <Input 
                name="daily_contact_limit"
                value={formData.daily_contact_limit}
                onChange={handleInputChange}
                placeholder="e.g. 50 / day" 
                className="h-11 mt-1.5 md:mt-2.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600 focus-visible:ring-sky-500" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/60">
          <Button variant="outline" onClick={onCancel} className="border-slate-200 dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm">
            Cancel
          </Button>
          {!isEditing && (
            <Button variant="outline" onClick={() => handleSubmit(true)} disabled={!isFormValid} className="border-slate-200 dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Save as draft
            </Button>
          )}
          <Button onClick={() => handleSubmit(false)} disabled={!isFormValid} className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm border-0 disabled:opacity-50 disabled:cursor-not-allowed">
            {isEditing ? 'Save changes' : 'Activate campaign'}
          </Button>
        </div>

      </Card>
    </div>
  );
}