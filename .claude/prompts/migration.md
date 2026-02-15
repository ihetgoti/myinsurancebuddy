# Database Migration Prompt

Generate a Prisma schema migration.

## Request Format

```
Type: {{create|update|relation|index}}
Model: {{MODEL_NAME}}
Fields: {{FIELD_DEFINITIONS}}
Relations: {{RELATION_DEFINITIONS}}
```

## Example Request

```
Type: create
Model: Lead
Fields: email, phone, state, city, insuranceType, status, source, metadata(Json)
Relations: Belongs to User (optional), has many LeadActivity
```

## Prompt Template

---

Create a database migration for the `@myinsurancebuddy/db` package:

### Requirements:
1. **Schema**: Update `packages/db/prisma/schema.prisma`
2. **Migration**: Run `pnpm db:migrate` after changes
3. **Client**: Regenerate with `pnpm db:generate`
4. **Seeds**: Update seed files if needed

### Schema Pattern:

```prisma
model {{MODEL_NAME}} {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Fields
  {{FIELD_NAME}} {{FIELD_TYPE}} {{FIELD_ATTRIBUTES}}
  
  // Relations
  {{RELATION_FIELD}} {{TYPE}} @relation(fields: [{{FOREIGN_KEY}}], references: [id])
  {{FOREIGN_KEY}} String?
  
  // Indexes
  @@index([{{FIELD_FOR_INDEX}}])
}
```

### Field Types Reference:

| Type | Use For | Example |
|------|---------|---------|
| `String` | Text, IDs, URLs | `@db.VarChar(255)` |
| `Int` | Whole numbers | Counts, ages |
| `Float` | Decimals | Prices, rates |
| `Decimal` | Precise money | `@db.Decimal(10, 2)` |
| `Boolean` | True/False | Flags, status |
| `DateTime` | Timestamps | `@default(now())` |
| `Json` | Complex data | Metadata, settings |
| `Enum` | Fixed options | Status, type |

### Common Patterns:

#### 1. Basic Model with Soft Delete
```prisma
model {{MODEL_NAME}} {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Soft delete
  
  name      String
  status    Status    @default(ACTIVE)
  
  @@index([status])
  @@index([deletedAt])
}
```

#### 2. Model with User Relation
```prisma
model {{MODEL_NAME}} {
  id     String @id @default(uuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

#### 3. Self-Referential Relation
```prisma
model Category {
  id       String     @id @default(uuid())
  name     String
  parentId String?
  parent   Category?  @relation("CategoryChildren", fields: [parentId], references: [id])
  children Category[] @relation("CategoryChildren")
}
```

#### 4. Many-to-Many Relation
```prisma
model Post {
  id       String     @id @default(uuid())
  tags     Tag[]
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
}
```

#### 5. Explicit Many-to-Many
```prisma
model Post {
  id          String        @id @default(uuid())
  postTags    PostTag[]
}

model Tag {
  id       String    @id @default(uuid())
  postTags PostTag[]
}

model PostTag {
  postId String
  tagId  String
  post   Post   @relation(fields: [postId], references: [id])
  tag    Tag    @relation(fields: [tagId], references: [id])
  
  @@id([postId, tagId])
}
```

### Migration Steps:

1. **Update Schema**:
```prisma
// packages/db/prisma/schema.prisma

model {{MODEL_NAME}} {
  // ... fields
}
```

2. **Create Migration**:
```bash
cd packages/db
pnpm prisma migrate dev --name add_{{model_name}}
```

3. **Generate Client**:
```bash
pnpm prisma generate
```

4. **Update Seed (if needed)**:
```typescript
// prisma/seed.ts
async function seed{{MODEL_NAME}}s() {
  await prisma.{{modelName}}.createMany({
    data: [
      // Seed data
    ],
  });
}
```

### Deliverables:
1. Updated `schema.prisma`
2. Migration file (auto-generated)
3. Updated seed script (if needed)
4. Usage examples

---

## Pre-built Migration Templates

### Blog System
```
Type: create
Model: Post, Category, Comment
Fields: 
  - Post: title, slug, content, excerpt, status, publishedAt, featuredImage
  - Category: name, slug, description
  - Comment: authorName, email, content, status
Relations: 
  - Post belongs to Category
  - Post has many Comments
  - Post belongs to User (author)
```

### Lead Management
```
Type: create
Model: Lead, LeadActivity, LeadSource
Fields:
  - Lead: email, phone, state, city, insuranceType, status, score, metadata
  - LeadActivity: type, description, metadata
  - LeadSource: name, slug, utmParams
Relations:
  - Lead has many LeadActivities
  - Lead belongs to LeadSource
  - Lead belongs to User (assigned)
```

### Template System (Existing)
```
Type: update
Model: Template
Fields to add:
  - aiPrompts: Json (for 12 AI sections)
  - exampleFormats: Json
  - isSystem: Boolean
```

### Page Analytics
```
Type: create
Model: PageView, PageEvent
Fields:
  - PageView: path, referrer, userAgent, ipHash, duration
  - PageEvent: type, element, metadata
Relations:
  - Both belong to Page (programmatic page)
```
