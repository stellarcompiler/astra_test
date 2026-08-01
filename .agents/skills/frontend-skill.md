
# Frontend Engineering Skill

## Purpose
Shared expertise for planning and implementing production-grade frontends. Optimize for React + TypeScript + Vite while preserving design fidelity, accessibility, performance, and maintainability.

## Stack
- React 19+
- TypeScript (strict)
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- TanStack Query (server state)
- Zustand (client state when Context is insufficient)
- React Hook Form + Zod
- Lucide Icons
- ESLint + Prettier

## Engineering Principles
- Reuse before creating.
- Composition over inheritance.
- Single responsibility per component.
- Keep business logic out of UI.
- Prefer declarative patterns.
- Mobile-first responsive design.
- Accessibility is mandatory.
- Performance is a feature.
- Never sacrifice design fidelity without documenting why.

## Project Structure
src/
- app/ (providers, routing)
- components/
  - ui/
  - shared/
- features/
- hooks/
- lib/
- services/
- styles/
- assets/
- types/
- utils/

## React Conventions
- Functional components only.
- Strict typing; avoid `any`.
- Keep props minimal.
- Lift state only when necessary.
- Memoize only after identifying render cost.
- Extract repeated logic into hooks.
- Prefer controlled composition over prop drilling.

## State
- Local: useState.
- Shared UI: Context.
- Complex client state: Zustand.
- Server state: TanStack Query.
- Derived state over duplicated state.

## Styling
- Tailwind utilities first.
- Extract reusable patterns into components.
- Use CSS variables for tokens.
- Consistent spacing scale.
- Avoid inline styles except dynamic transforms.

## Motion
- Use Framer Motion.
- Motion should communicate state.
- Animate transform/opacity over layout.
- Respect prefers-reduced-motion.
- Use variants for reusable animations.
- Avoid excessive simultaneous animations.

## Responsive
- Mobile-first.
- Validate phone, tablet, desktop.
- Prevent overflow.
- Preserve touch targets.
- Maintain visual hierarchy.

## Accessibility
- Semantic HTML.
- Keyboard navigation.
- Visible focus.
- ARIA only when required.
- Color contrast compliance.
- Screen-reader friendly labels.
- Alt text for informative images.

## Performance
- Route/code splitting.
- Lazy-load heavy features.
- Optimize SVGs/images.
- Avoid unnecessary renders.
- Virtualize long lists.
- Cache server data.
- Minimize bundle size.

## Design Fidelity
When design context exists:
- Preserve spacing, typography, colors, radius, shadows, hierarchy, constraints, responsive behavior and motion.
- Prefer SVG assets over raster.
- Reuse design tokens.

## Error UX
Always design:
- Loading
- Empty
- Error
- Retry
- Offline (when applicable)

## Testing
Plan for:
- Unit
- Component
- Integration
- Accessibility
- Responsive
- Interaction
- Visual regression where appropriate.

## Planner Guidance
For every request:
1. Analyze requirements.
2. Inspect existing architecture.
3. Reuse components.
4. Map design to components.
5. Define state/data flow.
6. Identify risks.
7. Produce atomic implementation tasks.
8. List assumptions and open questions.
9. Define acceptance criteria.

## Never
- Invent APIs.
- Duplicate components.
- Ignore accessibility.
- Hardcode design tokens.
- Optimize prematurely.
- Break existing conventions.

## Success Criteria
The resulting plan is deterministic, dependency-ordered, implementation-ready, reusable, accessible, performant, and suitable for autonomous coding agents.
