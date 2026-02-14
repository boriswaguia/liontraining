import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Non autorisé", status: 401, session: null };
  }
  const role = (session.user as Record<string, unknown>).role as string;
  if (role !== "admin") {
    return { error: "Accès réservé aux administrateurs", status: 403, session: null };
  }
  return { error: null, status: 200, session };
}
