import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from 'lucide-react';

export const getStatusColor = (status) => {
  switch(status) {
    case 'Live': return 'bg-emerald-100 text-emerald-700';
    case 'Paused': return 'bg-amber-100 text-amber-700';
    case 'Draft': return 'bg-slate-200 text-slate-700';
    case 'Completed': return 'bg-purple-100 text-purple-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export const getStatusDot = (status) => {
  switch(status) {
    case 'Live': return 'bg-emerald-500';
    case 'Paused': return 'bg-amber-500';
    case 'Draft': return 'bg-slate-500';
    case 'Completed': return 'bg-purple-500';
    default: return 'bg-slate-400';
  }
};

export default function CampaignList({ campaigns, onSelect, onNew }) {
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Campaigns</h1>
          <p className="text-slate-500 text-sm">Every outreach program running on this platform, at a glance.</p>
        </div>
        <Button onClick={onNew} className="bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New campaign
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 p-5 h-fit shadow-sm border-slate-200 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
            <button className="text-sky-500 text-xs hover:underline">Clear all</button>
          </div>
          
          <div className="space-y-4 mb-8">
            <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Status</h4>
            {['Live', 'Paused', 'Draft', 'Completed'].map((status) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id={status} defaultChecked />
                  <label htmlFor={status} className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1.5 font-medium ${getStatusColor(status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(status)}`}></span>
                    {status}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 text-sm text-slate-500">
            <span>{campaigns.length} of {campaigns.length} campaigns</span>
            <div className="flex items-center gap-2">
              <span>Sort by</span>
              <select className="border border-slate-200 rounded-md p-1.5 text-slate-700 bg-white shadow-sm outline-none text-sm">
                <option>Name (A-Z)</option>
                <option>Most prospects</option>
              </select>
            </div>
          </div>

          <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Campaign</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Prospects</div>
              <div className="col-span-2 text-right">Outreach</div>
              <div className="col-span-2 text-right">Meetings</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {campaigns.map(camp => (
                <div 
                  key={camp.id} 
                  onClick={() => onSelect(camp)}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="col-span-5">
                    <div className="font-semibold text-slate-900">{camp.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{camp.subtitle}</div>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium ${getStatusColor(camp.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(camp.status)}`}></span>
                      {camp.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-right font-semibold text-slate-900">{camp.prospects}</div>
                  <div className="col-span-2 text-right font-semibold text-slate-900">{camp.outreach}</div>
                  <div className="col-span-2 flex justify-between items-center pl-6">
                    <span className="font-semibold text-slate-900">{camp.meetings}</span>
                    <Button variant="outline" size="sm" className="ml-auto text-xs h-7 border-slate-200">
                      {camp.status === 'Draft' ? 'Start' : camp.status === 'Live' ? 'Pause' : camp.status === 'Paused' ? 'Resume' : 'Done'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}