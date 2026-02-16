import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { logActivity, Actions } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, schoolId, departmentId, classId, language } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont obligatoires" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    if (!schoolId || !departmentId || !classId) {
      return NextResponse.json(
        { error: "Veuillez sélectionner votre école, département et classe" },
        { status: 400 }
      );
    }

    // Validate the class exists and belongs to the right hierarchy
    const academicClass = await prisma.academicClass.findUnique({
      where: { id: classId },
      include: {
        department: {
          include: { school: true },
        },
      },
    });

    if (!academicClass) {
      return NextResponse.json(
        { error: "Classe non trouvée" },
        { status: 404 }
      );
    }

    if (
      academicClass.departmentId !== departmentId ||
      academicClass.department.schoolId !== schoolId
    ) {
      return NextResponse.json(
        { error: "Sélection incohérente" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "student",
        language: language || "fr",
        schoolId,
        departmentId,
        classId,
      },
    });

    // Auto-enroll in all courses for the selected class
    const courses = await prisma.course.findMany({
      where: { classId },
    });

    if (courses.length > 0) {
      for (const course of courses) {
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
          },
        });
      }
    }

    // Log registration activity
    logActivity({
      userId: user.id,
      action: Actions.REGISTER,
      category: "auth",
      resource: "user",
      resourceId: user.id,
      detail: { name: user.name, email: user.email, enrolledCourses: courses.length },
      req,
    });

    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        user: { id: user.id, name: user.name, email: user.email },
        enrolledCourses: courses.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}
