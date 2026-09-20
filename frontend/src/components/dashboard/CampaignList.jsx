import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from 'lucide-react';

export const getStatusColor = (status) => {
  switch(status) {
    case 'Live': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
    case 'Paused': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    case 'Draft': return 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300';
    case 'Completed': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};

export const getStatusDot = (status) => {
  switch(status) {
    case 'Live': return 'bg-emerald-500';
    case 'Paused': return 'bg-amber-500';
    case 'Draft': return 'bg-slate-500 dark:bg-slate-400';
    case 'Completed': return 'bg-purple-500';
    default: return 'bg-slate-400';
  }
};

const ALL_STATUSES = ['Live', 'Paused', 'Draft', 'Completed'];
const MAX_RANGES = { prospects: 1300, outreach: 500, meetings: 20 };

export default function CampaignList({ campaigns, onSelect, onNew, onToggleStatus }) {
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Campaigns</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Every outreach program running on this platform, at a glance.</p>
        </div>
        <Button onClick={onNew} className="bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm border-0">
          <Plus className="w-4 h-4 mr-2" /> New campaign
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        <Card className="w-full md:w-64 p-5 h-fit shadow-sm border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Filters</h3>
            <button onClick={handleClearAll} className="text-sky-500 text-xs hover:underline">Clear all</button>
          </div>
          
          <div className="space-y-3 mb-4">
            <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Status</h4>
            {ALL_STATUSES.map((status) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={status} 
                    checked={statusFilters.includes(status)} 
                    onCheckedChange={() => handleStatusToggle(status)}
                    className="border-slate-800 dark:border-slate-200 bg-transparent data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 data-[state=checked]:text-white cursor-pointer"
                  />
                  <label htmlFor={status} className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1.5 font-medium cursor-pointer select-none ${getStatusColor(status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(status)}`}></span>
                    {status}
                  </label>
                </div>
                <span className="text-slate-400 text-xs">{getStatusCount(status)}</span>
              </div>
            ))}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div className="space-y-0 mt-4">
            <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Ranges</h4>
            
            {[
              { id: 'prospects', label: 'Prospects', max: MAX_RANGES.prospects, val: rangeFilters.prospects },
              { id: 'outreach', label: 'Outreach', max: MAX_RANGES.outreach, val: rangeFilters.outreach },
              { id: 'meetings', label: 'Meetings', max: MAX_RANGES.meetings, val: rangeFilters.meetings }
            ].map(range => {
              const percentage = (range.val / range.max) * 100;
              return (
              <div key={range.id} className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{range.label}</span>
                  <span className="text-sky-500 font-semibold">0 - {range.val.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={range.max}
                  value={range.val}
                  onChange={(e) => handleRangeChange(range.id, e.target.value)}
                  className="w-full h-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:border-0"
                  style={{
                    backgroundImage: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, transparent ${percentage}%, transparent 100%)`
                  }}
                />
              </div>
            )})}
          </div>
        </Card>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 text-sm text-slate-500 dark:text-slate-400">
            <span>{processedCampaigns.length} of {campaigns.length} campaigns</span>
            <div className="flex items-center gap-2">
              <span>Sort by</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-slate-200 dark:border-slate-800 rounded-md p-1.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 shadow-sm outline-none text-sm cursor-pointer"
              >
                <option>Name (A-Z)</option>
                <option>Most prospects</option>
                <option>Most outreach</option>
                <option>Most meetings</option>
              </select>
            </div>
          </div>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <div className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <div className="w-[35%]">Campaign</div>
              <div className="w-[15%]">Status</div>
              <div className="w-[15%] text-center">Prospects</div>
              <div className="w-[15%] text-center">Outreach</div>
              <div className="w-[20%] text-left pl-2">Meetings</div>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {processedCampaigns.length === 0 ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                  No campaigns match your current filters.
                </div>
              ) : (
                processedCampaigns.map(camp => (
                  <div 
                    key={camp.id} 
                    onClick={() => onSelect(camp)}
                    className="flex items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors bg-white dark:bg-slate-900"
                  >
                    <div className="w-[35%] pr-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-[15px]">{camp.name}</div>
                      <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">{camp.subtitle}</div>
                    </div>
                    <div className="w-[15%]">
                      <span className={`text-[12px] px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 font-medium ${getStatusColor(camp.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(camp.status)}`}></span>
                        {camp.status}
                      </span>
                    </div>
                    <div className="w-[15%] text-center font-semibold text-slate-900 dark:text-white text-[15px]">{camp.prospects}</div>
                    <div className="w-[15%] text-center font-semibold text-slate-900 dark:text-white text-[15px]">{camp.outreach}</div>
                    <div className="w-[20%] flex justify-between items-center pl-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-[15px]">{camp.meetings}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`rounded-full px-5 h-8 text-sm font-medium transition-colors ${
                          camp.status === 'Completed' 
                            ? 'border-transparent text-slate-300 dark:text-slate-600 bg-transparent hover:bg-transparent pointer-events-none shadow-none' 
                            : camp.status === 'Draft'
                            ? 'border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 bg-white dark:bg-transparent'
                            : camp.status === 'Live'
                            ? 'border-amber-500 text-amber-600 dark:border-amber-500/50 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 bg-white dark:bg-transparent'
                            : camp.status === 'Paused'
                            ? 'border-emerald-500 text-emerald-600 dark:border-emerald-500/50 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 bg-white dark:bg-transparent'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatus = camp.status === 'Draft' ? 'Live' : camp.status === 'Live' ? 'Paused' : 'Live';
                          onToggleStatus(camp.id, nextStatus);
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