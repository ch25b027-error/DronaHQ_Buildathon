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
  
  const [enabledAgents, setEnabledAgents] = useState(
    isEditing ? ['ICP Fitment Agent', 'Lead Research & Enrichment Agent'] 
    : availableAgents.slice(0, 4)
  );

  const toggleAgent = (agent) => {
    setEnabledAgents(prev => 
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
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
        
        {/* Only show Identity & Targeting if creating a NEW campaign */}
        {!isEditing && (
          <>
            {/* IDENTITY SECTION */}
            <div className="mb-8">
              <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-100 pb-2">Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Campaign name</label>
                  <Input placeholder="e.g. US SaaS CTO Outreach" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Owner</label>
                  <Input placeholder="e.g. you" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Description</label>
                <textarea 
                  className="w-full flex min-h-[100px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 resize-none shadow-sm" 
                  placeholder="One or two lines on the objective of this campaign."
                ></textarea>
              </div>
            </div>

            {/* TARGETING SECTION */}
            <div className="mb-8">
              <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-100 pb-2">Targeting</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">ICP</label>
                  <Input placeholder="e.g. SaaS company CTOs" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Geography</label>
                  <Input placeholder="e.g. United States" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Target roles</label>
                  <Input placeholder="e.g. CTO, VP Engineering" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Company criteria</label>
                  <Input placeholder="e.g. 50–500 employees" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Exclusion criteria</label>
                <Input placeholder="e.g. existing customers, competitors" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
              </div>
            </div>
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
              <select className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                <option>Email + LinkedIn</option>
                <option>Email Only</option>
                <option>LinkedIn Only</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Daily contact limit</label>
              <Input placeholder="e.g. 50 / day" className="bg-white border-slate-200 focus-visible:ring-sky-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={onCancel} className="border-slate-200 shadow-sm">
            Cancel
          </Button>
          <Button onClick={() => onSave({ id: campaign?.id || 99 })} className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
            {isEditing ? 'Save changes' : 'Activate campaign'}
          </Button>
        </div>

      </Card>
    </div>
  );
}