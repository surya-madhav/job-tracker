# Tests Directory Documentation

## Overview
Comprehensive test suite using Jest and Testing Library.

## Test Categories

### Unit Tests
```typescript
// Authentication tests
describe('Authentication', () => {
  it('should create and verify token', () => {...});
  it('should create user', () => {...});
});
```

### Integration Tests
```typescript
// API endpoint tests
describe('Jobs API', () => {
  it('should create job', () => {...});
  it('should list user jobs', () => {...});
});
```

## Running Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Test Structure
```typescript
describe('Component/Feature', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something', () => {
    // Test
  });
});
```

## Best Practices
1. Test business logic thoroughly
2. Mock external dependencies
3. Use meaningful test names
4. Keep tests focused
5. Maintain test isolation