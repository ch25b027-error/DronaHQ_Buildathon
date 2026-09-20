import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink } from 'lucide-react';
import api from '../utils/axios';

export default function ProspectTable({ campaignId }) {
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProspects = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/campaigns/${campaignId}/prospects`);
        if (res.data.success && isMounted) {
          setProspects(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch prospects:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (campaignId) {
      fetchProspects();
    }
    return () => { isMounted = false; };
  }, [campaignId]);

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Discovered': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'Researched': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Qualified': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Contacted': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
      case 'Engaged': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Meeting': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Opportunity': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl min-h-[300px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl overflow-hidden mt-6">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Prospect CRM / Lead Directory</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live feed of prospects processed by the autonomous AI engine.</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
            <TableRow className="border-slate-100 dark:border-slate-800/60">
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Name</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Job Title & Company</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">AI Fit Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {prospects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500 dark:text-slate-400">
                  No prospects found in this campaign.
                </TableCell>
              </TableRow>
            ) : (
              prospects.map((prospect) => (
                <TableRow key={prospect.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800/60">
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      {prospect.name}
                      {prospect.linkedin_url && (
                        <a href={`https://${prospect.linkedin_url}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-500 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-700 dark:text-slate-300">{prospect.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">{prospect.company}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`border-0 font-medium ${getStageColor(prospect.funnel_stage || 'Discovered')}`}>
                      {prospect.funnel_stage || 'Discovered'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate" title={prospect.ai_fit_reason}>
                      {prospect.ai_fit_reason || 'Qualified based on target criteria'}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

