const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 10000;

require('dotenv').config();

// Middleware CSP (evita erro do Google Fonts e CSS externo)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "script-src 'self' 'unsafe-inline';"
  );
  next();
});

app.use(express.static('public')); // caso tenha assets

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/automaclick_v6.html');
});

app.get('/chatbot', async (req, res) => {
  const pageURL = req.query.url;
  if (!pageURL) return res.send('URL inválida');

  try {
    // Simulação de extração inteligente
    const pageData = `Título: Produto X\nBenefícios: A, B, C\nPreço: R$99`;

    const prompt = `
Você é um assistente de vendas. Responda com base neste produto:
${pageData}
Responda como se estivesse em uma conversa com um cliente.
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mistral", // ou "meta-llama/llama-3-70b-instruct"
        messages: [
          { role: "system", content: "Você é um vendedor experiente." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    res.json({ resposta: data.choices[0].message.content });
  } catch (err) {
    res.status(500).send('Erro na IA');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Automaclick rodando na porta ${PORT}`);
});
