# MJTH.live Development Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build

## Project Structure
- `docs/` - VitePress documentation content
- `scripts/` - Data update scripts
- `.vue` files - Vue 3 components with script setup syntax

## Code Style
- Use TypeScript for type safety
- Follow Vue 3 Composition API with `<script setup>` syntax
- Use Thai language for user-facing content
- Import components directly with relative paths
- Named exports preferred over default exports

## Component Styling
- Use scoped CSS in Vue components
- Use CSS variables for theming (follow VitePress conventions)
- Responsive design with mobile-first approach

## Data Handling
- Use nanostores for state management
- Async data fetching in `onMount` hooks
- Local data in JSON files under `docs/public/`
- Server data fetched with appropriate error handling

## Naming Conventions
- PascalCase for components
- camelCase for variables and functions
- kebab-case for HTML attributes and CSS classes