import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export type ActivityCategory = "auth" | "learning" | "ai" | "admin";

export interface LogActivityParams {
  userId: string;
  action: string;
  category: ActivityCategory;
  resource?: string;
  resourceId?: string;
  detail?: Record<string, unknown>;
  req?: NextRequest;
}

/**
 * Log a user activity. Fire-and-forget — never throws.
 */
export function logActivity(params: LogActivityParams) {
  const { userId, action, category, resource, resourceId, detail, req } = params;

  // Extract IP and user-agent from request if available
  let ipAddress: string | undefined;
  let userAgent: string | undefined;
  if (req) {
    ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;
    userAgent = req.headers.get("user-agent") || undefined;
  }

  // Fire-and-forget — don't await, don't block the response
  prisma.activityLog
    .create({
      data: {
        userId,
        action,
        category,
        resource: resource || null,
        resourceId: resourceId || null,
        detail: detail ? JSON.stringify(detail) : null,
        ipAddress: ipAddress || null,
        userAgent: userAgent ? userAgent.substring(0, 500) : null,
      },
    })
    .catch((err) => {
      console.error("[ActivityLog] Failed to log activity:", err?.message);
    });
}

/** Pre-defined action constants for consistency */
export const Actions = {
  // Auth
  LOGIN: "login",
  REGISTER: "register",

  // Learning
  COURSE_ENROLL: "course.enroll",
  COURSE_VIEW: "course.view",

  // AI-generated content
  CHAT_MESSAGE: "chat.message",
  EXERCISE_GENERATE: "exercise.generate",
  EXERCISE_SCORE: "exercise.score",
  STUDY_GUIDE_GENERATE: "study_guide.generate",
  STUDY_GUIDE_COMPLETE: "study_guide.complete",
  FLASHCARD_GENERATE: "flashcard.generate",
  FLASHCARD_REVIEW: "flashcard.review",
  STUDY_PLAN_GENERATE: "study_plan.generate",
  STUDY_PLAN_TASK_TOGGLE: "study_plan.task_toggle",

  // Admin actions
  ADMIN_USER_CREATE: "admin.user.create",
  ADMIN_USER_UPDATE: "admin.user.update",
  ADMIN_USER_DELETE: "admin.user.delete",
  ADMIN_USER_TOGGLE_ACTIVE: "admin.user.toggle_active",
  ADMIN_SCHOOL_CREATE: "admin.school.create",
  ADMIN_SCHOOL_UPDATE: "admin.school.update",
  ADMIN_SCHOOL_DELETE: "admin.school.delete",
  ADMIN_DEPARTMENT_CREATE: "admin.department.create",
  ADMIN_DEPARTMENT_UPDATE: "admin.department.update",
  ADMIN_DEPARTMENT_DELETE: "admin.department.delete",
  ADMIN_CLASS_CREATE: "admin.class.create",
  ADMIN_CLASS_UPDATE: "admin.class.update",
  ADMIN_CLASS_DELETE: "admin.class.delete",
  ADMIN_COURSE_CREATE: "admin.course.create",
  ADMIN_COURSE_UPDATE: "admin.course.update",
  ADMIN_COURSE_DELETE: "admin.course.delete",
} as const;
