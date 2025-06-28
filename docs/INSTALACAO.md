# 🚀 Guia de Instalação - Automaclick v6.0 com IA

**Bem-vindo ao futuro da automação de vendas!** Este guia detalha o passo a passo para instalar e configurar o Automaclick v6.0, a versão com chatbot conversacional autônomo integrado via OpenRouter.

## 🎯 Pré-requisitos Essenciais

Antes de começar, garanta que você tenha os seguintes itens:

1.  **Node.js 14+:** Essencial para rodar o servidor backend. [Baixe aqui](https://nodejs.org/)
2.  **Conta Gratuita no OpenRouter:** Para acessar os modelos de IA. [Crie sua conta](https://openrouter.ai)
3.  **Servidor para Deploy:** Um ambiente para hospedar o servidor (Render, Vercel, Railway, etc.)
4.  **Conhecimento Básico de Terminal:** Para executar os comandos de instalação.

## 📦 Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
automaclick_chatbot/
├── server.js              # Servidor Node.js principal
├── package.json           # Dependências do projeto
├── automaclick_v6.html    # Interface do gerador de links
├── README.md              # Documentação geral
└── docs/                  # Documentação detalhada
    ├── INSTALACAO.md      # Este guia
    ├── API.md             # Documentação da API
    └── DEPLOY.md          # Guia de deploy
```

## 🛠️ Passo a Passo da Instalação

### **Passo 1: Obter os Arquivos do Projeto**

Primeiro, você precisa baixar ou clonar os arquivos do projeto para sua máquina local.

```bash
# Exemplo com Git (recomendado)
git clone https://github.com/seu-usuario/automaclick-chatbot.git
cd automaclick-chatbot
```

### **Passo 2: Instalar as Dependências do Servidor**

O servidor Node.js precisa de algumas bibliotecas para funcionar. Instale-as com o seguinte comando:

```bash
npm install
```

Este comando irá baixar e instalar `express`, `cors` e `node-fetch`.

### **Passo 3: Obter sua Chave de API do OpenRouter**

Esta é a etapa mais importante para a IA funcionar.

1.  **Acesse [openrouter.ai](https://openrouter.ai)** e faça login ou crie sua conta.
2.  No painel, vá para a seção **"Keys"** ou **"API Keys"**.
3.  Clique em **"Create Key"** para gerar uma nova chave de API.
4.  **Copie a chave gerada.** Ela será algo como `sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx`.

**⚠️ Guarde esta chave em um local seguro!**

### **Passo 4: Configurar a Variável de Ambiente**

Para que o servidor possa se autenticar no OpenRouter, você precisa configurar a chave de API como uma variável de ambiente.

**No Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="sua-chave-aqui"
```

**No macOS/Linux:**
```bash
export OPENROUTER_API_KEY="sua-chave-aqui"
```

**Dica:** Para desenvolvimento, você pode usar um arquivo `.env` com a biblioteca `dotenv` para facilitar.

### **Passo 5: Iniciar o Servidor Localmente**

Com tudo configurado, inicie o servidor para testar localmente.

```bash
npm start
```

Você deverá ver a seguinte mensagem no terminal:

```
🚀 Servidor Automaclick v6.0 rodando na porta 3000
```

Isso significa que o servidor está pronto para receber requisições.

### **Passo 6: Configurar e Usar o Frontend**

1.  **Abra o arquivo `automaclick_v6.html`** em seu navegador.
2.  No campo **"URL do Servidor Chatbot"**, mantenha `http://localhost:3000` para testes locais.
3.  Preencha os outros campos (nome do robô, página de vendas).
4.  Clique em **"Gerar Link Mágico com IA"**.
5.  Copie o link gerado e cole em uma nova aba.

Se tudo estiver correto, você será direcionado para a interface do chatbot, e a IA estará pronta para conversar!

## 🚀 Próximo Passo: Deploy em Produção

Após testar localmente, o próximo passo é hospedar seu servidor em uma plataforma online para que seus clientes possam acessá-lo de qualquer lugar.

Consulte o guia **`docs/DEPLOY.md`** para instruções detalhadas sobre como fazer o deploy em plataformas como Render, Vercel e Railway.

## 🆘 Solução de Problemas Comuns

- **"Erro ao conectar com OpenRouter"**: Verifique se a chave de API está correta e se a variável de ambiente foi configurada corretamente.
- **"Servidor não responde"**: Confirme se o servidor está rodando e se a URL no frontend está correta.
- **"Falha na extração de dados"**: A página de vendas pode ter proteção. O sistema usará dados padrão como fallback.

---

**🎉 Parabéns! Você instalou o Automaclick v6.0 com sucesso. Agora você está pronto para revolucionar suas vendas com IA conversacional!**

