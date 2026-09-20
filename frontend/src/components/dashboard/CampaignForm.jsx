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
  
  // State for Agent Selection (Pre-selects first 4 if new)
  const [enabledAgents, setEnabledAgents] = useState(
    isEditing ? ['ICP Fitment Agent', 'Lead Research & Enrichment Agent'] // Mock pre-selected for edit
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
          {isEditing ? 'Modify targeting, adjust channels, or toggle specific agents.' : 'Saved as a draft until you activate it — no outreach fires yet.'}
        </p>
      </div>

      <Card className="p-8 shadow-sm border-slate-200 bg-white">
        
        {/* Identity & Targeting sections would go here (same as previous iteration) */}
        <div className="mb-8 p-12 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-sm">
          [ Identity & Targeting Inputs Render Here ]
        </div>

        {/* Dynamic Agents Section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 border-b border-slate-100 pb-2">Agents Enabled</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAgents.map(agent => {
              const isActive = enabledAgents.includes(agent);
              return (
                <div 
                  key={agent} 
                  className={`flex items-center space-x-3 p-4 rounded-md border transition-colors cursor-pointer ${
                    isActive ? 'border-sky-200 bg-sky-50/60' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleAgent(agent)}
                >
                  <Checkbox 
                    id={agent} 
                    checked={isActive} 
                    onCheckedChange={() => toggleAgent(agent)}
                    className={isActive ? 'border-sky-500 bg-sky-500 text-white' : ''}
                  />
                  <label htmlFor={agent} className="text-sm font-medium leading-none text-slate-700 cursor-pointer">
                    {agent}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channels Section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 border-b border-slate-100 pb-2">Channels & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Active channels</label>
              <select className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
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
          <Button variant="outline" onClick={onCancel} className="border-slate-200">
            {isEditing ? 'Cancel' : 'Save as draft'}
          </Button>
          <Button onClick={() => onSave({ id: 99 })} className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
            {isEditing ? 'Save changes' : 'Activate campaign'}
          </Button>
        </div>

      </Card>
    </div>
  );
}