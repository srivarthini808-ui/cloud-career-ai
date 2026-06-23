import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — CloudHire AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard" });
  }, [loading, session, navigate]);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Welcome back!"); navigate({ to: "/dashboard" }); }
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Account created! Signing you in…"); navigate({ to: "/dashboard" }); }
  }

  async function onForgot() {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth",
    });
    if (error) toast.error(error.message);
    else toast.success("Check your inbox for reset instructions.");
  }

  return (
    <div className="min-h-screen hero-grid-bg grid place-items-center px-4">
      <Link to="/" className="absolute top-6 left-6 text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 glow"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="size-9 rounded-lg gradient-bg grid place-items-center text-white font-bold">C</div>
          <span className="font-semibold tracking-tight">CloudHire <span className="gradient-text">AI</span></span>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={onSignIn} className="space-y-4 mt-4">
              <Field label="Email" id="si-email" type="email" value={email} onChange={setEmail} />
              <Field label="Password" id="si-pwd" type="password" value={password} onChange={setPassword} />
              <Button type="submit" disabled={busy} className="w-full gradient-bg text-white hover:opacity-90">
                {busy && <Loader2 className="size-4 mr-2 animate-spin" />} Sign in
              </Button>
              <button type="button" onClick={onForgot} className="text-xs text-muted-foreground hover:text-foreground underline">
                Forgot password?
              </button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={onSignUp} className="space-y-4 mt-4">
              <Field label="Full name" id="su-name" value={name} onChange={setName} />
              <Field label="Email" id="su-email" type="email" value={email} onChange={setEmail} />
              <Field label="Password" id="su-pwd" type="password" value={password} onChange={setPassword} />
              <Button type="submit" disabled={busy} className="w-full gradient-bg text-white hover:opacity-90">
                {busy && <Loader2 className="size-4 mr-2 animate-spin" />} Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function Field({
  id, label, type = "text", value, onChange,
}: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
