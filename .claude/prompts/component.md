# Component Generation Prompt

Generate a new React component for the @myinsurancebuddy/ui package.

## Request Format

```
Component: {{COMPONENT_NAME}}
Type: {{atom|molecule|organism}}
Props: {{PROP_LIST}}
Features: {{FEATURE_LIST}}
```

## Example Request

```
Component: PricingCard
Type: molecule
Props: title, price, features[], ctaText, ctaHref
Features: Highlight badge, price comparison strike-through, feature checklist
```

## Prompt Template

---

Create a new React component `{{COMPONENT_NAME}}` in `packages/ui/src/components/`:

### Requirements:
1. **File**: `packages/ui/src/components/{{COMPONENT_NAME}}.tsx`
2. **Export**: Add to `packages/ui/src/index.ts`
3. **TypeScript**: Full type definitions for props
4. **Styling**: Tailwind CSS with responsive classes
5. **Accessibility**: ARIA labels, keyboard navigation where applicable

### Component Structure:
```tsx
import * as React from 'react';
import { cn } from '../lib/utils';

export interface {{COMPONENT_NAME}}Props {
  // Define all props here
  className?: string;
}

export function {{COMPONENT_NAME}}({ 
  // Destructure props
  className 
}: {{COMPONENT_NAME}}Props) {
  return (
    <div className={cn("", className)}>
      {/* Component JSX */}
    </div>
  );
}

{{COMPONENT_NAME}}.displayName = '{{COMPONENT_NAME}}';
```

### Style Guidelines:
- Use `cn()` utility from `../lib/utils` for class merging
- Follow mobile-first approach
- Use semantic HTML elements
- Support dark mode if applicable (use `dark:` prefix)

### Deliverables:
1. Component file with full implementation
2. Update to `packages/ui/src/index.ts` exports
3. Usage example in comments

---

## Pre-built Component Templates

### Button Component
```
Component: Button
Type: atom
Props: variant, size, children, onClick, disabled, loading
Features: Primary/secondary/ghost variants, sm/md/lg sizes, loading state
```

### DataTable Component
```
Component: DataTable
Type: organism
Props: columns[], data[], pagination, sorting, filtering
Features: Sortable headers, pagination, row selection, empty state
```

### FormInput Component
```
Component: FormInput
Type: atom
Props: label, name, type, placeholder, error, required
Features: Label association, error message display, icon support
```

### Modal Component
```
Component: Modal
Type: molecule
Props: isOpen, onClose, title, children, footer
Features: Backdrop click to close, ESC key support, focus trap
```

### Card Component
```
Component: Card
Type: molecule
Props: title, description, children, footer, headerAction
Features: Shadow, border, header with optional action
```
