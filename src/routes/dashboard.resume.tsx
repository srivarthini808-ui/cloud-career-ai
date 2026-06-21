import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, Loader2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { analyzeResume } from "@/lib/ai.functions";
import { extractResumeText } from "@/lib/extract-resume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/resume")({
  component: ResumePage,
});

function ResumePage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [extracting, setExtracting] = useState(false);
  const analyze = useServerFn(analyzeResume);

  const mut = useMutation({
    mutationFn: async () => analyze({ data: { resumeText: text, fileName } }),
    onError: (e: Error) => toast.error(e.message),
    onSuccess: () => toast.success("Analysis ready"),
  });

  async function onFile(file: File) {
    setExtracting(true);
    try {
      const t = await extractResumeText(file);
      setText(t);
      setFileName(file.name);
      toast.success(`Extracted ${t.length} characters from ${file.name}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="text-muted-foreground mt-1">Upload your resume or paste the text — we'll score it and suggest fixes.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 space-y-4">
          <label className="block">
            <div className="border-2 border-dashed rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="size-8 mx-auto text-muted-foreground" />
              <p className="mt-2 font-medium">Upload PDF, DOCX or TXT</p>
              <p className="text-xs text-muted-foreground mt-1">Or paste resume text below</p>
              <input
                type="file" accept=".pdf,.docx,.txt" className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
            </div>
          </label>
          {extracting && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Extracting text…</p>}
          {fileName && <p className="text-sm flex items-center gap-2"><FileText className="size-4" /> {fileName}</p>}
          <Textarea
            placeholder="Or paste your resume text here…"
            rows={12} value={text} onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={() => mut.mutate()}
            disabled={text.length < 50 || mut.isPending}
            className="w-full gradient-bg text-white hover:opacity-90"
          >
            {mut.isPending ? <><Loader2 className="size-4 mr-2 animate-spin" /> Analyzing…</> : <><Sparkles className="size-4 mr-2" /> Analyze with AI</>}
          </Button>
        </div>

        <div className="space-y-4">
          {mut.data ? <Results data={mut.data} /> : (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
              <Sparkles className="size-8 mx-auto opacity-50" />
              <p className="mt-2 text-sm">Your results will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AnalysisResult {
  resume_score: number;
  ats_score: number;
  summary: string;
  technical_skills: string[];
  soft_skills: string[];
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  grammar_suggestions: string[];
  formatting_suggestions: string[];
  keyword_suggestions: string[];
}

function Results({ data }: { data: AnalysisResult }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ScoreCard label="Resume Score" value={data.resume_score} />
        <ScoreCard label="ATS Score" value={data.ats_score} />
      </div>
      <Section title="Summary"><p className="text-sm">{data.summary}</p></Section>
      <Section title="Technical Skills"><Pills items={data.technical_skills} /></Section>
      <Section title="Soft Skills"><Pills items={data.soft_skills} /></Section>
      <Section title="Strengths"><List items={data.strengths} /></Section>
      <Section title="Weaknesses"><List items={data.weaknesses} /></Section>
      <Section title="Missing Skills"><Pills items={data.missing_skills} variant="destructive" /></Section>
      <Section title="Grammar"><List items={data.grammar_suggestions} /></Section>
      <Section title="Formatting"><List items={data.formatting_suggestions} /></Section>
      <Section title="Keyword Suggestions"><List items={data.keyword_suggestions} /></Section>
    </motion.div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-4xl font-bold mt-1 gradient-text">{value}<span className="text-base text-muted-foreground">/100</span></div>
      <Progress value={value} className="mt-3" />
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
function Pills({ items, variant }: { items: string[]; variant?: "destructive" }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">None</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s, i) => <Badge key={i} variant={variant ?? "secondary"}>{s}</Badge>)}
    </div>
  );
}
function List({ items }: { items: string[] }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">None</p>;
  return <ul className="text-sm space-y-1 list-disc pl-5">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
}
