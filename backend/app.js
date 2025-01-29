const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/diet-plan", async (req, res) => {
  console.log("🔹 Request received at /api/diet-plan");
  const userInputs = req.body;

  const prompt = `
Generate a structured vegetarian weight loss diet plan in **valid JSON format** based on the user's details:

{
  "Preferences": "${userInputs.preferences || "None"}",
  "Health Issues": "${userInputs.healthIssues || "None"}",
  "Activity Level": "${userInputs.activityLevel || "None"}",
  "Goals": "${userInputs.goals || "Weight loss"}"
}

### Response Format:
Return ONLY a valid JSON object with this structure:
{
  "breakfast": { "meal": "Meal name", "description": "Meal details", "calories": 320 },
  "lunch": { "meal": "Meal name", "description": "Meal details", "calories": 450 },
  "dinner": { "meal": "Meal name", "description": "Meal details", "calories": 400 },
  "snacks": [
    { "snack": "Snack name", "description": "Snack details", "calories": 180 },
    { "snack": "Snack name", "description": "Snack details", "calories": 200 }
  ],
  "total_calories": 1550
}

Ensure:
1. No additional text, comments, or explanations.
2. All calorie values are **numbers**, not strings.
3. Output **only JSON** without \`markdown\` or \`\`\`json formatting.
`;

  try {
    console.log("⏳ Generating diet plan...");
    const result = await model.generateContent(prompt);
    let generatedText = result.response.text().trim();

    console.log("📝 Raw AI Response:", generatedText);

    generatedText = generatedText.replace(/^```json\s*|```$/g, "").trim();

    let parsedDietPlan;
    try {
      parsedDietPlan = JSON.parse(generatedText);
    } catch (jsonError) {
      return res.status(500).json({ error: "AI returned invalid JSON format." });
    }

    const requiredKeys = ["breakfast", "lunch", "dinner", "snacks", "total_calories"];
    const isValidResponse = requiredKeys.every((key) => key in parsedDietPlan);

    if (!isValidResponse) {
      return res.status(500).json({ error: "Invalid diet plan structure." });
    }

    res.status(200).json({ dietPlan: parsedDietPlan });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate diet plan. Try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
