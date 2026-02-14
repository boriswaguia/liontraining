import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import * as fs from "fs";
import * as path from "path";

const COURSES = [
  {
    code: "MTIN-121",
    title: "Analyse Mathématique",
    description: "Nombres complexes, équations, forme trigonométrique et exponentielle, formule de Moivre, séries et suites numériques",
    hours: 36, semester: 1, level: 1, category: "math",
    filename: "MTIN 121 Analyse mathématique.md",
  },
  {
    code: "MTIN-122",
    title: "Algèbre Linéaire",
    description: "Espaces vectoriels, matrices, déterminants, systèmes d'équations linéaires, applications linéaires",
    hours: 36, semester: 1, level: 1, category: "math",
    filename: "MTIN 122 Algèbre_lineaire.md",
  },
  {
    code: "MTIN-131",
    title: "Introduction à l'Informatique",
    description: "Architecture d'un ordinateur, systèmes d'exploitation, réseaux informatiques, structures de données",
    hours: 36, semester: 1, level: 1, category: "cs",
    filename: "MTIN_131 (2).md",
  },
  {
    code: "MTIN-132",
    title: "Introduction à l'Algorithmique",
    description: "Algorithmique et programmation, variables, structures de contrôle, tableaux, sous-programmes",
    hours: 36, semester: 1, level: 1, category: "cs",
    filename: "MTIN_132.md",
  },
  {
    code: "MTIN-141",
    title: "Électricité",
    description: "Circuits électriques en régime continu et alternatif, traitement de signal, séries de Fourier",
    hours: 45, semester: 1, level: 1, category: "electronics",
    filename: "Cours_Electricité_MTIN_2025_2026.md",
  },
  {
    code: "MTIN-142",
    title: "Circuits Logiques et Électronique Numérique",
    description: "Systèmes de numération, algèbre de Boole, fonctions logiques, logique combinatoire et séquentielle",
    hours: 36, semester: 1, level: 1, category: "electronics",
    filename: "MTIN 142_Circuit logique et éléments d'électronique numerique.md",
  },
  {
    code: "MTI-113-FR",
    title: "Expression Écrite et Orale (Français)",
    description: "Prise de notes, résumé de texte, argumentation, figures de style, communication",
    hours: 36, semester: 1, level: 1, category: "language",
    filename: "MTI 113 Francais.md",
  },
  {
    code: "MTIN-113-EOE",
    title: "Économie et Organisation des Entreprises",
    description: "Notion d'entreprise, types d'entreprises, organisation, gestion, environnement économique",
    hours: 36, semester: 1, level: 1, category: "business",
    filename: "MTIN 113 EOE.md",
  },
  {
    code: "MTIN-114",
    title: "Droit / Aspects Juridiques des TIC",
    description: "Règle de droit, sources du droit, contrats, droit du travail, aspects juridiques des technologies",
    hours: 36, semester: 1, level: 1, category: "law",
    filename: "MTIN 114 Droit.md",
  },
];

export async function POST() {
  try {
    // Check if already seeded
    const existingCourses = await prisma.course.count();
    if (existingCourses > 0) {
      return NextResponse.json({ message: "Database already seeded", courses: existingCourses });
    }

    // Create demo student
    const hashedPassword = await bcrypt.hash("student123", 10);
    const student = await prisma.user.upsert({
      where: { email: "etudiant@lionai.com" },
      update: {},
      create: {
        name: "Étudiant Demo",
        email: "etudiant@lionai.com",
        password: hashedPassword,
        role: "student",
      },
    });

    // Create admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "admin@lionai.com" },
      update: {},
      create: {
        name: "Administrateur",
        email: "admin@lionai.com",
        password: adminPassword,
        role: "admin",
      },
    });

    // Resolve course files path
    const coursesDir = path.resolve(process.cwd(), "../uit/gi/2025");
    const results: string[] = [];

    for (const courseDef of COURSES) {
      const filePath = path.join(coursesDir, courseDef.filename);
      let content = "";

      try {
        content = fs.readFileSync(filePath, "utf-8");
        results.push(`Loaded: ${courseDef.filename}`);
      } catch {
        content = `# ${courseDef.title}\n\n${courseDef.description}`;
        results.push(`Placeholder: ${courseDef.filename}`);
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

      // Enroll demo student
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
    }

    return NextResponse.json({
      message: "Database seeded successfully!",
      results,
      accounts: {
        student: "etudiant@lionai.com / student123",
        admin: "admin@lionai.com / admin123",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
