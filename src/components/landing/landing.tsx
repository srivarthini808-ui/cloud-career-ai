import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, FileSearch, Target, Map, MessagesSquare,
  FileText, GitCompare, Sparkles, Upload, Brain, TrendingUp, Star,
  Check, Moon, Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useTheme } from "@/hooks/use-theme";

const features = [
  { icon: Target, title: "ATS Optimization", desc: "Pass automated screeners with keyword-perfect resumes." },
  { icon: FileSearch, title: "Resume Analysis", desc: "Deep AI critique with scores and concrete fixes." },
  { icon: GitCompare, title: "Job Matching", desc: "Compare your resume to any target role instantly." },
  { icon: Map, title: "Career Roadmap", desc: "30/60/90-day plans tailored to your career goals." },
  { icon: MessagesSquare, title: "Interview Prep", desc: "Practice tech, HR and behavioral rounds with AI." },
  { icon: FileText, title: "Cover Letters", desc: "Generate polished, role-specific cover letters in seconds." },
  { icon: Sparkles, title: "Skill Gap Detection", desc: "Pinpoint missing skills with a radar of strengths." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Watch your scores climb across multiple revisions." },
];

const steps = [
  { icon: Upload, title: "Upload resume", desc: "PDF, DOCX or paste text — your data stays private." },
  { icon: Brain, title: "AI analysis", desc: "Gemini reads your resume against the role you want." },
  { icon: Sparkles, title: "Get insights", desc: "Scores, gaps, keyword fixes, formatting tips." },
  { icon: TrendingUp, title: "Improve career", desc: "Apply guidance and watch your match score rise." },
];

const tiers = [
  {
    name: "Free", price: "$0", desc: "Get started",
    features: ["3 resume analyses / mo", "Job match (3 roles)", "Basic interview prep", "Community support"],
  },
  {
    name: "Pro", price: "$19", highlight: true, desc: "For active job seekers",
    features: ["Unlimited analyses", "All roles & skill gaps", "Mock interviews", "Cover letters & PDF export", "Priority support"],
  },
  {
    name: "Enterprise", price: "Custom", desc: "Teams & universities",
    features: ["SSO + admin panel", "Bulk seats", "Custom integrations", "Dedicated CSM", "SLA"],
  },
];

const testimonials = [
  { name: "Priya M.", role: "SWE @ Stripe", body: "Got 3 interviews in a week after raising my ATS score from 54 → 91." },
  { name: "Daniel K.", role: "Cloud Engineer", body: "The skill-gap radar pointed me at exactly what to learn for AWS roles." },
  { name: "Sara A.", role: "Data Analyst", body: "The cover letters feel handwritten — recruiters actually replied." },
];

const faqs = [
  { q: "Is my resume data private?", a: "Yes. Files are stored encrypted in your private cloud bucket and only you can access them." },
  { q: "Which AI powers CloudHire?", a: "We use Google Gemini for analysis, scoring and content generation." },
  { q: "Do I need a credit card to start?", a: "No. The Free tier requires no card." },
  { q: "Can I export my cover letter?", a: "Yes — copy or export as PDF directly from the dashboard." },
];

export function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 rounded-lg gradient-bg glow grid place-items-center text-white font-bold">C</div>
              <span className="font-semibold tracking-tight">CloudHire <span className="gradient-text">AI</span></span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#how" className="hover:text-foreground">How it works</a>
              <a href="#pricing" className="hover:text-foreground">Pricing</a>
              <a href="#faq" className="hover:text-foreground">FAQ</a>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/auth"><Button size="sm" className="gradient-bg text-white hover:opacity-90">Get started</Button></Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-grid-bg pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              AI-powered career intelligence
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight">
              Analyze. <span className="gradient-text">Improve.</span> Get hired.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              CloudHire AI scores your resume, fixes ATS issues, matches you to roles,
              and builds a 30/60/90-day plan to land your next job.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90 glow">
                  Analyze my resume <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <a href="#how"><Button size="lg" variant="outline">See how it works</Button></a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>★★★★★ 4.9 / 5</span>
              <span>12,000+ resumes analyzed</span>
              <span>Powered by Gemini</span>
            </div>
          </motion.div>

          {/* Mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 glass rounded-3xl p-6 text-left max-w-4xl mx-auto glow"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Resume Score", value: "92", sub: "+18 this week" },
                { label: "ATS Score", value: "88", sub: "Passes 9/10 screens" },
                { label: "Job Match", value: "Frontend Dev", sub: "84% match" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-card/60 border p-4">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-3xl font-bold mt-1 gradient-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader eyebrow="Features" title="Everything you need to get hired" />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="glass rounded-2xl p-5 hover:glow transition-shadow"
              >
                <div className="size-10 rounded-xl gradient-bg grid place-items-center text-white">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader eyebrow="How it works" title="From upload to offer in four steps" />
          <div className="mt-12 grid md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.title} className="glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground">Step {i + 1}</div>
                <s.icon className="size-6 mt-2 text-primary" />
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader eyebrow="Pricing" title="Simple plans for every stage" />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`rounded-3xl p-6 border ${t.highlight ? "gradient-bg text-white border-transparent glow" : "glass"}`}
              >
                <div className={`text-sm ${t.highlight ? "opacity-90" : "text-muted-foreground"}`}>{t.name}</div>
                <div className="mt-2 text-4xl font-bold">
                  {t.price}<span className={`text-base font-normal ${t.highlight ? "opacity-80" : "text-muted-foreground"}`}>/mo</span>
                </div>
                <p className={`mt-1 text-sm ${t.highlight ? "opacity-90" : "text-muted-foreground"}`}>{t.desc}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2 items-start">
                      <Check className="size-4 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className="block mt-6">
                  <Button className={t.highlight ? "w-full bg-white text-primary hover:bg-white/90" : "w-full"}>
                    {t.name === "Enterprise" ? "Contact sales" : "Get started"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader eyebrow="Testimonials" title="Loved by job seekers worldwide" />
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm">{t.body}</p>
                <div className="mt-4 text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeader eyebrow="FAQ" title="Answers, fast" />
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`i${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="gradient-bg rounded-3xl p-10 text-center text-white glow">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to land your next role?</h2>
            <p className="mt-3 opacity-90">Free to start. No credit card required.</p>
            <Link to="/auth" className="inline-block mt-6">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">Get started free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg gradient-bg grid place-items-center text-white text-xs font-bold">C</div>
            <span className="text-sm">© {new Date().getFullYear()} CloudHire AI</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}
