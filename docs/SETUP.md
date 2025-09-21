# Sales SaaS Application - Development Setup

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

## Quick Start with Docker

The fastest way to get started is using Docker Compose:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sales-saas-app
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - pgAdmin: http://localhost:5050 (admin@sales-saas.com / admin123)
   - Database: localhost:5432
   - Redis: localhost:6379

## Manual Setup (without Docker)

### 1. Database Setup

Install and start PostgreSQL:
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb sales_saas_dev

# Run schema
psql sales_saas_dev < database/schema.sql
psql sales_saas_dev < database/seeds.sql
```

Install and start Redis:
```bash
# macOS with Homebrew
brew install redis
brew services start redis
```

### 2. Backend Setup

```bash
cd backend
npm install
cp ../.env.example .env

# Update .env with your local database credentials

npm run dev
```

The backend will be available at http://localhost:3001

### 3. Frontend Setup

```bash
cd frontend
npm install
cp ../.env.example .env.local

# Update NEXT_PUBLIC_API_URL if needed

npm run dev
```

The frontend will be available at http://localhost:3000

## Development Workflow

### Database Migrations

To create a new migration:
```bash
cd backend
npm run migration:create -- <migration_name>
```

To run migrations:
```bash
npm run migration:run
```

To rollback migrations:
```bash
npm run migration:rollback
```

### Testing

Run backend tests:
```bash
cd backend
npm test
npm run test:watch  # for watch mode
npm run test:coverage  # for coverage report
```

Run frontend tests:
```bash
cd frontend
npm test
npm run test:watch
```

### Code Quality

Format code:
```bash
npm run format  # in backend or frontend directory
```

Lint code:
```bash
npm run lint  # in backend or frontend directory
npm run lint:fix  # to auto-fix issues
```

Type checking (TypeScript):
```bash
npm run type-check
```

## Environment Variables

Key environment variables you should customize:

### Security (REQUIRED)
- `JWT_SECRET` - Used for JWT token signing
- `REFRESH_TOKEN_SECRET` - Used for refresh tokens
- `SESSION_SECRET` - Used for session management
- `NEXTAUTH_SECRET` - Used by NextAuth.js

### Database
- `DATABASE_URL` - Full PostgreSQL connection string
- `REDIS_URL` - Redis connection string

### Email (for notifications)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `FROM_EMAIL`, `FROM_NAME`

## Project Structure

```
sales-saas-app/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── tests/               # Backend tests
│   └── package.json
├── frontend/                # Next.js React app
│   ├── components/          # React components
│   ├── pages/               # Next.js pages
│   ├── styles/              # CSS/SCSS files
│   ├── utils/               # Frontend utilities
│   └── package.json
├── database/                # Database files
│   ├── schema.sql           # Database schema
│   ├── seeds.sql            # Seed data
│   └── migrations/          # Database migrations
├── docs/                    # Documentation
├── config/                  # Configuration files
└── scripts/                 # Utility scripts
```

## Available Scripts

### Root Directory
- `npm run dev` - Start all services with Docker Compose
- `npm run build` - Build all services for production
- `npm run test` - Run all tests

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Lint code

## Database Schema

The application uses PostgreSQL with the following main entities:
- Organizations (multi-tenant)
- Users (with role-based permissions)
- Products/Offers
- Daily metrics (sales reps and setters)
- Reports (EOD/EOW/EOM)
- Goals and notifications

See [database/schema.sql](../database/schema.sql) for the complete schema.

## API Documentation

The API follows REST conventions. See [API_SPEC.md](./API_SPEC.md) for complete endpoint documentation.

Base URL: `http://localhost:3001/api/v1`

### Authentication
Most endpoints require JWT authentication via the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Troubleshooting

### Common Issues

**Database connection errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists and schema is applied

**Frontend build errors:**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

**Docker issues:**
- Stop all containers: `docker-compose down`
- Remove volumes: `docker-compose down -v`
- Rebuild: `docker-compose up --build --force-recreate`

**Port conflicts:**
- Change ports in docker-compose.yml or .env
- Kill processes using ports: `lsof -ti:3000 | xargs kill -9`

### Logs

View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Commit changes: `git commit -m "Add your feature"`
6. Push branch: `git push origin feature/your-feature-name`
7. Create a pull request

## Production Deployment

For production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Support

If you encounter any issues:
1. Check this setup guide
2. Review the troubleshooting section
3. Check existing issues in the repository
4. Create a new issue with detailed information