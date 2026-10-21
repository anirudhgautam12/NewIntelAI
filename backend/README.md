# Main Application Backend (Node.js + Express)

This service manages user authentication, stores analysis records and chat logs, enforces row-level security (ownership validation), and orchestrates requests to the FastAPI AI microservice.

---

## 1. Prerequisites
- **Node.js**: Version 18 or above.
- **MongoDB**: A running MongoDB instance locally (`mongodb://127.0.0.1:27017/ai-news-intelligence`) or a MongoDB Atlas cloud URI.

---

## 2. Installation and Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file (copy from `.env.example` if needed):
   ```bash
   cp .env.example .env
   ```

4. Verify your environment variables inside `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/ai-news-intelligence
   JWT_SECRET=ai_news_platform_major_project_secret_token_key_2026
   JWT_EXPIRES_IN=7d
   AI_SERVICE_URL=http://127.0.0.1:8000
   CLIENT_URL=http://localhost:5173
   ```

---

## 3. Running the Server

- **Development Mode** (with nodemon reload):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

---

## 4. API Endpoints Reference

All routes are prefixed with `/api`.

### Authentication Router (`/auth`)
| Method | Endpoint | Protection | Description | Payload Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Public | Register new user. Hashes password explicitly. | `{ "name": "Dev", "email": "dev@test.com", "password": "password123" }` |
| **POST** | `/auth/login` | Public | Authenticate user. Returns JWT and user profile. | `{ "email": "dev@test.com", "password": "password123" }` |
| **GET** | `/auth/me` | Protected | Fetch current user info based on JWT claims. | *(None)* |

### Article Analysis Router (`/articles`)
| Method | Endpoint | Protection | Description | Payload Body / Query params |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/articles/analyze` | Protected | Submit raw text or URL to execute NLP analysis. | `{ "inputType": "text", "articleText": "...", "summaryLength": "medium" }` or `{ "inputType": "url", "articleUrl": "https://...", "summaryLength": "medium" }` |
| **GET** | `/articles` | Protected | Retrieve paginated history of analyzed articles. Omits large text. | Supports: `?page=1`, `?limit=10`, `?sentiment=POSITIVE` (Max limit: 50) |
| **GET** | `/articles/:id` | Protected | Fetch full details of a specific analysis by ID. | *(None)* |
| **DELETE** | `/articles/:id` | Protected | Cascade delete an article and its chat messages. | *(None)* |

### Chat / Q&A Router (`/articles`)
| Method | Endpoint | Protection | Description | Payload Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/articles/:id/ask` | Protected | Ask a question about an analyzed article (RAG). | `{ "question": "What is the primary conclusion?" }` |
| **GET** | `/articles/:id/chat` | Protected | Get chronologically sorted chat history on the article. | *(None)* |

---

## 5. Security Practices
- **Password Protection**: User passwords are explicitly hashed using `bcryptjs` with salt round `10` before insertion into MongoDB. Passwords are never returned in JSON payloads (configured with `select: false` on Mongoose schema).
- **JWT Authorization**: Route protection middleware extracts the Bearer token from the `Authorization` header, decodes the signature using `JWT_SECRET`, and attaches `req.user` to the request object.
- **Row-level Access Control**: Controllers strictly use `req.user._id` to query documents, ensuring users can only read, delete, or ask questions on articles they analyzed themselves.
