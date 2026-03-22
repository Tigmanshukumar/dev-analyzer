import axios from "axios";

export const generateComparison = async (candidates, role) => {
  try {
    const prompt = `
You are a strict technical recruiter.

Compare the following candidates for the role: ${role}

IMPORTANT RULES:
- Do NOT assume ranking is correct
- Evaluate each candidate independently first
- Then compare them
- Prioritize: Consistency > Quality > Activity > Popularity
- Avoid generic statements
- Focus on differences, not descriptions

Candidates:
${JSON.stringify(candidates)}

Write in EXACT format:

Individual Assessment:
- Candidate 1 (username): (1 line)
- Candidate 2 (username): (1 line)

Key Differences:
- (Biggest difference)
- (Second biggest difference)

Winner:
(Choose ONE username)

Reason:
(Why this candidate wins based on metrics)

Risk:
(What could go wrong if we hire the winner)
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    return "Comparison AI failed";
  }
};