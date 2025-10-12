# 🥋 The Dojo Lab

[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://web-dojolab.vercel.app)

O **The Dojo Lab** é um sistema web de **gamificação com avaliação de alunos**, voltado para professores e gestores que desejam tornar o processo de ensino mais dinâmico, justo e envolvente.  
O projeto está em constante evolução: atualmente na versão **2.3**, com a **v3** já em planejamento 🚀.

## 🔗 Acesso

👉 [**web-dojolab.vercel.app**](https://web-dojolab.vercel.app)

---

## 🧩 Que recursos são utilizados?
✅ Código aberto no **GitHub**
✅ Hospedagem automática no **Vercel**  
✅ Banco de dados em tempo real com **Firebase**  

---

## ✨ Funcionalidades Atuais (v2.3)

- 📋 **Cadastro (CRUD)** de:
  - Alunos
  - Turmas
  - Equipes
  - Insígnias
  - Atividades
- ☁️ **Armazenamento** de entidades e dados no **Firebase**.
- 📥 **Importação de arquivo CSV** para cadastro em lote de alunos.
- ⏱️ **Atividades cronometradas**.
- 📑 **Status de atividades** e possibilidade de **criar cópias**.
- 🎯 **Critérios de avaliação** configuráveis:
  - Individual / Equipe
  - Inteiro / Booleano
  - Com **peso avaliativo** (1 a 5).
- 🔎 **Filtros e ordenação** avançados.
- 🏆 **Pódio dinâmico** com suporte a empates.
- 📊 Armazenamento e visualização dos **resultados das atividades**.
- 🖼️ **Atividades com imagens.**
- 🌟 **Descrição da atividade com HTML/CSS/JS**
- 🛠️ **Toolbar de edição formatada** (rich text) para descrição de atividades.
- 🎶 **Alarme sonoro** para atividades cronometradas.  
- 📅 **Calendário de atividades** integrado.  
- 🏷️ **Tags** em atividades

---

## 🚀 Próximas Funcionalidades (v2.3)

- 📈 **KPIs** para avaliação e relatórios de desempenho de alunos.  
- 📝 **Registros de ocorrências** e observações individuais.  


## 🐞 Correções de bugs e Melhorias a fazer
- 🔃 **Ordenação correta pelo nome das turmas**
- ⛵ **Navbar sempre no topo**
- 🎨 **Melhora visual dos formulários**

---

## 🛠️ Tecnologias

- **Código aberto no:** [Github](https://github.com/)  
- **Frontend:** [React](https://reactjs.org/) + [Next.js](https://nextjs.org/)  
- **Backend & Database:** [Firebase](https://firebase.google.com/)  
- **Hospedagem:** [Vercel](https://vercel.com/)  

---

# 🧩 Dojo Lab

**Dojo Lab** é uma plataforma interativa para criação de atividades de robótica e pensamento computacional com recursos de gamificação, editor de texto rico e páginas interativas com HTML, CSS e JavaScript.

O sistema permite que professores e alunos criem, editem e executem atividades diretamente no navegador — sem precisar instalar softwares adicionais.

---

# 🚀 Como utilizar:
## 🧠 Pré-requisitos

Antes de começar, você precisa ter:

- 🧰 Uma conta no [GitHub](https://github.com/)
- ☁️ Uma conta no [Vercel](https://vercel.com/signup)
- 🔥 Uma conta no [Firebase Console](https://console.firebase.google.com/)

*(Todas gratuitas e com login Google disponível)*

---

## 🪄 Passo a passo de instalação

### 1️⃣ Faça o fork do repositório

1. Vá até a página do projeto no GitHub:  
   👉 [https://github.com/seu-usuario/web-dojolab](https://github.com/seu-usuario/web-dojolab)
2. Clique em **“Fork”** (canto superior direito).
3. Isso criará uma cópia do projeto na sua conta GitHub.

---

### 2️⃣ Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e clique em **“Adicionar projeto”**.
2. Dê um nome ao projeto, por exemplo: `dojo-lab`.
3. No painel do projeto:
   - Clique em **Firestore Database** → **Criar Banco de Dados** → escolha **modo de teste**.
   - Clique em **Configurações ⚙️ > Configurações do projeto > Suas aplicações** e selecione **Web**.
4. Copie o código de configuração gerado, algo como:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "dojo-lab.firebaseapp.com",
     projectId: "dojo-lab",
     storageBucket: "dojo-lab.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456"
   };
5. Guarde esse código — você vai precisar no próximo passo.

### 3️⃣ Configure as variáveis de ambiente no Vercel
1. Acesse [Vercel]https://vercel.com/dashboard
2. Clique em “Add New Project” → selecione o seu fork web-dojolab.
3. Antes do deploy, clique em “Environment Variables” e adicione as chaves abaixo (com os valores do Firebase):
```
+------------------------------------------+-------------------------+
| Nome da Variável (Next.js)               | Valor (Copiado do F.C.) |
+------------------------------------------+-------------------------+
| NEXT_PUBLIC_FIREBASE_API_KEY             | apiKey                  |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         | authDomain              |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID          | projectId               |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      | storageBucket           |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | messagingSenderId       |
| NEXT_PUBLIC_FIREBASE_APP_ID              | appId                   |
+------------------------------------------+-------------------------+
```
4. Clique em Deploy 🎉
💡 Após o primeiro deploy, o Vercel cria um link como https://seu-nome.vercel.app/.

### 4️⃣ Teste o sistema localmente (opcional)
Se quiser rodar localmente antes de publicar:
Para isto, você precisará ter instalado o [Git](https://git-scm.com/)

```

# No terminal, clone o seu fork
git clone https://github.com/SEU_USUARIO/web-dojolab.git

cd web-dojolab

# Instale as dependências
npm install

# Crie um arquivo .env.local e adicione as variáveis do Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Rode o servidor local
npm run dev

```

5️⃣ **Personalize seu Dojo Lab ✨**
Você pode editar os seguintes diretórios:
```
+------------------------------+----------------------------------------------------------+
| Pasta/Arquivo             | Descrição                                                   |
+------------------------------+----------------------------------------------------------+
| /app/components/          | Componentes reutilizáveis do sistema (ex: editor, timer,    |
|                           | modais)                                                     |
| /app/pages/               | Páginas principais do app (home, atividades, etc.)          |
| /public/backgrounds/      | Imagens usadas como planos de fundo das fases               |
| /public/fonts/            | Fontes personalizadas (TTF, OTF)                            |
| /app/lib/firebase.ts      | Inicialização e configuração do Firebase                    |
+---------------------------+-------------------------------------------------------------+
```
🎨 **Recursos visuais**

Fontes Google e locais (TTF/OTF)
Páginas interativas com HTML + JS (modo “interactive”)
Animações suaves com Framer Motion
Ícones com Lucide e Heroicons
Estilos com TailwindCSS

🧑‍💻 **Stack técnica**
```
+---------------------------+---------------------------------------+
| Recurso                   | Tecnologia                            |
+---------------------------+---------------------------------------+
| Front-end                 | Next.js 15 + React 19                 |
| Estilização               | Tailwind CSS 3                        |
| Animações                 | Framer Motion                         |
| Editor de texto           | Tiptap (com suporte a HTML interativo)|
| Banco de dados            | Firebase Firestore                    |
| Deploy                    | Vercel                                |
| Versionamento             | GitHub                                |
+---------------------------+---------------------------------------+
```
---

## 📌 Status do Projeto

- Versão atual: **2.3**  
- Próxima milestone: **2.4** (em desenvolvimento)

---

## 🤝 Contribuição

Contribuições são muito bem-vindas!  
Você pode:
1. Fazer um fork do repositório  
2. Criar uma branch (`git checkout -b minha-feature`)  
3. Commitar suas alterações (`git commit -m 'feat: Minha nova feature'`)  
4. Submeter um Pull Request 🎉  

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

💡 *The Dojo Lab — transformando o aprendizado em uma jornada de evolução.*
