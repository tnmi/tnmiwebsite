import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  console.log("Gemini API route hit");
  console.log("GEMINI_API_KEY value:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
  try {
    const { query, content } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent(`${query}\n\n${content}`);
    const text = await result.response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error contacting Gemini API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}