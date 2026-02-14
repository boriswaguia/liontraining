import { prisma } from "@/lib/db";

// ============= TYPES =============

export interface StudentProfile {
  masteryLevel: number;
  currentDifficulty: string;
  totalXp: number;
  streak: number;
  topicsCovered: string[];
  topicMastery: Array<{
    topic: string;
    score: number;
    timesPracticed: number;
    difficultyReached: string;
    weakAreas: string[];
  }>;
  recentExercises: Array<{
    topic: string;
    difficulty: string;
    score: number | null;
  }>;
}

// ============= BADGE DEFINITIONS =============

export const BADGE_DEFINITIONS = [
  {
    badge: "first_exercise",
    title: "Premier Pas",
    description: "Compléter votre premier exercice",
    icon: "🎯",
    check: (stats: { totalExercises: number }) => stats.totalExercises >= 1,
  },
  {
    badge: "five_exercises",
    title: "En Forme",
    description: "Compléter 5 exercices",
    icon: "💪",
    check: (stats: { totalExercises: number }) => stats.totalExercises >= 5,
  },
  {
    badge: "twenty_exercises",
    title: "Machine d'Exercices",
    description: "Compléter 20 exercices",
    icon: "🔥",
    check: (stats: { totalExercises: number }) => stats.totalExercises >= 20,
  },
  {
    badge: "first_perfect",
    title: "Score Parfait",
    description: "Obtenir 100% à un exercice",
    icon: "⭐",
    check: (stats: { hasGotPerfectScore: boolean }) => stats.hasGotPerfectScore,
  },
  {
    badge: "streak_3",
    title: "Régulier",
    description: "3 jours consécutifs d'étude",
    icon: "📅",
    check: (stats: { streak: number }) => stats.streak >= 3,
  },
  {
    badge: "streak_7",
    title: "Déterminé",
    description: "7 jours consécutifs d'étude",
    icon: "🏆",
    check: (stats: { streak: number }) => stats.streak >= 7,
  },
  {
    badge: "first_flashcard",
    title: "Flashcard Fan",
    description: "Réviser votre premier deck de flashcards",
    icon: "🃏",
    check: (stats: { totalFlashcards: number }) => stats.totalFlashcards >= 1,
  },
  {
    badge: "mastery_50",
    title: "Mi-Chemin",
    description: "Atteindre 50% de maîtrise dans un cours",
    icon: "📈",
    check: (stats: { masteryLevel: number }) => stats.masteryLevel >= 50,
  },
  {
    badge: "mastery_80",
    title: "Expert",
    description: "Atteindre 80% de maîtrise dans un cours",
    icon: "🎓",
    check: (stats: { masteryLevel: number }) => stats.masteryLevel >= 80,
  },
  {
    badge: "xp_100",
    title: "Centurion",
    description: "Accumuler 100 XP",
    icon: "💯",
    check: (stats: { totalXp: number }) => stats.totalXp >= 100,
  },
  {
    badge: "xp_500",
    title: "Érudit",
    description: "Accumuler 500 XP",
    icon: "🌟",
    check: (stats: { totalXp: number }) => stats.totalXp >= 500,
  },
  {
    badge: "three_topics",
    title: "Explorateur",
    description: "Étudier 3 sujets différents",
    icon: "🧭",
    check: (stats: { topicCount: number }) => stats.topicCount >= 3,
  },
];

// ============= XP REWARDS =============

const XP_REWARDS = {
  exercise_complete: 10,
  exercise_perfect: 25,
  exercise_good: 15, // 80%+
  flashcard_review: 5,
  study_guide: 5,
  chat_message: 2,
  study_plan: 5,
  streak_bonus: 5, // per day of streak
};

// ============= CORE FUNCTIONS =============

/**
 * Get or create a UserProgress record for user+course
 */
export async function getOrCreateProgress(userId: string, courseId: string) {
  let progress = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!progress) {
    progress = await prisma.userProgress.create({
      data: { userId, courseId },
    });
  }

  return progress;
}

/**
 * Build a student profile string for LLM context injection.
 * This tells the AI what the student knows so it can adapt.
 */
export async function buildStudentProfileForLLM(
  userId: string,
  courseId: string
): Promise<string> {
  const [progress, topics, recentExercises] = await Promise.all([
    getOrCreateProgress(userId, courseId),
    prisma.topicMastery.findMany({
      where: { userId, courseId },
      orderBy: { masteryScore: "asc" },
    }),
    prisma.exercise.findMany({
      where: { userId, courseId, score: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { topic: true, difficulty: true, score: true },
    }),
  ]);

  const topicsCovered: string[] = JSON.parse(progress.topicsCovered || "[]");

  const lines: string[] = [
    `\n--- PROFIL ÉTUDIANT (contexte pour personnalisation) ---`,
    `Niveau de maîtrise global: ${progress.masteryLevel}/100`,
    `Difficulté actuelle recommandée: ${progress.currentDifficulty}`,
    `Nombre total d'exercices complétés: ${progress.totalExercises}`,
    `Taux de réussite: ${progress.totalExercises > 0 ? Math.round((progress.totalCorrect / progress.totalExercises) * 100) : 0}%`,
  ];

  if (topicsCovered.length > 0) {
    lines.push(`Sujets déjà couverts: ${topicsCovered.join(", ")}`);
  }

  if (topics.length > 0) {
    const weak = topics.filter((t: any) => t.masteryScore < 40);
    const strong = topics.filter((t: any) => t.masteryScore >= 70);

    if (weak.length > 0) {
      lines.push(
        `Points faibles (< 40%): ${weak.map((t: any) => `${t.topic} (${t.masteryScore}%)`).join(", ")}`
      );
    }
    if (strong.length > 0) {
      lines.push(
        `Points forts (≥ 70%): ${strong.map((t: any) => `${t.topic} (${t.masteryScore}%)`).join(", ")}`
      );
    }
  }

  if (recentExercises.length > 0) {
    const avgScore =
      recentExercises.reduce((sum: number, e: any) => sum + (e.score || 0), 0) /
      recentExercises.length;
    lines.push(
      `Score moyen récent: ${Math.round(avgScore)}%`
    );

    const recentTopics = [...new Set(recentExercises.map((e: any) => e.topic))];
    lines.push(
      `Sujets récemment pratiqués: ${recentTopics.join(", ")}`
    );
  }

  lines.push(
    `\nINSTRUCTIONS ADAPTATIVES:`,
    `- Ne PAS régénérer du contenu sur les sujets déjà bien maîtrisés (≥ 70%)`,
    `- Concentrer sur les points faibles de l'étudiant`,
    `- Adapter la difficulté au niveau "${progress.currentDifficulty}"`,
    `- Varier les types de questions par rapport aux exercices passés`,
    `--- FIN PROFIL ÉTUDIANT ---\n`
  );

  return lines.join("\n");
}

/**
 * Compute adaptive difficulty based on recent performance.
 * If the student scores well, increase difficulty. If poorly, decrease.
 */
export function computeAdaptiveDifficulty(
  currentDifficulty: string,
  recentScores: number[]
): string {
  if (recentScores.length < 3) return currentDifficulty;

  const last3 = recentScores.slice(0, 3);
  const avg = last3.reduce((a, b) => a + b, 0) / last3.length;

  if (avg >= 80) {
    // Student is doing great, increase difficulty
    if (currentDifficulty === "easy") return "medium";
    if (currentDifficulty === "medium") return "hard";
    return "hard";
  } else if (avg < 40) {
    // Student is struggling, decrease difficulty
    if (currentDifficulty === "hard") return "medium";
    if (currentDifficulty === "medium") return "easy";
    return "easy";
  }

  return currentDifficulty;
}

/**
 * Update mastery score after an exercise is scored.
 * Uses exponential moving average so recent performance is weighted more.
 */
export async function updateAfterExerciseScore(
  userId: string,
  courseId: string,
  topic: string,
  scorePercent: number, // 0-100
  difficulty: string
) {
  // Update or create TopicMastery
  const existing = await prisma.topicMastery.findUnique({
    where: { userId_courseId_topic: { userId, courseId, topic } },
  });

  const isCorrect = scorePercent >= 60;
  const difficultyMultiplier =
    difficulty === "hard" ? 1.5 : difficulty === "medium" ? 1.0 : 0.7;

  if (existing) {
    const newMastery = Math.min(
      100,
      Math.round(
        existing.masteryScore * 0.7 +
          scorePercent * difficultyMultiplier * 0.3
      )
    );

    // Track highest difficulty reached
    const diffLevels: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
    const newDiffReached =
      diffLevels[difficulty] > diffLevels[existing.difficultyReached]
        ? difficulty
        : existing.difficultyReached;

    await prisma.topicMastery.update({
      where: { id: existing.id },
      data: {
        masteryScore: newMastery,
        timesPracticed: existing.timesPracticed + 1,
        timesCorrect: existing.timesCorrect + (isCorrect ? 1 : 0),
        difficultyReached: newDiffReached,
        lastPracticedAt: new Date(),
      },
    });
  } else {
    const initialMastery = Math.min(
      100,
      Math.round(scorePercent * difficultyMultiplier)
    );
    await prisma.topicMastery.create({
      data: {
        userId,
        courseId,
        topic,
        masteryScore: initialMastery,
        timesPracticed: 1,
        timesCorrect: isCorrect ? 1 : 0,
        difficultyReached: difficulty,
        lastPracticedAt: new Date(),
      },
    });
  }

  // Update UserProgress
  const progress = await getOrCreateProgress(userId, courseId);

  // Calculate XP earned
  let xpEarned = XP_REWARDS.exercise_complete;
  if (scorePercent === 100) xpEarned += XP_REWARDS.exercise_perfect;
  else if (scorePercent >= 80) xpEarned += XP_REWARDS.exercise_good;

  // Update topics covered
  const topicsCovered: string[] = JSON.parse(progress.topicsCovered || "[]");
  if (!topicsCovered.includes(topic)) {
    topicsCovered.push(topic);
  }

  // Calculate streak
  const now = new Date();
  const lastActivity = new Date(progress.lastActivityAt);
  const daysDiff = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );
  let newStreak = progress.streak;
  if (daysDiff === 1) {
    newStreak += 1;
    xpEarned += XP_REWARDS.streak_bonus;
  } else if (daysDiff > 1) {
    newStreak = 1;
  }

  // Get all topic mastery values to compute overall mastery
  const allTopics = await prisma.topicMastery.findMany({
    where: { userId, courseId },
  });
  const overallMastery =
    allTopics.length > 0
      ? Math.round(
          allTopics.reduce((sum: number, t: any) => sum + t.masteryScore, 0) /
            allTopics.length
        )
      : 0;

  // Get recent scores for adaptive difficulty
  const recentExercises = await prisma.exercise.findMany({
    where: { userId, courseId, score: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { score: true },
  });
  const recentScores = recentExercises
    .map((e: any) => e.score)
    .filter((s: any): s is number => s !== null);
  const newDifficulty = computeAdaptiveDifficulty(
    progress.currentDifficulty,
    recentScores
  );

  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      masteryLevel: overallMastery,
      currentDifficulty: newDifficulty,
      totalXp: progress.totalXp + xpEarned,
      streak: newStreak,
      topicsCovered: JSON.stringify(topicsCovered),
      totalExercises: progress.totalExercises + 1,
      totalCorrect: progress.totalCorrect + (isCorrect ? 1 : 0),
      lastActivityAt: now,
    },
  });

  // Check for new achievements
  await checkAndAwardBadges(userId, courseId);

  return { xpEarned, newDifficulty, overallMastery };
}

/**
 * Record activity for non-exercise actions (flashcard review, study guide, chat)
 */
export async function recordActivity(
  userId: string,
  courseId: string,
  type: "flashcard" | "study_guide" | "chat" | "study_plan"
) {
  const progress = await getOrCreateProgress(userId, courseId);

  const xpEarned =
    type === "flashcard"
      ? XP_REWARDS.flashcard_review
      : type === "study_guide"
        ? XP_REWARDS.study_guide
        : type === "chat"
          ? XP_REWARDS.chat_message
          : XP_REWARDS.study_plan;

  // Streak calculation
  const now = new Date();
  const lastActivity = new Date(progress.lastActivityAt);
  const daysDiff = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );
  let newStreak = progress.streak;
  if (daysDiff === 1) {
    newStreak += 1;
  } else if (daysDiff > 1) {
    newStreak = 1;
  }

  const updateData: Record<string, any> = {
    totalXp: progress.totalXp + xpEarned,
    streak: newStreak,
    lastActivityAt: now,
  };

  if (type === "flashcard") updateData.totalFlashcards = progress.totalFlashcards + 1;
  if (type === "study_guide") updateData.totalStudyGuides = progress.totalStudyGuides + 1;
  if (type === "chat") updateData.totalChatMessages = progress.totalChatMessages + 1;

  await prisma.userProgress.update({
    where: { id: progress.id },
    data: updateData,
  });

  await checkAndAwardBadges(userId, courseId);
}

/**
 * Check badge criteria and award any new badges
 */
async function checkAndAwardBadges(userId: string, courseId: string) {
  const progress = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!progress) return;

  const existingBadges = await prisma.achievement.findMany({
    where: { userId },
    select: { badge: true },
  });
  const earnedBadgeIds = new Set(existingBadges.map((b: any) => b.badge));

  // Check for perfect score achievement
  const hasPerfect = await prisma.exercise.findFirst({
    where: { userId, score: 100 },
  });

  const topicCount = await prisma.topicMastery.count({
    where: { userId, courseId },
  });

  const stats = {
    totalExercises: progress.totalExercises,
    totalFlashcards: progress.totalFlashcards,
    masteryLevel: progress.masteryLevel,
    totalXp: progress.totalXp,
    streak: progress.streak,
    topicCount,
    hasGotPerfectScore: !!hasPerfect,
  };

  const newBadges: Array<{ badge: string; title: string; description: string; icon: string }> = [];

  for (const def of BADGE_DEFINITIONS) {
    if (earnedBadgeIds.has(def.badge)) continue;
    if ((def.check as any)(stats)) {
      newBadges.push({
        badge: def.badge,
        title: def.title,
        description: def.description,
        icon: def.icon,
      });
    }
  }

  if (newBadges.length > 0) {
    await prisma.achievement.createMany({
      data: newBadges.map((b) => ({
        userId,
        badge: b.badge,
        title: b.title,
        description: b.description,
        icon: b.icon,
      })),
      skipDuplicates: true,
    });
  }

  return newBadges;
}

/**
 * Get full student profile data for the progress page
 */
export async function getStudentProgressData(userId: string) {
  const [allProgress, allTopics, achievements, recentExercises] =
    await Promise.all([
      prisma.userProgress.findMany({
        where: { userId },
        include: { course: true },
      }),
      prisma.topicMastery.findMany({
        where: { userId },
        include: { course: true },
        orderBy: { masteryScore: "desc" },
      }),
      prisma.achievement.findMany({
        where: { userId },
        orderBy: { earnedAt: "desc" },
      }),
      prisma.exercise.findMany({
        where: { userId, score: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { course: true },
      }),
    ]);

  // Aggregate stats
  const totalXp = allProgress.reduce((sum: number, p: any) => sum + p.totalXp, 0);
  const maxStreak = Math.max(...allProgress.map((p: any) => p.streak), 0);
  const totalExercises = allProgress.reduce(
    (sum: number, p: any) => sum + p.totalExercises,
    0
  );
  const totalCorrect = allProgress.reduce(
    (sum: number, p: any) => sum + p.totalCorrect,
    0
  );

  return {
    courseProgress: allProgress,
    topicMastery: allTopics,
    achievements,
    recentExercises,
    stats: {
      totalXp,
      maxStreak,
      totalExercises,
      totalCorrect,
      successRate:
        totalExercises > 0
          ? Math.round((totalCorrect / totalExercises) * 100)
          : 0,
      coursesStudied: allProgress.length,
      topicsMastered: allTopics.filter((t: any) => t.masteryScore >= 70).length,
      totalTopics: allTopics.length,
    },
  };
}
