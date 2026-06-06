# ShopZone SPA Architecture - Engineer Prompts

This document lists realistic developer prompts used during the engineering phase of the **ShopZone** production Single Page Application. It covers state management design, protected route patterns, dynamic URL structures, and performance optimizations.

---

## 1. Context API State Architecture
**Prompt:**
> "I am building a premium React e-commerce frontend. I need to design a clean Context API wrapper to handle global state. It should persist `cartItems` and guest `isLoggedIn` states in `localStorage` so they survive browser refreshes. I want to calculate the total list count and subtotal price reactively using dynamic derivations inside the provider instead of storing them as redundant states. How can I architect this safely using TypeScript, and provide standard helpers like `addToCart()`, `updateQuantity()`, `removeFromCart()`, and `clearCart()`?"

---

## 2. Dynamic Product Fetching & Category Parameter Matching
**Prompt:**
> "I am setting up the `/shop` route and want to pull product feeds from `https://dummyjson.com/products?limit=100`. In my home landing page, I have cards for 'Beauty', 'Fashion', 'Electronics', and 'Furniture'.
> When a user clicks a card, I will route them to `/shop?category=beauty`. How can I read this query param safely in `/shop` using React Router's `useSearchParams`, and apply filtering logic matching DummyJSON categories (since DummyJSON doesn't have a single category for 'Electronics' but splits it into 'smartphones' and 'laptops')? Please provide stable local filter hooks that support both category search and custom tabs like 'Essentials' or 'New Arrivals'."

---

## 3. Safe Guest Authentication & Protected Redirects
**Prompt:**
> "I need to construct a `/checkout` page that should only be accessible if Guest Login is active. Otherwise, I should force-redirect unauthorized guests trying to enter back to the `/login` route.
> Crucially, I want to capture where they came from so that after clicking 'Login as Guest' on `/login`, the application immediately redirects them back to `/checkout` or the specific page they were viewing. Can you show me how to write a highly modular `<ProtectedRoute>` wrapper around `react-router-dom`'s `<Navigate>` and state locations?"

---

## 4. E-Commerce Cart Logic (Avoid Infinite Loops & Redundant Renders)
**Prompt:**
> "When building `/product/:id`, I want to fetch specific item specs from `https://dummyjson.com/products/${id}`. I am experiencing a bug where my fetch triggers infinite re-renders because of how `useEffect` dependencies are configured.
> Help me write a robust, error-guarded fetch block using standard lifecycle hooks, and include a visual quantity selection widget (+ and - counters) so the user can select 3 or 4 units of a product and add them collectively to the global context cart."

---

## 5. Vercel Client-Side Rewrite configurations
**Prompt:**
> "I am deploying my client-side React Router SPA. When I refresh the page on routes like `/cart` or `/product/15`, I get a 404 error from the server container. How can I write a standard `vercel.json` rewrite configuration so all resource requests resolve cleanly to `index.html`?"

---

## 6. Premium Brand Curation & Design Inspiration (Landbook & Stitch UI Alignment)
**Prompt:**
> "To elevate the visual identity of ShopZone beyond typical 'AI-generated defaults' or plain bootstrap templates, I want to pull layout inspiration from Landbook's top-performing desktop landing pages and Stitch's minimalist, tactile UI patterns.
> Specifically:
> - I love Landbook's editorial-style headers featuring bold display weights paired with spacious negative space. How can I map that layout structure to our Home welcome banner?
> - How do I integrate Stitch-like micro-animations (subtle card scaling on hover, soft background color transitions) and distinct borders to indicate interactive touch targets smoothly in Tailwind without causing visual noise?
> - Provide style combinations featuringInter as the workspace body typeface mixed with Slate tints to ensure clean density and professional visual hierarchies."
