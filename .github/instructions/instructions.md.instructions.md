---
description: Always-on repository instructions for implementation quality, styling conventions, SEO checks, responsiveness, and clarification behavior.
applyTo: "**"
---

# Bulk Vapes USA Agent Instructions

Use these rules on every task in this repository.

## 1. Always Review Project Docs First

Before coding, check and follow relevant documentation in the `docs/` directory.

Priority references:
1. `docs/client_requirements.md`
2. `docs/prd_doc.md`
3. `docs/BACKLOG.md`
4. `docs/ENV_SETUP.md`
5. `docs/SANITY_MIGRATION_AND_TEMPLATE.md`

If docs conflict, prioritize `docs/client_requirements.md`, then `docs/prd_doc.md`, and note any mismatch in your response.

## 2. Styling Standard

Use `app/globals.css` as the primary styling base for global tokens, shared utility classes, and theme variables.

Rules:
1. Keep styling consistent with existing global CSS conventions.
2. Do not introduce unrelated styling systems when `app/globals.css` can handle the requirement.
3. Add reusable variables/tokens in `app/globals.css` instead of hardcoding repeated values.

## 3. Component Modularity

Use modular component structure for all UI work.

Rules:
1. Prefer small reusable components over large monolithic page files.
2. Keep business logic separate from presentational components when practical.
3. Place shared UI in `components/` and keep page routes in `app/` focused on composition.
4. Reuse existing components before creating new ones.
5. Check `components/ui/` for existing shadcn/ui components before creating a new component from scratch.
6. If a required shadcn/ui component does not exist yet, add it via shadcn first, then extend it only if needed.

## 4. Responsiveness Is Mandatory

Every UI change must be responsive.

Checklist:
1. Validate mobile-first behavior.
2. Ensure layout integrity at common breakpoints (mobile, tablet, desktop).
3. Prevent overflow, clipping, and unusable touch targets.

## 5. SEO Check After Each Build Task

After completing any page or major UI implementation, verify SEO essentials.

Checklist:
1. Single, clear H1 per page.
2. Logical heading hierarchy (H1 -> H2 -> H3).
3. Title and meta description are present and relevant.
4. Internal links align with the SEO architecture in docs.
5. Image alt text is meaningful.

## 6. Clarification Behavior

If any requirement is unclear, contradictory, or missing, ask the user for clarification before making assumptions.

Default behavior:
1. Ask concise clarification questions.
2. State assumptions only when moving forward is necessary.
3. Prefer confirmation over silent guessing for architecture, SEO intent, or compliance-sensitive changes.