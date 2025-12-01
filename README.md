# WhatsApp Dashboard

A modern, full-featured WhatsApp management dashboard built with Next.js 14 and powered by Evolution API v2.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Evolution API](https://img.shields.io/badge/Evolution%20API-v2.1+-green?style=flat-square)

## Features

### Core Functionality
- **Dashboard** - Real-time analytics and statistics
- **Instance Management** - Create, manage, and monitor WhatsApp instances
- **Conversations** - View and manage chats
- **Contact Management** - View and manage contacts
- **Group Management** - Manage WhatsApp groups
- **Webhook Configuration** - Configure event webhooks
- **Settings** - Instance configuration

### Authentication & Security
- **NextAuth.js v5** - Secure credential-based authentication
- **Role-Based Access Control** - Fine-grained permissions (Super Admin, Admin, Manager, Operator, Viewer)
- **Session Management** - JWT-based sessions with 30-day expiration
- **Protected Routes** - Middleware-based route protection

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: TanStack Query (React Query)
- **Auth**: NextAuth.js v5
- **Database**: PostgreSQL
- **Cache**: Redis
- **API**: Evolution API v2

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd whatsappx
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://whatsapp:whatsapp123@localhost:5432/whatsapp_dashboard

# Evolution API
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=your-api-key-here

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:5000
```

### 3. Start Backend Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Evolution API on port 8080

### 4. Initialize Database

```bash
# Run the main schema
docker exec -i whatsapp-dashboard-postgres psql -U whatsapp -d whatsapp_dashboard < database/schema.sql

# Run the user management schema
docker exec -i whatsapp-dashboard-postgres psql -U whatsapp -d whatsapp_dashboard < database/user-management-schema.sql
```

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:5000

### 6. Login

Default admin credentials:
- **Email**: `cc@siwaht.com`
- **Password**: `Hola173!`

## Project Structure

```
├── app/
│   ├── (auth)/           # Login page
│   ├── (dashboard)/      # Protected dashboard pages
│   └── api/              # API routes
├── components/
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── database/
│   ├── schema.sql        # Main database schema
│   └── user-management-schema.sql  # User/role schema
├── hooks/                # React Query hooks
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── evolution-api.ts  # Evolution API client
│   ├── permissions.ts    # Permission utilities
│   └── providers.tsx     # React providers
├── types/                # TypeScript definitions
└── middleware.ts         # Route protection
```

## Default Roles

| Role | Description |
|------|-------------|
| **Super Admin** | Full system access |
| **Admin** | Most permissions except user deletion |
| **Manager** | Instance and operational management |
| **Operator** | Day-to-day operations |
| **Viewer** | Read-only access |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `EVOLUTION_API_URL` | Evolution API URL | Yes |
| `EVOLUTION_API_KEY` | Evolution API key | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |

## Docker Services

The `docker-compose.yml` includes:
- **PostgreSQL** (5432) - Main database
- **Redis** (6379) - Cache and sessions
- **Evolution API** (8080) - WhatsApp integration
- **Dashboard** (5000) - Next.js application

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Security Notes

- Always use HTTPS in production
- Keep `NEXTAUTH_SECRET` secure and unique
- Change default admin password immediately
- Regularly rotate API keys

## License

MIT
