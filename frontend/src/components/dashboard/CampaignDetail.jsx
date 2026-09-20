import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from 'lucide-react';
import { getStatusColor, getStatusDot } from './CampaignList';

export default function CampaignDetail({ campaign, onBack, onEdit, onToggleStatus }) {
  // Calculate dynamic conversion rate or default to 0.0%
  const conversionRate = campaign.outreach > 0 
    ? ((campaign.meetings / campaign.outreach) * 100).toFixed(1) + '%' 
    : '0.0%';

  return (
    <div className="space-y-6">
      {/* Back to Campaigns Link */}
      <button 
        onClick={onBack} 
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Campaigns</span>
      </button>

      {/* Top Header Card */}
      <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left: Title, Status & Metadata Pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {campaign.name}
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium ${getStatusColor(campaign.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(campaign.status)}`}></span>
                {campaign.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal text-slate-600 border-slate-200 bg-white rounded-md px-2.5 py-1">
                {campaign.subtitle || "Target Audience"}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 border-slate-200 bg-white rounded-md px-2.5 py-1">
                Owner: {campaign.owner || "Aashi"}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 border-slate-200 bg-white rounded-md px-2.5 py-1">
                Email
              </Badge>
              <Badge variant="outline" className="text-xs font-normal text-slate-600 border-slate-200 bg-white rounded-md px-2.5 py-1">
                LinkedIn
              </Badge>
            </div>
          </div>

          {/* Right: Actions */}
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
                className="border-amber-600/70 text-slate-800 hover:bg-amber-50 hover:text-amber-800 font-medium px-5 h-9"
              >
                Pause
              </Button>
            )}

            {campaign.status === 'Paused' && (
              <Button 
                variant="outline"
                onClick={() => onToggleStatus && onToggleStatus(campaign.id, 'Live')}
                className="border-emerald-600/70 text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 font-medium px-5 h-9"
              >
                Resume
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={onEdit} 
              className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-5 h-9"
            >
              Edit
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              {campaign.prospects?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Prospects</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              {campaign.outreach?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Outreach sent</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              {campaign.meetings?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Meetings booked</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              {conversionRate}
            </div>
            <div className="text-xs text-slate-500 font-medium">Conversion</div>
          </CardContent>
        </Card>
      </div>

      {/* Reserved Slot for AI Data (Funnel, Agent Feed & Channels) */}
      <div id="ai-intelligence-container" className="pt-2">
        {/* We will attach the funnel graphs and agent feed components right here */}
      </div>
    </div>
  );
}