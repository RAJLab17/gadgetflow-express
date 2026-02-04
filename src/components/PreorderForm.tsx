import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShoppingBag, Check, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  customerName: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  customerEmail: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  streetAddress: z.string().min(5, "Bitte gib deine vollständige Adresse ein"),
  postalCode: z.string().min(4, "Ungültige Postleitzahl"),
  city: z.string().min(2, "Bitte gib deinen Ort ein"),
});

type FormData = z.infer<typeof formSchema>;

interface PreorderFormProps {
  productName: string;
  productVariant?: string;
  originalPrice: number;
  discountPercent?: number;
  onSuccess?: () => void;
}

const PreorderForm = ({
  productName,
  productVariant,
  originalPrice,
  discountPercent = 10,
  onSuccess,
}: PreorderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const { toast } = useToast();

  const finalPrice = originalPrice * (1 - discountPercent / 100);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Generate order number client-side (format: PRE-XXXXXX)
      const generatedOrderNumber = `PRE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { data: insertedData, error } = await supabase
        .from("preorders")
        .insert({
          order_number: generatedOrderNumber,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          phone: data.phone || null,
          street_address: data.streetAddress,
          postal_code: data.postalCode,
          city: data.city,
          product_name: productName,
          product_variant: productVariant || null,
          original_price: originalPrice,
          discount_percent: discountPercent,
          final_price: finalPrice,
          includes_free_cable: true,
        })
        .select("order_number")
        .single();

      if (error) throw error;

      setOrderNumber(insertedData.order_number);
      setIsSuccess(true);
      reset();
      onSuccess?.();

      toast({
        title: "Vorbestellung erfolgreich!",
        description: `Deine Bestellnummer: ${insertedData.order_number}`,
      });
    } catch (error) {
      console.error("Preorder error:", error);
      toast({
        title: "Fehler bei der Bestellung",
        description: "Bitte versuche es erneut oder kontaktiere uns.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 bg-card rounded-2xl border border-primary/30 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Vielen Dank für deine Vorbestellung!
        </h3>
        <p className="text-muted-foreground mb-4">
          Deine Bestellnummer: <span className="text-primary font-bold">{orderNumber}</span>
        </p>
        <div className="p-4 bg-secondary/50 rounded-xl mb-6">
          <p className="text-sm text-foreground">
            <Sparkles className="inline w-4 h-4 text-primary mr-1" />
            Deine persönliche Produktion startet in Kürze! Wir benachrichtigen dich per E-Mail, 
            sobald dein Produkt auf dem Weg zu dir ist.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Gift className="w-4 h-4 text-primary" />
          <span>Dein Gratis-Premium-Kabel ist inklusive!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-card rounded-2xl border border-border">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Jetzt Vorbestellen</h3>
      </div>

      {/* Price Summary */}
      <div className="p-4 bg-secondary/50 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">{productName}</span>
          <span className="text-muted-foreground line-through">CHF {originalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-primary font-medium">-{discountPercent}% Vorbestellerrabatt</span>
          <span className="text-primary">-CHF {(originalPrice - finalPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-primary font-medium flex items-center gap-1">
            <Gift className="w-4 h-4" /> Gratis Premium-Kabel
          </span>
          <span className="text-primary">CHF 0.00</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">Gesamtpreis</span>
            <span className="text-2xl font-bold text-primary">CHF {finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Name *</Label>
            <Input
              id="customerName"
              placeholder="Max Mustermann"
              {...register("customerName")}
              className={errors.customerName ? "border-destructive" : ""}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">E-Mail *</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="max@beispiel.ch"
              {...register("customerEmail")}
              className={errors.customerEmail ? "border-destructive" : ""}
            />
            {errors.customerEmail && (
              <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+41 79 123 45 67"
            {...register("phone")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="streetAddress">Strasse & Hausnummer *</Label>
          <Input
            id="streetAddress"
            placeholder="Musterstrasse 123"
            {...register("streetAddress")}
            className={errors.streetAddress ? "border-destructive" : ""}
          />
          {errors.streetAddress && (
            <p className="text-sm text-destructive">{errors.streetAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">PLZ *</Label>
            <Input
              id="postalCode"
              placeholder="8000"
              {...register("postalCode")}
              className={errors.postalCode ? "border-destructive" : ""}
            />
            {errors.postalCode && (
              <p className="text-sm text-destructive">{errors.postalCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ort *</Label>
            <Input
              id="city"
              placeholder="Zürich"
              {...register("city")}
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="xl"
          variant="glow"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Wird verarbeitet...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Jetzt für CHF {finalPrice.toFixed(2)} vorbestellen
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mb-4">
          Lieferzeit: 2-4 Wochen • Individuelle Produktion • Sichere Bezahlung
        </p>

        {/* Payment Methods */}
        <div className="flex flex-col items-center gap-3 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Sichere Zahlungsmethoden</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Mastercard */}
            <div className="bg-muted/50 border border-border rounded px-2 py-1.5">
              <svg viewBox="0 0 38 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
                <path d="M19 17.5a7 7 0 0 1 0-11 7 7 0 0 0 0 11z" fill="#FF5F00"/>
              </svg>
            </div>
            {/* Visa */}
            <div className="bg-muted/50 border border-border rounded px-2 py-1.5">
              <svg viewBox="0 0 38 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 8L13 16h-2l2.5-8h2zm6.5 5.5c0-1.5-2-1.7-2-2.5 0-.3.3-.5.8-.5.7 0 1.4.3 1.8.5l.4-1.5c-.5-.2-1.2-.5-2.2-.5-2 0-3.3 1-3.3 2.5 0 1.7 2.5 1.8 2.5 2.7 0 .4-.4.6-1 .6-.8 0-1.7-.4-2.1-.6l-.4 1.5c.5.3 1.4.5 2.4.5 2.2 0 3.5-1 3.5-2.6zM28 16l-1.5-8h-1.8c-.5 0-.9.3-1 .7L21 16h2.2l.4-1.2h2.7l.3 1.2H28zm-2.5-3l1.1-3.2.6 3.2h-1.7zM11 8l-3.2 8H5.5L3.8 9.8c-.1-.4-.2-.5-.5-.7C2.8 8.9 2 8.6 1.5 8.4l.1-.4h3.3c.5 0 .9.3 1 .9l.8 4.3L9 8h2z" fill="#1434CB"/>
              </svg>
            </div>
            {/* Apple Pay */}
            <div className="bg-muted/50 border border-border rounded px-2 py-1.5">
              <svg viewBox="0 0 38 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 8.5c-.4.5-1 .9-1.6.8-.1-.6.2-1.3.5-1.7.4-.5 1-.8 1.5-.9.1.7-.1 1.3-.4 1.8zm.4.9c-.9 0-1.7.5-2.1.5-.5 0-1.2-.5-2-.5-1 0-2 .6-2.5 1.5-1.1 1.9-.3 4.7.8 6.2.5.8 1.1 1.6 2 1.6.8 0 1.1-.5 2-.5 1 0 1.2.5 2 .5s1.4-.8 1.9-1.5c.6-.9.8-1.7.8-1.7s-1.6-.6-1.6-2.4c0-1.5 1.2-2.2 1.3-2.3-.7-1.1-1.8-1.2-2.2-1.2l-.4-.2z" fill="currentColor"/>
                <path d="M17.5 7.5c2.2 0 3.8 1.5 3.8 3.8 0 2.3-1.6 3.8-3.9 3.8h-2.5v4h-1.8V7.5h4.4zm-2.6 6.1h2.1c1.5 0 2.4-1 2.4-2.4 0-1.4-.9-2.4-2.4-2.4h-2.1v4.8zm6.6 2.2c0-1.5 1.1-2.4 3.2-2.5l2.3-.1v-.7c0-1-.6-1.5-1.7-1.5-1 0-1.6.5-1.7 1.2h-1.7c.1-1.5 1.4-2.6 3.5-2.6s3.3 1.1 3.3 2.9v6.1h-1.7v-1.5c-.5 1-1.5 1.6-2.7 1.6-1.7 0-2.8-1-2.8-2.5v-.4zm5.5-.7v-.7l-2.1.1c-1 .1-1.6.5-1.6 1.2s.6 1.2 1.5 1.2c1.2 0 2.2-.8 2.2-1.8zm3.1 5.7v-1.4c.1 0 .4.1.6.1.9 0 1.4-.4 1.7-1.4l.2-.5-3.2-8.9h1.9l2.2 7.2 2.2-7.2h1.9l-3.3 9.4c-.8 2.2-1.6 2.9-3.5 2.9-.2 0-.5 0-.7-.2z" fill="currentColor"/>
              </svg>
            </div>
            {/* Google Pay */}
            <div className="bg-muted/50 border border-border rounded px-2 py-1.5">
              <svg viewBox="0 0 38 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 12.2l-.1-.8h-4.2v1.5h2.4c-.1.6-.4 1.1-.8 1.4v1.2h1.3c.8-.7 1.4-1.9 1.4-3.3z" fill="#4285F4"/>
                <path d="M14.2 16c1.1 0 2-.4 2.7-1l-1.3-1c-.4.3-.9.4-1.4.4-1.1 0-2-.7-2.3-1.7h-1.4v1c.7 1.4 2 2.3 3.7 2.3z" fill="#34A853"/>
                <path d="M12.9 12.7c-.1-.2-.1-.5-.1-.7s0-.5.1-.7v-1h-1.4c-.3.5-.4 1.1-.4 1.7s.1 1.2.4 1.7l1.4-1z" fill="#FBBC05"/>
                <path d="M14.2 9.3c.6 0 1.1.2 1.5.6l1.1-1.1c-.7-.7-1.6-1-2.6-1-1.7 0-3 .9-3.7 2.3l1.4 1c.3-1 1.2-1.8 2.3-1.8z" fill="#EA4335"/>
                <path d="M24 10.8h-1.5v4.3H24v-4.3zm3.3 1.4c-.4 0-.8.2-1 .5l-.1-.4h-1.3v4.3h1.5v-2.1c0-.8.4-1.1.8-1.1.2 0 .3 0 .5.1l.2-1.4c-.2 0-.4-.1-.6 0v.1zm2.2-.1c-.8 0-1.3.4-1.6.9v-.8h-1.5v4.3h1.5v-2.3c0-.7.3-1 .8-1 .5 0 .7.3.7.9v2.4H31v-2.6c0-1.2-.6-1.8-1.5-1.8z" fill="currentColor"/>
              </svg>
            </div>
            {/* TWINT */}
            <div className="bg-muted/50 border border-border rounded px-2 py-1.5">
              <span className="font-bold text-xs tracking-tight text-foreground">TWINT</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL-Verschlüsselt
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sichere Zahlung
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PreorderForm;
