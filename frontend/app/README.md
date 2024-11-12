# App Directory Documentation

## Overview
Next.js 13 App Router implementation with route groups and layouts.

## Directory Structure
```
app/
├── (auth)/             # Authentication route group
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   └── layout.tsx     # Auth layout
├── (authenticated)/    # Protected route group
│   ├── dashboard/     # Main dashboard
│   ├── jobs/         # Job management
│   ├── companies/    # Company management
│   ├── contacts/     # Contact management
│   └── layout.tsx    # Protected layout
└── api/              # API routes
```

## Route Groups

### Authentication (`/app/(auth)/`)
Public routes for authentication:
- `login/`: User login with email/password
- `register/`: New user registration
- `forgot-password/`: Password reset flow

### Protected (`/app/(authenticated)/`)
Routes requiring authentication:
- `dashboard/`: Overview and statistics
- `jobs/`: Job application management
- `companies/`: Company tracking
- `contacts/`: Contact management

## Layouts
- `(auth)/layout.tsx`: Minimal layout for auth pages
- `(authenticated)/layout.tsx`: Full layout with navigation

## State Management
- React Context for authentication
- Server Components for data fetching
- Client Components for interactivity

## Key Features
- Route protection via middleware
- Responsive layouts
- Dark/light mode support
- Loading states
- Error boundaries