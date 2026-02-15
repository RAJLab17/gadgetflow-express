import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShoppingBag, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PaymentIcons from "@/components/PaymentIcons";

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
  fixedFinalPrice?: number;
  onSuccess?: () => void;
}

const PreorderForm = ({
  productName,
  productVariant,
  originalPrice,
  discountPercent = 10,
  fixedFinalPrice,
  onSuccess,
}: PreorderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const { toast } = useToast();

  const finalPrice = fixedFinalPrice ?? originalPrice * (1 - discountPercent / 100);

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
          includes_free_cable: false,
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
        <div className="p-4 bg-secondary/50 rounded-xl">
          <p className="text-sm text-foreground">
            <Sparkles className="inline w-4 h-4 text-primary mr-1" />
            Deine persönliche Produktion startet in Kürze! Wir benachrichtigen dich per E-Mail, 
            sobald dein Produkt auf dem Weg zu dir ist.
          </p>
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
          <span className="text-muted-foreground line-through">CHF {Number.isInteger(originalPrice) ? `${originalPrice}.–` : originalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-primary font-medium">-{discountPercent}% Vorbestellerrabatt</span>
          <span className="text-primary">-CHF {Number.isInteger(originalPrice - finalPrice) ? `${originalPrice - finalPrice}.–` : (originalPrice - finalPrice).toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">Gesamtpreis</span>
            <span className="text-2xl font-bold text-primary">CHF {Number.isInteger(finalPrice) ? `${finalPrice}.–` : finalPrice.toFixed(2)}</span>
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
        <div className="pt-4 border-t border-border">
          <PaymentIcons size="sm" />
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL-Verschlüsselt
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
