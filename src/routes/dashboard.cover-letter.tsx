import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, FileText, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { coverLetter } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/cover-letter")({
  component: CoverLetterPage,
});

function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "concise">("professional");
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const fn = useServerFn(coverLetter);
  const mut = useMutation({
    mutationFn: () =>
      fn({ data: { jobTitle, company, jobDescription: jd, resumeText: resume, tone } }),
    onError: (e: Error) => toast.error(e.message),
  });

  async function exportPdf() {
    if (!mut.data) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 56;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFont("Times", "Normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(mut.data.text, width);
    doc.text(lines, margin, margin + 14);
    doc.save(`cover-letter-${company || "draft"}.pdf`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cover Letter Generator</h1>
        <p className="text-muted-foreground mt-1">Tailored letters that sound human, not templated.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm">Job title</label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} /></div>
            <div><label className="text-sm">Company</label><Input value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          </div>
          <div>
            <label className="text-sm">Tone</label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><label className="text-sm">Job description (optional)</label>
            <Textarea rows={4} value={jd} onChange={(e) => setJd(e.target.value)} />
          </div>
          <div><label className="text-sm">Your resume / background</label>
            <Textarea rows={8} value={resume} onChange={(e) => setResume(e.target.value)} />
          </div>
          <Button onClick={() => mut.mutate()}
            disabled={!jobTitle || !company || resume.length < 20 || mut.isPending}
            className="w-full gradient-bg text-white hover:opacity-90">
            {mut.isPending ? <><Loader2 className="size-4 mr-2 animate-spin" /> Writing…</> : <><FileText className="size-4 mr-2" /> Generate letter</>}
          </Button>
        </div>

        <div className="glass rounded-2xl p-5 min-h-[300px]">
          {mut.data ? (
            <>
              <div className="flex justify-end gap-2 mb-3">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(mut.data!.text); toast.success("Copied"); }}>
                  <Copy className="size-3.5 mr-1.5" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={exportPdf}>
                  <Download className="size-3.5 mr-1.5" /> PDF
                </Button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{mut.data.text}</pre>
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-12">Your cover letter will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
