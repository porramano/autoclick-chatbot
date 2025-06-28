# 📡 Documentação da API - Automaclick v6.0

Esta documentação detalha todas as rotas e endpoints disponíveis no servidor Automaclick v6.0.

## 🌐 Base URL

```
http://localhost:3000  # Desenvolvimento
https://seu-servidor.onrender.com  # Produção
```

## 📋 Endpoints Disponíveis

### **GET /status**

Verifica o status do servidor e informações básicas.

**Resposta:**
```json
{
  "status": "online",
  "version": "6.0",
  "timestamp": "2025-06-26T16:58:50.988Z",
  "cache_size": 0
}
```

### **GET /chatbot**

Carrega a interface do chatbot com IA conversacional.

**Parâmetros de Query:**
- `robot` (string): Nome do robô/assistente (ex: @VendedorIA)
- `url` (string): URL da página de vendas (URL encoded)
- `networks` (string): Redes sociais separadas por vírgula
- `v` (string): Versão do Automaclick

**Exemplo:**
```
GET /chatbot?robot=%40VendedorIA&url=https%3A%2F%2Fexemplo.com&networks=whatsapp%2Cchatbot&v=6.0
```

### **POST /chat**

Envia uma mensagem para a IA e recebe a resposta.

**Body (JSON):**
```json
{
  "message": "Qual é o preço deste curso?",
  "productData": {
    "title": "Curso de Marketing Digital",
    "description": "Aprenda marketing digital do zero",
    "price": "R$ 297,00",
    "benefits": ["Acesso vitalício", "Certificado"],
    "testimonials": ["Excelente curso!"]
  }
}
```

**Resposta:**
```json
{
  "response": "O investimento para o 'Curso de Marketing Digital' é R$ 297,00. É um valor muito justo considerando que você receberá acesso vitalício e certificado de conclusão!"
}
```

## 🔧 Modelos de IA Disponíveis

O sistema utiliza modelos gratuitos do OpenRouter:

- `mistralai/mistral-7b-instruct:free` - Rápido e eficiente
- `meta-llama/llama-3.1-8b-instruct:free` - Melhor contexto
- `anthropic/claude-3-haiku:beta` - Conversas naturais

## 🛡️ Tratamento de Erros

Todos os endpoints retornam códigos de status HTTP apropriados:

- `200` - Sucesso
- `400` - Erro de parâmetros
- `500` - Erro interno do servidor

**Exemplo de erro:**
```json
{
  "error": "Parâmetro 'robot' é obrigatório",
  "code": 400
}
```

## 📊 Cache e Performance

- Dados de produtos ficam em cache por 1 hora
- Rate limiting: 100 requisições por minuto por IP
- Timeout de resposta: 30 segundos

## 🔐 Autenticação

A API utiliza a chave do OpenRouter configurada via variável de ambiente `OPENROUTER_API_KEY`. Não é necessária autenticação adicional para os endpoints públicos.

