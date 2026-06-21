import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CloudHire AI — Analyze. Improve. Get Hired." },
      { name: "description", content: "AI-powered resume analyzer, ATS optimizer, job match and interview prep — powered by Gemini." },
    ],
  }),
  component: Landing,
});
