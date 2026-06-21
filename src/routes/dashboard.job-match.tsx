import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { jobMatch } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/job-match")({
  component: JobMatchPage,
});

const ROLES = ["Software Engineer", "Frontend Developer", "Backend Developer", "Cloud Engineer", "Data Analyst", "AI Engineer"];

function JobMatchPage() {
  const [role, setRole] = useState(ROLES[0]);
  const [text, setText] = useState("");
  const fn = useServerFn(jobMatch);
  const mut = useMutation({
    mutationFn: () => fn({ data: { resumeText: text, role } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Match</h1>
        <p className="text-muted-foreground mt-1">Compare your resume to a target role.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Target role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Textarea rows={14} placeholder="Paste your resume text here…" value={text} onChange={(e) => setText(e.target.value)} />
          <Button
            onClick={() => mut.mutate()}
            disabled={text.length < 50 || mut.isPending}
            className="w-full gradient-bg text-white hover:opacity-90"
          >
            {mut.isPending ? <><Loader2 className="size-4 mr-2 animate-spin" /> Matching…</> : <><GitCompare className="size-4 mr-2" /> Match</>}
          </Button>
        </div>

        <div className="space-y-4">
          {mut.data ? (
            <>
              <div className="glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground">Match Score</div>
                <div className="text-5xl font-bold gradient-text mt-1">{mut.data.match_score}<span className="text-base text-muted-foreground">/100</span></div>
                <Progress value={mut.data.match_score} className="mt-3" />
              </div>
              <Section title="Matched skills">
                <div className="flex flex-wrap gap-1.5">{mut.data.matched_skills.map((s, i) => <Badge key={i}>{s}</Badge>)}</div>
              </Section>
              <Section title="Missing skills">
                <div className="flex flex-wrap gap-1.5">{mut.data.missing_skills.map((s, i) => <Badge key={i} variant="destructive">{s}</Badge>)}</div>
              </Section>
              <Section title="Improvement plan">
                <ul className="text-sm space-y-1 list-disc pl-5">{mut.data.improvement_plan.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </Section>
              <Section title="Learning resources">
                <ul className="text-sm space-y-1 list-disc pl-5">
                  {mut.data.learning_resources.map((r, i) => (
                    <li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{r.title}</a></li>
                  ))}
                </ul>
              </Section>
            </>
          ) : (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground text-sm">Pick a role and paste your resume to get a match.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="glass rounded-2xl p-5"><h3 className="font-semibold mb-2">{title}</h3>{children}</div>;
}
