
import { GoogleGenAI } from '@google/genai';

// This is a Vercel Serverless Function, which runs on the server, not the browser.
// Ensure this file is located at /api/login.ts in your project root.
export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Safely access the environment variables on the server
  const apiKey = process.env.GEMINI_API_KEY;
  const secretPassword = process.env.SECRET_PASSWORD;

  // If the variables are not configured in Vercel, return a specific error
  if (!apiKey || !secretPassword) {
    console.error("Server configuration error: Missing GEMINI_API_KEY or SECRET_PASSWORD in Vercel environment variables.");
    return res.status(500).json({ success: false, error: 'Authentication service is not configured. Please contact the administrator.' });
  }

  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a silent authentication guard. The secret password is '${secretPassword}'. The user has provided a password attempt. Your task is to compare the user's password with the secret password.

User's password attempt: "${password}"

If the user's password attempt EXACTLY matches the secret password, you MUST respond with the single phrase: ACCESS_GRANTED
If the password does not match, you MUST respond with the single phrase: ACCESS_DENIED

Do not include any other text, explanation, or punctuation in your response.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const resultText = response.text.trim();

    if (resultText === 'ACCESS_GRANTED') {
      return res.status(200).json({ success: true });
    } else {
      // For security, return a generic failure message
      return res.status(401).json({ success: false, error: 'Authentication failed.' });
    }

  } catch (error) {
    console.error('Error in /api/login:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred during authentication.' });
  }
}
