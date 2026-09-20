import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2 } from 'lucide-react';
import { getStatusColor, getStatusDot } from './CampaignList';
import api from '../utils/axios';
import ProspectTable from './ProspectTable';

export default function CampaignDetail({ campaign, onBack, onEdit, onToggleStatus }) {
  const [aiData, setAiData] = useState({
    funnelData: [],
    channelData: [],
    agentActivities: [],
    versions: []
  });
  const [isLoadingAI, setIsLoadingAI] = useState(true);

  const conversionRate = campaign.outreach > 0 
    ? ((campaign.meetings / campaign.outreach) * 100).toFixed(1) + '%' 
    : '0.0%';

  // Fetch real AI Intelligence data from the database when the campaign loads
  useEffect(() => {
    let isMounted = true;
    
    const fetchIntelligence = async () => {
      setIsLoadingAI(true);
      try {
        const res = await api.get(`/campaigns/${campaign.id}/intelligence`);
        if (res.data.success && isMounted) {
          setAiData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch AI intelligence data:", err);
      } finally {
        if (isMounted) setIsLoadingAI(false);
      }
    };

    if (campaign?.id) fetchIntelligence();

    return () => { isMounted = false; };
  }, [campaign.id]);

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
        <CardContent className="px-6 py-2 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-3">
                {campaign.icp || "No ICP defined"}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-3">
                Owner: {campaign.owner || "Unassigned"}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-3">
                Email
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-3">
                LinkedIn
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {campaign.status === 'Draft' && (
              <Button onClick={() => onToggleStatus && onToggleStatus(campaign.id, 'Live')} className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-5 h-9 shadow-sm">
                Activate
              </Button>
            )}
            {campaign.status === 'Live' && (
              <Button variant="outline" onClick={() => onToggleStatus && onToggleStatus(campaign.id, 'Paused')} className="border-amber-600/70 dark:border-amber-500/50 text-slate-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-medium px-5 h-9">
                Pause
              </Button>
            )}
            {campaign.status === 'Paused' && (
              <Button variant="outline" onClick={() => onToggleStatus && onToggleStatus(campaign.id, 'Live')} className="border-emerald-600/70 dark:border-emerald-500/50 text-slate-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-medium px-5 h-9">
                Resume
              </Button>
            )}
            <Button variant="outline" onClick={onEdit} title="You can edit channel and agent here" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium px-5 h-9">
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
            <CardContent className="px-6 py-2">
              <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div id="ai-intelligence-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 relative min-h-[400px]">
        
        {isLoadingAI ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/50 rounded-xl z-10">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Crunching intelligence data...</p>
          </div>
        ) : (
          <>
            <div className="lg:col-span-7 space-y-6">
              
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Prospect funnel</h3>
                  <div className="space-y-4">
                    {aiData.funnelData.map((item) => (
                      <div key={item.label} className="flex items-center text-sm">
                        <span className="w-32 text-slate-500 dark:text-slate-400">{item.label}</span>
                        <div className="flex-1 mx-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-1000"
                            style={{ width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%` }}
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

              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Outreach by channel</h3>
                  <div className="space-y-4">
                    {aiData.channelData.map((item) => (
                      <div key={item.label} className="flex items-center text-sm">
                        <span className="w-32 text-slate-500 dark:text-slate-400">{item.label}</span>
                        <div className="flex-1 mx-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-sky-500 transition-all duration-1000"
                            style={{ width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%` }}
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

            <div className="lg:col-span-5 space-y-6">
              
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl h-[400px] overflow-hidden flex flex-col">
                <div className="p-6 pb-4 shrink-0 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Agent activity</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Live</span>
                  </div>
                </div>
                <div className="p-6 pt-0 overflow-y-auto space-y-5 flex-1">
                  {aiData.agentActivities.length === 0 ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400 italic text-center mt-10">No agent activity logged yet.</div>
                  ) : (
                    aiData.agentActivities.map((activity, idx) => (
                      <div key={idx} className="relative pl-6">
                        <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                          <span className="font-semibold">{activity.agent}</span> {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Prompt / harness versions</h3>
                  <div className="space-y-3">
                    {aiData.versions.length === 0 ? (
                      <div className="text-sm text-slate-500 dark:text-slate-400 italic text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">No harness versions deployed.</div>
                    ) : (
                      aiData.versions.map((version) => (
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
                      ))
                    )}
                  </div>
                </div>
              </Card>

            </div>
          </>
        )}
      </div>

    </div>
  );
}