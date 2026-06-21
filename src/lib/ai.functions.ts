import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ResumeAnalysisSchema = z.object({
  resumeText: z.string().min(50, "Resume text too short").max(40_000),
  fileName: z.string().optional(),
  storagePath: z.string().optional(),
});

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ResumeAnalysisSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { callGeminiJSON } = await import("./ai-gateway.server");

    const result = await callGeminiJSON<{
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
    }>({
      messages: [
        {
          role: "system",
          content:
            "You are CloudHire AI, an expert ATS and career coach. Analyze resumes precisely and return scores from 0-100. Be honest and specific.",
        },
        {
          role: "user",
          content: `Analyze this resume and return JSON with keys: resume_score (0-100), ats_score (0-100), summary (2 sentences), technical_skills (string[]), soft_skills (string[]), strengths (string[]), weaknesses (string[]), missing_skills (string[]), grammar_suggestions (string[]), formatting_suggestions (string[]), keyword_suggestions (string[]).\n\nResume:\n${data.resumeText}`,
        },
      ],
    });

    // Persist resume + analysis
    const { data: resumeRow, error: rErr } = await context.supabase
      .from("resumes")
      .insert({
        user_id: context.userId,
        file_name: data.fileName ?? "Pasted Resume",
        storage_path: data.storagePath ?? null,
        raw_text: data.resumeText,
      })
      .select("id")
      .single();
    if (rErr) throw new Error(rErr.message);

    await context.supabase.from("analyses").insert({
      user_id: context.userId,
      resume_id: resumeRow.id,
      kind: "resume",
      payload: result,
    });

    return { resumeId: resumeRow.id, ...result };
  });

const JobMatchSchema = z.object({
  resumeText: z.string().min(50).max(40_000),
  role: z.string().min(2).max(80),
});

export const jobMatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => JobMatchSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { callGeminiJSON } = await import("./ai-gateway.server");
    const result = await callGeminiJSON<{
      match_score: number;
      matched_skills: string[];
      missing_skills: string[];
      improvement_plan: string[];
      learning_resources: { title: string; url: string }[];
    }>({
      messages: [
        {
          role: "system",
          content:
            "You are an expert tech recruiter. Compare a resume to a target role and return precise gaps and a learning plan.",
        },
        {
          role: "user",
          content: `Target role: ${data.role}\n\nResume:\n${data.resumeText}\n\nReturn JSON: match_score (0-100), matched_skills (string[]), missing_skills (string[]), improvement_plan (string[] of 5-7 concrete steps), learning_resources (array of {title, url} — real, well-known resources).`,
        },
      ],
    });
    await context.supabase.from("analyses").insert({
      user_id: context.userId,
      kind: "job_match",
      payload: { role: data.role, ...result },
    });
    return result;
  });

const SkillGapSchema = z.object({
  resumeText: z.string().min(50).max(40_000),
  targetRole: z.string().min(2).max(80),
});

export const skillGap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SkillGapSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { callGeminiJSON } = await import("./ai-gateway.server");
    const result = await callGeminiJSON<{
      current_skills: { name: string; level: number }[];
      required_skills: { name: string; level: number }[];
      gap_percent: number;
      learning_roadmap: string[];
    }>({
      messages: [
        {
          role: "system",
          content:
            "You are a career analyst. Score skills 0-100 for both current (from resume) and required (for the target market role).",
        },
        {
          role: "user",
          content: `Target role: ${data.targetRole}\n\nResume:\n${data.resumeText}\n\nReturn JSON: current_skills (array of {name, level 0-100}, 6-8 items), required_skills (array of {name, level 0-100} for the same 6-8 skill names), gap_percent (number), learning_roadmap (string[] 6 items).`,
        },
      ],
    });
    await context.supabase.from("analyses").insert({
      user_id: context.userId,
      kind: "skill_gap",
      payload: { targetRole: data.targetRole, ...result },
    });
    return result;
  });

const RoadmapSchema = z.object({
  resumeText: z.string().min(20).max(40_000),
  goal: z.string().min(2).max(120),
});

export const careerRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => RoadmapSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { callGeminiJSON } = await import("./ai-gateway.server");
    const result = await callGeminiJSON<{
      plan_30: string[];
      plan_60: string[];
      plan_90: string[];
      certifications: string[];
      projects: string[];
      growth_strategy: string;
    }>({
      messages: [
        {
          role: "system",
          content:
            "You are a senior career mentor. Generate a focused, achievable plan.",
        },
        {
          role: "user",
          content: `Goal: ${data.goal}\n\nBackground:\n${data.resumeText}\n\nReturn JSON: plan_30 (string[] 5 items), plan_60 (string[] 5 items), plan_90 (string[] 5 items), certifications (string[]), projects (string[]), growth_strategy (string).`,
        },
      ],
    });
    await context.supabase.from("analyses").insert({
      user_id: context.userId,
      kind: "roadmap",
      payload: { goal: data.goal, ...result },
    });
    return result;
  });

const InterviewSchema = z.object({
  role: z.string().min(2).max(80),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const interviewQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InterviewSchema.parse(input))
  .handler(async ({ data }) => {
    const { callGeminiJSON } = await import("./ai-gateway.server");
    return await callGeminiJSON<{
      technical: { q: string; a: string }[];
      hr: { q: string; a: string }[];
      behavioral: { q: string; a: string }[];
      project_based: { q: string; a: string }[];
    }>({
      messages: [
        {
          role: "system",
          content: "You are an interview coach. Provide concise, high-quality answers.",
        },
        {
          role: "user",
          content: `Role: ${data.role}. Difficulty: ${data.difficulty}.\nReturn JSON with technical, hr, behavioral, project_based — each an array of 5 items shaped {q, a}. Answers should be 2-4 sentences each.`,
        },
      ],
    });
  });

const CoverLetterSchema = z.object({
  resumeText: z.string().min(20).max(40_000),
  jobTitle: z.string().min(2).max(120),
  company: z.string().min(1).max(120),
  jobDescription: z.string().max(8000).optional(),
  tone: z.enum(["professional", "enthusiastic", "concise"]).default("professional"),
});

export const coverLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CoverLetterSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { callGemini } = await import("./ai-gateway.server");
    const text = await callGemini({
      messages: [
        {
          role: "system",
          content:
            "You write polished, role-specific cover letters in plain text (no markdown). Use natural paragraphs, no headings or asterisks.",
        },
        {
          role: "user",
          content: `Write a ${data.tone} cover letter for the role of "${data.jobTitle}" at ${data.company}.\n\nCandidate resume:\n${data.resumeText}\n\nJob description:\n${data.jobDescription ?? "(not provided)"}\n\nReturn just the letter body, starting with "Dear Hiring Manager,".`,
      },
      ],
    });
    await context.supabase.from("analyses").insert({
      user_id: context.userId,
      kind: "cover_letter",
      payload: { jobTitle: data.jobTitle, company: data.company, text },
    });
    return { text };
  });
