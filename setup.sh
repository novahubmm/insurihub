#!/bin/bash

# InsuriHub Development Setup Script
echo "🚀 Setting up InsuriHub development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_success "npm $(npm -v) detected"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed successfully"

# Setup environment files
print_status "Setting up environment files..."

# Copy web environment file
if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.local.example apps/web/.env.local
    print_success "Created apps/web/.env.local"
else
    print_warning "apps/web/.env.local already exists"
fi

# Copy main environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created .env file"
else
    print_warning ".env file already exists"
fi

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    print_success "Docker and Docker Compose detected"
    
    # Ask user if they want to use Docker
    echo ""
    read -p "Do you want to start the database with Docker? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Starting PostgreSQL and Redis with Docker..."
        
        # Start only database services
        docker-compose up -d postgres redis
        
        if [ $? -eq 0 ]; then
            print_success "Database services started successfully"
            
            # Wait for database to be ready
            print_status "Waiting for database to be ready..."
            sleep 10
            
            # Setup database
            print_status "Setting up database..."
            cd packages/database
            npx prisma generate
            npx prisma db push
            
            if [ $? -eq 0 ]; then
                print_success "Database setup completed"
            else
                print_error "Database setup failed"
            fi
            
            cd ../..
        else
            print_error "Failed to start database services"
        fi
    else
        print_warning "Skipping Docker setup. Make sure you have PostgreSQL and Redis running locally."
        print_status "Default connection strings:"
        print_status "PostgreSQL: postgresql://postgres:postgres123@localhost:5432/insurance_connect"
        print_status "Redis: redis://localhost:6379"
    fi
else
    print_warning "Docker not found. You'll need to setup PostgreSQL and Redis manually."
    print_status "Required services:"
    print_status "- PostgreSQL 15+"
    print_status "- Redis 7+"
fi

# Create uploads directory
print_status "Creating uploads directory..."
mkdir -p uploads
print_success "Uploads directory created"

# Generate Prisma client
print_status "Generating Prisma client..."
cd packages/database
npx prisma generate
cd ../..
print_success "Prisma client generated"

# Final instructions
echo ""
print_success "🎉 Setup completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Update the .env file with your database credentials if needed"
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "3. Or start individual services:"
echo "   # API server"
echo "   cd apps/api && npm run dev"
echo ""
echo "   # Web app"
echo "   cd apps/web && npm run dev"
echo ""
print_status "The application will be available at:"
print_status "- Web App: http://localhost:3000"
print_status "- API: http://localhost:3001"
print_status "- Database Studio: npm run db:studio"
echo ""
print_warning "Make sure to update the JWT_SECRET in .env before production!"
echo ""
print_success "Happy coding! 🚀"