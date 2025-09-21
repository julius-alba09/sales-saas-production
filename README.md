# Sales SaaS Application

A comprehensive multi-dashboard sales management platform designed for sales agencies to manage their teams of sales reps and appointment setters.

## Overview

This application provides three distinct dashboard experiences:
- **User Dashboard** (Sales Agency)
- **Sales Rep Dashboard**
- **Appointment Setter Dashboard**

## Key Features

### Dashboard Types
1. **Agency Dashboard**: Complete overview of team performance, product management, and analytics
2. **Sales Rep Dashboard**: Individual performance tracking, EOD reporting, and goal management
3. **Appointment Setter Dashboard**: Specialized KPI tracking for setters including call metrics and booking rates

### Core Functionality
- Multi-role user management with permissions
- Real-time KPI tracking and analytics
- Customizable EOD/EOW/EOM reporting
- Product/offer management system
- Leaderboards and performance comparisons
- Notification preferences and automated reporting
- Data analysis from individual and team perspectives

## Project Structure

```
├── frontend/          # React/Next.js frontend application
├── backend/           # Node.js/Express API server
├── database/          # Database schemas, migrations, and seeds
├── docs/              # Project documentation
├── config/            # Configuration files
└── scripts/           # Utility and deployment scripts
```

## Quick Start

1. Clone the repository
2. Set up environment variables
3. Run database migrations
4. Start the development servers

Detailed setup instructions are in the [docs/SETUP.md](docs/SETUP.md) file.

## Architecture

- **Frontend**: React/Next.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT with role-based access control
- **Deployment**: Docker containers

## Contributing

Please read the [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for development guidelines.