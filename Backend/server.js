import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { checkEnvironment } from "./checkEnvironment.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import cors from "cors";
/*
AI_GOOGLE_URL=
AI_GOOGLE_MODEL=gemini-1.5-flash
AI_GOOGLE_KEY=AIzaSyBNoEniJK-vdOessAJHT1D8o6c6U4DhLSM
*/
const genAI = new GoogleGenerativeAI("process.env.AI_GOOGLE_KEY");
const model = genAI.getGenerativeModel({ model: "process.AI_GOOGLE_MODEL" });

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});
const systemPrompt = `You are the Gift Genie that can search the web! 

You generate gift ideas that feel thoughtful, specific, and genuinely useful.
Your output must be in structured Markdown.
Do not write introductions or conclusions.
Start directly with the gift suggestions.

Each gift must:
- Have a clear heading with the actual product's name
- Include a short explanation of why it works
- Include the current price or a price range
- Include one or more links to websites or social media business pages
where the gift can be bought

Prefer products that are widely available and well-reviewed.
If you can't find a working link, say so rather than guessing.

If the user mentions a location, situation, or constraint,
adapt the gift ideas and add another short section 
under each gift that guides the user to get the gift in that 
constrained context.

After the gift ideas, include a section titled "Questions for you"
with clarifying questions that would help improve the recommendations.

Finish with a section with H2 heading titled "Wanna browse yourself?"
with links to various ecommerce sites with relevant search queries and filters 
already applied.`;

async function handleGiftRequest(userPrompt) {
  const response = await openai.responses.create({
    model: process.env.AI_MODEL,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    tools: [{ type: "web_search_preview" }],
  });
  return response;
}
const app = express();
app.use(cors());
app.use(express.json());
checkEnvironment();

app.post("/api/gift", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    console.log(userPrompt);
    const response = await handleGiftRequest(userPrompt);
    console.log(response.output_text);
    res.json({ message: `${response.output_text}` });
  } catch {
    const { userPrompt } = req.body;
    console.log(userPrompt);
    const response = await handleGiftRequest(userPrompt);
    console.log(response.output_text);
    res.json({ message: `${response.output_text}` });
  }
});
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
