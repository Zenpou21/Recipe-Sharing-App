# Recipe Sharing App

A modern React-based recipe application built with TypeScript, featuring async operations, real-time search, and favorites.

## Development Process

### Approach & Major Steps

1. **Project Setup**
   - Initialized Vite + React + TypeScript project
   - Configured HeroUI v2.8.8 with Tailwind CSS v4
   - Set up routing with React Router DOM
   - Added Poppins font family for typography

2. **Core Features Implementation**
   - Built recipe CRUD operations with async handling
   - Implemented ingredient management with JSON structure (name, quantity, unit)
   - Created reusable components (Drawer, Modal, Skeleton, ConfirmationModal)
   - Added separated loading states per operation (all, one, create, update, delete)

3. **Async Coordination**
   - Implemented debounced search with race condition prevention (500ms delay)
   - Added optimistic UI updates with rollback on failure for favorites
   - Built request cancellation using AbortController
   - Added retry logic with exponential backoff (1s → 2s → 4s, max 3 retries)

4. **State Management**
   - Favorites persistence with localStorage
   - Request ID tracking for search and favorites to prevent stale updates
   - Synchronized operations (await fetchRecipes after create/update/delete)

5. **UI/UX Enhancements**
   - Responsive design (mobile-first, grid layout)
   - Empty states and loading skeletons
   - Form validation and reset on success
   - Toast notifications for success/error feedback

### Challenges & Solutions

**Challenge 1: Race Conditions in Search**
- **Problem:** Rapid typing caused stale search results to overwrite newer ones
- **Solution:** Implemented request ID tracking with debouncing (500ms)

**Challenge 2: Form Data Persisting After Submit**
- **Problem:** Drawer stayed open during fetchRecipes, showing form data briefly
- **Solution:** Changed from parallel to sequential execution (await fetchRecipes)

**Challenge 3: Concurrent Favorites Updates**
- **Problem:** Multiple rapid clicks caused inconsistent favorite states
- **Solution:** Per-recipe request ID tracking, only latest intent persists

**Challenge 4: Request Not Cancelling on Drawer Close**
- **Problem:** Closing drawer mid-submit still created the recipe
- **Solution:** Added useEffect to cancel requests when drawer closes

**Challenge 5: AbortError Showing to Users**
- **Problem:** Cancelled requests showed "AbortError: Aborted" toast
- **Solution:** Created isAbortError() helper checking multiple error types

## Tools & Libraries

### Frameworks & Core Libraries
- **React 19.2.0** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing

### UI Libraries
- **HeroUI v2.8.8** - Component library with Tailwind CSS v4 support
- **Tailwind CSS v4.1.18** - Utility-first CSS
- **Lucide React** - Icon library

### HTTP & State Management
- **Axios** - HTTP client with request cancellation support
- **React Hooks** - useState, useEffect, useCallback, useMemo, useRef

### AI Tools Used

**GitHub Copilot / ChatGPT / Claude (via VS Code)**
- **Architecture Design:** Helped design the custom hook pattern for useRecipes
- **Async Pattern Implementation:** Provided guidance on AbortController and retry logic
- **Code Refactoring:** Suggested DRY improvements (executeWithAbort helper function)
- **Bug Fixing:** Assisted in debugging race conditions and abort error handling
- **TypeScript Types:** Helped define proper interfaces and type safety
- **ES2020+ Features:** Recommended nullish coalescing (??) over logical OR (||)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting (auto-applied)
- **Browser DevTools** - Network tab for request monitoring

## External Resources

### Documentation & Tutorials
- [HeroUI Documentation](https://heroui.com/docs) - Component API reference
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) - TypeScript patterns
- [Axios Documentation](https://axios-http.com/docs/cancellation) - Axios cancellation tokens

### Code Patterns Referenced
- Exponential backoff retry logic pattern
- Optimistic UI pattern from React documentation

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm installed
- Backend API running at `https://rsa-api.flowcsolutions.com/api`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zenpou21/Recipe-Sharing-App.git
   cd Recipe-Sharing-App