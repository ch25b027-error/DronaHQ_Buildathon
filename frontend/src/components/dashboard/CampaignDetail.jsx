import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from 'lucide-react';
import { getStatusColor, getStatusDot } from './CampaignList';

export default function CampaignDetail({ campaign, onBack, onEdit }) {
  return (
    <>
      <button onClick={onBack} className="text-slate-500 flex items-center gap-1 hover:text-slate-900 mb-6 text-sm transition-colors">
        <ChevronLeft className="w-4 h-4" /> Campaigns
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium ${getStatusColor(campaign.status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(campaign.status)}`}></span>
              {campaign.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-slate-500 font-normal border-slate-200 bg-white">{campaign.subtitle}</Badge>
            <Badge variant="outline" className="text-slate-500 font-normal border-slate-200 bg-white">Owner: Aashi</Badge>
            <Badge variant="outline" className="text-slate-500 font-normal border-slate-200 bg-white">Email</Badge>
            <Badge variant="outline" className="text-slate-500 font-normal border-slate-200 bg-white">LinkedIn</Badge>
          </div>
        </div>
        
        {/* Dynamic Buttons Based on Wireframes */}
        <div className="flex gap-3">
          {campaign.status === 'Draft' && (
            <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm">Activate</Button>
          )}
          {campaign.status === 'Live' && (
            <Button variant="outline" className="border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50">Pause</Button>
          )}
          {campaign.status === 'Paused' && (
            <Button variant="outline" className="border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50">Resume</Button>
          )}
          <Button variant="outline" onClick={onEdit} className="border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50">Edit</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {['Prospects', 'Outreach sent', 'Meetings booked', 'Conversion'].map((metric, i) => (
          <Card key={metric} className="p-6 shadow-sm border-slate-200 bg-white">
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {i === 0 ? campaign.prospects : i === 1 ? campaign.outreach : i === 2 ? campaign.meetings : '1.4%'}
            </div>
            <div className="text-xs text-slate-500 font-medium">{metric}</div>
          </Card>
        ))}
      </div>

      {/* Rest of the funnel and activity UI goes here (same as previous iteration) */}
      <div className="p-12 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-sm">
        [ Funnel & Agent Activity Visualizations Render Here ]
      </div>
    </>
  );
}