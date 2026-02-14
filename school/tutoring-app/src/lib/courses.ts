// Course definitions matching the UIT GI 2025 curricula
export interface CourseDefinition {
  code: string;
  title: string;
  description: string;
  hours: number;
  semester: number;
  level: number;
  category: string;
  filename: string;
}

export const COURSES: CourseDefinition[] = [
  {
    code: "MTIN-121",
    title: "Analyse Mathématique",
    description:
      "Nombres complexes, équations, forme trigonométrique et exponentielle, formule de Moivre, séries et suites numériques",
    hours: 36,
    semester: 1,
    level: 1,
    category: "math",
    filename: "MTIN 121 Analyse mathématique.md",
  },
  {
    code: "MTIN-122",
    title: "Algèbre Linéaire",
    description:
      "Espaces vectoriels, matrices, déterminants, systèmes d'équations linéaires, applications linéaires",
    hours: 36,
    semester: 1,
    level: 1,
    category: "math",
    filename: "MTIN 122 Algèbre_lineaire.md",
  },
  {
    code: "MTIN-131",
    title: "Introduction à l'Informatique",
    description:
      "Architecture d'un ordinateur, systèmes d'exploitation, réseaux informatiques, structures de données, algorithmes de base",
    hours: 36,
    semester: 1,
    level: 1,
    category: "cs",
    filename: "MTIN_131 (2).md",
  },
  {
    code: "MTIN-132",
    title: "Introduction à l'Algorithmique",
    description:
      "Algorithmique et programmation, variables, structures de contrôle, tableaux, sous-programmes, programmation en Fortran",
    hours: 36,
    semester: 1,
    level: 1,
    category: "cs",
    filename: "MTIN_132.md",
  },
  {
    code: "MTIN-141",
    title: "Électricité",
    description:
      "Circuits électriques en régime continu et alternatif, traitement de signal, séries de Fourier, quadripôles",
    hours: 45,
    semester: 1,
    level: 1,
    category: "electronics",
    filename: "Cours_Electricité_MTIN_2025_2026.md",
  },
  {
    code: "MTIN-142",
    title: "Circuits Logiques et Électronique Numérique",
    description:
      "Systèmes de numération, algèbre de Boole, fonctions logiques, logique combinatoire et séquentielle",
    hours: 36,
    semester: 1,
    level: 1,
    category: "electronics",
    filename:
      "MTIN 142_Circuit logique et éléments d'électronique numerique.md",
  },
  {
    code: "MTI-113-FR",
    title: "Expression Écrite et Orale (Français)",
    description:
      "Prise de notes, résumé de texte, argumentation, figures de style, communication, rédaction professionnelle",
    hours: 36,
    semester: 1,
    level: 1,
    category: "language",
    filename: "MTI 113 Francais.md",
  },
  {
    code: "MTIN-113-EOE",
    title: "Économie et Organisation des Entreprises",
    description:
      "Notion d'entreprise, types d'entreprises, organisation, gestion, environnement économique, entrepreneuriat",
    hours: 36,
    semester: 1,
    level: 1,
    category: "business",
    filename: "MTIN 113 EOE.md",
  },
  {
    code: "MTIN-114",
    title: "Droit / Aspects Juridiques des TIC",
    description:
      "Règle de droit, sources du droit, contrats, droit du travail, aspects juridiques des technologies",
    hours: 36,
    semester: 1,
    level: 1,
    category: "law",
    filename: "MTIN 114 Droit.md",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  math: "Mathématiques",
  cs: "Informatique",
  electronics: "Électricité & Électronique",
  language: "Langues & Communication",
  business: "Économie & Gestion",
  law: "Droit",
};

export const CATEGORY_COLORS: Record<string, string> = {
  math: "bg-blue-100 text-blue-800",
  cs: "bg-green-100 text-green-800",
  electronics: "bg-yellow-100 text-yellow-800",
  language: "bg-purple-100 text-purple-800",
  business: "bg-orange-100 text-orange-800",
  law: "bg-red-100 text-red-800",
};

export const CATEGORY_ICONS: Record<string, string> = {
  math: "📐",
  cs: "💻",
  electronics: "⚡",
  language: "📝",
  business: "📊",
  law: "⚖️",
};
