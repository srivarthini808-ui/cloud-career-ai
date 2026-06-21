import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Map } from "lucide-react";
import { toast } from "sonner";
import { careerRoadmap } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/roadmap")({
  component: RoadmapPage,
});

function RoadmapPage() {
  const [goal, setGoal] = useState("Become a Senior Cloud Engineer");
  const [text, setText] = useState("");
  const fn = useServerFn(careerRoadmap);
  const mut = useMutation({
    mutationFn: () => fn({ data: { resumeText: text, goal } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Roadmap</h1>
        <p className="text-muted-foreground mt-1">Get a 30/60/90-day plan to hit your goal.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Goal</label>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <Textarea rows={12} placeholder="Paste resume / background…" value={text} onChange={(e) => setText(e.target.value)} />
          <Button onClick={() => mut.mutate()} disabled={text.length < 20 || mut.isPending} className="w-full gradient-bg text-white hover:opacity-90">
            {mut.isPending ? <><Loader2 className="size-4 mr-2 animate-spin" /> Building plan…</> : <><Map className="size-4 mr-2" /> Generate roadmap</>}
          </Button>
        </div>

        <div className="space-y-4">
          {mut.data ? (
            <>
              <Phase title="30-Day Plan" items={mut.data.plan_30} />
              <Phase title="60-Day Plan" items={mut.data.plan_60} />
              <Phase title="90-Day Plan" items={mut.data.plan_90} />
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-1.5">{mut.data.certifications.map((c, i) => <Badge key={i}>{c}</Badge>)}</div>
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-2">Projects</h3>
                <ul className="text-sm list-disc pl-5 space-y-1">{mut.data.projects.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-2">Growth strategy</h3>
                <p className="text-sm">{mut.data.growth_strategy}</p>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground text-sm">Your plan will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Phase({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="text-sm list-disc pl-5 space-y-1">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    </div>
  );
}
