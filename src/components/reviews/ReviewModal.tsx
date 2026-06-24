import { useState, useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "./StarRating";

const schema = z.object({
  customer_name: z.string().trim().min(2, "Bitte deinen Namen eingeben").max(80),
  customer_email: z.string().trim().email("Ungültige Email").max(255),
  rating: z.number().int().min(1, "Bitte Sterne wählen").max(5),
  title: z.string().trim().min(3, "Titel zu kurz").max(120),
  comment: z.string().trim().min(20, "Mindestens 20 Zeichen").max(1500),
  website: z.string().max(0, "Spam erkannt"), // honeypot
});

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialRating?: number;
  productId?: string;
}

const ReviewModal = ({ open, onOpenChange, initialRating = 5, productId = "nexus" }: ReviewModalProps) => {
  const [rating, setRating] = useState(initialRating);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setRating(initialRating || 5);
  }, [open, initialRating]);

  const reset = () => {
    setName("");
    setEmail("");
    setTitle("");
    setComment("");
    setWebsite("");
    setRating(5);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      customer_name: name,
      customer_email: email,
      rating,
      title,
      comment,
      website,
    });
    if (!parsed.success) {
      toast({
        title: "Bitte prüfe deine Eingabe",
        description: parsed.error.issues[0]?.message ?? "Ungültige Daten",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.functions.invoke("submit-review", {
      body: {
        product_id: productId,
        customer_name: parsed.data.customer_name,
        customer_email: parsed.data.customer_email,
        rating: parsed.data.rating,
        title: parsed.data.title,
        comment: parsed.data.comment,
        website: parsed.data.website,
      },
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Danke für deine Bewertung!",
      description: "Sie wird nach kurzer Prüfung veröffentlicht.",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bewertung schreiben</DialogTitle>
          <DialogDescription>
            Teile deine Erfahrung mit dem RAJ NEXUS – ehrlich und in deinen Worten.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label className="mb-2 block">Deine Bewertung</Label>
            <StarRating value={rating} onChange={setRating} size={32} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="rev-name">Name *</Label>
              <Input id="rev-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required />
            </div>
            <div>
              <Label htmlFor="rev-email">Email *</Label>
              <Input
                id="rev-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
              <p className="mt-1 text-[11px] text-stone-500">Wird nie öffentlich angezeigt.</p>
            </div>
          </div>

          <div>
            <Label htmlFor="rev-title">Titel *</Label>
            <Input
              id="rev-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="z.B. Endlich ein Schweizer Charger der hält was er verspricht"
              required
            />
          </div>

          <div>
            <Label htmlFor="rev-comment">Deine Erfahrung *</Label>
            <Textarea
              id="rev-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={1500}
              placeholder="Was hat dich überzeugt? Wie nutzt du den NEXUS im Alltag?"
              required
            />
            <p className="mt-1 text-[11px] text-stone-500">{comment.length} / 1500</p>
          </div>

          {/* Honeypot — versteckt vor Menschen, Bots füllen es aus */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting} className="bg-stone-900 hover:bg-stone-800">
              {submitting ? "Wird gesendet..." : "Bewertung absenden"}
            </Button>
          </div>

          <p className="text-center text-[11px] text-stone-500">
            Deine Bewertung wird manuell geprüft, um Spam zu vermeiden.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
