import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import { interviewQuestions } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/interview")({
  component: InterviewPage,
});

type Diff = "easy" | "medium" | "hard";

function InterviewPage() {
  const [role, setRole] = useState("Frontend Developer");
  const [diff, setDiff] = useState<Diff>("medium");
  const fn = useServerFn(interviewQuestions);
  const mut = useMutation({
    mutationFn: () => fn({ data: { role, difficulty: diff } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview Prep</h1>
        <p className="text-muted-foreground mt-1">AI-generated questions across technical, HR, behavioral and project rounds.</p>
      </div>

      <div className="glass rounded-2xl p-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-1.5 block">Role</label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(["easy", "medium", "hard"] as Diff[]).map((d) => (
            <Badge
              key={d}
              variant={diff === d ? "default" : "secondary"}
              className="cursor-pointer capitalize"
              onClick={() => setDiff(d)}
            >{d}</Badge>
          ))}
        </div>
        <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="gradient-bg text-white hover:opacity-90">
          {mut.isPending ? <><Loader2 className="size-4 mr-2 animate-spin" /> Generating…</> : <><MessagesSquare className="size-4 mr-2" /> Generate</>}
        </Button>
      </div>

      {mut.data && (
        <Tabs defaultValue="technical">
          <TabsList className="grid grid-cols-4 max-w-xl">
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
            <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
            <TabsTrigger value="project_based">Project</TabsTrigger>
          </TabsList>
          {(["technical", "hr", "behavioral", "project_based"] as const).map((k) => (
            <TabsContent key={k} value={k}>
              <div className="glass rounded-2xl p-5">
                <Accordion type="single" collapsible>
                  {mut.data![k].map((q, i) => (
                    <AccordionItem key={i} value={`i${i}`}>
                      <AccordionTrigger className="text-left">{q.q}</AccordionTrigger>
                      <AccordionContent className="text-sm">{q.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
