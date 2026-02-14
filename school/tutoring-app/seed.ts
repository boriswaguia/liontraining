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
    filename: "MTIN_121_Analyse_mathematique.md",
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
    filename: "MTIN_122_Algebre_lineaire.md",
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
    filename: "MTIN_131_Informatique.md",
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
    filename: "Cours_Electricite_MTIN_2025_2026.md",
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
    filename: "MTIN_142_Circuit_logique.md",
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
    filename: "MTI_113_Francais.md",
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
    filename: "MTIN_113_EOE.md",
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
    filename: "MTIN_114_Droit.md",
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // ============ 1. Create School ============
  const school = await prisma.school.upsert({
    where: { shortName: "UIT Douala" },
    update: {},
    create: {
      name: "Institut Universitaire de Technologie de Douala",
      shortName: "UIT Douala",
      city: "Douala",
      country: "Cameroun",
      description:
        "L'IUT de Douala est un établissement d'enseignement supérieur technologique au Cameroun.",
    },
  });
  console.log(`🏫 School: ${school.shortName} (${school.id})`);

  // ============ 2. Create Department ============
  const department = await prisma.department.upsert({
    where: { schoolId_code: { schoolId: school.id, code: "GI" } },
    update: {},
    create: {
      schoolId: school.id,
      name: "Génie Informatique",
      code: "GI",
      description:
        "Département de Génie Informatique - Formation en développement logiciel, réseaux et systèmes.",
    },
  });
  console.log(`📂 Department: ${department.code} - ${department.name}`);

  // ============ 3. Create Academic Class ============
  const academicClass = await prisma.academicClass.upsert({
    where: {
      departmentId_code_academicYear: {
        departmentId: department.id,
        code: "L1",
        academicYear: "2025/2026",
      },
    },
    update: {},
    create: {
      departmentId: department.id,
      name: "Licence 1",
      code: "L1",
      academicYear: "2025/2026",
      description: "Première année de la licence en Génie Informatique",
    },
  });
  console.log(
    `🎓 Class: ${academicClass.name} (${academicClass.code}) - ${academicClass.academicYear}`
  );

  // ============ 4. Create Demo Users ============
  const hashedPassword = await bcrypt.hash("student123", 10);
  const student = await prisma.user.upsert({
    where: { email: "etudiant@uit.cm" },
    update: {
      schoolId: school.id,
      departmentId: department.id,
      classId: academicClass.id,
      language: "fr",
    },
    create: {
      name: "Étudiant Demo",
      email: "etudiant@uit.cm",
      password: hashedPassword,
      role: "student",
      language: "fr",
      schoolId: school.id,
      departmentId: department.id,
      classId: academicClass.id,
    },
  });
  console.log(`👤 Student: ${student.email}`);

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@lionai.com" },
    update: {},
    create: {
      name: "Administrateur",
      email: "admin@lionai.com",
      password: adminPassword,
      role: "admin",
      language: "fr",
    },
  });
  console.log(`👤 Admin: ${admin.email}`);

  // ============ 5. Seed Courses (linked to class) ============
  // Use COURSES_DIR env var, or fall back to local path
  const coursesDir = process.env.COURSES_DIR
    ? path.resolve(process.env.COURSES_DIR)
    : path.resolve(__dirname, "../uit/gi/2025");
  console.log(`\n📚 Loading courses from: ${coursesDir}\n`);

  for (const courseDef of COURSES) {
    const filePath = path.join(coursesDir, courseDef.filename);
    let content = "";

    try {
      content = fs.readFileSync(filePath, "utf-8");
      console.log(`  📄 Loaded: ${courseDef.filename}`);
    } catch {
      console.warn(
        `  ⚠️  File not found: ${courseDef.filename}, using placeholder`
      );
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
        classId: academicClass.id,
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
        classId: academicClass.id,
      },
    });

    // Auto-enroll demo student
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

    console.log(`  ✅ ${courseDef.code} - ${courseDef.title}`);
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Demo Accounts:");
  console.log("   Student: etudiant@uit.cm / student123");
  console.log("   Admin:   admin@lionai.com / admin123");
  console.log(`\n🏫 Hierarchy: ${school.shortName} → ${department.code} → ${academicClass.name} (${academicClass.academicYear})`);
  console.log(`📚 ${COURSES.length} courses linked to ${academicClass.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
