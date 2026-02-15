# Test Generation Prompt

Generate tests for components and APIs.

## Request Format

```
Target: {{TARGET_PATH}}
Type: {{unit|integration|e2e}}
Features: {{FEATURES_TO_TEST}}
Mock: {{DEPENDENCIES_TO_MOCK}}
```

## Example Request

```
Target: apps/web/components/PricingCard.tsx
Type: unit
Features: Rendering, click handlers, loading state
Mock: none
```

## Prompt Template

---

Create tests for the specified target:

### Requirements:
1. **Framework**: Vitest + React Testing Library
2. **Location**: Same directory as target with `.test.ts` or `.test.tsx` suffix
3. **Coverage**: Test happy path, edge cases, and errors
4. **Mocks**: Mock external dependencies appropriately
5. **Naming**: `describe` target name, `it` should describe behavior

### Test Structure:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { {{ComponentName}} } from './{{ComponentName}}';

// Mock dependencies
vi.mock('@myinsurancebuddy/db', () => ({
  prisma: {
    {{model}}: {
      findMany: vi.fn(),
    },
  },
}));

describe('{{ComponentName}}', () => {
  it('renders correctly with required props', () => {
    render(<{{ComponentName}} {{props}} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    const onClick = vi.fn();
    render(<{{ComponentName}} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
  
  it('displays loading state', () => {
    render(<{{ComponentName}} loading />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  
  it('handles error state', () => {
    render(<{{ComponentName}} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
```

### API Route Test Structure:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { prisma } from '@myinsurancebuddy/db';

vi.mock('@myinsurancebuddy/db');

describe('/api/{{route}}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('GET', () => {
    it('returns data successfully', async () => {
      const mockData = [{ id: '1', name: 'Test' }];
      prisma.{{model}}.findMany.mockResolvedValue(mockData);
      
      const response = await GET();
      const json = await response.json();
      
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toEqual(mockData);
    });
    
    it('handles database errors', async () => {
      prisma.{{model}}.findMany.mockRejectedValue(new Error('DB Error'));
      
      const response = await GET();
      const json = await response.json();
      
      expect(response.status).toBe(500);
      expect(json.success).toBe(false);
    });
  });
  
  describe('POST', () => {
    it('creates item with valid data', async () => {
      const mockData = { id: '1', name: 'Test' };
      prisma.{{model}}.create.mockResolvedValue(mockData);
      
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      });
      
      const response = await POST(request);
      const json = await response.json();
      
      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
    });
    
    it('returns 400 for invalid data', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ invalid: 'data' }),
      });
      
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
```

### Testing Utilities:

```typescript
// test/utils.tsx
import { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

function render(ui: ReactElement, { session = null, ...options } = {}) {
  return rtlRender(
    <SessionProvider session={session}>{ui}</SessionProvider>,
    options
  );
}

export * from '@testing-library/react';
export { render };
```

### Common Matchers:

```typescript
// Assertions
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('text');
expect(element).toHaveClass('class-name');
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(element).toHaveAttribute('href', '/link');

// Async
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
await screen.findByText('Loaded');
```

### Deliverables:
1. Test file with comprehensive coverage
2. Mock configurations
3. Test utilities if needed
4. Run command: `pnpm test`

---

## Pre-built Test Templates

### Component Test
```
Target: packages/ui/src/components/DataTable.tsx
Type: unit
Features: Render with data, sorting, pagination, row selection, empty state
Mock: none
```

### API Route Test
```
Target: apps/web/app/api/posts/route.ts
Type: integration
Features: GET pagination, POST creation, validation, auth
Mock: prisma, next-auth
```

### Hook Test
```
Target: apps/web/hooks/useLocalStorage.ts
Type: unit
Features: Initial value, update, persist, SSR safety
Mock: localStorage
```

### E2E Test (Playwright)
```
Target: /blog/[slug]
Type: e2e
Features: Page load, navigation, form submission
Mock: API responses
```
