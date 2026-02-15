import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── Metadata interfaces ──────────────────────────────────────────
interface SchoolMeta {
  name: string;
  shortName: string;
  city: string;
  country?: string;
  description?: string;
  logo?: string;
}

interface DepartmentMeta {
  name: string;
  code: string;
  description?: string;
}

interface ClassMeta {
  name: string;
  code: string;
  academicYear: string;
  description?: string;
}

interface CourseFrontmatter {
  code: string;
  title: string;
  description: string;
  hours?: number;
  semester?: number;
  level?: number;
  category?: string;
}

// ── Helpers ──────────────────────────────────────────────────────

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Parse YAML-like frontmatter between --- delimiters.
 * Handles simple key: value pairs including quoted strings.
 */
function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: content };

  const meta: Record<string, string> = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const kv = line.match(/^(\w+)\s*:\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      meta[kv[1]] = val;
    }
  }

  const bodyStart = content.indexOf("---", match.index! + 3);
  const body = bodyStart >= 0 ? content.substring(bodyStart + 3).trimStart() : content;

  return { meta, body };
}

function getSubdirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith(".md"))
    .map((f) => f.name);
}

// ── Main seed ────────────────────────────────────────────────────

async function main() {
  const coursesDir = process.env.COURSES_DIR
    ? path.resolve(process.env.COURSES_DIR)
    : path.resolve(__dirname, "course-materials");

  console.log("🌱 Seeding database...");
  console.log(`📁 Course materials root: ${coursesDir}\n`);

  if (!fs.existsSync(coursesDir)) {
    console.error(`❌ Course materials directory not found: ${coursesDir}`);
    process.exit(1);
  }

  // ── 1. Create default admin (school-independent) ──
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
  console.log(`👤 Admin: ${admin.email}\n`);

  // ── 2. Walk school directories ──
  const schoolDirs = getSubdirectories(coursesDir);
  if (schoolDirs.length === 0) {
    console.warn("⚠️  No school directories found. Nothing to seed.");
    return;
  }

  let totalCourses = 0;

  for (const schoolFolder of schoolDirs) {
    const schoolPath = path.join(coursesDir, schoolFolder);
    const schoolJsonPath = path.join(schoolPath, "school.json");

    if (!fs.existsSync(schoolJsonPath)) {
      console.warn(`⚠️  Skipping ${schoolFolder}: no school.json found`);
      continue;
    }

    const schoolMeta = readJson<SchoolMeta>(schoolJsonPath);

    // Create/update school
    const school = await prisma.school.upsert({
      where: { shortName: schoolMeta.shortName },
      update: {
        name: schoolMeta.name,
        city: schoolMeta.city,
        country: schoolMeta.country || "Cameroun",
        description: schoolMeta.description || null,
      },
      create: {
        name: schoolMeta.name,
        shortName: schoolMeta.shortName,
        city: schoolMeta.city,
        country: schoolMeta.country || "Cameroun",
        description: schoolMeta.description || null,
      },
    });
    console.log(`🏫 School: ${school.shortName} (${school.id})`);

    // ── 3. Walk department directories ──
    const deptDirs = getSubdirectories(schoolPath);

    for (const deptFolder of deptDirs) {
      const deptPath = path.join(schoolPath, deptFolder);
      const deptJsonPath = path.join(deptPath, "department.json");

      if (!fs.existsSync(deptJsonPath)) {
        continue; // skip non-department folders
      }

      const deptMeta = readJson<DepartmentMeta>(deptJsonPath);

      // Create/update department
      const department = await prisma.department.upsert({
        where: { schoolId_code: { schoolId: school.id, code: deptMeta.code } },
        update: {
          name: deptMeta.name,
          description: deptMeta.description || null,
        },
        create: {
          schoolId: school.id,
          name: deptMeta.name,
          code: deptMeta.code,
          description: deptMeta.description || null,
        },
      });
      console.log(`  📂 Department: ${department.code} — ${department.name}`);

      // ── 4. Walk class directories ──
      const classDirs = getSubdirectories(deptPath);

      for (const classFolder of classDirs) {
        const classPath = path.join(deptPath, classFolder);
        const classJsonPath = path.join(classPath, "class.json");

        if (!fs.existsSync(classJsonPath)) {
          continue; // skip non-class folders
        }

        const classMeta = readJson<ClassMeta>(classJsonPath);

        // Create/update class
        const academicClass = await prisma.academicClass.upsert({
          where: {
            departmentId_code_academicYear: {
              departmentId: department.id,
              code: classMeta.code,
              academicYear: classMeta.academicYear,
            },
          },
          update: {
            name: classMeta.name,
            description: classMeta.description || null,
          },
          create: {
            departmentId: department.id,
            name: classMeta.name,
            code: classMeta.code,
            academicYear: classMeta.academicYear,
            description: classMeta.description || null,
          },
        });
        console.log(`    🎓 Class: ${academicClass.name} (${academicClass.code}) — ${academicClass.academicYear}`);

        // ── 5. Read course .md files with frontmatter ──
        const mdFiles = getMarkdownFiles(classPath);
        let classCoursesCount = 0;

        for (const mdFile of mdFiles) {
          const filePath = path.join(classPath, mdFile);
          const raw = fs.readFileSync(filePath, "utf-8");
          const { meta, body } = parseFrontmatter(raw);

          if (!meta.code || !meta.title) {
            console.warn(`      ⚠️  Skipping ${mdFile}: missing 'code' or 'title' in frontmatter`);
            continue;
          }

          const courseDef: CourseFrontmatter = {
            code: meta.code,
            title: meta.title,
            description: meta.description || meta.title,
            hours: meta.hours ? parseInt(meta.hours, 10) : 36,
            semester: meta.semester ? parseInt(meta.semester, 10) : 1,
            level: meta.level ? parseInt(meta.level, 10) : 1,
            category: meta.category || "general",
          };

          const content = body || `# ${courseDef.title}\n\n${courseDef.description}`;

          await prisma.course.upsert({
            where: { code: courseDef.code },
            update: {
              title: courseDef.title,
              description: courseDef.description,
              hours: courseDef.hours!,
              semester: courseDef.semester!,
              level: courseDef.level!,
              content: content,
              category: courseDef.category!,
              classId: academicClass.id,
            },
            create: {
              code: courseDef.code,
              title: courseDef.title,
              description: courseDef.description,
              hours: courseDef.hours!,
              semester: courseDef.semester!,
              level: courseDef.level!,
              content: content,
              category: courseDef.category!,
              classId: academicClass.id,
            },
          });

          console.log(`      ✅ ${courseDef.code} — ${courseDef.title} (${mdFile})`);
          classCoursesCount++;
        }

        totalCourses += classCoursesCount;
        console.log(`    📚 ${classCoursesCount} course(s) in ${academicClass.name}\n`);
      }
    }
  }

  // ── 6. Create demo student (linked to first school/dept/class found) ──
  const firstSchool = await prisma.school.findFirst({ include: { departments: { include: { classes: true } } } });
  if (firstSchool) {
    const firstDept = firstSchool.departments[0];
    const firstClass = firstDept?.classes[0];

    const hashedPassword = await bcrypt.hash("student123", 10);
    const student = await prisma.user.upsert({
      where: { email: "etudiant@uit.cm" },
      update: {
        schoolId: firstSchool.id,
        departmentId: firstDept?.id || null,
        classId: firstClass?.id || null,
      },
      create: {
        name: "Étudiant Demo",
        email: "etudiant@uit.cm",
        password: hashedPassword,
        role: "student",
        language: "fr",
        schoolId: firstSchool.id,
        departmentId: firstDept?.id || null,
        classId: firstClass?.id || null,
      },
    });
    console.log(`👤 Demo student: ${student.email}`);

    // Auto-enroll demo student in all courses of their class
    if (firstClass) {
      const courses = await prisma.course.findMany({ where: { classId: firstClass.id } });
      for (const course of courses) {
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: student.id, courseId: course.id } },
          update: {},
          create: { userId: student.id, courseId: course.id },
        });
      }
      console.log(`📝 Enrolled in ${courses.length} course(s)`);
    }
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log(`📊 Total: ${totalCourses} course(s) across ${schoolDirs.length} school(s)`);
  console.log("\n📋 Demo Accounts:");
  console.log("   Student: etudiant@uit.cm / student123");
  console.log("   Admin:   admin@lionai.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
