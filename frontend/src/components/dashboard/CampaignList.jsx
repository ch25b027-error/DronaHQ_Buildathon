import { useState, useMemo } from 'react';
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

const ALL_STATUSES = ['Live', 'Paused', 'Draft', 'Completed'];
const MAX_RANGES = { prospects: 1300, outreach: 500, meetings: 20 };

export default function CampaignList({ campaigns, onSelect, onNew }) {
  const [statusFilters, setStatusFilters] = useState(ALL_STATUSES);
  const [rangeFilters, setRangeFilters] = useState(MAX_RANGES);
  const [sortOption, setSortOption] = useState('Name (A-Z)');

  const handleStatusToggle = (status) => {
    setStatusFilters(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleRangeChange = (type, value) => {
    setRangeFilters(prev => ({ ...prev, [type]: Number(value) }));
  };

  const handleClearAll = () => {
    setStatusFilters(ALL_STATUSES);
    setRangeFilters(MAX_RANGES);
    setSortOption('Name (A-Z)');
  };

  const processedCampaigns = useMemo(() => {
    let result = campaigns.filter(camp => {
      const matchesStatus = statusFilters.includes(camp.status);
      const matchesProspects = camp.prospects <= rangeFilters.prospects;
      const matchesOutreach = camp.outreach <= rangeFilters.outreach;
      const matchesMeetings = camp.meetings <= rangeFilters.meetings;
      return matchesStatus && matchesProspects && matchesOutreach && matchesMeetings;
    });

    if (sortOption === 'Name (A-Z)') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'Most prospects') {
      result.sort((a, b) => b.prospects - a.prospects);
    } else if (sortOption === 'Most outreach') {
      result.sort((a, b) => b.outreach - a.outreach);
    } else if (sortOption === 'Most meetings') {
      result.sort((a, b) => b.meetings - a.meetings);
    }

    return result;
  }, [campaigns, statusFilters, rangeFilters, sortOption]);

  const getStatusCount = (status) => campaigns.filter(c => c.status === status).length;

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
        
        {/* Sidebar Filters */}
        <Card className="w-full md:w-64 p-5 h-fit shadow-sm border-slate-200 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
            <button onClick={handleClearAll} className="text-sky-500 text-xs hover:underline">Clear all</button>
          </div>
          
          <div className="space-y-3 mb-4">
            <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Status</h4>
            {ALL_STATUSES.map((status) => (
              <div key={status} className="flex items-center justify-between">
                {/* Removed the conflicting onClick from this wrapper div */}
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={status} 
                    checked={statusFilters.includes(status)} 
                    onCheckedChange={() => handleStatusToggle(status)}
                    className="border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 data-[state=checked]:text-white cursor-pointer"
                  />
                  {/* The htmlFor attribute ensures clicking the label toggles the checkbox perfectly */}
                  <label htmlFor={status} className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1.5 font-medium cursor-pointer select-none ${getStatusColor(status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(status)}`}></span>
                    {status}
                  </label>
                </div>
                <span className="text-slate-400 text-xs">{getStatusCount(status)}</span>
              </div>
            ))}
          </div>

          <hr className=" border-slate-100" />

          {/* Range Sliders */}
          <div className="space-y-0">
            <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Ranges</h4>
            
            {[
              { id: 'prospects', label: 'Prospects', max: MAX_RANGES.prospects, val: rangeFilters.prospects },
              { id: 'outreach', label: 'Outreach', max: MAX_RANGES.outreach, val: rangeFilters.outreach },
              { id: 'meetings', label: 'Meetings', max: MAX_RANGES.meetings, val: rangeFilters.meetings }
            ].map(range => {
              const percentage = (range.val / range.max) * 100;
              return (
              <div key={range.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{range.label}</span>
                  <span className="text-sky-500 font-semibold">0 - {range.val.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={range.max}
                  value={range.val}
                  onChange={(e) => handleRangeChange(range.id, e.target.value)}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:border-0"
                  style={{
                    background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
                  }}
                />
              </div>
            )})}
          </div>
        </Card>

        {/* Main List Area */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 text-sm text-slate-500">
            <span>{processedCampaigns.length} of {campaigns.length} campaigns</span>
            <div className="flex items-center gap-2">
              <span>Sort by</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-slate-200 rounded-md p-1.5 text-slate-700 bg-white shadow-sm outline-none text-sm cursor-pointer"
              >
                <option>Name (A-Z)</option>
                <option>Most prospects</option>
                <option>Most outreach</option>
                <option>Most meetings</option>
              </select>
            </div>
          </div>

          <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
            {/* Header Row: Tightened padding (py-3) and white background */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-slate-100 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Campaign</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Prospects</div>
              <div className="col-span-2 text-right">Outreach</div>
              <div className="col-span-2 text-right pr-2">Meetings</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {processedCampaigns.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No campaigns match your current filters.
                </div>
              ) : (
                processedCampaigns.map(camp => (
                  <div 
                    key={camp.id} 
                    onClick={() => onSelect(camp)}
                    // Added 'group' and changed hover color to sky-50
                    className="group grid grid-cols-12 gap-4 p-4 items-center hover:bg-sky-50 cursor-pointer transition-colors"
                  >
                    <div className="col-span-5">
                      <div className="font-semibold text-slate-900">{camp.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{camp.subtitle}</div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium ${getStatusColor(camp.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(camp.status)}`}></span>
                        {camp.status}
                      </span>
                    </div>
                    <div className="col-span-1 text-right font-semibold text-slate-900">{camp.prospects}</div>
                    <div className="col-span-2 text-right font-semibold text-slate-900">{camp.outreach}</div>
                    <div className="col-span-2 flex justify-between items-center pl-6">
                      <span className="font-semibold text-slate-900">{camp.meetings}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        // Dynamic button styling based on row hover and 'Completed' state
                        className={`ml-auto text-xs h-7 transition-colors ${
                          camp.status === 'Completed' 
                            ? 'border-transparent text-slate-400 bg-transparent hover:bg-transparent pointer-events-none' 
                            : 'border-slate-200 text-slate-700 bg-white group-hover:border-sky-500 group-hover:text-sky-600 group-hover:bg-sky-50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add status toggle logic here later when connected to backend
                        }}
                      >
                        {camp.status === 'Draft' ? 'Start' : camp.status === 'Live' ? 'Pause' : camp.status === 'Paused' ? 'Resume' : 'Done'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}