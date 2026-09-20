import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft } from 'lucide-react';

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
  
  // 1. Add state to capture all the text inputs
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    owner: campaign?.owner || '',
    description: campaign?.description || '',
    icp: campaign?.icp || '',
    geography: campaign?.geography || '',
    target_roles: campaign?.target_roles || '',
    company_criteria: campaign?.company_criteria || '',
    exclusion_criteria: campaign?.exclusion_criteria || '',
    daily_contact_limit: campaign?.daily_contact_limit || '',
  });

  const [enabledAgents, setEnabledAgents] = useState(
    isEditing ? ['ICP Fitment Agent', 'Lead Research & Enrichment Agent'] 
    : availableAgents.slice(0, 4)
  );

  // 2. Generic handler for all text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAgent = (agent) => {
    setEnabledAgents(prev => 
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  };

  // 3. Submit handler
  const handleSubmit = (isDraft) => {
    // Combine text data with the selected agents
    const payload = {
      ...formData,
      id: campaign?.id, // undefined for new campaigns
      status: isDraft ? 'Draft' : 'Live',
      agents: enabledAgents
    };
    onSave(payload, isDraft);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onCancel} className="text-slate-500 flex items-center gap-1 hover:text-slate-900 mb-6 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Campaigns
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isEditing ? `Edit: ${campaign.name}` : 'New campaign'}
        </h1>
        <p className="text-slate-500 text-sm">
          {isEditing 
            ? 'Adjust active channels or toggle specific agents for this campaign.'
            : 'Saved as a draft until you activate it — no outreach fires yet.'}
        </p>
      </div>

      <Card className="p-6 md:p-8 shadow-sm border-slate-200 bg-white">
        
        {!isEditing && (
          <>
            <div className="mb-8">
              <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-100 pb-2">Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Campaign name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. US SaaS CTO Outreach" 
                    className="bg-white border-slate-200 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Owner</label>
                  <Input 
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    placeholder="e.g. you" 
                    className="bg-white border-slate-200 focus-visible:ring-sky-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full flex min-h-[100px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 resize-none shadow-sm" 
                  placeholder="One or two lines on the objective of this campaign."
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-100 pb-2">Targeting</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">ICP</label>
                  <Input 
                    name="icp"
                    value={formData.icp}
                    onChange={handleInputChange}
                    placeholder="e.g. SaaS company CTOs" 
                    className="bg-white border-slate-200 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Geography</label>
                  <Input 
                    name="geography"
                    value={formData.geography}
                    onChange={handleInputChange}
                    placeholder="e.g. United States" 
                    className="bg-white border-slate-200 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Target roles</label>
                  <Input 
                    name="target_roles"
                    value={formData.target_roles}
                    onChange={handleInputChange}
                    placeholder="e.g. CTO, VP Engineering" 
                    className="bg-white border-slate-200 focus-visible:ring-sky-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Company criteria</label>
                  <Input 
                    name="company_criteria"
                    value={formData.company_criteria}
                    onChange={handleInputChange}
                    placeholder="e.g. 50–500 employees" 
                    className="bg-white border-slate-200 focus-visible:ring-sky-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Exclusion criteria</label>
                <Input 
                  name="exclusion_criteria"
                  value={formData.exclusion_criteria}
                  onChange={handleInputChange}
                  placeholder="e.g. existing customers, competitors" 
                  className="bg-white border-slate-200 focus-visible:ring-sky-500" 
                />
              </div>
            </div>
          </>
        )}

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

        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-100 pb-2">Channels & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Active channels</label>
              <select className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                <option>Email + LinkedIn</option>
                <option>Email Only</option>
                <option>LinkedIn Only</option>
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