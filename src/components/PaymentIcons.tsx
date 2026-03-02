import mastercardLogo from "@/assets/payment/mastercard.png";
import visaLogo from "@/assets/payment/visa.png";
import googlePayLogo from "@/assets/payment/google-pay.png";
import applePayLogo from "@/assets/payment/apple-pay.png";
import amexLogo from "@/assets/payment/amex.png";
import klarnaLogo from "@/assets/payment/klarna.png";

interface PaymentIconsProps {
  size?: "sm" | "md";
  showLabels?: boolean;
}

const TwintLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="30" rx="4" fill="#000000" />
    <text x="50" y="20" textAnchor="middle" fill="#ffffff" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" letterSpacing="1">
      TWINT
    </text>
  </svg>
);

const PaymentIcons = ({ size = "md", showLabels = true }: PaymentIconsProps) => {
  const iconHeight = size === "sm" ? "h-5" : "h-6";
  const containerPadding = size === "sm" ? "px-2 py-1.5" : "px-3 py-2";

  const paymentMethods = [
    { name: "Visa", logo: visaLogo },
    { name: "Mastercard", logo: mastercardLogo },
    { name: "American Express", logo: amexLogo },
    { name: "Apple Pay", logo: applePayLogo, invert: true },
    { name: "Google Pay", logo: googlePayLogo },
    { name: "Klarna", logo: klarnaLogo },
    { name: "TWINT", isCustom: true },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {showLabels && (
        <p className={`${size === "sm" ? "text-xs" : "text-sm"} text-muted-foreground font-medium`}>
          Sichere Zahlungsmethoden
        </p>
      )}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className={`bg-white border border-border rounded-lg ${containerPadding} flex items-center justify-center hover:border-primary/50 transition-colors min-w-[60px]`}
          >
            {method.isCustom ? (
              <TwintLogo className={`${iconHeight} w-auto`} />
            ) : (
              <img
                src={method.logo}
                alt={method.name}
                className={`${iconHeight} w-auto object-contain ${method.invert ? 'dark:invert' : ''}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentIcons;
