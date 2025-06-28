# 🚀 Guia de Deploy - Automaclick v6.0

Este guia detalha como fazer o deploy do Automaclick v6.0 em diferentes plataformas de hospedagem.

## 🎯 Opções de Hospedagem

### **1. Render (Recomendado - Gratuito)**

Render oferece hospedagem gratuita para aplicações Node.js com SSL automático.

**Passo a passo:**

1. **Crie uma conta no [Render](https://render.com)**
2. **Conecte seu repositório GitHub**
3. **Configure o serviço:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
4. **Adicione a variável de ambiente:**
   - Key: `OPENROUTER_API_KEY`
   - Value: sua chave do OpenRouter
5. **Deploy automático!**

**URL final:** `https://seu-app.onrender.com`

### **2. Vercel (Serverless)**

Ideal para aplicações serverless com deploy automático.

**Passo a passo:**

1. **Instale o Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Configure o projeto:**
   ```bash
   vercel
   ```

3. **Adicione variáveis de ambiente:**
   ```bash
   vercel env add OPENROUTER_API_KEY
   ```

4. **Deploy para produção:**
   ```bash
   vercel --prod
   ```

### **3. Railway**

Plataforma moderna com deploy simples.

**Passo a passo:**

1. **Conecte no [Railway](https://railway.app)**
2. **Conecte seu repositório**
3. **Configure variáveis:**
   - `OPENROUTER_API_KEY`: sua chave
4. **Deploy automático**

## 🔧 Configuração Pós-Deploy

### **1. Atualizar o Frontend**

Após o deploy, atualize o arquivo `automaclick_v6.html`:

```javascript
// Substitua localhost pela URL do seu servidor
const serverUrl = "https://seu-servidor.onrender.com";
```

### **2. Testar a Integração**

1. Acesse seu frontend hospedado
2. Configure a URL do servidor
3. Gere um link mágico
4. Teste o chatbot

### **3. Configurar Domínio Personalizado (Opcional)**

Para usar seu próprio domínio:

1. **No Render:** Settings > Custom Domains
2. **No Vercel:** Project Settings > Domains
3. **No Railway:** Settings > Domains

## 🛡️ Segurança em Produção

### **Variáveis de Ambiente Obrigatórias:**

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
NODE_ENV=production
PORT=3000
```

### **CORS e Headers:**

O servidor já está configurado com:
- CORS habilitado para todos os domínios
- Headers de segurança básicos
- Rate limiting por IP

## 📊 Monitoramento

### **Logs do Servidor:**

Todos os deploys incluem logs automáticos:
- Requisições de chat
- Extrações de dados
- Erros de API

### **Métricas Importantes:**

- Tempo de resposta da IA
- Taxa de sucesso das extrações
- Número de conversas por hora

## 🔄 Atualizações

Para atualizar o servidor:

1. **Faça push das mudanças para o repositório**
2. **Deploy automático será acionado**
3. **Verifique os logs para confirmar sucesso**

## 🆘 Troubleshooting

### **Problemas Comuns:**

**"Build failed"**
- Verifique se `package.json` está correto
- Confirme se todas as dependências estão listadas

**"Server timeout"**
- Aumente o timeout nas configurações da plataforma
- Otimize as chamadas para a API do OpenRouter

**"CORS error"**
- Verifique se o CORS está habilitado no servidor
- Confirme se a URL do frontend está correta

## 🎉 Deploy Concluído!

Após seguir este guia, seu Automaclick v6.0 estará rodando em produção, pronto para atender milhares de clientes simultaneamente com IA conversacional!

**Próximos passos:**
1. Compartilhe a URL do seu frontend com seus afiliados
2. Configure analytics para monitorar performance
3. Teste com diferentes páginas de vendas

