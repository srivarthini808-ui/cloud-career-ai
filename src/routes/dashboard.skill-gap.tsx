import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { skillGap } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

export const Route = createFileRoute("/dashboard/skill-gap")({
  component: SkillGapPage,
});

function SkillGapPage() {
  const [role, setRole] = useState("Frontend Developer");
  const [text, setText] = useState("");
  const fn = useServerFn(skillGap);
  const mut = useMutation({
    mutationFn: () => fn({ data: { resumeText: text, targetRole: role } }),
    onError: (e: Error) => toast.error(e.message),
  });

  const radarData = mut.data
    ? mut.data.current_skills.map((cs, i) => ({
        skill: cs.name,
        you: cs.level,
        market: mut.data!.required_skills[i]?.level ?? 0,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-1">See how your skills stack up against the market.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Target role</label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <Textarea rows={14} placeholder="Paste your resume text here…" value={text} onChange={(e) => setText(e.target.value)} />
          <Button onClick={() => mut.mutate()} disabled={text.length < 50 || mut.isPending} className="w-full gradient-bg text-white hover:opacity-90">
            {mut.isPending ? <><Loader2 className="size-4 mr-2 animate-spin" /> Analyzing…</> : <><Sparkles className="size-4 mr-2" /> Analyze</>}
          </Button>
        </div>

        <div className="space-y-4">
          {mut.data ? (
            <>
              <div className="glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground">Overall gap</div>
                <div className="text-5xl font-bold gradient-text mt-1">{mut.data.gap_percent}%</div>
                <Progress value={mut.data.gap_percent} className="mt-3" />
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-2">Skills radar</h3>
                <div className="h-72">
                  <ResponsiveContainer>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" fontSize={11} />
                      <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                      <Legend />
                      <Radar name="You" dataKey="you" stroke="oklch(0.7 0.2 268)" fill="oklch(0.7 0.2 268)" fillOpacity={0.4} />
                      <Radar name="Market" dataKey="market" stroke="oklch(0.72 0.18 295)" fill="oklch(0.72 0.18 295)" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-2">Learning roadmap</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">{mut.data.learning_roadmap.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground text-sm">Run an analysis to see your radar.</div>
          )}
        </div>
      </div>
    </div>
  );
}
