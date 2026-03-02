import mastercardLogo from "@/assets/payment/mastercard.png";
import googlePayLogo from "@/assets/payment/google-pay.png";
import applePayLogo from "@/assets/payment/apple-pay.png";

interface PaymentIconsProps {
  size?: "sm" | "md";
  showLabels?: boolean;
}

const PaymentIcons = ({ size = "md", showLabels = true }: PaymentIconsProps) => {
  const iconHeight = size === "sm" ? "h-5" : "h-6";
  const containerPadding = size === "sm" ? "px-2 py-1.5" : "px-3 py-2";

  const paymentMethods = [
    { name: "Mastercard", logo: mastercardLogo },
    { 
      name: "Visa", 
      isText: true,
      textContent: (
        <span className="font-bold text-sm tracking-tight" style={{ color: '#1A1F71' }}>VISA</span>
      )
    },
    { name: "Apple Pay", logo: applePayLogo, invert: true },
    { name: "Google Pay", logo: googlePayLogo },
    { 
      name: "American Express", 
      isText: true,
      textContent: (
        <span className="font-bold text-[10px] leading-tight text-center" style={{ color: '#006FCF' }}>AMEX</span>
      )
    },
    { 
      name: "Klarna", 
      isText: true,
      textContent: (
        <span className="font-extrabold text-xs tracking-tight" style={{ color: '#FFB3C7', WebkitTextStroke: '0.5px #E5A0B3' }}>Klarna.</span>
      )
    },
    { 
      name: "TWINT", 
      isText: true,
      textContent: (
        <span className="font-black text-sm tracking-tight" style={{ color: '#000000' }}>
          TWINT
        </span>
      )
    },
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
            {method.isText ? (
              method.textContent
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
