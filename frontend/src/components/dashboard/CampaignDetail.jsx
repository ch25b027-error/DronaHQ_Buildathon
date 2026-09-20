import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from 'lucide-react';
import { getStatusColor, getStatusDot } from './CampaignList';

// Mock data for the AI Intelligence UI — you can wire this to your backend later
const funnelData = [
  { label: 'Discovered', value: 1284, max: 1284 },
  { label: 'Researched', value: 947, max: 1284 },
  { label: 'Qualified', value: 612, max: 1284 },
  { label: 'Contacted', value: 426, max: 1284 },
  { label: 'Engaged', value: 134, max: 1284 },
  { label: 'Meeting', value: 18, max: 1284 },
  { label: 'Opportunity', value: 7, max: 1284 },
];

const channelData = [
  { label: 'Email', value: 284, max: 300 },
  { label: 'LinkedIn', value: 142, max: 300 },
  { label: 'Calls', value: 0, max: 300 },
];

const agentActivities = [
  { agent: 'Research Agent', action: 'enriched 12 prospects from LinkedIn + Clearbit', time: '2 min ago' },
  { agent: 'Personalisation Agent', action: 'drafted 8 cold emails — pending review', time: '14 min ago' },
  { agent: 'ICP Fitment Agent', action: 'disqualified 3 prospects (wrong seniority)', time: '31 min ago' },
  { agent: 'Outreach Strategy Agent', action: 'updated send-time model', time: '1 hr ago' },
  { agent: 'Research Agent', action: 'enriched 19 prospects — batch complete', time: '3 hr ago' },
  { agent: 'ICP Fitment Agent', action: 'scored 45 new leads from Apollo pull', time: '5 hr ago' },
];

const versions = [
  { id: 'v3', name: 'tightened qualification bar', status: 'active', time: 'activated 2 days ago' },
  { id: 'v2', name: 'added LinkedIn enrichment fallback', status: 'inactive', time: '6 days ago' },
  { id: 'v1', name: 'initial harness', status: 'inactive', time: '14 days ago' },
];

export default function CampaignDetail({ campaign, onBack, onEdit, onToggleStatus }) {
  const conversionRate = campaign.outreach > 0 
    ? ((campaign.meetings / campaign.outreach) * 100).toFixed(1) + '%' 
    : '0.0%';

  return (
    <div className="space-y-6 pb-12">
      <button 
        onClick={onBack} 
        className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Campaigns</span>
      </button>

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl transition-colors">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {campaign.name}
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium ${getStatusColor(campaign.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(campaign.status)}`}></span>
                {campaign.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-1">
                {campaign.icp || "No ICP defined"}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-1">
                Owner: {campaign.owner || "Unassigned"}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-1">
                Email
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-1">
                LinkedIn
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {campaign.status === 'Draft' && (
              <Button 
                onClick={() => onToggleStatus && onToggleStatus(campaign.id, 'Live')}
                className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-5 h-9 shadow-sm"
              >
                Activate
              </Button>
            )}

            {campaign.status === 'Live' && (
              <Button 
                variant="outline"
                onClick={() => onToggleStatus && onToggleStatus(campaign.id, 'Paused')}
                className="border-amber-600/70 dark:border-amber-500/50 text-slate-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-800 dark:bg-transparent font-medium px-5 h-9"
              >
                Pause
              </Button>
            )}

            {campaign.status === 'Paused' && (
              <Button 
                variant="outline"
                onClick={() => onToggleStatus && onToggleStatus(campaign.id, 'Live')}
                className="border-emerald-600/70 dark:border-emerald-500/50 text-slate-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-800 dark:bg-transparent font-medium px-5 h-9"
              >
                Resume
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={onEdit} 
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-transparent font-medium px-5 h-9"
            >
              Edit
            </Button>
          </div>

        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Prospects', value: campaign.prospects?.toLocaleString() || 0 },
          { label: 'Outreach sent', value: campaign.outreach?.toLocaleString() || 0 },
          { label: 'Meetings booked', value: campaign.meetings?.toLocaleString() || 0 },
          { label: 'Conversion', value: conversionRate }
        ].map((metric) => (
          <Card key={metric.label} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl transition-colors">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Intelligence UI Section */}
      <div id="ai-intelligence-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left Column: Funnels and Channels */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Prospect Funnel */}
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Prospect funnel</h3>
              <div className="space-y-4">
                {funnelData.map((item) => (
                  <div key={item.label} className="flex items-center text-sm">
                    <span className="w-32 text-slate-500 dark:text-slate-400">{item.label}</span>
                    <div className="flex-1 mx-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right font-semibold text-slate-900 dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Outreach by Channel */}
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Outreach by channel</h3>
              <div className="space-y-4">
                {channelData.map((item) => (
                  <div key={item.label} className="flex items-center text-sm">
                    <span className="w-32 text-slate-500 dark:text-slate-400">{item.label}</span>
                    <div className="flex-1 mx-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-sky-500"
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right font-semibold text-slate-900 dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column: Activity and Versions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Agent Activity */}
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl h-[400px] overflow-hidden flex flex-col">
            <div className="p-6 pb-4 shrink-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Agent activity</h3>
            </div>
            <div className="p-6 pt-0 overflow-y-auto space-y-5 flex-1">
              {agentActivities.map((activity, idx) => (
                <div key={idx} className="relative pl-6">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                    <span className="font-semibold">{activity.agent}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Prompt Versions */}
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Prompt / harness versions</h3>
              <div className="space-y-3">
                {versions.map((version) => (
                  <div 
                    key={version.id} 
                    className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${
                      version.status === 'active' 
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-sm ${version.status === 'active' ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-white'}`}>
                          {version.id} — {version.name}
                        </span>
                        {version.status === 'active' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-medium border border-sky-200 dark:border-sky-500/30">
                            active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {version.time}
                      </div>
                    </div>
                    {version.status !== 'active' && (
                      <button className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
                        Roll back
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}