import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from 'lucide-react';
import { getStatusColor, getStatusDot } from './CampaignList';

export default function CampaignDetail({ campaign, onBack, onEdit, onToggleStatus }) {
  const conversionRate = campaign.outreach > 0 
    ? ((campaign.meetings / campaign.outreach) * 100).toFixed(1) + '%' 
    : '0.0%';

  return (
    <div className="space-y-6">
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
                {campaign.subtitle || "Target Audience"}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent rounded-md px-2.5 py-1">
                Owner: {campaign.owner || "Aashi"}
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

      <div id="ai-intelligence-container" className="pt-2">
        {/* Funnel graphs and agent feed components render here */}
      </div>
    </div>
  );
}