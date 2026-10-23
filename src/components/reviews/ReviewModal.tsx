import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Camera, X, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "./StarRating";
import { REVIEW_PRODUCTS, type ReviewProductId } from "@/lib/reviewProducts";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
  productId?: ReviewProductId;
}

const ReviewModal = ({ open, onOpenChange, initialRating = 5, productId = "nexus" }: ReviewModalProps) => {
  const [rating, setRating] = useState(initialRating);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileGalleryRef = useRef<HTMLInputElement>(null);
  const fileCameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setRating(initialRating || 5);
  }, [open, initialRating]);


  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const reset = () => {
    setName("");
    setEmail("");
    setTitle("");
    setComment("");
    setWebsite("");
    setRating(5);
    clearPhoto();
  };

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileGalleryRef.current) fileGalleryRef.current.value = "";
    if (fileCameraRef.current) fileCameraRef.current.value = "";
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      toast({ title: "Ungültiges Format", description: "Nur JPG, PNG oder WEBP.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast({ title: "Foto zu gross", description: "Maximale Grösse: 5 MB.", variant: "destructive" });
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
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
    try {
      const form = new FormData();
      form.append("product_id", productId);
      form.append("customer_name", parsed.data.customer_name);
      form.append("customer_email", parsed.data.customer_email);
      form.append("rating", String(parsed.data.rating));
      form.append("title", parsed.data.title);
      form.append("comment", parsed.data.comment);
      if (parsed.data.website) form.append("website", parsed.data.website);
      if (photoFile) form.append("photos", photoFile);
      const { data, error } = await supabase.functions.invoke("submit-review", { body: form });
      if (error) throw error;
      if (!data?.ok) throw new Error("Die Bewertung konnte nicht gespeichert werden. Bitte versuche es erneut.");
      toast({
        title: "Danke! Deine Bewertung wird kurz geprüft und dann veröffentlicht.",
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Fehler", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bewertung schreiben</DialogTitle>
          <DialogDescription>
            Teile deine Erfahrung mit {REVIEW_PRODUCTS[productId]} – ehrlich und in deinen Worten.
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
              <p className="mt-1 text-[11px] text-muted-foreground">Wird öffentlich angezeigt, z.B. nur Vorname</p>
            </div>
            <div>
              <Label htmlFor="rev-email">E-Mail *</Label>
              <Input
                id="rev-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
              <p className="mt-1 text-[11px] text-stone-500">Wird nicht veröffentlicht, nur zur Kaufbestätigung</p>
            </div>
          </div>


          <div>
            <Label htmlFor="rev-title">Titel *</Label>
            <Input
              id="rev-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder={productId === "nexus" ? "z.B. Endlich ein Schweizer Charger der hält was er verspricht" : "Dein Fazit"}
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
              placeholder={productId === "nexus" ? "Was hat dich überzeugt? Wie nutzt du den NEXUS im Alltag?" : "Wie nutzt du deine MATRIX im Alltag?"}
              required
            />
            <p className="mt-1 text-[11px] text-stone-500">{comment.length} / 1500</p>
          </div>

          {/* PHOTO UPLOAD (optional) */}
          <div>
            <Label className="mb-2 block">Foto hinzufügen (optional)</Label>
            {photoPreview ? (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Vorschau"
                  className="h-32 w-32 rounded-lg border border-stone-200 object-cover"
                />
                <button
                  type="button"
                  onClick={clearPhoto}
                  aria-label="Foto entfernen"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white shadow-md transition hover:bg-stone-700"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileGalleryRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 transition hover:border-stone-900"
                >
                  <ImageIcon size={16} />
                  Aus Galerie wählen
                </button>
                <button
                  type="button"
                  onClick={() => fileCameraRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 transition hover:border-stone-900 sm:hidden"
                >
                  <Camera size={16} />
                  Foto aufnehmen
                </button>
              </div>
            )}
            <input
              ref={fileGalleryRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <input
              ref={fileCameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <p className="mt-1 text-[11px] text-stone-500">JPG, PNG oder WEBP · max. 5 MB · 1 Foto</p>
          </div>

          {/* Honeypot */}
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
