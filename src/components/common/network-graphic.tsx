import { cn } from "@/lib/cn";

/**
 * Motivo gráfico da marca: uma rede de pontos ligados dentro de um círculo, inspirada no
 * símbolo da Conexão Positiva (não é o logótipo). Gerado de forma determinística no servidor.
 */
interface Node {
  x: number;
  y: number;
  r: number;
}

const SIZE = 600;
const CENTER = SIZE / 2;
const RADIUS = 270;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function buildNetwork(seed = 7, count = 30) {
  const random = seededRandom(seed);
  const nodes: Node[] = [{ x: CENTER + 10, y: CENTER + 20, r: 18 }];
  let attempts = 0;
  while (nodes.length < count && attempts < 4000) {
    attempts += 1;
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * (RADIUS - 18);
    const x = CENTER + Math.cos(angle) * distance;
    const y = CENTER + Math.sin(angle) * distance;
    if (nodes.every((node) => Math.hypot(node.x - x, node.y - y) > 64)) {
      nodes.push({ x, y, r: 5 + random() * 9 });
    }
  }

  const edges = new Set<string>();
  nodes.forEach((node, index) => {
    nodes
      .map((other, otherIndex) => ({
        otherIndex,
        d: Math.hypot(other.x - node.x, other.y - node.y),
      }))
      .filter((entry) => entry.otherIndex !== index)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ otherIndex }) => {
        edges.add([index, otherIndex].sort((a, b) => a - b).join("-"));
      });
  });

  return {
    nodes,
    edges: [...edges].map((key) => key.split("-").map(Number) as [number, number]),
  };
}

const network = buildNetwork();

export function NetworkGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
      className={cn("text-secondary", className)}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        className="network-ring"
      />
      <g stroke="currentColor" strokeWidth={4} strokeLinecap="round" className="network-lines">
        {network.edges.map(([a, b], index) => {
          const from = network.nodes[a];
          const to = network.nodes[b];
          if (!from || !to) return null;
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x.toFixed(1)}
              y1={from.y.toFixed(1)}
              x2={to.x.toFixed(1)}
              y2={to.y.toFixed(1)}
              pathLength={1}
              style={{ animationDelay: `${120 + (index % 12) * 45}ms` }}
            />
          );
        })}
      </g>
      <g fill="currentColor" className="network-nodes">
        {network.nodes.map((node, index) => (
          <circle
            key={index}
            cx={node.x.toFixed(1)}
            cy={node.y.toFixed(1)}
            r={node.r.toFixed(1)}
            style={{ animationDelay: `${300 + (index % 10) * 50}ms` }}
          />
        ))}
      </g>
    </svg>
  );
}
