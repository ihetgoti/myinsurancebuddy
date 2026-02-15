# Page Generation Prompt

Generate a new Next.js App Router page.

## Request Format

```
Path: {{PAGE_PATH}}
Type: {{static|dynamic|server|client}}
Data: {{DATA_REQUIREMENTS}}
Features: {{FEATURE_LIST}}
Layout: {{default|sidebar|auth|minimal}}
```

## Example Request

```
Path: /blog/[slug]
Type: dynamic
Data: Post by slug, related posts
Features: SEO meta, reading time, share buttons
Layout: default
```

## Prompt Template

---

Create a new page at `apps/{{APP}}/app/{{PAGE_PATH}}/page.tsx`:

### Requirements:
1. **File**: `apps/{{APP}}/app/{{PAGE_PATH}}/page.tsx`
2. **Type**: {{static|dynamic}} generation
3. **Data Fetching**: Server-side with Prisma
4. **SEO**: Generate metadata export
5. **Loading**: Create `loading.tsx` if needed
6. **Error**: Create `error.tsx` if needed

### Page Structure (Dynamic):

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@myinsurancebuddy/db';

interface PageProps {
  params: {
    {{PARAM_NAME}}: string;
  };
}

// Generate metadata
export async function generateMetadata({ 
  params 
}: PageProps): Promise<Metadata> {
  const data = await prisma.{{MODEL_NAME}}.findUnique({
    where: { {{PARAM_NAME}}: params.{{PARAM_NAME}} },
  });
  
  if (!data) {
    return { title: 'Not Found' };
  }
  
  return {
    title: data.title,
    description: data.metaDescription,
    openGraph: {
      title: data.ogTitle || data.title,
      description: data.ogDescription,
    },
  };
}

// Generate static params (optional for SSG)
export async function generateStaticParams() {
  const items = await prisma.{{MODEL_NAME}}.findMany({
    select: { {{PARAM_NAME}}: true },
  });
  
  return items.map((item) => ({
    {{PARAM_NAME}}: item.{{PARAM_NAME}},
  }));
}

// Main page component
export default async function Page({ params }: PageProps) {
  const data = await prisma.{{MODEL_NAME}}.findUnique({
    where: { {{PARAM_NAME}}: params.{{PARAM_NAME}} },
  });
  
  if (!data) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page content */}
    </div>
  );
}
```

### Page Structure (Client Component):

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, [params.{{PARAM_NAME}}]);
  
  async function fetchData() {
    try {
      const res = await fetch(`/api/{{ROUTE_NAME}}/${params.{{PARAM_NAME}}}`);
      const json = await res.json();
      setData(json.data);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) return <Loading />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page content */}
    </div>
  );
}
```

### Layout Structure:

```typescript
// apps/{{APP}}/app/{{PAGE_PATH}}/layout.tsx
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
```

### Loading State:

```typescript
// apps/{{APP}}/app/{{PAGE_PATH}}/loading.tsx
import { Skeleton } from '@myinsurancebuddy/ui';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
```

### Error State:

```typescript
// apps/{{APP}}/app/{{PAGE_PATH}}/error.tsx
'use client';

import { Button } from '@myinsurancebuddy/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Deliverables:
1. `page.tsx` - Main page component
2. `layout.tsx` - Layout wrapper (if custom needed)
3. `loading.tsx` - Loading skeleton
4. `error.tsx` - Error boundary

---

## Pre-built Page Templates

### Blog Post Page
```
Path: /blog/[slug]
Type: dynamic
Data: Post by slug, related posts, author info
Features: Rich text rendering, SEO, share buttons
Layout: default
```

### Admin Dashboard
```
Path: /dashboard
Type: server
Data: Stats, recent activity, quick actions
Features: Charts, data tables, filterable widgets
Layout: sidebar
```

### Template Editor
```
Path: /admin/templates/[id]/edit
Type: dynamic client
Data: Template by ID, available variables
Features: Code editor, preview, save/publish
Layout: sidebar
```

### Insurance Page (Programmatic)
```
Path: /[type]/[state]/[city]
Type: dynamic
Data: Page by slug, local stats, providers
Features: AI content sections, lead forms, comparison tables
Layout: default
```
