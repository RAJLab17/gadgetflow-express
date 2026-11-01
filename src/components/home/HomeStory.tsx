import logo from "@/assets/logo-transparent.webp";
import "@/styles/home-story.css";

const STROKE = { vectorEffect: "non-scaling-stroke" } as const;

const HomeStory = () => (
  <section className="home-story" aria-labelledby="home-story-eyebrow">
    <div className="home-story-inner">
      <img className="home-story-logo" src={logo} alt="RAJ Logo" width={240} height={200} loading="lazy" decoding="async" />
      <p id="home-story-eyebrow" className="home-story-eyebrow">HINTER RAJ</p>
      <h2 className="home-story-title">
        Eine echte Schweizer Marke für Wireless Charging. Eine Marke, mit der man sich <em>identifizieren kann.</em>
      </h2>
      <p className="home-story-text">
        Deshalb achten wir auf jedes Detail. Unser Team aus drei Personen arbeitet mit einem klaren Ziel: jedem Kunden ein besseres Erlebnis zu bieten und ihn mit unseren Produkten glücklich zu machen.
      </p>
      <span className="home-story-rule" aria-hidden="true" />
      <p className="home-story-sign">Euer RAJ Team</p>
    </div>

    <svg className="home-story-alps home-story-alps--m" viewBox="0 0 390 150" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs><linearGradient id="rajAlp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D2AE73" stopOpacity="0.16" /><stop offset="1" stopColor="#D2AE73" stopOpacity="0" /></linearGradient></defs>
      <path style={STROKE} d="M0,150 L0,118 L28,112 L52,104 L70,108 L92,96 L110,100 L128,88 L146,92 L160,80 L172,84 L186,70 L196,74 L206,58 L214,62 L222,50 L230,56 L240,68 L252,64 L266,78 L282,74 L300,88 L318,84 L338,98 L360,94 L390,106 L390,150 Z" fill="url(#rajAlp)" stroke="#D2AE73" strokeOpacity="0.38" strokeWidth="1" />
      <path style={STROKE} d="M222,50 L222,30 M219,50 L222,41 L225,50" fill="none" stroke="#D2AE73" strokeOpacity="0.5" strokeWidth="1" />
      <path style={STROKE} d="M0,150 L0,132 L40,126 L76,130 L110,120 L148,124 L178,114 L210,118 L246,108 L280,116 L314,110 L350,120 L390,116 L390,150 Z" fill="#000000" fillOpacity="0.55" stroke="#B48A4E" strokeOpacity="0.22" strokeWidth="1" />
    </svg>

    <svg className="home-story-alps home-story-alps--d" viewBox="0 0 1440 230" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs><linearGradient id="rajAlpD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D2AE73" stopOpacity="0.14" /><stop offset="1" stopColor="#D2AE73" stopOpacity="0" /></linearGradient></defs>
      <path style={STROKE} d="M0,230 L0,190 L90,182 L170,170 L240,176 L320,160 L390,166 L460,148 L530,154 L590,136 L640,142 L690,118 L726,124 L760,96 L784,104 L810,80 L836,90 L866,112 L900,106 L950,128 L1010,122 L1070,146 L1140,140 L1220,160 L1300,154 L1380,170 L1440,166 L1440,230 Z" fill="url(#rajAlpD)" stroke="#D2AE73" strokeOpacity="0.36" strokeWidth="1" />
      <path style={STROKE} d="M810,80 L810,50 M805,80 L810,64 L815,80" fill="none" stroke="#D2AE73" strokeOpacity="0.5" strokeWidth="1" />
      <path style={STROKE} d="M0,230 L0,206 L140,198 L270,204 L400,190 L540,196 L660,182 L790,188 L920,174 L1050,186 L1180,178 L1310,190 L1440,184 L1440,230 Z" fill="#000000" fillOpacity="0.55" stroke="#B48A4E" strokeOpacity="0.22" strokeWidth="1" />
    </svg>
  </section>
);

export default HomeStory;
