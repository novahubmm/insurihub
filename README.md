# InsuriHub - Premium Insurance Social Platform

A Facebook-like social platform designed specifically for the insurance industry with premium gold/green design.

## 🚀 Features

### Core Platform
- **Social Feed**: Post insurance content with images (500 words max)
- **Token System**: Pay-per-post with admin approval
- **Real-time Chat**: One-on-one messaging with file sharing
- **Live Notifications**: Real-time updates across platform
- **Mobile-First PWA**: Works on web and mobile devices

### User Roles
- **Guest**: Read posts only
- **Customer**: Register, post content, chat, buy tokens
- **Agent**: Manage customers, CRM features (Phase 2)
- **Admin**: Approve posts, manage guru, analytics dashboard

### Premium Features
- **Gold/Green Theme**: Premium insurance-focused design
- **Smooth Animations**: Framer Motion + React Spring
- **File Sharing**: Token-based pricing by file size
- **Agent Packages**: Monthly subscriptions (Phase 2)

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **React Query** - Data fetching and caching
- **Socket.io Client** - Real-time communication

### Mobile
- **React Native** - Native mobile apps
- **Expo** - Development platform

### Backend
- **Node.js + Express** - REST API server
- **Socket.io** - Real-time features
- **JWT** - Authentication
- **Multer** - File upload handling

### Database
- **PostgreSQL** - Main database
- **Redis** - Caching and sessions
- **Prisma** - Database ORM

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PM2** - Process management

## 📱 Mobile-First Design

- Responsive design starting from 320px
- PWA capabilities with offline support
- Native mobile apps for iOS/Android
- Touch-optimized interactions

## 🎨 Design System

- **Primary**: Gold (#FFD700, #FFA500)
- **Secondary**: Green (#228B22, #32CD32)
- **Premium feel** with subtle gradients and shadows
- **Smooth animations** for all interactions

## 🚀 Getting Started

```bash
# Clone repository
git clone <repo-url>
cd insurance-connect

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run development server
npm run dev
```

## 📦 Project Structure

```
insurance-connect/
├── apps/
│   ├── web/                 # Next.js web app
│   ├── mobile/              # React Native app
│   └── api/                 # Express.js backend
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Prisma schema
│   └── types/               # Shared TypeScript types
├── docker/                  # Docker configurations
└── docs/                    # Documentation
```

## 🔄 Development Phases

### Phase 1: Core Platform
- [x] User authentication
- [x] Social feed with posts
- [x] Token system
- [x] Real-time chat
- [x] Admin dashboard
- [x] Mobile PWA

### Phase 2: Agent Features
- [ ] Agent registration
- [ ] Customer management CRM
- [ ] Insurance product integration
- [ ] Subscription packages

## 📄 License

MIT License - See LICENSE file for details