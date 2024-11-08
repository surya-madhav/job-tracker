# JobTrackr - Job Application Management System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fjobtrackr)
[![Tests](https://github.com/yourusername/jobtrackr/workflows/Tests/badge.svg)](https://github.com/yourusername/jobtrackr/actions)
[![Coverage Status](https://coveralls.io/repos/github/yourusername/jobtrackr/badge.svg?branch=main)](https://coveralls.io/github/yourusername/jobtrackr?branch=main)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview
JobTrackr is a modern, full-stack application for managing job applications, tracking company interactions, and organizing your job search process. Built with Next.js 13, SQLite, and Tailwind CSS.

## Features
- 🔐 Secure authentication with JWT
- 📊 Interactive dashboard with job statistics
- 📝 Job application tracking with Kanban, Grid, and List views
- 🏢 Company management and tracking
- 👥 Contact management for networking
- 🎨 Beautiful UI with dark/light mode
- 📱 Fully responsive design

## Tech Stack
- **Frontend**: Next.js 13, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, SQLite
- **Authentication**: JWT with HTTP-only cookies
- **Testing**: Jest, React Testing Library
- **Documentation**: Swagger/OpenAPI

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Run with auth bypass (automatic login)
npm run dev

# Run with normal authentication
npm run dev:auth

# Run tests
npm test
```

### Environment Setup
Create `.env.development`:
```env
NEXT_PUBLIC_DEV_AUTH_BYPASS=true
```

### Development User
When running with `npm run dev`, you'll be automatically logged in as:
```json
{
  "email": "dev@example.com",
  "password": "password123"
}
```

## Project Structure
```
├── app/                  # Next.js 13 App Router
│   ├── (auth)/          # Authentication pages
│   ├── (authenticated)/ # Protected pages
│   ├── api/             # API routes
├── components/          # Reusable React components
├── lib/                 # Core utilities and database
├── hooks/              # Custom React hooks
├── __tests__/         # Test files
```

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- Feature branches: `feature/description`
- Bug fixes: `fix/description`

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

### Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## API Documentation
- Available at `/api-docs` in development
- Swagger UI for interactive testing
- Authentication required for most endpoints

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License
MIT License - see LICENSE file for details