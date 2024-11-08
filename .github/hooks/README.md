# Hooks Directory Documentation

## Overview
Custom React hooks for state management and functionality.

## Available Hooks

### Authentication (`useAuth`)
```typescript
const { user, login, register, logout, isLoading } = useAuth();
```

Features:
- User context management
- Authentication state
- Login/register/logout
- Loading states
- Error handling

### Toast Notifications (`useToast`)
```typescript
const { toast } = useToast();
```

Features:
- Success/error/info toasts
- Customizable duration
- Queue management
- Accessibility support

## Usage Guidelines

### Authentication Hook
```typescript
function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Logout {user.name}
    </button>
  );
}
```

### Toast Hook
```typescript
function MyComponent() {
  const { toast } = useToast();
  
  const handleAction = () => {
    toast({
      title: "Success",
      description: "Action completed"
    });
  };
}
```

## Best Practices
1. Use TypeScript for type safety
2. Handle loading states
3. Implement error handling
4. Clean up subscriptions
5. Memoize callbacks