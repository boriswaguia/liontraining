import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity, Actions } from "@/lib/activity";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: { course: true },
  });

  const courses = enrollments
    .map((e) => e.course)
    .filter((c) => c.isActive);
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { courseId } = await req.json();

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId,
    },
  });

  logActivity({
    userId: session.user.id,
    action: Actions.COURSE_ENROLL,
    category: "learning",
    resource: "course",
    resourceId: courseId,
    req,
  });

  return NextResponse.json({ enrollment }, { status: 201 });
}
