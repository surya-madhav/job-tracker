# Components Directory Documentation

## Overview
Reusable UI components built with shadcn/ui and Tailwind CSS.

## Component Categories

### Layout Components
- `main-nav.tsx`: Main navigation bar
- `user-nav.tsx`: User menu and actions
- `theme-toggle.tsx`: Theme switcher

### Job Components
- `job-grid.tsx`: Grid view for jobs
- `job-list.tsx`: List view for jobs
- `job-kanban.tsx`: Kanban board view

### Company Components
- `company-grid.tsx`: Grid view for companies
- `company-list.tsx`: List view for companies

### Contact Components
- `contact-grid.tsx`: Grid view for contacts
- `contact-list.tsx`: List view for contacts

## Usage Guidelines

### Component Structure
```typescript
// Component template
interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // Implementation
}
```

### Best Practices
1. Keep components focused and small
2. Use TypeScript for props
3. Implement proper loading states
4. Handle error cases
5. Support dark/light modes

### Accessibility
- Proper ARIA attributes
- Keyboard navigation
- Screen reader support
- Color contrast

### Performance
- Lazy loading where appropriate
- Memoization for expensive operations
- Proper key usage in lists
- Image optimization