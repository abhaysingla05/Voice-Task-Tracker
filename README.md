# Voice-Enabled Task Tracker

A full-stack task management application that allows users to create tasks using natural language voice commands.

## 1. Project Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- No external API keys required (uses native Web Speech API and local parsing)

### Installation Steps

#### Backend
1. Navigate to the backend directory:
   cd backend

2. Install dependencies:
   npm install

3. Configure Environment Variables:
   Create a .env file in the backend directory with the following content:
   PORT=5000
   DATABASE_URL="file:./dev.db"

4. Run Database Migrations:
   npx prisma migrate dev --name init

5. Start the Server:
   npm run dev

The backend will run on http://localhost:5000.

#### Frontend
1. Open a new terminal and navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the Development Server:
   npm run dev

The frontend will run on http://localhost:5173.

### Seed Data
No seed data script is required. The database is initialized empty. You can create tasks immediately using the UI.

## 2. Tech Stack

### Frontend
- React (Vite)
- TailwindCSS (Styling)
- Zustand (State Management)
- @hello-pangea/dnd (Drag and Drop)
- Web Speech API (Voice Recognition)

### Backend
- Node.js & Express
- SQLite (Database)
- Prisma ORM
- chrono-node (Natural Language Date Parsing)

## 3. API Documentation

### GET /tasks
Fetch all tasks. Supports filtering and searching.
- Query Parameters:
  - status: 'todo', 'in-progress', 'done'
  - priority: 'low', 'medium', 'high'
  - search: string (matches title or description)
- Response: Array of Task objects

### POST /tasks
Create a new task.
- Body:
  {
    "title": "Buy milk",
    "priority": "high",
    "status": "todo",
    "dueDate": "2023-12-25T10:00:00.000Z"
  }
- Response: Created Task object

### PUT /tasks/:id
Update an existing task.
- Body: Same as POST
- Response: Updated Task object

### DELETE /tasks/:id
Delete a task.
- Response: { "message": "Task deleted successfully" }

### POST /parse-voice
Parse raw voice transcript into structured data.
- Body: { "transcript": "Buy milk tomorrow high priority" }
- Response:
  {
    "title": "Buy milk",
    "priority": "high",
    "dueDate": "2023-12-06T12:00:00.000Z",
    "status": "todo"
  }

## 4. Decisions & Assumptions

### Design Decisions
- SQLite: Chosen for simplicity and ease of local setup. No external database server is required, making the project easy to review.
- Web Speech API: Used the browser's native API instead of a paid service like OpenAI Whisper to keep the project cost-free and privacy-focused.
- Local Parsing (chrono-node): Implemented a deterministic parsing logic using chrono-node and Regex instead of an LLM. This ensures instant response times and reliability for date/time extraction.
- Zustand: Selected over Redux for frontend state management due to its minimal boilerplate and simplicity for this scale of application.

### Assumptions
- The user grants microphone permissions to the browser.
- Voice commands follow a general structure of "Task description + time + priority", although the parser is robust enough to handle variations.
- The application is intended for single-user local use (no authentication implemented as per requirements).
- Email configuration is not applicable to this specific implementation as it focuses on the voice-enabled task management workflow.

## 5. AI Tools Usage

### Tools Used
- Google Gemini, ChatGPT

### Usage Details
- Boilerplate Generation: Used to set up the initial project structure for React (Vite) and Node.js (Express).
- Debugging: Assisted in resolving database connection issues with Prisma and SQLite (absolute path configuration).
- Documentation: Helped draft the README, implementation plan, and demo scripts.

### Notable Approaches
- The agent suggested using chrono-node as a lightweight alternative to an LLM for date parsing, which significantly reduced complexity and dependencies.
- The agent implemented a "Review Modal" workflow to allow users to verify voice parsing results before creation, mitigating potential parsing errors.
