# Next.js Learning Journey 📚

A comprehensive guide documenting my learnings while building Next.js applications. This README will be continuously updated as I explore more features and concepts.

---

## Table of Contents

- [Route Groups](#route-groups)
  - [What are Route Groups?](#what-are-route-groups)
  - [Creating Route Groups](#creating-route-groups)
  - [Parallel Pages and Conflicts](#parallel-pages-and-conflicts)
  - [Use Cases](#use-cases)
  - [File Structure Example](#file-structure-example)
- [Error Handling](#error-handling)
  - [Custom Error Pages](#custom-error-pages)
  - [Global Error Handling](#global-error-handling)
  - [Error Hierarchy](#error-hierarchy)
- [Loading States](#loading-states)
  - [Creating Loading UI](#creating-loading-ui)
  - [Loading Hierarchy](#loading-hierarchy)

---

## Route Groups

### What are Route Groups?

Route Groups are a powerful organizational feature in Next.js that allow you to group related routes together **without affecting the URL structure**. By wrapping a folder name in parentheses `(folderName)`, you create a route group that helps organize your code while keeping URLs clean.

**Key Benefits:**

- 📁 Better project organization
- 🎯 Logical grouping of related routes
- 🔄 Shared layouts for specific route segments
- 🚫 No impact on the URL path

---

### Creating Route Groups

To create a route group, wrap the folder name in parentheses:

```
app/
├── (dashboard)/
│   ├── home/
│   │   └── page.tsx      → renders at /home
│   └── about/
│       └── page.tsx      → renders at /about
└── (marketing)/
    ├── contact/
    │   └── page.tsx      → renders at /contact
    └── pricing/
        └── page.tsx      → renders at /pricing
```

**Without route groups**, the URLs would be:

- `/dashboard/home`
- `/dashboard/about`

**With route groups** `(dashboard)`, the URLs become:

- `/home`
- `/about`

The `(dashboard)` segment is **completely omitted** from the URL!

---

### Parallel Pages and Conflicts

#### Understanding the Root Route (`/`)

When using route groups, you can place a `page.tsx` file inside any route group to handle the root path (`/`). However, **you cannot have multiple `page.tsx` files in different route groups that resolve to the same path**.

#### Example Error:

```
app/
├── (dashboard)/
│   └── page.tsx         → resolves to /
└── (root)/
    └── page.tsx         → also resolves to /
```

**This will cause an error:**

```
Error: You cannot have two parallel pages that resolve to the same path.
Please check /(dashboard) and /(root).
```

![Parallel Page Error](public/readme/parallelpagerror.png)

#### Solution:

Only include one `page.tsx` at the root level within route groups:

```
app/
├── (dashboard)/
│   ├── page.tsx         → ✅ resolves to /
│   ├── home/
│   └── about/
└── (marketing)/
    ├── contact/
    └── pricing/
```

---

### Use Cases

#### 1. **Separating Application Sections**

```
app/
├── (admin)/
│   ├── layout.tsx       → Admin-specific layout
│   ├── users/
│   └── settings/
└── (public)/
    ├── layout.tsx       → Public-facing layout
    ├── blog/
    └── about/
```

#### 2. **Different Authentication States**

```
app/
├── (authenticated)/
│   ├── layout.tsx       → Requires authentication
│   ├── dashboard/
│   └── profile/
└── (guest)/
    ├── layout.tsx       → Public access only
    ├── login/
    └── signup/
```

#### 3. **Shared Layouts Within Groups**

Each route group can have its own `layout.tsx` that applies to all routes within that group:

```
app/
├── (dashboard)/
│   ├── layout.tsx       → Shared dashboard layout (sidebar, header)
│   ├── analytics/
│   ├── settings/
│   └── reports/
└── (marketing)/
    ├── layout.tsx       → Shared marketing layout (navbar, footer)
    ├── features/
    └── pricing/
```

---

### File Structure Example

Here's a complete example showing how route groups organize a project:

```
app/
├── (dashboard)/
│   ├── layout.tsx                 → Dashboard layout with sidebar
│   ├── page.tsx                   → Dashboard home at /
│   ├── analytics/
│   │   └── page.tsx               → /analytics
│   ├── users/
│   │   └── page.tsx               → /users
│   └── settings/
│       └── page.tsx               → /settings
│
├── (marketing)/
│   ├── layout.tsx                 → Marketing layout with navbar
│   ├── features/
│   │   └── page.tsx               → /features
│   ├── pricing/
│   │   └── page.tsx               → /pricing
│   └── about/
│       └── page.tsx               → /about
│
└── api/
    └── users/
        └── route.ts               → /api/users
```

**Benefits of this structure:**

- Clear separation between dashboard and marketing sections
- Each section has its own layout and styling
- URLs remain clean without `dashboard` or `marketing` prefixes
- Easy to maintain and scale

---

## Error Handling

### Custom Error Pages

Next.js provides a powerful way to handle errors gracefully using `error.tsx` files. When an error occurs in any component or route, the **closest** `error.tsx` file in the folder hierarchy will catch and handle it.

**Key Features:**

- ⚡ Automatic error boundaries
- 🎨 Custom error UI per route
- 🔄 Built-in recovery mechanism with `reset()`
- 📍 Scoped to specific routes

#### Creating an Error Handler

Simply create an `error.tsx` file in the folder where you want custom error handling:

<details>
<summary><strong>View Code Example: error.tsx</strong></summary>

```tsx
// app/products/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

</details>

**Important:** Error components **must be Client Components** (marked with `"use client"`).

**Props Explained:**

- `error`: Contains the error object with optional `digest` property for error tracking
- `reset()`: Function that attempts to re-render the error boundary's contents

---

### Global Error Handling

For errors that occur outside of specific route error boundaries, or to provide a fallback for all routes without custom `error.tsx` files, you can create a `global-error.tsx` file in the app directory.

**When to use:**

- Catch errors in the root layout
- Provide a universal fallback error UI
- Handle errors in routes without specific error handlers

<details>
<summary><strong>View Code Example: global-error.tsx</strong></summary>

```tsx
// app/global-error.tsx
"use client"; // This component must be a client component

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong globally!</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

</details>

**Note:** Global error **must** include `<html>` and `<body>` tags since it replaces the root layout when active.

---

### Error Hierarchy

**Priority Rule:** The **closest** `error.tsx` file to where the error occurs takes priority.

#### Example Structure:

```
app/
├── global-error.tsx           → Catches all unhandled errors
├── error.tsx                  → Catches errors in app root
├── dashboard/
│   ├── error.tsx              → Catches errors in dashboard/*
│   ├── analytics/
│   │   ├── error.tsx          → Catches errors in dashboard/analytics/*
│   │   └── page.tsx
│   └── users/
│       └── page.tsx           → Uses dashboard/error.tsx
└── blog/
    └── page.tsx               → Uses app/error.tsx
```

**Error Resolution Flow:**

1. Error occurs in `dashboard/analytics/page.tsx`
2. Next.js looks for `dashboard/analytics/error.tsx` ✅ (Found - handles error)
3. If not found, would check `dashboard/error.tsx`
4. If not found, would check `app/error.tsx`
5. Finally, would fall back to `global-error.tsx`

**Key Takeaway:** Each route can have its own custom error handling, and Next.js automatically uses the nearest error boundary. This allows for granular control over error presentation at different levels of your application.

---

## Loading States

### Creating Loading UI

Next.js automatically shows loading states using `loading.tsx` files. While data is being fetched or a page is rendering, the loading UI is displayed seamlessly using **React Suspense** under the hood.

**Key Features:**

- ⏳ Automatic loading states
- 🎯 Route-specific loaders
- 🔄 No manual Suspense configuration needed
- 📍 Hierarchical loading boundaries
- ✨ Instant loading UI without additional setup

#### Creating a Loading Component

Create a `loading.tsx` file in any route folder:

<details>
<summary><strong>View Code Example: Basic loading.tsx</strong></summary>

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      <p className="ml-4 text-xl">Loading dashboard...</p>
    </div>
  );
}
```

</details>

**Advanced Example with Skeleton UI:**

<details>
<summary><strong>View Code Example: Skeleton Loading</strong></summary>

```tsx
// app/products/loading.tsx
export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
```

</details>

**How it works:**

- When navigating to a route, Next.js immediately shows the `loading.tsx` component
- Once the page is ready, it replaces the loading UI with the actual content
- This creates a smooth, instant feedback experience for users

---

### Loading Hierarchy

Similar to error handling, **the closest `loading.tsx` file** takes priority.

#### Example Structure:

```
app/
├── loading.tsx                → Global loading state
├── dashboard/
│   ├── loading.tsx            → Dashboard loading
│   ├── analytics/
│   │   ├── loading.tsx        → Analytics specific loading
│   │   └── page.tsx
│   └── users/
│       └── page.tsx           → Uses dashboard/loading.tsx
└── blog/
    ├── loading.tsx            → Blog loading
    └── [slug]/
        └── page.tsx           → Uses blog/loading.tsx
```

**Loading Resolution:**

- When navigating to `/dashboard/analytics`, shows `dashboard/analytics/loading.tsx`
- When navigating to `/dashboard/users`, shows `dashboard/loading.tsx`
- When navigating to `/blog/my-post`, shows `blog/loading.tsx`
- If no specific loading file exists, Next.js will use the closest parent `loading.tsx`

**Best Practices:**

- Create loading states that match your page layout for smoother transitions
- Use skeleton screens for better perceived performance
- Keep loading UI simple and lightweight
- Consider adding loading states at multiple levels for better UX

---

## Additional Resources

### Official Documentation

- [Next.js Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Next.js Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Next.js Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)

---

## Notes for Future Updates

This README will be expanded as I continue learning. Upcoming topics may include:

- ~~Route Groups~~ ✅
- ~~Error Handling~~ ✅
- ~~Loading States~~ ✅
- Dynamic routes
- API routes
- Middleware
- Server and Client Components
- Data fetching strategies
- Parallel routes
- Intercepting routes
- Metadata and SEO
- Image optimization
- And more...

---

**Last Updated:** October 2025

**Project Status:** 🚧 Actively Learning

---

## Quick Reference

### File Conventions Summary

| File               | Purpose                | Must be Client Component? |
| ------------------ | ---------------------- | ------------------------- |
| `page.tsx`         | Route UI               | No                        |
| `layout.tsx`       | Shared UI for segments | No                        |
| `loading.tsx`      | Loading UI             | No                        |
| `error.tsx`        | Error UI               | Yes ✅                    |
| `global-error.tsx` | Global error UI        | Yes ✅                    |
| `route.ts`         | API endpoint           | N/A                       |

### Remember

- **Route Groups**: Use `(folderName)` to organize without affecting URLs
- **Error Handling**: Closest `error.tsx` takes priority
- **Loading States**: Closest `loading.tsx` takes priority
- **Hierarchy Matters**: Both error and loading files follow the folder structure priority

---

_Happy Learning! Keep building amazing things with Next.js! 🚀_
