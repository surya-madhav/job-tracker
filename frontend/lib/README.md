# Library Directory Documentation

## Overview
Core utilities and database operations.

## Key Files

### Database (`db.ts`)
```typescript
// Database operations
export async function getDb() {...}
export async function createUser() {...}
export async function getJobs() {...}
```

### Authentication (`auth.ts`)
```typescript
// Auth utilities
export async function createToken() {...}
export async function verifyToken() {...}
```

### API Documentation (`swagger.ts`)
```typescript
// Swagger configuration
export const getApiDocs = () => {...}
```

## Database Schema

### Users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Jobs
```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  company_id TEXT,
  url TEXT,
  status TEXT CHECK (status IN ('Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected')),
  application_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Companies
```sql
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  location TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Contacts
```sql
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company_id TEXT,
  name TEXT NOT NULL,
  position TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

## Development Mode
- Auto-seeding of test data
- Authentication bypass
- Development user creation