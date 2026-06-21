import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { FileSearch, GitCompare, Sparkles, Map, MessagesSquare, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const modules = [
  { title: "Resume Analysis", desc: "Score, ATS, gaps & fixes", icon: FileSearch, url: "/dashboard/resume" },
  { title: "Job Match", desc: "Compare to a target role", icon: GitCompare, url: "/dashboard/job-match" },
  { title: "Skill Gap", desc: "Radar of strengths/gaps", icon: Sparkles, url: "/dashboard/skill-gap" },
  { title: "Career Roadmap", desc: "30/60/90-day plan", icon: Map, url: "/dashboard/roadmap" },
  { title: "Interview Prep", desc: "Practice questions", icon: MessagesSquare, url: "/dashboard/interview" },
  { title: "Cover Letters", desc: "Polished, ready to send", icon: FileText, url: "/dashboard/cover-letter" },
];

function DashboardHome() {
  const { user } = useAuth();
  const { data: analyses } = useQuery({
    queryKey: ["analyses", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("analyses").select("*").order("created_at", { ascending: false }).limit(10);
      return data ?? [];
    },
    enabled: !!user,
  });

  const resumeScores = (analyses ?? [])
    .filter((a) => a.kind === "resume")
    .reverse()
    .map((a, i) => {
      const p = a.payload as { resume_score?: number; ats_score?: number };
      return { name: `#${i + 1}`, resume: p.resume_score ?? 0, ats: p.ats_score ?? 0 };
    });

  const latest = (analyses ?? []).find((a) => a.kind === "resume")?.payload as
    | { resume_score?: number; ats_score?: number } | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back 👋</h1>
        <p className="text-muted-foreground mt-1">Pick up where you left off, or run a new analysis.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Resume score" value={latest?.resume_score ?? "—"} />
        <Stat label="ATS score" value={latest?.ats_score ?? "—"} />
        <Stat label="Total analyses" value={analyses?.length ?? 0} />
        <Stat label="Plan" value="Free" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Resume score trend</h3>
            <span className="text-xs text-muted-foreground">Last 10 analyses</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={resumeScores}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.2 268)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.7 0.2 268)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 295)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis domain={[0, 100]} fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="resume" stroke="oklch(0.7 0.2 268)" fill="url(#g1)" />
                <Area type="monotone" dataKey="ats" stroke="oklch(0.72 0.18 295)" fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Recent activity</h3>
          <div className="space-y-2 text-sm">
            {(analyses ?? []).slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border/50 py-2 last:border-0">
                <span className="capitalize">{a.kind.replace("_", " ")}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!analyses || analyses.length === 0) && (
              <p className="text-sm text-muted-foreground">No activity yet — start with a resume analysis.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Modules</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={m.url} className="glass rounded-2xl p-5 block hover:glow transition-shadow">
                <div className="size-10 rounded-xl gradient-bg grid place-items-center text-white">
                  <m.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold mt-1 gradient-text">{value}</div>
    </div>
  );
}
