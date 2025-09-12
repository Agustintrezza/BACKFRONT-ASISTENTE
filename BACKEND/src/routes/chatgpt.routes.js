// src/routes/chatgpt.routes.js
const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/chatgpt/query
router.post("/query", async (req, res) => {
  try {
    const { message, tenant } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // podés usar gpt-4o o gpt-3.5 si querés
      messages: [
        { role: "system", content: `Asistente para el tenant: ${tenant}` },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error en ChatGPT:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
