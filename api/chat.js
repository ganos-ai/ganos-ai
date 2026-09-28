import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Menggunakan kunci API yang sudah terpasang
    const apiKey = "AQ.Ab8RN6LX-BYIgPP1w_suq939P-qutJZQPg6fD57JR7sV9-f0sQ";
    
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (response && response.text) {
      return res.status(200).json({ reply: response.text });
    } else {
      return res.status(500).json({ error: 'Gagal mendapatkan respons dari model AI.' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server.' });
  }
}
