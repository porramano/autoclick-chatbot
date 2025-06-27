/**
 * Automaclick Chatbot Server v6.0
 * Servidor Node.js para integração com OpenRouter e chatbot autônomo
 * 
 * Funcionalidades:
 * - Extração de dados de páginas de vendas
 * - Integração com API OpenRouter (modelos gratuitos)
 * - Interface de chatbot em tempo real
 * - Escalabilidade para milhares de afiliados
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do OpenRouter
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'sk-or-v1-your-api-key-here';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Modelos gratuitos disponíveis
const FREE_MODELS = [
    'mistralai/mistral-7b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'anthropic/claude-3-haiku:beta'
];

/**
 * Classe para extração de dados de páginas de vendas
 * Baseada no motor do Automaclick v5.0
 */
class PageDataExtractor {
    static async extractPageData(url) {
        const log = (message) => console.log(`[${new Date().toISOString()}] ${message}`);
        
        try {
            log(`Iniciando extração de dados da URL: ${url}`);
            
            // Usar proxy CORS para contornar limitações
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const html = data.contents;
            
            // Extrair dados usando regex e parsing HTML
            const extractedData = {
                title: this.extractTitle(html),
                description: this.extractDescription(html),
                price: this.extractPrice(html),
                benefits: this.extractBenefits(html),
                testimonials: this.extractTestimonials(html),
                cta: this.extractCTA(html),
                url: url
            };

            log(`Extração concluída com sucesso para: ${extractedData.title}`);
            return extractedData;

        } catch (error) {
            log(`Erro na extração: ${error.message}`);
            
            // Retornar dados padrão em caso de falha
            return {
                title: "Produto Incrível",
                description: "Um produto que vai transformar sua vida e seus resultados.",
                price: "Consulte o preço na página",
                benefits: [
                    "Resultados comprovados",
                    "Suporte especializado", 
                    "Garantia de satisfação"
                ],
                testimonials: [
                    "Produto excelente, recomendo! - Cliente Satisfeito"
                ],
                cta: "Compre Agora",
                url: url
            };
        }
    }

    static extractTitle(html) {
        const patterns = [
            /<title[^>]*>([^<]+)<\/title>/i,
            /<h1[^>]*>([^<]+)<\/h1>/i,
            /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i
        ];

        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                return match[1].trim().substring(0, 100);
            }
        }
        return "Produto Incrível";
    }

    static extractDescription(html) {
        const patterns = [
            /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
            /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i,
            /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/p>/i
        ];

        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                return match[1].trim().substring(0, 300);
            }
        }
        return "Um produto que vai transformar sua vida e seus resultados.";
    }

    static extractPrice(html) {
        const patterns = [
            /R\$\s*(\d+(?:,\d{2})?)/g,
            /\$\s*(\d+(?:\.\d{2})?)/g,
            /(\d+(?:,\d{2})?\s*reais?)/gi,
            /por\s+apenas\s+R?\$?\s*(\d+(?:,\d{2})?)/gi
        ];

        for (const pattern of patterns) {
            const matches = html.match(pattern);
            if (matches && matches.length > 0) {
                return matches[0].trim();
            }
        }
        return "Consulte o preço na página";
    }

    static extractBenefits(html) {
        const benefits = [];
        
        // Procurar por listas e itens de benefícios
        const listPatterns = [
            /<li[^>]*>([^<]+)<\/li>/gi,
            /<div[^>]*class="[^"]*benefit[^"]*"[^>]*>([^<]+)<\/div>/gi,
            /<span[^>]*class="[^"]*check[^"]*"[^>]*>[^<]*<\/span>\s*([^<]+)/gi
        ];

        for (const pattern of listPatterns) {
            let match;
            while ((match = pattern.exec(html)) !== null && benefits.length < 5) {
                const benefit = match[1].trim();
                if (benefit.length > 10 && benefit.length < 100) {
                    benefits.push(benefit);
                }
            }
        }

        return benefits.length > 0 ? benefits : [
            "Resultados comprovados",
            "Suporte especializado",
            "Garantia de satisfação"
        ];
    }

    static extractTestimonials(html) {
        const testimonials = [];
        
        const patterns = [
            /<div[^>]*class="[^"]*testimonial[^"]*"[^>]*>([^<]+)<\/div>/gi,
            /<blockquote[^>]*>([^<]+)<\/blockquote>/gi,
            /"([^"]{50,200})"\s*-\s*([^<\n]+)/gi
        ];

        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(html)) !== null && testimonials.length < 3) {
                const testimonial = match[1].trim();
                if (testimonial.length > 20) {
                    testimonials.push(testimonial);
                }
            }
        }

        return testimonials.length > 0 ? testimonials : [
            "Produto excelente, recomendo! - Cliente Satisfeito"
        ];
    }

    static extractCTA(html) {
        const patterns = [
            /<button[^>]*>([^<]+)<\/button>/gi,
            /<a[^>]*class="[^"]*btn[^"]*"[^>]*>([^<]+)<\/a>/gi,
            /comprar?\s+agora/gi,
            /adquirir?\s+já/gi
        ];

        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        return "Compre Agora";
    }
}

/**
 * Classe para integração com OpenRouter
 */
class OpenRouterClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = OPENROUTER_BASE_URL;
    }

    async generateResponse(prompt, userMessage, productData) {
        try {
            const systemPrompt = this.buildSystemPrompt(productData);
            
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://automaclick.app',
                    'X-Title': 'Automaclick Chatbot'
                },
                body: JSON.stringify({
                    model: FREE_MODELS[0], // Usar Mistral como padrão
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                    top_p: 0.9
                })
            });

            if (!response.ok) {
                throw new Error(`OpenRouter API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('Erro na API OpenRouter:', error);
            
            // Fallback: resposta baseada em template
            return this.generateFallbackResponse(userMessage, productData);
        }
    }

    buildSystemPrompt(productData) {
        return `Você é um assistente de vendas experiente e especializado no produto "${productData.title}".

INFORMAÇÕES DO PRODUTO:
- Título: ${productData.title}
- Descrição: ${productData.description}
- Preço: ${productData.price}
- Benefícios: ${productData.benefits.join(', ')}
- Depoimentos: ${productData.testimonials.join(' | ')}
- Call-to-Action: ${productData.cta}

INSTRUÇÕES:
1. Responda APENAS sobre este produto específico
2. Seja persuasivo mas honesto
3. Foque nos benefícios e resultados
4. Use linguagem amigável e profissional
5. Incentive a ação (compra) quando apropriado
6. Se não souber algo específico, seja honesto
7. Mantenha respostas concisas (máximo 3 parágrafos)

Responda às perguntas do cliente com base nessas informações.`;
    }

    generateFallbackResponse(userMessage, productData) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custa')) {
            return `O investimento para adquirir "${productData.title}" é ${productData.price}. É um valor muito justo considerando todos os benefícios que você vai receber: ${productData.benefits.slice(0, 2).join(' e ')}. ${productData.cta}!`;
        }
        
        if (lowerMessage.includes('benefício') || lowerMessage.includes('vantagem') || lowerMessage.includes('o que')) {
            return `Os principais benefícios de "${productData.title}" são: ${productData.benefits.join(', ')}. ${productData.description} Não perca essa oportunidade!`;
        }
        
        if (lowerMessage.includes('funciona') || lowerMessage.includes('como')) {
            return `"${productData.title}" funciona de forma simples e eficaz. ${productData.description} Você terá acesso a: ${productData.benefits.slice(0, 3).join(', ')}. ${productData.cta} e comece a ver resultados!`;
        }
        
        if (lowerMessage.includes('garantia') || lowerMessage.includes('seguro')) {
            return `Sim! "${productData.title}" oferece total garantia de satisfação. ${productData.testimonials[0]} Você pode adquirir com total segurança. ${productData.cta}!`;
        }
        
        // Resposta padrão
        return `"${productData.title}" é realmente incrível! ${productData.description} Os principais benefícios incluem: ${productData.benefits.slice(0, 2).join(' e ')}. ${productData.testimonials[0]} ${productData.cta} e transforme seus resultados!`;
    }
}

// Instância do cliente OpenRouter
const openRouterClient = new OpenRouterClient(OPENROUTER_API_KEY);

// Cache para dados de produtos (evitar re-extrações desnecessárias)
const productCache = new Map();

/**
 * Rota principal do chatbot
 */
app.get('/chatbot', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ 
            error: 'URL da página de vendas é obrigatória' 
        });
    }

    try {
        // Verificar cache primeiro
        let productData = productCache.get(url);
        
        if (!productData) {
            // Extrair dados da página
            productData = await PageDataExtractor.extractPageData(url);
            
            // Armazenar no cache por 1 hora
            productCache.set(url, productData);
            setTimeout(() => productCache.delete(url), 3600000);
        }

        // Renderizar página do chatbot
        res.send(generateChatbotHTML(productData));
        
    } catch (error) {
        console.error('Erro no chatbot:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * API para enviar mensagens ao chatbot
 */
app.post('/api/chat', async (req, res) => {
    const { message, productUrl } = req.body;
    
    if (!message || !productUrl) {
        return res.status(400).json({ 
            error: 'Mensagem e URL do produto são obrigatórias' 
        });
    }

    try {
        // Obter dados do produto (do cache ou extrair)
        let productData = productCache.get(productUrl);
        
        if (!productData) {
            productData = await PageDataExtractor.extractPageData(productUrl);
            productCache.set(productUrl, productData);
        }

        // Gerar resposta usando OpenRouter
        const response = await openRouterClient.generateResponse(
            '', // prompt não usado nesta versão
            message,
            productData
        );

        res.json({
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erro na API de chat:', error);
        res.status(500).json({ 
            error: 'Erro ao processar mensagem' 
        });
    }
});

/**
 * Gerar HTML da interface do chatbot
 */
function generateChatbotHTML(productData) {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat - ${productData.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-container {
            width: 100%;
            max-width: 400px;
            height: 600px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .chat-header h1 {
            font-size: 18px;
            margin-bottom: 5px;
        }
        
        .chat-header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
        }
        
        .message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }
        
        .message.user {
            justify-content: flex-end;
        }
        
        .message.bot {
            justify-content: flex-start;
        }
        
        .message-content {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .message.user .message-content {
            background: #007bff;
            color: white;
        }
        
        .message.bot .message-content {
            background: white;
            color: #333;
            border: 1px solid #e9ecef;
        }
        
        .chat-input {
            padding: 20px;
            background: white;
            border-top: 1px solid #e9ecef;
        }
        
        .input-group {
            display: flex;
            gap: 10px;
        }
        
        .input-group input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
        }
        
        .input-group input:focus {
            border-color: #007bff;
        }
        
        .input-group button {
            padding: 12px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }
        
        .input-group button:hover {
            background: #0056b3;
        }
        
        .input-group button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .typing-indicator {
            display: none;
            padding: 12px 16px;
            background: white;
            border-radius: 18px;
            border: 1px solid #e9ecef;
            max-width: 80%;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: #999;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }
        
        .welcome-message {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #1565c0;
        }
        
        @media (max-width: 480px) {
            .chat-container {
                height: 100vh;
                border-radius: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>💬 Assistente de Vendas</h1>
            <p>Tire suas dúvidas sobre o produto</p>
        </div>
        
        <div class="chat-messages" id="chatMessages">
            <div class="welcome-message">
                <strong>👋 Olá!</strong><br>
                Sou seu assistente especializado em "<strong>${productData.title}</strong>". 
                Estou aqui para esclarecer todas as suas dúvidas sobre este produto incrível!
                <br><br>
                <strong>Pergunte sobre:</strong> preço, benefícios, como funciona, garantias, etc.
            </div>
            
            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
        
        <div class="chat-input">
            <div class="input-group">
                <input 
                    type="text" 
                    id="messageInput" 
                    placeholder="Digite sua pergunta..."
                    maxlength="200"
                >
                <button id="sendButton">Enviar</button>
            </div>
        </div>
    </div>

    <script>
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const typingIndicator = document.getElementById('typingIndicator');
        
        const productUrl = '${productData.url}';
        
        // Função para adicionar mensagem ao chat
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user' : 'bot'}\`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = content;
            
            messageDiv.appendChild(contentDiv);
            chatMessages.insertBefore(messageDiv, typingIndicator);
            
            // Scroll para a última mensagem
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Função para mostrar/esconder indicador de digitação
        function showTyping(show = true) {
            typingIndicator.style.display = show ? 'block' : 'none';
            if (show) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
        
        // Função para enviar mensagem
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;
            
            // Adicionar mensagem do usuário
            addMessage(message, true);
            messageInput.value = '';
            sendButton.disabled = true;
            
            // Mostrar indicador de digitação
            showTyping(true);
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        productUrl: productUrl
                    })
                });
                
                const data = await response.json();
                
                // Esconder indicador de digitação
                showTyping(false);
                
                if (response.ok) {
                    // Adicionar resposta do bot
                    addMessage(data.response);
                } else {
                    addMessage('Desculpe, ocorreu um erro. Tente novamente.');
                }
                
            } catch (error) {
                console.error('Erro:', error);
                showTyping(false);
                addMessage('Desculpe, não consegui processar sua mensagem. Tente novamente.');
            }
            
            sendButton.disabled = false;
            messageInput.focus();
        }
        
        // Event listeners
        sendButton.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Focar no input ao carregar
        messageInput.focus();
        
        // Sugestões de perguntas iniciais
        setTimeout(() => {
            const suggestions = [
                'Qual é o preço?',
                'Quais são os benefícios?',
                'Como funciona?',
                'Tem garantia?'
            ];
            
            const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            messageInput.placeholder = \`Ex: "\${randomSuggestion}"\`;
        }, 3000);
    </script>
</body>
</html>
    `;
}

// Rota de status
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        version: '6.0',
        timestamp: new Date().toISOString(),
        cache_size: productCache.size
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Automaclick Chatbot Server v6.0 rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}/chatbot?url=https://exemplo.com`);
    console.log(`🔑 Configure sua chave OpenRouter na variável OPENROUTER_API_KEY`);
});

module.exports = app;

