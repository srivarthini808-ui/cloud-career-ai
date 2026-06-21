// Server-only helper for Lovable AI Gateway (Gemini).
// Never import from client code.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGemini(opts: {
  messages: AIMessage[];
  model?: string;
  jsonSchema?: Record<string, unknown>;
}): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");

  const body: Record<string, unknown> = {
    model: opts.model ?? "google/gemini-2.5-flash",
    messages: opts.messages,
  };
  if (opts.jsonSchema) {
    body.response_format = {
      type: "json_schema",
      json_schema: { name: "Result", strict: true, schema: opts.jsonSchema },
    };
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please retry shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "";
}

export async function callGeminiJSON<T>(opts: {
  messages: AIMessage[];
  model?: string;
}): Promise<T> {
  // Ask for JSON via instruction; parse defensively.
  const messages = [
    ...opts.messages,
    {
      role: "system" as const,
      content:
        "Return ONLY valid minified JSON matching the requested shape. No code fences, no prose.",
    },
  ];
  const raw = await callGemini({ messages, model: opts.model });
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to grab the first {...} block
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]) as T;
    throw new Error("AI returned non-JSON response");
  }
}
