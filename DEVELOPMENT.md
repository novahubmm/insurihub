# InsuriHub Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- PostgreSQL 15+ (or Docker)
- Redis 7+ (or Docker)

### Setup

1. **Run the setup script:**
```bash
./setup.sh
```

2. **Or manual setup:**
```bash
# Install dependencies
npm install

# Copy environment files
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local

# Start database (Docker)
docker-compose up -d postgres redis

# Setup database
cd packages/database
npx prisma generate
npx prisma db push
cd ../..

# Start development
npm run dev
```

## 🏗️ Project Structure

```
insurihub/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App router pages
│   │   │   ├── components/  # React components
│   │   │   ├── contexts/    # React contexts
│   │   │   ├── lib/         # Utilities and API
│   │   │   └── types/       # TypeScript types
│   │   └── public/          # Static assets
│   └── api/                 # Express.js backend
│       ├── src/
│       │   ├── routes/      # API routes
│       │   ├── middleware/  # Express middleware
│       │   ├── socket/      # Socket.IO handlers
│       │   └── scripts/     # Database seeds, etc.
│       └── uploads/         # File uploads
├── packages/
│   ├── database/            # Prisma schema
│   ├── ui/                  # Shared UI components
│   └── types/               # Shared TypeScript types
└── docker/                  # Docker configurations
```

## 🛠️ Development Commands

### Root Level
```bash
# Install all dependencies
npm install

# Start all services
npm run dev

# Build all apps
npm run build

# Run linting
npm run lint

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:studio     # Open Prisma Studio
```

### Web App (apps/web)
```bash
cd apps/web

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

### API Server (apps/api)
```bash
cd apps/api

# Development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Database seed
npm run db:seed
```

## 🔧 Environment Configuration

### Main Environment (.env)
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/insurihub"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# API
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH="./uploads"

# Token System
DEFAULT_POST_TOKEN_COST=10
DEFAULT_FILE_TOKEN_COST_PER_KB=1
```

### Web App Environment (apps/web/.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 🗄️ Database Management

### Prisma Commands
```bash
# Generate client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create and run migrations
npx prisma migrate dev

# Open database browser
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
```

### Database Schema
The database schema is defined in `packages/database/schema.prisma`. Key models:
- **User**: Authentication and user data
- **Post**: Social media posts with approval workflow
- **Message**: Real-time chat messages
- **TokenTransaction**: Token purchase and usage tracking
- **AgentPackage**: Subscription packages for agents

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/:id/comments` - Get post comments

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/messages` - Send message
- `GET /api/chat/:id/messages` - Get chat messages

### Admin
- `GET /api/admin/posts/pending` - Get pending posts
- `POST /api/admin/posts/:id/approve` - Approve post
- `POST /api/admin/posts/:id/reject` - Reject post

## 🔄 Real-time Features

### Socket.IO Events

**Client to Server:**
- `join-chat` - Join chat room
- `send-message` - Send message
- `typing-start` - Start typing indicator
- `like-post` - Like/unlike post

**Server to Client:**
- `new-message` - New message received
- `user-online` - User came online
- `user-typing` - User is typing
- `post-like-updated` - Post like count updated

## 🎨 UI Components

### Design System
- **Colors**: Gold (#f59e0b) and Green (#10b981) theme
- **Typography**: Inter (body) and Poppins (headings)
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icons

### Component Structure
```
components/
├── ui/                 # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── LoadingSpinner.tsx
├── auth/              # Authentication components
├── dashboard/         # Dashboard components
├── landing/           # Landing page components
└── chat/              # Chat components
```

## 📱 Mobile Development

### PWA Features
- Service worker for offline support
- Web app manifest for installation
- Push notifications
- Responsive design (mobile-first)

### React Native (Future)
The project structure supports React Native development:
```bash
# Future mobile app
apps/mobile/           # React Native app
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# Production build
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Build applications: `npm run build`
2. Setup PostgreSQL and Redis
3. Run database migrations: `npx prisma migrate deploy`
4. Start API server: `cd apps/api && npm start`
5. Start web server: `cd apps/web && npm start`
6. Configure Nginx reverse proxy

## 🧪 Testing

### Unit Tests
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run Playwright tests
npm run test:e2e
```

## 🔍 Debugging

### API Debugging
- Use `console.log` or debugger in API routes
- Check logs: `docker-compose logs api`
- Database queries: Enable Prisma logging

### Frontend Debugging
- React DevTools browser extension
- Next.js built-in debugging
- Network tab for API calls

### Socket.IO Debugging
- Enable debug mode: `DEBUG=socket.io:* npm run dev`
- Use Socket.IO admin UI for monitoring

## 📊 Performance

### Optimization Tips
- Use React Query for API caching
- Implement image optimization with Next.js
- Use Redis for session caching
- Enable gzip compression in Nginx

### Monitoring
- Add logging with Winston
- Use Prisma query optimization
- Monitor with tools like New Relic or DataDog

## 🔐 Security

### Best Practices
- JWT token expiration and refresh
- Input validation with Joi
- Rate limiting with Redis
- CORS configuration
- Helmet.js security headers
- File upload validation

### Environment Security
- Never commit `.env` files
- Use strong JWT secrets
- Enable HTTPS in production
- Regular dependency updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)