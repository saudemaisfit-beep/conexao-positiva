import { Eye, Hourglass, Navigation, Scale, Sprout, Wind, type LucideIcon } from "lucide-react";

export interface CentroPillar {
  letter: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

/** Os seis pilares do Método C.E.N.T.R.O. (texto fornecido pela Conexão Positiva). */
export const centroPillars: CentroPillar[] = [
  {
    letter: "C",
    name: "Consciência",
    slug: "consciencia",
    description:
      "Desenvolvimento da autoconsciência, compreensão de comportamentos, emoções, necessidades e objetivos.",
    icon: Eye,
  },
  {
    letter: "E",
    name: "Equilíbrio",
    slug: "equilibrio",
    description: "Construção de maior equilíbrio entre vida profissional, pessoal e emocional.",
    icon: Scale,
  },
  {
    letter: "N",
    name: "Nutrição",
    slug: "nutricao",
    description:
      "Promoção de escolhas, hábitos e comportamentos que contribuam para o bem-estar físico, mental e emocional.",
    icon: Sprout,
  },
  {
    letter: "T",
    name: "Tempo",
    slug: "tempo",
    description: "Gestão consciente do tempo, prioridades, produtividade e organização.",
    icon: Hourglass,
  },
  {
    letter: "R",
    name: "Respiração",
    slug: "respiracao",
    description:
      "Utilização da respiração como ferramenta para presença, foco, equilíbrio e gestão emocional.",
    icon: Wind,
  },
  {
    letter: "O",
    name: "Orientação",
    slug: "orientacao",
    description: "Transformação da consciência em direção, objetivos, decisões e ações.",
    icon: Navigation,
  },
];
