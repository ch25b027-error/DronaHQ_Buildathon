import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Mail, 
  ExternalLink 
} from "lucide-react";

const LinkedInIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const socials = [
    { name: "LinkedIn", href: "https://www.linkedin.com/company/deltecs-infotech/", icon: LinkedInIcon },
    { name: "Instagram", href: "https://www.instagram.com/dronahq", icon: InstagramIcon },
    { name: "X (Twitter)", href: "https://x.com/DronaHQ", icon: TwitterIcon },
    { name: "Discord", href: "https://discord.com/invite/F2pB4UgEeK", icon: MessageSquare },
  ];

  const team = [
    { role: "DB & Tech Lead", name: "Shivashankar", email: "shivashankar@example.com" },
    { role: "AI Lead", name: "Agentic Engineer", email: "ai.lead@example.com" },
    { role: "Product Lead", name: "Product Manager", email: "product.lead@example.com" },
  ];

  return (
    <section className="bottom-0">
      <footer className="w-full border-t border-slate-800 bottom-0 bg-[#0B1519] text-slate-400 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200">Platform Partner</span>
                <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400 font-normal">
                  DronaHQ
                </Badge>
              </div>
              
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                Autonomous SDR Control Plane built for the 51-Hour IIT Madras Inter Guild Buildathon.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {socials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.name}</span>
                      <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="md:text-right space-y-3">
              <span className="text-sm font-medium text-slate-200 block">Engineering Team</span>
              <div className="flex flex-col md:items-end gap-1.5 text-xs text-slate-400">
                {team.map((member) => (
                  <div key={member.role} className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">[{member.role}]</span>
                    <span className="text-slate-300">{member.name}</span>
                    <a 
                      href={`mailto:${member.email}`} 
                      className="text-slate-400 hover:text-[#F26B22] transition-colors inline-flex items-center"
                      title={`Email ${member.name}`}
                    >
                      <Mail className="h-3.5 w-3.5 ml-1 inline text-slate-500 hover:text-[#F26B22]" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <Separator className="my-6 bg-slate-800" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-[11px]">
            <span>© 2026 Autonomous SDR Control Plane. All rights reserved.</span>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>All System Agents Operational</span>
            </div>
          </div>

        </div>
      </footer>
    </section>
  );
}