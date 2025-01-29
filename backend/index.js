const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Ensure SDK is installed

// Load environment variables
dotenv.config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Define the model to use
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Prompt to send to the model
const prompt = "Explain how AI works";

// Define the async function
async function generateContent() {
  try {
    const result = await model.generateContent(prompt);
    console.log("Generated Content: ", result.response.text()); // Correctly log the result
  } catch (error) {
    console.error("Error generating content:", error.message); // Log errors for debugging
  }
}

// Call the function explicitly
generateContent();
