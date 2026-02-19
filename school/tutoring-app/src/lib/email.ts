import { Resend } from "resend";

const FROM_ADDRESS =
  process.env.RESEND_FROM || "LionLearn <noreply@lionlearning.briskprototyping.com>";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] RESEND_API_KEY not configured — skipping email to ${to}: "${subject}"`);
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    if (error) {
      console.error(`[Email] Resend error for ${to}:`, error.message);
      return false;
    }
    console.log(`[Email] Sent to ${to}: "${subject}"`);
    return true;
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, (err as Error).message);
    return false;
  }
}

/**
 * Build the daily recommendation email HTML
 */
export function buildRecommendationEmail(params: {
  studentName: string;
  type: "exercise" | "study_guide" | "flashcard";
  courseTitle: string;
  courseCode: string;
  topic: string;
  reason: string;
  contentUrl: string;
  language: string;
}): { subject: string; html: string } {
  const { studentName, type, courseTitle, courseCode, topic, reason, contentUrl, language } = params;
  const fr = language === "fr";

  const typeLabels: Record<string, { fr: string; en: string }> = {
    exercise: { fr: "Exercice", en: "Exercise" },
    study_guide: { fr: "Guide d'étude", en: "Study Guide" },
    flashcard: { fr: "Flashcards", en: "Flashcards" },
  };

  const typeLabel = fr ? typeLabels[type].fr : typeLabels[type].en;

  const subject = fr
    ? `📚 Votre ${typeLabel.toLowerCase()} du jour — ${courseCode}`
    : `📚 Your daily ${typeLabel.toLowerCase()} — ${courseCode}`;

  const html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; }
    .container { max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 24px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 22px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 24px; }
    .greeting { font-size: 16px; color: #374151; margin-bottom: 16px; }
    .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-exercise { background: #fef3c7; color: #92400e; }
    .badge-study_guide { background: #d1fae5; color: #065f46; }
    .badge-flashcard { background: #ede9fe; color: #5b21b6; }
    .course { font-size: 18px; font-weight: 700; color: #1f2937; margin: 12px 0 4px; }
    .topic { font-size: 14px; color: #6b7280; }
    .reason { font-size: 13px; color: #6b7280; margin-top: 12px; padding: 10px; background: #eff6ff; border-radius: 8px; border-left: 3px solid #3b82f6; }
    .cta { display: block; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-size: 16px; font-weight: 600; margin-top: 20px; }
    .cta:hover { background: #1d4ed8; }
    .footer { text-align: center; padding: 16px 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
    .lion { font-size: 32px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="lion">🦁</div>
      <h1>LionLearn</h1>
      <p>${fr ? "Votre recommandation quotidienne" : "Your daily recommendation"}</p>
    </div>
    <div class="body">
      <p class="greeting">${fr ? "Bonjour" : "Hello"} ${studentName} 👋</p>
      <div class="card">
        <span class="badge badge-${type}">${typeLabel}</span>
        <p class="course">${courseCode} — ${courseTitle}</p>
        <p class="topic">${topic}</p>
        <div class="reason">
          💡 ${reason}
        </div>
      </div>
      <a href="${contentUrl}" class="cta">
        ${fr ? "Commencer maintenant →" : "Start now →"}
      </a>
    </div>
    <div class="footer">
      ${fr ? "Ce contenu a été généré par l'IA pour vous aider à progresser." : "This content was AI-generated to help you improve."}
      <br />LionLearn · ${fr ? "Apprendre intelligemment" : "Learn smart"}
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}
