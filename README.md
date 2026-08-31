# Pantry Ledger

A small public recipe SPA. Search and filter meals, open a recipe, and build a shopping list.

This is a **standalone sample** for job applications. It is not the production Legend app. No auth, no database, no API keys, no private training data.

## Stack

- Vite
- React 18
- React Router
- Recipes live in `src/data/recipes.json` so the content can be swapped without touching components

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## What a reviewer can look at

- Component split: catalog, recipe detail, shopping list
- Client-side search, meal filter, and sort
- Shared state lifted in `App.jsx` (selected recipes)
- Structured recipe records (macros, tags, ingredients, steps)

## Swap in real recipes

Edit `src/data/recipes.json`. Keep the same shape:

```json
{
  "id": "unique-slug",
  "title": "Name",
  "meal": "Breakfast",
  "minutes": 20,
  "servings": 2,
  "tags": ["high-protein"],
  "blurb": "One sentence.",
  "macros": { "calories": 400, "protein": 30, "fat": 20, "netCarbs": 6 },
  "ingredients": ["..."],
  "steps": ["..."]
}
```

## Intentionally not included

- User accounts
- Payment or LLM calls
- The larger coaching product this page was inspired by
