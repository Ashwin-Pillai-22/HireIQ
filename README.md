# HireIQ - AI-Powered Interview Preparation

A modern web application for interview preparation with AI-powered mock interviews and resume analysis.

## Features

- 🔐 **Firebase Authentication** - Secure user authentication with email/password
- 📊 **Firestore Integration** - User profiles and interview statistics stored in Firestore
- 🎯 **AI Mock Interviews** - Practice with AI interviewers
- 📄 **Resume Analysis** - Get feedback on your resume
- 👤 **User Profiles** - View interview statistics and manage profile
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.8+
- Firebase project

### 1. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Enable Firestore Database
4. Create a service account and download the key file (for backend)
5. Get your Firebase config from Project Settings (for frontend)

### 2. Frontend Setup

1. Install dependencies:
   ```bash
   cd hireIQ
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Test Firestore integration:
   - Sign up a new user
   - Complete a mock interview
   - Check user profile for updated statistics

### 3. Backend Setup

1. Install Python dependencies:
   ```bash
   cd hireiq-backend
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env`:
   ```
   API_KEY=your_api_key
   DB_KEY=path_to_firebase_service_account.json
   ```

3. Start the backend server:
   ```bash
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

## Project Structure

```
hireIQ/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth)
│   ├── lib/           # Utilities and Firebase config
│   ├── pages/         # Page components
│   └── ...
hireiq-backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Configuration and security
│   ├── db/            # Database connections
│   ├── models/        # Data models
│   └── services/      # Business logic
└── ...
```

## Authentication Flow

1. Users sign up/login via Firebase Authentication
2. Protected routes redirect unauthenticated users to `/auth`
3. Auth state is managed globally via React Context
4. User info is displayed in the navigation bar

## API Endpoints

- `POST /api/interview/start` - Start a new interview
- `POST /api/interview/interviews/{session_id}/answer` - Submit answer
- `GET /api/interview/interviews/{session_id}/result` - Get final results
- `GET /api/interview/interviews/{session_id}/questions/{question_id}` - Get question feedback

## Database Schema

### Firestore Collections

#### `users` Collection
```json
{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLoginAt": "2024-01-01T00:00:00.000Z",
  "interviewStats": {
    "totalInterviews": 5,
    "completedInterviews": 4,
    "averageScore": 75.5
  },
  "preferences": {
    "theme": "light",
    "notifications": true
  }
}
```

#### `interviews` Collection (Backend)
- Managed by the Python backend
- Contains interview sessions and questions

## User Features

- **Profile Management**: Update display name and view account information
- **Interview Statistics**: Track total interviews, completion rate, and average scores
- **Authentication State**: Persistent login across sessions
- **Protected Routes**: All app features require authentication

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** FastAPI, Python, Firebase
- **Database:** Firestore
- **Authentication:** Firebase Auth
- **AI:** Ollama (Llama models)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Testing Firestore Integration

You can test the Firestore integration by importing the test functions:

```typescript
import { testFirestoreConnection, testAuthenticatedUser } from '@/lib/firestoreTest';

// Test basic Firestore operations
await testFirestoreConnection();

// Test with authenticated user
await testAuthenticatedUser('user@example.com', 'password');
```

## License

MIT License