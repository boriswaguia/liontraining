import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface CourseDefinition {
  code: string;
  title: string;
  description: string;
  hours: number;
  semester: number;
  level: number;
  category: string;
  filename: string;
}

const COURSES: CourseDefinition[] = [
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
      "Architecture d'un ordinateur, systèmes d'exploitation, réseaux informatiques, structures de données",
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
      "Algorithmique et programmation, variables, structures de contrôle, tableaux, sous-programmes",
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
      "Circuits électriques en régime continu et alternatif, traitement de signal, séries de Fourier",
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
      "Prise de notes, résumé de texte, argumentation, figures de style, communication",
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
      "Notion d'entreprise, types d'entreprises, organisation, gestion, environnement économique",
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

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo student account
  const hashedPassword = await bcrypt.hash("student123", 10);
  const student = await prisma.user.upsert({
    where: { email: "etudiant@uit.cm" },
    update: {},
    create: {
      name: "Étudiant Demo",
      email: "etudiant@uit.cm",
      password: hashedPassword,
      role: "student",
    },
  });
  console.log(`✅ Demo student created: ${student.email}`);

  // Create admin account
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@uit.cm" },
    update: {},
    create: {
      name: "Administrateur",
      email: "admin@uit.cm",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Seed courses from markdown files
  const coursesDir = path.resolve(__dirname, "../uit/gi/2025");

  for (const courseDef of COURSES) {
    const filePath = path.join(coursesDir, courseDef.filename);
    let content = "";

    try {
      content = fs.readFileSync(filePath, "utf-8");
      console.log(`📄 Loaded: ${courseDef.filename}`);
    } catch {
      console.warn(`⚠️  File not found: ${courseDef.filename}, using placeholder content`);
      content = `# ${courseDef.title}\n\n${courseDef.description}`;
    }

    const course = await prisma.course.upsert({
      where: { code: courseDef.code },
      update: {
        title: courseDef.title,
        description: courseDef.description,
        hours: courseDef.hours,
        semester: courseDef.semester,
        level: courseDef.level,
        content: content,
        category: courseDef.category,
      },
      create: {
        code: courseDef.code,
        title: courseDef.title,
        description: courseDef.description,
        hours: courseDef.hours,
        semester: courseDef.semester,
        level: courseDef.level,
        content: content,
        category: courseDef.category,
      },
    });

    // Auto-enroll demo student in all courses
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
      },
    });

    console.log(`✅ Course seeded: ${courseDef.code} - ${courseDef.title}`);
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Demo Accounts:");
  console.log("   Student: etudiant@uit.cm / student123");
  console.log("   Admin:   admin@uit.cm / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
