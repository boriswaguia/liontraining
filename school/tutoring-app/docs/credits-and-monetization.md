# Credits & Monetization System

> **Version:** 1.0  
> **Date:** February 16, 2026  
> **Model:** Hybrid Free Tier + Credit Top-ups (Option C)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Free Tier](#free-tier)
4. [Credit System](#credit-system)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Quota Enforcement Flow](#quota-enforcement-flow)
8. [Admin Management](#admin-management)
9. [Student UI](#student-ui)
10. [Configuration & Tuning](#configuration--tuning)
11. [File Map](#file-map)

---

## Overview

LionLearn uses a **hybrid monetization model** that balances accessibility with sustainability:

- **Free tier** — Every student gets a daily allowance of AI-powered actions at no cost. This resets every day at midnight UTC.
- **Credit top-ups** — When the free allowance is exhausted, students can use purchased credits to continue. Credits do not expire and persist across days.
- **Admin bypass** — Administrators are never subject to quotas.

This approach ensures that students always have meaningful daily access while providing a monetization path for heavy users.

---

## Architecture

```
Student Action (e.g., "Generate Exercise")
        │
        ▼
  API Route Handler
        │
        ▼
  checkAndConsumeQuota(userId, action)
        │
        ├─ Admin? → Always allowed
        │
        ├─ Free tier remaining? → Allow + increment daily counter
        │
        ├─ Credits sufficient? → Deduct credits + log transaction + allow
        │
        └─ Neither? → Return 402 with reason
                          │
                          ▼
                QuotaExceededModal (client-side)
```

---

## Free Tier

Every student receives the following **daily** allowances (reset at 00:00 UTC):

| Allowance        | Daily Limit | Actions Counted                                       |
| ---------------- | ----------- | ----------------------------------------------------- |
| **Generations**  | 5 / day     | Exercises, Study Guides, Flashcards, Study Plans       |
| **Chat Messages**| 15 / day    | Chat messages sent to AI tutor                         |

- Generations and chat messages are tracked separately.
- All generation-type actions share the same 5/day pool (e.g., 3 exercises + 2 study guides = 5 generations used).

---

## Credit System

### Credit Costs

| Action         | Credit Cost | Description                          |
| -------------- | ----------- | ------------------------------------ |
| `exercise`     | 3 credits   | Generate a practice exercise set     |
| `study_guide`  | 3 credits   | Generate a study guide               |
| `flashcards`   | 2 credits   | Generate a flashcard deck            |
| `chat`         | 1 credit    | Send a chat message (beyond free)    |
| `study_plan`   | 5 credits   | Generate a personalized study plan   |

### Credit Lifecycle

1. **Acquisition** — Credits are added via:
   - Admin grants (positive or negative amounts)
   - Future: online purchases via credit packs

2. **Consumption** — Credits are deducted only when the free tier is exhausted. Each deduction is logged as a `CreditTransaction` with type `"usage"`.

3. **Persistence** — Credits never expire. They remain on the user's balance indefinitely.

4. **Transactions** — Every credit change (grant, usage, refund) is recorded with `balanceBefore` and `balanceAfter` for full auditability.

### Transaction Types

| Type           | Description                                  |
| -------------- | -------------------------------------------- |
| `purchase`     | Student purchased a credit pack              |
| `admin_grant`  | Admin manually added/removed credits         |
| `usage`        | Credits consumed by an AI action             |
| `refund`       | Credits refunded (e.g., failed generation)   |
| `reset`        | Credits reset by system                      |

---

## Database Schema

### Modified: `User` model

```prisma
model User {
  // ... existing fields ...
  creditBalance  Int             @default(0)
  plan           String          @default("free") // "free" | "starter" | "pro"
  usageQuotas       UsageQuota[]
  creditTransactions CreditTransaction[]
}
```

### New: `UsageQuota`

Tracks daily usage per student. One record per user per day.

```prisma
model UsageQuota {
  id           String   @id @default(cuid())
  userId       String
  date         DateTime @db.Date
  generations  Int      @default(0)
  chatMessages Int      @default(0)
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId])
}
```

### New: `CreditTransaction`

Immutable audit log of every credit change.

```prisma
model CreditTransaction {
  id            String   @id @default(cuid())
  userId        String
  amount        Int      // positive = added, negative = spent
  type          String   // "purchase" | "admin_grant" | "usage" | "refund" | "reset"
  action        String?  // "exercise" | "study_guide" | etc. (for usage type)
  description   String
  balanceBefore Int
  balanceAfter  Int
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@index([type])
}
```

### New: `CreditPack`

Defines purchasable credit packages managed by admins.

```prisma
model CreditPack {
  id          String   @id @default(cuid())
  name        String
  credits     Int
  priceCFA    Int
  description String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## API Reference

### Student APIs

#### `GET /api/credits`

Returns the current user's quota status, credit costs, and free limits.

**Query Parameters:**

| Param | Description                                  |
| ----- | -------------------------------------------- |
| `tab` | Optional. `"packs"` or `"history"` for extra data |

**Response (default):**
```json
{
  "quotaStatus": {
    "creditBalance": 42,
    "plan": "free",
    "role": "student",
    "today": {
      "generations": 3,
      "chatMessages": 7,
      "generationsLimit": 5,
      "chatMessagesLimit": 15
    }
  },
  "creditCosts": { "exercise": 3, "study_guide": 3, "flashcards": 2, "chat": 1, "study_plan": 5 },
  "freeLimits": { "generations": 5, "chatMessages": 15 }
}
```

**Response (tab=packs):** Adds `packs` array of active `CreditPack` objects.

**Response (tab=history):** Adds `transactions` array of the user's last 50 `CreditTransaction` records.

---

### Admin APIs

#### `POST /api/admin/credits`

Grant or remove credits from a user.

**Request Body:**
```json
{
  "userId": "clxyz...",
  "amount": 50,
  "description": "Bonus pour participation"
}
```
- `amount` can be negative to remove credits.

**Response:**
```json
{ "creditBalance": 92 }
```

#### `GET /api/admin/credits?userId=xxx`

Get a user's credit balance, transaction history (last 50), and today's usage quota.

**Response:**
```json
{
  "user": { "id": "...", "name": "...", "email": "...", "creditBalance": 42, "plan": "free" },
  "transactions": [...],
  "todayQuota": { "id": "...", "generations": 3, "chatMessages": 7 }
}
```

#### `GET /api/admin/credit-packs`

List all credit packs (active and inactive).

#### `POST /api/admin/credit-packs`

Create a new credit pack.

**Request Body:**
```json
{
  "name": "Pack Starter",
  "credits": 50,
  "priceCFA": 1000,
  "description": "Idéal pour commencer",
  "sortOrder": 0
}
```

#### `PUT /api/admin/credit-packs`

Update a credit pack. Only provided fields are updated.

**Request Body:**
```json
{
  "id": "clxyz...",
  "name": "Pack Pro",
  "credits": 150,
  "priceCFA": 2500,
  "isActive": true
}
```

#### `DELETE /api/admin/credit-packs?id=xxx`

Delete a credit pack permanently.

---

## Quota Enforcement Flow

Quota checks are integrated into all five AI-powered API routes. The flow is identical across all routes:

### Protected Routes

| Route                  | Action Key     |
| ---------------------- | -------------- |
| `POST /api/exercises`  | `exercise`     |
| `POST /api/study-guides` | `study_guide` |
| `POST /api/flashcards` | `flashcards`   |
| `POST /api/chat`       | `chat`         |
| `POST /api/study-plans`| `study_plan`   |

### Server-side Logic

Each route calls `checkAndConsumeQuota(userId, action)` **before** invoking the Gemini AI model:

```typescript
import { checkAndConsumeQuota } from "@/lib/credits";

// Inside POST handler, after auth check:
const quotaResult = await checkAndConsumeQuota(session.user.id, "exercise");
if (!quotaResult.allowed) {
  return NextResponse.json({
    error: "Quota dépassé",
    reason: quotaResult.reason,
    creditBalance: quotaResult.creditBalance,
    creditCost: quotaResult.creditCost,
  }, { status: 402 });
}

// ... proceed with AI generation ...

// Include quota info in successful response:
return NextResponse.json({
  exercise,
  quota: {
    freeRemaining: quotaResult.freeRemaining,
    usedCredits: quotaResult.usedCredits,
    creditBalance: quotaResult.creditBalance,
  },
});
```

### `checkAndConsumeQuota()` Decision Tree

1. **Admin?** → Always `{ allowed: true }` (no tracking).
2. **Free tier available?** → Increment daily counter, return `{ allowed: true, freeRemaining: N, usedCredits: false }`.
3. **Sufficient credits?** → Atomically deduct credits (via `$transaction`), log `CreditTransaction`, return `{ allowed: true, usedCredits: true, creditBalance: N }`.
4. **Denied** → Return `{ allowed: false, reason: "insufficient_credits", creditBalance: N, creditCost: N }`.

### Client-side Handling

All five student pages (exercises, study guides, flashcards, chat, planner) include the `QuotaExceededModal` component:

```tsx
import QuotaExceededModal from "@/components/QuotaExceededModal";

// State
const [quotaModal, setQuotaModal] = useState<{
  show: boolean;
  reason?: string;
  creditBalance?: number;
  creditCost?: number;
}>({ show: false });

// In fetch handler
if (res.status === 402) {
  const data = await res.json();
  setQuotaModal({
    show: true,
    reason: data.reason,
    creditBalance: data.creditBalance,
    creditCost: data.creditCost,
  });
  return;
}

// In JSX
<QuotaExceededModal
  show={quotaModal.show}
  onClose={() => setQuotaModal({ show: false })}
  reason={quotaModal.reason}
  creditBalance={quotaModal.creditBalance}
  creditCost={quotaModal.creditCost}
  lang={lang}
/>
```

The modal displays:
- Different messaging for **"quota_exceeded"** (free tier exhausted, no credits) vs **"insufficient_credits"** (has some credits but not enough for this action)
- Current balance and action cost
- A link to `/credits` to buy more

**Special case — Chat page:** When a 402 is returned, the optimistically-added user message is rolled back: `setMessages((prev) => prev.slice(0, -1))`.

---

## Admin Management

### Credit Packs Page (`/admin/credit-packs`)

Admins can create, edit, toggle, and delete credit packs. The page displays:

- Table of all packs with name, credits, price (FCFA), price-per-credit, active status
- Create/edit modal form
- Info card showing credit costs per action and free tier limits

### User Credit Management (`/admin/users/[id]` → Credits tab)

The user detail page includes a **Credits** tab where admins can:

- View the user's current credit balance
- Grant credits (positive amount) or remove credits (negative amount)
- Add an optional description for the transaction
- All grants are logged as `CreditTransaction` with type `"admin_grant"` and appear in the activity log

---

## Student UI

### Credits Page (`/credits`)

The student credits dashboard includes:

- **Balance card** — Gradient card showing current credit balance
- **Daily free tier progress** — Visual progress bars for generations (X/5) and chat messages (X/15) with reset-at-midnight info
- **Three tabs:**
  - **Costs** — Table showing credit cost per action type
  - **Buy** — Available credit packs with pricing, per-credit value, and "Popular" badge on the 2nd pack
  - **History** — Transaction log with color-coded amounts (green for additions, red for deductions)

### Sidebar Navigation

- Students see a **"Credits"** link (Coins icon) in the sidebar pointing to `/credits`
- Admins see a **"Credit Packs"** link in the admin section pointing to `/admin/credit-packs`

---

## Configuration & Tuning

All configurable values are in `src/lib/credits.ts`:

### Credit Costs

```typescript
export const CREDIT_COSTS: Record<string, number> = {
  exercise: 3,
  study_guide: 3,
  flashcards: 2,
  chat: 1,
  study_plan: 5,
};
```

### Free Tier Limits

```typescript
export const FREE_LIMITS = {
  generations: 5,   // exercises + guides + flashcards + study plans combined
  chatMessages: 15, // chat messages per day
};
```

To adjust limits, modify these constants and redeploy. No database migration is needed.

### Adding a New AI Action

1. Add the action key and cost to `CREDIT_COSTS` in `src/lib/credits.ts`.
2. Add the action to either `GENERATION_ACTIONS` or `CHAT_ACTIONS` array.
3. Call `checkAndConsumeQuota(userId, "new_action")` in the new API route.
4. Add the `QuotaExceededModal` to the corresponding page component.
5. Add translation keys in `src/lib/i18n.ts` under `credits.action.new_action`.

---

## File Map

| File | Purpose |
| ---- | ------- |
| `src/lib/credits.ts` | Core quota/credit engine: `checkAndConsumeQuota()`, `getQuotaStatus()`, `addCredits()`, constants |
| `src/components/QuotaExceededModal.tsx` | Reusable modal shown on 402 responses |
| `src/app/api/credits/route.ts` | Student-facing API (quota status, packs, history) |
| `src/app/api/admin/credits/route.ts` | Admin credit grant + user credit history |
| `src/app/api/admin/credit-packs/route.ts` | Admin CRUD for credit packs |
| `src/app/(authenticated)/credits/page.tsx` | Student credits dashboard |
| `src/app/(authenticated)/admin/credit-packs/page.tsx` | Admin credit packs management |
| `src/app/api/exercises/route.ts` | Quota-integrated exercise generation |
| `src/app/api/study-guides/route.ts` | Quota-integrated study guide generation |
| `src/app/api/flashcards/route.ts` | Quota-integrated flashcard generation |
| `src/app/api/chat/route.ts` | Quota-integrated chat messaging |
| `src/app/api/study-plans/route.ts` | Quota-integrated study plan generation |
| `src/app/(authenticated)/exercises/page.tsx` | Exercise page with QuotaExceededModal |
| `src/app/(authenticated)/study-guides/page.tsx` | Study guides page with QuotaExceededModal |
| `src/app/(authenticated)/flashcards/page.tsx` | Flashcards page with QuotaExceededModal |
| `src/app/(authenticated)/chat/page.tsx` | Chat page with QuotaExceededModal + message rollback |
| `src/app/(authenticated)/planner/page.tsx` | Planner page with QuotaExceededModal |
| `src/components/Sidebar.tsx` | Sidebar with Credits/Credit Packs nav links |
| `src/lib/i18n.ts` | ~60 translation keys for credits UI (fr/en) |
| `prisma/schema.prisma` | `UsageQuota`, `CreditTransaction`, `CreditPack` models + User fields |

Your real cost is Gemini API usage. Everything else is just DB reads.

Option A: Credit System (what you proposed)
Pros: Simple, transparent, scales with usage.
Cons: Students feel "nickeled-and-dimed" per action, friction kills engagement, hard to explain the value of 1 credit, credits expiring feels punishing.

Option B: Tiered Subscription (better for education)
Pros: Predictable revenue, no friction per action, students engage more freely, easier to market ("abonnement étudiant").
Cons: Heavy users on Premium could cost you, but Gemini Flash is cheap (~$0.075/million tokens).

Option C: Hybrid — Free Tier + Credit Top-ups (recommended)
Why this is the best model:

No barrier to entry — every student gets meaningful free usage daily, driving adoption
No expiration resentment — credits persist, students don't feel robbed
Natural upsell — students hit the daily cap during exam season (when they need it most) and buy credits willingly
Low operational risk — you're never giving unlimited access to an API that costs money
Simple to implement — just a creditBalance on User + a daily_usage counter that resets at midnight
Works in African markets — small top-ups via Mobile Money (MTN MoMo, Orange Money) fit the purchasing pattern perfectly
Implementation Blueprint (if you go with Option C)
Want me to build Option C? I'd start with the schema + quota middleware + balance display, then add the purchase flow (which can integrate with any payment gateway or start with admin-granted credits for testing).