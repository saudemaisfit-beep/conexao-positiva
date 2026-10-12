/**
 * Animações do núcleo da órbita C.E.N.T.R.O. (uma por pilar), em SVG e CSS puro.
 * O estado base de cada desenho já faz sentido parado: com movimento reduzido as animações
 * não arrancam (estilos em globals.css, `.centro-art`).
 */
export function CentroOrbitArt({
  slug,
  breatheIn,
  breatheOut,
}: {
  slug: string;
  breatheIn: string;
  breatheOut: string;
}) {
  const common = {
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: `centro-art centro-art--${slug}`,
  };

  switch (slug) {
    case "consciencia":
      // Ondas de luz que se expandem a partir de um ponto: a consciência a alargar-se.
      return (
        <svg {...common}>
          <circle className="art-ripple" cx="60" cy="60" r="44" />
          <circle className="art-ripple" cx="60" cy="60" r="44" />
          <circle className="art-ripple" cx="60" cy="60" r="44" />
          <circle cx="60" cy="60" r="7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "equilibrio":
      // Balança que oscila até encontrar o ponto de equilíbrio.
      return (
        <svg {...common}>
          <path d="M60 50 L48 92 H72 Z" />
          <g className="art-beam">
            <line x1="22" y1="50" x2="98" y2="50" />
            <circle cx="24" cy="40" r="9" fill="currentColor" stroke="none" />
            <circle cx="96" cy="40" r="9" fill="currentColor" stroke="none" />
          </g>
          <circle cx="60" cy="50" r="4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "nutricao":
      // Rebento que cresce: escolhas e hábitos que alimentam o bem-estar.
      return (
        <svg {...common}>
          <path d="M34 98 H86" />
          <g className="art-sprout">
            <path className="art-draw" pathLength={1} d="M60 98 V52" />
            <path
              className="art-draw art-leaf-l"
              pathLength={1}
              d="M60 70 C44 70 34 60 32 46 C46 46 58 54 60 70 Z"
            />
            <path
              className="art-draw art-leaf-r"
              pathLength={1}
              d="M60 58 C74 58 86 48 88 32 C72 32 62 42 60 58 Z"
            />
          </g>
        </svg>
      );
    case "tempo":
      // Relógio com ponteiros em movimento: gestão consciente do tempo.
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="42" />
          {Array.from({ length: 12 }, (_, index) => (
            <line
              key={index}
              x1="60"
              y1="22"
              x2="60"
              y2={index % 3 === 0 ? 30 : 26}
              transform={`rotate(${index * 30} 60 60)`}
            />
          ))}
          <line className="art-hand-hour" x1="60" y1="60" x2="60" y2="40" strokeWidth={4} />
          <line className="art-hand-minute" x1="60" y1="60" x2="60" y2="28" />
          <circle cx="60" cy="60" r="4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "respiracao":
      // Respiração guiada: o círculo expande ao inspirar e contrai ao expirar (4 s + 4 s).
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="46" strokeDasharray="2 6" opacity="0.6" />
          <circle
            className="art-breath"
            cx="60"
            cy="60"
            r="40"
            fill="currentColor"
            fillOpacity="0.18"
          />
          <text
            className="art-breath-in"
            x="60"
            y="65"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
          >
            {breatheIn}
          </text>
          <text
            className="art-breath-out"
            x="60"
            y="65"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
          >
            {breatheOut}
          </text>
        </svg>
      );
    default:
      // Orientação: a agulha de uma bússola procura o norte e estabiliza.
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="42" />
          <text
            x="60"
            y="14"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            className="art-north"
          >
            N
          </text>
          <g className="art-needle">
            <path d="M60 26 L68 60 L60 56 L52 60 Z" fill="currentColor" stroke="none" />
            <path d="M60 94 L68 60 L60 64 L52 60 Z" opacity="0.4" />
          </g>
          <circle cx="60" cy="60" r="4" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
