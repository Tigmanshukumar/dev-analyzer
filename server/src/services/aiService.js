import Bytez from "bytez.js";

const key = process.env.BYTEZ_KEY;
const sdk = new Bytez(key);
const model = sdk.model("openai/gpt-4o");

export const generateSummary = async (data) => {
  try {
    const prompt = `
You are a strict technical recruiter.

CRITICAL THINKING RULES:
- Do NOT repeat numbers without interpreting them
- Do NOT treat popularity (stars) as strong hiring signal
- Prioritize signals:
  1. Consistency (most important)
  2. Repo Quality
  3. Activity
  4. Popularity (least important)
- Always include a tradeoff (no candidate is perfect)
- Avoid generic praise

Candidate Data:
${JSON.stringify(data)}

SYSTEM SCORES:
- Hireability: ${data.hireability?.score} (${data.hireability?.label})
- Quality: ${data.quality?.averageScore}
- Activity: ${data.activity?.recentActivityScore}
- Consistency: ${data.consistency?.consistencyScore}
- Languages: ${data.metrics?.topLanguages?.join(", ")}

Write in EXACT format:

Summary:
(Explain strongest signal + biggest limitation)

Strengths:
- (Explain WHY it matters for hiring)
- (Focus on real-world impact, not numbers)

Weaknesses:
- (Highlight hiring risk, not just missing skill)
- (Explain consequence)

Final Decision:
(Use system label ONLY)

Justification:
(Explain WHY strengths outweigh weaknesses OR not — no repetition of scores)
`;

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt,
      },
    ]);

    if (error) {
      console.error("Bytez API Error:", error);
      return "AI analysis unavailable";
    }

    return output;
  } catch (err) {
    console.error("AI Service Error:", err);
    return "AI analysis unavailable";
  }
};