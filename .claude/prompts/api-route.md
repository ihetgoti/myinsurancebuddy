# API Route Generation Prompt

Generate a new API route for Next.js App Router.

## Request Format

```
Route: /api/{{ROUTE_NAME}}
Methods: {{GET|POST|PUT|DELETE|PATCH}}
Auth: {{true|false|optional}}
Model: {{MODEL_NAME}}
Features: {{FEATURE_LIST}}
```

## Example Request

```
Route: /api/templates
Methods: GET, POST, PUT, DELETE
Auth: true
Model: Template
Features: Pagination, filtering by type, validation with Zod
```

## Prompt Template

---

Create a new API route at `apps/{{web|admin}}/app/api/{{ROUTE_NAME}}/route.ts`:

### Requirements:
1. **File**: `apps/{{APP}}/app/api/{{ROUTE_NAME}}/route.ts`
2. **Auth**: Check session if `auth: true`
3. **Methods**: Implement specified HTTP methods
4. **Database**: Use `@myinsurancebuddy/db` for Prisma client
5. **Validation**: Use Zod for input validation
6. **Response**: Consistent JSON format

### Route Structure:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@myinsurancebuddy/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schemas
const createSchema = z.object({
  // Define schema
});

// GET /api/{{ROUTE_NAME}}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Parse query params
    
    const data = await prisma.{{MODEL_NAME}}.findMany({
      // Query options
    });
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching {{ROUTE_NAME}}:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST /api/{{ROUTE_NAME}}
export async function POST(request: NextRequest) {
  try {
    {{#if auth}}
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    {{/if}}
    
    const body = await request.json();
    const validated = createSchema.parse(body);
    
    const data = await prisma.{{MODEL_NAME}}.create({
      data: validated,
    });
    
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating {{ROUTE_NAME}}:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create' },
      { status: 500 }
    );
  }
}

// PUT /api/{{ROUTE_NAME}}/:id
// DELETE /api/{{ROUTE_NAME}}/:id
```

### Response Format:
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

### Error Format:
```json
{
  "success": false,
  "error": "Human readable message",
  "code": "ERROR_CODE"
}
```

### Deliverables:
1. Route file with all methods
2. Validation schemas (Zod)
3. TypeScript types
4. Basic error handling

---

## Pre-built Route Templates

### CRUD Route
```
Route: /api/posts
Methods: GET, POST, PUT, DELETE
Auth: true
Model: Post
Features: Pagination, search, publish status filter
```

### Public Data Route
```
Route: /api/regions
Methods: GET
Auth: false
Model: State, City
Features: List all states, filter cities by state
```

### AI Generation Route
```
Route: /api/ai-generate
Methods: POST
Auth: true
Model: AIGeneratedContent
Features: Queue jobs, return job ID, webhook callback
```
