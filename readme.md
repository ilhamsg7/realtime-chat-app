# Realtime Chat Application

A real-time chat application built with Ruby on Rails backend and React + Vite frontend.

## Backend Setup (Rails)

### Prerequisites
- Ruby version 3.4.4
- Rails version 8.0.2
- PostgreSQL

### Installation

1. Navigate to backend directory
```bash
cd backend-side
```

2. Install dependencies
```bash
bundle install
```

3. Database setup
```bash
rails db:create
rails db:migrate
```

4. Start the Rails server
```bash
rails server
```

or

```bash
rails s
```

The backend will run on `http://localhost:3000`

## Frontend Setup (React + Vite)

### Prerequisites
- Bun 1.0 or higher
- Node.js 18+ (for Vite)

### Installation

1. Navigate to frontend directory
```bash
cd frontend-side
```

2. Install dependencies using Bun
```bash
bun install
```

3. Start the development server
```bash
bun run dev
```

The frontend will run on `http://localhost:5174`

## Features
- Real-time chat using WebSocket
- Multiple chat rooms
- Dark mode support
- Responsive design

## Tech Stack
### Backend
- Ruby on Rails
- ActionCable for WebSocket
- PostgreSQL database
- Rack CORS for handling CORS

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Native WebSocket client
