export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Kunci API dipasang langsung di sini agar tidak perlu repot setting di Vercel
    const apiKey = "AQ.Ab8RN6LX-BYIgPP1w_suq939P-qutJZQPg6fD57JR7sV9-f0sQ";

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await apiResponse.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const replyText = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: replyText });
    } else {
      return res.status(500).json({ error: 'Struktur respons Gemini tidak valid: ' + JSON.stringify(data) });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Server Error: ' + error.message });
  }
}
