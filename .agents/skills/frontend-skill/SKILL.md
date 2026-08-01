---
name: frontend-engineering
description: Production frontend engineering skill for implementing features from docs/design-system.md using React, TypeScript, Vite, Tailwind CSS and Framer Motion. Complements the Frontend Builder Agent by providing engineering standards, architectural guidance and implementation best practices.
version: 2.0
priority: high
---

# Frontend Engineering Skill

## Purpose

This skill complements the **Frontend Builder Agent** by defining the engineering standards used during implementation.

The agent determines **what** to build from `docs/design-system.md`.

This skill defines **how** it should be built.

It is an implementation skill—not a planning or design skill.

---

# Source of Truth

Always follow, in order of precedence:

1. `docs/design-system.md`
2. Existing project architecture
3. Existing reusable components
4. Existing design tokens
5. Existing project conventions

If a conflict exists, prefer the higher-priority source.

Do not redesign or reinterpret the implementation plan.

---

# Implementation Philosophy

Every change should be:

- Production-ready
- Deterministic
- Buildable
- Maintainable
- Reusable
- Accessible
- Performant
- Minimal

Prefer extending existing code over creating new abstractions.

Optimize for long-term maintainability rather than short-term convenience.

---

# Preferred Technology Stack

## Core

- React 19+
- TypeScript (Strict Mode)
- Vite

## Routing

- React Router

## Styling

- Tailwind CSS
- CSS Variables
- Existing Design Tokens

## Motion

- Framer Motion

## State

- Local State → `useState`
- Shared UI State → Context API
- Complex Client State → Zustand
- Server State → TanStack Query

## Forms

- React Hook Form
- Zod

## Icons

- Lucide React

## Quality

- ESLint
- Prettier

Follow the existing project stack whenever available.

---

# Engineering Principles

Always

- Reuse before creating.
- Prefer composition.
- Keep components focused.
- Write strongly typed code.
- Keep implementations concise.
- Prefer declarative React.
- Separate UI from business logic.
- Keep architecture consistent.
- Preserve design fidelity.

Never

- Duplicate components.
- Introduce unnecessary abstractions.
- Over-engineer.
- Hardcode design values.
- Break existing conventions.
- Modify unrelated features.

---

# Implementation Workflow

For every implementation task:

## 1. Understand

Read the assigned section from `docs/design-system.md`.

Understand

- scope
- acceptance criteria
- dependencies
- affected components

---

## 2. Inspect

Search for existing

- components
- layouts
- hooks
- utilities
- animations
- icons
- styles

Always reuse before creating.

---

## 3. Implement

Modify the smallest number of files necessary.

Prefer

- extending components
- composing components
- extracting reusable logic only when justified

Keep implementations compact.

---

## 4. Validate

Ensure

- TypeScript passes
- lint passes
- build succeeds
- tests pass when available

---

## 5. Verify

Validate

- layout
- responsiveness
- interactions
- accessibility
- console output
- runtime behavior

Never assume correctness.

---

# Component Standards

Components should

- have one responsibility
- expose minimal APIs
- be reusable
- be strongly typed
- avoid unnecessary props
- avoid duplicated logic

Prefer composition over inheritance.

Create custom hooks only for shared behavior.

Avoid premature abstraction.

---

# State Management

Use the simplest appropriate solution.

| Scenario | Preferred Solution |
|----------|--------------------|
| Local UI | useState |
| Derived Data | Compute directly |
| Shared UI | Context API |
| Complex Client State | Zustand |
| Server State | TanStack Query |

Rules

- Keep state close to ownership.
- Avoid duplicated state.
- Prefer derived values.
- Minimize global state.

---

# Styling Standards

Prefer

- Tailwind utilities
- Existing utility classes
- Shared design tokens
- CSS variables

Maintain

- spacing scale
- typography scale
- border radius
- shadows
- colors
- breakpoints

Avoid

- duplicated utility chains
- arbitrary values unless justified
- inline styles except transforms

---

# Motion Standards

Use Framer Motion only when motion improves UX.

Prefer

- transform
- opacity
- variants
- layout animations

Avoid

- excessive motion
- layout thrashing
- distracting animations

Always respect reduced-motion preferences.

---

# Responsive Design

Design mobile-first.

Verify

- mobile
- tablet
- desktop

Prevent

- overflow
- clipped content
- layout shifts

Maintain

- visual hierarchy
- readable typography
- adequate touch targets

---

# Accessibility

Every implementation should include

- semantic HTML
- keyboard navigation
- visible focus states
- descriptive labels
- accessible forms
- sufficient color contrast

Use ARIA only when semantic HTML is insufficient.

---

# Performance

Optimize for runtime performance.

Prefer

- lazy-loaded routes
- code splitting
- memoization only when beneficial
- reusable assets
- optimized SVGs
- efficient rendering

Avoid

- unnecessary re-renders
- unnecessary effects
- excessive component nesting
- duplicated calculations

---

# Design Fidelity

When implementing from a design reference:

Preserve

- layout
- typography
- spacing
- colors
- radius
- shadows
- sizing
- responsive behavior
- interaction patterns
- visual hierarchy

Do not reinterpret the design.

---

# UX States

Account for

- Loading
- Empty
- Error
- Retry
- Offline
- Disabled
- Success

Every interactive feature should degrade gracefully.

---

# Code Quality Checklist

Before completing a task, verify:

- No duplicated logic
- No dead code
- No unused imports
- No unnecessary abstractions
- Strong typing throughout
- Small, focused components
- Consistent naming
- Readable implementation
- Minimal file changes
- Production-ready quality

---

# Validation Commands

Execute whenever applicable

```bash
npm install
npm run lint
npm run build
npm test
```

Resolve practical issues before considering the task complete.

---

# Success Criteria

A successful implementation:

- Follows `docs/design-system.md`
- Reuses existing architecture
- Produces production-quality code
- Maintains design fidelity
- Passes validation
- Is accessible and responsive
- Uses concise, maintainable implementations
- Leaves the repository in a buildable state
- Complements the Frontend Builder Agent without redefining its responsibilities