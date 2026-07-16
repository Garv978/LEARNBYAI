# LEARNBYAI

![GitHub stars](https://img.shields.io/github/stars/Garv978/LEARNBYAI?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/Garv978/LEARNBYAI?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/Garv978/LEARNBYAI?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/Garv978/LEARNBYAI?style=for-the-badge&logo=github)

## 📑 Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Contributors](#contributors)
- [Contributing](#contributing)

# 📚 LearnWithAI

> An AI-powered learning platform that transforms PDFs into an interactive study experience using Retrieval-Augmented Generation (RAG).


## 🏗️ Architecture


A high-level view of how the main pieces fit together:

```mermaid
flowchart LR
    User["👤 User / Browser"]

    FE["🖼️ React + Vite Frontend"]

    API["🚀 Express.js API Server"]

    Auth["🔐 JWT Authentication"]

    Mongo["🍃 MongoDB"]

    Cloud["☁️ Cloudinary\n(PDF Storage)"]

    Queue["📬 BullMQ Queue"]

    Redis["⚡ Redis"]

    Worker["⚙️ Background Worker"]

    Parse["📄 PDF Parser"]

    Embed["🧠 Embedding Generator"]

    Pinecone["📌 Pinecone Vector DB"]

    OpenAI["🤖 OpenAI API"]

    User --> FE
    FE --> API

    API --> Auth
    API --> Mongo
    API --> Cloud

    API --> Queue
    Queue --> Redis
    Redis --> Worker

    Worker --> Parse
    Parse --> Embed
    Embed --> OpenAI
    Embed --> Pinecone

    FE -->|"Chat with PDF"| API
    API --> Pinecone
    API --> OpenAI
    API --> Mongo
    API --> FE
```


## ✨ Overview

LearnWithAI allows users to upload PDF documents and instantly interact with them using AI. Instead of reading hundreds of pages manually, users can:

- 💬 Chat with their PDFs
- 📝 Generate AI summaries
- 🎯 Create flashcards
- ❓ Generate quizzes
- 📖 Take smart notes

Large PDF processing is handled asynchronously using **BullMQ** and **Redis**, ensuring the application remains fast and responsive.

---

## 🚀 Features

### 📄 PDF Management

- Upload PDFs securely
- Cloudinary storage
- View uploaded PDFs
- Delete PDFs
- Processing status tracking

---

### 🤖 AI Features

- Chat with PDF using RAG
- AI-generated summaries
- Flashcard generation
- Quiz generation
- Context-aware responses
- Semantic document search

---

### 🔐 Authentication

- JWT Authentication
- Secure HTTP-only cookies
- Protected routes
- User-specific documents

---

### ⚡ Background Processing

PDF processing runs in the background:

- Text extraction
- Text chunking
- Embedding generation
- Pinecone indexing
- Status updates

This prevents long upload requests and improves scalability.

---

## 🧠 How It Works

```text
                Upload PDF
                     │
                     ▼
              Express Backend
                     │
                     ▼
        Store PDF in Cloudinary
                     │
                     ▼
          Save Metadata in MongoDB
                     │
                     ▼
          Create BullMQ Processing Job
                     │
                     ▼
               Redis Queue
                     │
                     ▼
            Background Worker
                     │
                     ▼
            Extract PDF Text
                     │
                     ▼
             Split into Chunks
                     │
                     ▼
      Generate OpenAI Embeddings
                     │
                     ▼
      Store Embeddings in Pinecone
                     │
                     ▼
          PDF Ready for Chat
```

---

## 💬 Chat Flow

```text
User Question
      │
      ▼
Generate Query Embedding
      │
      ▼
Search Similar Chunks
      │
      ▼
Retrieve Context
      │
      ▼
Send Context + Prompt
      │
      ▼
OpenAI Response
      │
      ▼
Answer Returned to User
```

---

## 🛠️ Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)


## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/Garv978/LEARNBYAI.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```
## 📦 Key Dependencies

### 🎨 Frontend

```text
react: ^19.2.7
react-dom: ^19.2.7
react-router-dom: ^7.18.1
axios: ^1.18.1
jwt-decode: ^4.0.0
lucide-react: ^1.24.0
tailwindcss: ^4.3.2
@tailwindcss/vite: ^4.3.2
```

### 🚀 Backend

```text
express
mongoose
jsonwebtoken
bcryptjs
cookie-parser
cors
dotenv
helmet
morgan
express-rate-limit
express-fileupload
cloudinary
multer
streamifier
http-status-codes
```

### 🤖 AI & RAG

```text
openai
langchain
@langchain/openai
@langchain/community
@langchain/textsplitters
@langchain/pinecone
@pinecone-database/pinecone
pdf-parse
```

### ⚡ Background Jobs

```text
bullmq
ioredis
```

### 🔍 Validation

```text
zod
```

### 🛠️ Development

```text
nodemon
eslint
vite
```

## 🚀 Available Scripts

- **dev** — `npm run dev`
- **build** — `npm run build`
- **lint** — `npm run lint`
- **preview** — `npm run preview`

## 📁 Project Structure

```
.
├── client
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── components
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pdfnavbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── index.css
│   │   ├── layouts
│   │   │   ├── PdfLayout.jsx
│   │   │   └── UserLayout.jsx
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PdfList.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   └── pdf
│   │   │       ├── Chat.jsx
│   │   │       ├── Flashcards.jsx
│   │   │       ├── Notes.jsx
│   │   │       ├── Quiz.jsx
│   │   │       └── Summary.jsx
│   │   ├── services
│   │   │   └── AuthServices.js
│   │   └── utils
│   │       └── ProtectedRoute.jsx
│   └── vite.config.js
└── server
    ├── api.js
    ├── app.js
    ├── config
    │   ├── cloudinary.js
    │   └── redis.js
    ├── controllers
    │   ├── authController.js
    │   ├── pdfController.js
    │   └── userController.js
    ├── db
    │   └── connect.js
    ├── errors
    │   ├── bad-request.js
    │   ├── custom-api.js
    │   ├── index.js
    │   ├── not-found.js
    │   ├── unauthenticated.js
    │   └── unauthorized.js
    ├── middleware
    │   ├── authentication.js
    │   ├── error-handler.js
    │   ├── not-found.js
    │   └── upload.js
    ├── models
    │   ├── Pdf.js
    │   ├── Token.js
    │   └── User.js
    ├── package.json
    ├── queues
    │   └── pdfQueue.js
    ├── routes
    │   ├── authRoutes.js
    │   ├── pdfRoutes.js
    │   └── userRoutes.js
    ├── utils
    │   ├── checkPermissions.js
    │   ├── createTokenUser.js
    │   ├── index.js
    │   ├── jwt.js
    │   └── sendEmail.js
    └── workers
        └── pdfworker.js
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

## 👥 Contributors

Thanks to everyone who has contributed to this project:

<p align="left">
<a href="https://github.com/Garv978" title="Garv978"><img src="https://avatars.githubusercontent.com/u/192967117?v=4&s=64" width="64" height="64" alt="Garv978" style="border-radius:50%" /></a>
</p>

[See the full list of contributors →](https://github.com/Garv978/LEARNBYAI/graphs/contributors)

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/Garv978/LEARNBYAI.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.

---
