import Bytez from "bytez.js";

const key = process.env.BYTEZ_KEY;
const sdk = new Bytez(key);
const model = sdk.model("openai/gpt-4o");

export const generateSummary = async (data) => {
  try {
    const prompt = `
You are a strict technical recruiter.

IMPORTANT RULES:
- Base your decision ONLY on the provided data
- Do NOT exaggerate or praise unnecessarily
- Be critical and realistic
- If candidate is weak → clearly say it

Candidate Data:
${JSON.stringify(data)}

Write output in this EXACT format:

Summary:
(2 lines max, no hype)

Strengths:
- point 1
- point 2

Weaknesses:
- point 1
- point 2

Final Decision:
(Choose ONE: Strong Hire / Hire / Consider / Reject)

Justification:
(1–2 lines explaining WHY based on data)
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