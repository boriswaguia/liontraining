import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export async function generateStudyGuide(
  courseTitle: string,
  courseContent: string,
  chapter?: string,
  studentProfile?: string
): Promise<string> {
  const model = getGeminiModel();
  const topicFocus = chapter
    ? `Focus specifically on the chapter/topic: "${chapter}".`
    : "Cover all main topics in the course.";

  const profileSection = studentProfile || "";

  const prompt = `You are an expert tutor helping university students at IUT Douala (University Institute of Technology) understand their course material.

Course: ${courseTitle}
${topicFocus}
${profileSection}

Based on the following course content, create a comprehensive but simplified study guide that:
1. Breaks down complex concepts into easy-to-understand language
2. Uses clear examples and analogies
3. Highlights key definitions, formulas, and theorems
4. Includes "Remember!" tips for important points
5. Uses bullet points and organized headings
6. If math is involved, show step-by-step solutions
7. If a student profile is provided, focus on their weak areas and skip topics they've already mastered

Write the study guide in the same language as the course content (French if the course is in French).
Use markdown formatting.

Course Content:
${courseContent.substring(0, 30000)}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateExercises(
  courseTitle: string,
  courseContent: string,
  topic: string,
  difficulty: string = "medium",
  count: number = 5,
  studentProfile?: string
): Promise<{ questions: string[]; solutions: string[] }> {
  const model = getGeminiModel();

  const profileSection = studentProfile || "";

  const prompt = `You are an expert tutor creating practice exercises for university students at IUT Douala.

Course: ${courseTitle}
Topic: ${topic}
Difficulty: ${difficulty}
Number of exercises: ${count}
${profileSection}

Based on the course content below, generate ${count} practice exercises with detailed solutions.

IMPORTANT: Return your response as valid JSON with this exact structure:
{
  "questions": ["Question 1 text...", "Question 2 text...", ...],
  "solutions": ["Detailed solution 1...", "Detailed solution 2...", ...]
}

Make exercises appropriate for the difficulty level:
- easy: Basic recall and simple application
- medium: Application and analysis
- hard: Synthesis, complex problem-solving

If student profile is provided:
- Avoid questions on topics the student has already mastered (≥70%)
- Focus on weak areas mentioned in the profile
- Vary question types from previously attempted exercises
- If the student has been struggling, include more guided/scaffolded questions

Write in the same language as the course content. Use LaTeX notation for any math formulas (e.g., \\(x^2\\)).

Course Content:
${courseContent.substring(0, 25000)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // If JSON parsing fails, try to extract questions and solutions manually
  }

  return {
    questions: [`Exercise generation completed. Raw response:\n${text}`],
    solutions: ["See the exercise text for details."],
  };
}

export async function generateFlashcards(
  courseTitle: string,
  courseContent: string,
  topic?: string,
  count: number = 15,
  studentProfile?: string
): Promise<Array<{ front: string; back: string }>> {
  const model = getGeminiModel();

  const topicFocus = topic ? `Focus on: ${topic}` : "Cover all main topics.";
  const profileSection = studentProfile || "";

  const prompt = `You are an expert tutor creating flashcards for university students at IUT Douala.

Course: ${courseTitle}
${topicFocus}
Number of flashcards: ${count}
${profileSection}

Based on the course content below, generate ${count} flashcards for revision.

IMPORTANT: Return your response as valid JSON with this exact structure:
{
  "cards": [
    {"front": "Question or concept", "back": "Answer or explanation"},
    ...
  ]
}

Make flashcards that:
- Cover key definitions, formulas, and concepts
- Are concise but complete
- Are useful for exam preparation
- Include a mix of recall and understanding cards
- If student profile is provided, prioritize weak areas and avoid repeating well-mastered content

Write in the same language as the course content.

Course Content:
${courseContent.substring(0, 25000)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.cards || [];
    }
  } catch {
    // fallback
  }

  return [{ front: "Error generating flashcards", back: "Please try again." }];
}

export async function chatWithTutor(
  courseTitle: string,
  courseContent: string,
  messageHistory: Array<{ role: string; content: string }>,
  newMessage: string,
  studentProfile?: string
): Promise<string> {
  const model = getGeminiModel();

  const historyText = messageHistory
    .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
    .join("\n");

  const profileSection = studentProfile || "";

  const prompt = `You are a patient, knowledgeable tutor helping a university student at IUT Douala (University Institute of Technology) understand their course material.

Course: ${courseTitle}
${profileSection}

Your role:
- Explain concepts clearly using simple language and examples
- If the student asks about formulas, show step-by-step derivations
- Encourage the student and build their confidence
- If a concept is complex, break it into smaller parts
- Use analogies from everyday life when possible
- Answer in the same language as the course/student's question (French if they ask in French)
- If student profile is provided, adapt your explanations to their level and focus on their weak areas
- Acknowledge their progress and encourage improvement

Course Material for Reference:
${courseContent.substring(0, 20000)}

Previous Conversation:
${historyText}

Student's New Question: ${newMessage}

Respond as the tutor:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateStudyPlan(
  courseTitle: string,
  courseContent: string,
  startDate: string,
  endDate: string,
  hoursPerDay: number = 2,
  studentProfile?: string
): Promise<{
  title: string;
  tasks: Array<{ title: string; description: string; dueDate: string }>;
}> {
  const model = getGeminiModel();

  const profileSection = studentProfile || "";

  const prompt = `You are an expert study planner helping a university student at IUT Douala prepare for their exams.

Course: ${courseTitle}
Study Period: ${startDate} to ${endDate}
Available Study Hours Per Day: ${hoursPerDay}
${profileSection}
Available Study Hours Per Day: ${hoursPerDay}

Based on the course content below, create a detailed study plan.

IMPORTANT: Return your response as valid JSON with this exact structure:
{
  "title": "Study Plan for [Course]",
  "tasks": [
    {
      "title": "Task title",
      "description": "What to study and how",
      "dueDate": "YYYY-MM-DD"
    },
    ...
  ]
}

The plan should:
- Break the course into logical study sessions
- Allocate more time for difficult topics
- Include revision and practice sessions
- Include a final review before the end date
- Be realistic with the available hours
- If student profile is provided, prioritize weak topics and spend less time on mastered ones

Write in the same language as the course content.

Course Content:
${courseContent.substring(0, 25000)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return {
    title: `Study Plan for ${courseTitle}`,
    tasks: [
      {
        title: "Review course material",
        description: "Go through all chapters",
        dueDate: endDate,
      },
    ],
  };
}
