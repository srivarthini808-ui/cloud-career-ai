import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? "");
      setHeadline(data?.headline ?? "");
      setLoading(false);
    });
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, full_name: fullName, headline, updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Your account details.</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        {loading ? <Loader2 className="size-5 animate-spin" /> : (
          <>
            <div className="space-y-1.5"><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
            <div className="space-y-1.5"><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Headline</Label><Textarea rows={2} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Frontend dev passionate about UX" /></div>
            <Button onClick={save} disabled={saving} className="gradient-bg text-white hover:opacity-90">
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />} Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
