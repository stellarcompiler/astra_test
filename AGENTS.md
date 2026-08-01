# AGENTS.md

## Project

Modern, mobile-first responsive website for ASTRA Space Club built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router

Primary target: smartphones. Backend interaction is minimal.

---

## Core Principles

- Mobile-first
- Keep solutions simple
- Prefer reusable components
- Write readable, maintainable code
- Avoid unnecessary dependencies
- Preserve consistency across the project

---

## React

- Use functional components.
- Prefer composition over inheritance.
- Keep components focused on a single responsibility.
- Extract reusable logic into custom hooks.
- Avoid duplicated code.

---

## Responsive Design

Priority:

1. Mobile
2. Tablet
3. Desktop

Prefer:

- Flexbox
- CSS Grid
- Relative units
- `clamp()`
- `aspect-ratio`

Avoid:

- Fixed layouts
- Horizontal scrolling
- Magic numbers

---

## Styling

- Use Tailwind CSS.
- Reuse existing design patterns.
- Keep spacing and typography consistent.
- Avoid inline styles unless necessary.

---

## Animation

Prefer:

- `transform`
- `opacity`

Avoid animating layout properties such as:

- width
- height
- top
- left

Animations should be smooth, lightweight, and respect `prefers-reduced-motion`.

---

## Accessibility

Every feature should:

- Use semantic HTML
- Support keyboard navigation
- Include visible focus states
- Maintain sufficient color contrast
- Use ARIA only when needed

---

## Performance

Prefer:

- Lazy loading
- Optimized images
- SVG assets
- Small bundles

Avoid unnecessary re-renders and large dependencies.

---

## Code Quality

- Use TypeScript.
- Use descriptive names.
- Prefer early returns.
- Keep files modular.
- Don't modify unrelated code.

---

## Definition of Done

A task is complete when:

- It works correctly.
- It is responsive.
- It is accessible.
- It follows project conventions.
- It introduces no unnecessary complexity.