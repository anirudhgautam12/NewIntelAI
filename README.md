# AI News Intelligence Platform

## Project Title
**Development of an Intelligent News Summarization and Sentiment Analysis System using NLP and Large Language Models**

This repository contains the complete backend system for the AI News Intelligence Platform major project. The system is built using a microservices architecture, containing a main web application API and an internal AI/NLP processing service.

---

## 1. High-Level Architecture

The system consists of two main services that communicate with each other using REST APIs:

```
                  React Frontend (Future, Do Not Build)
                                  │
                                  ▼
                  Node.js + Express Main Backend (Port 5000)
                    │                             │
                    ▼                             ▼
            MongoDB / Mongoose           Python FastAPI Service (Port 8000)
          (Users, Analysis, Chat)                  │
                                                   ├─► NLP Preprocessing (spaCy)
                                                   ├─► AI Summarization (BART)
                                                   ├─► Sentiment Analysis (RoBERTa)
                                                   ├─► Keyword Extraction (KeyBERT)
                                                   ├─► Entity Recognition (spaCy)
                                                   ├─► RAG Index & Query (FAISS)
                                                   ▼
                                             LLM Provider (Google Gemini API)
```

### Key Security & Architectural Boundaries
1. **Isolated Frontend Communication**: The React frontend must communicate *only* with the Node.js API gateway. It must *never* make requests directly to the Python FastAPI microservice.
2. **Internal AI Microservice**: The Python FastAPI service runs inside the firewall as an internal service. It does not directly connect to MongoDB. All data persistence and user ownership checks are handled by the Node.js backend.
3. **Lazy Singleton Model Loading**: Deep learning models (BART, RoBERTa, KeyBERT, Sentence Transformers) are loaded into memory *only when their respective endpoints are accessed for the first time*, caching the instances for subsequent requests. This keeps RAM usage low during boot (crucial for development on machines like a MacBook Air M1).

---

## 2. Microservice Responsibilities

### Node.js Main Application Backend
- **User Authentication**: Register, Login, and fetch profile endpoints (`bcryptjs` password hashing and secure JWT signing).
- **Security & Authorization**: Route protection middleware verifying JWT claims, ensuring users can only read/write their own articles and chat logs.
- **Service Integration**: Communicates with the FastAPI microservice via Axios with a customized `120000ms` (120 seconds) connection timeout to accommodate local model inference times on CPU/M1 GPU.
- **Database Storage**: Models and queries metadata, statistics, keywords, entities, summaries, and chat transcripts in MongoDB.

### Python FastAPI AI/NLP Service
- **Article Body Extraction**: Uses `trafilatura` to extract main text body and titles from submitted URLs.
- **NLP Preprocessing**: Normalizes unicode characters and uses `spaCy`'s `en_core_web_sm` to lemmatize tokens and filter punctuation and stopwords.
- **BART Summarization**: Uses Hugging Face `facebook/bart-large-cnn` to generate short, medium, and detailed summaries. Large text blocks are recursively summarized in sentence-aware chunks to fit model context windows.
- **3-Class Sentiment Classification**: Uses `cardiffnlp/twitter-roberta-base-sentiment-latest` to classify sentiment as POSITIVE, NEGATIVE, or NEUTRAL. Probability scores from long articles are chunk-averaged.
- **KeyBERT Keywords**: Extracts top 10 key phrases using a shared SentenceTransformer backend and MMR (Maximal Marginal Relevance) for diversity.
- **Named Entity Recognition**: Extracts Person, Organization, Location, GPE, Date, and Money using `spaCy` NER.
- **RAG Q&A Engine**: Indexes article chunks using `all-MiniLM-L6-v2` embeddings, retrieves top-match contexts using a local FAISS index, and queries Google Gemini API (or OpenAI) to produce a concise, context-grounded answer.

---

## 3. Core Project Flows

### Article Analysis Flow
1. User submits an article URL or raw text to `POST /api/articles/analyze` with the Authorization header.
2. Node.js backend validates payload and creates a record in MongoDB with `status: "PROCESSING"`.
3. If input is a URL, Node.js calls FastAPI `POST /api/extract-article` which fetches and returns the raw text.
4. Node.js sends the raw text to FastAPI `POST /api/analyze`.
5. FastAPI triggers its local models (BART, RoBERTa, KeyBERT, spaCy), computes word counts and ratios, and returns the full analysis payload.
6. Node.js saves results to MongoDB, updates status to `COMPLETED`, and returns the final analysis to the client. If any step fails, status is marked as `FAILED` with a safe error message.

### Retrieval-Augmented Generation (RAG) Q&A Flow
1. User submits a question about a completed article analysis to `POST /api/articles/:id/ask`.
2. Node.js validates ownership, retrieves the original article text, and calls FastAPI `POST /api/ask`.
3. FastAPI checks if a FAISS vector index exists for the given `article_id` in its local directory.
4. If missing, it chunk-splits the text, embeds chunks using Sentence Transformers, builds and writes a FAISS index, and saves chunk texts to a JSON file.
5. FastAPI embeds the user question, retrieves the top 3 similar chunks, and formats a context-aware prompt.
6. The prompt is sent to Google Gemini (or OpenAI) instructing the model to answer *only* from context. If not found in context, it returns `"The information is not available in the article."`.
7. Node.js saves the user's question, answer, and sources into MongoDB as a `ChatMessage`, returning the message to the client.

---

## 4. Setup and Run Guide

For installation commands, virtual environments, and starting up both services, please refer to the respective README files:
- **Node.js Main Backend**: [backend/README.md](file:///Users/anirudhgautam/Downloads/Codinglearning/Devanshi's%20genai%20project/backend/README.md)
- **AI/NLP Microservice**: [ai-service/README.md](file:///Users/anirudhgautam/Downloads/Codinglearning/Devanshi's%20genai%20project/ai-service/README.md)
