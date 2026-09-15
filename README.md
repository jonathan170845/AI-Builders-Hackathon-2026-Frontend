# Veritas

Veritas is a decision-intelligence application that helps leaders and teams test important decisions before committing to them. It breaks down the assumptions behind a decision, presents failure patterns from comparable cases, evaluates financial resilience, and creates a validation plan.

## Features

- Runs a stress test for a business decision.
- Identifies and evaluates critical assumptions.
- Calculates contribution margin, operating profit, burn rate, runway, and break-even point.
- Displays failure mechanisms, comparable companies, and supporting sources.
- Creates validation experiments and lets users review their analysis history.

## Tech Stack

- React 18 and TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Run Locally

Ensure that Node.js and pnpm are installed, then run:

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Available Commands

```bash
pnpm run dev        # Start the development server
pnpm run build      # Create a production build
pnpm run preview    # Preview the production build locally
pnpm run lint       # Run ESLint
pnpm run typecheck  # Check TypeScript types
```

## API and Application Notes

New analyses and analysis history are powered by the FastAPI backend. Run the backend at `http://127.0.0.1:8000`; Vite proxies `/api` requests to it. The `.env.example` file defines `VITE_API_BASE_URL=/api/v1`.

Do not place provider API keys in the frontend or in `VITE_*` environment variables, as these values are exposed to the browser.

- `/new` submits a decision for analysis.
- `/analyses/:id` restores an analysis' progress or report after a page refresh.
- `/history` loads persistent, paginated analysis history.

Polling stops when an analysis completes or fails, permits only one active request, and is cancelled when the user leaves the page. If the connection is interrupted, the job may still be running; check the history page before submitting the same decision again.

Financial inputs are entirely optional and are enabled through a checkbox. Actual financial results are calculated by the backend using the same monetary unit supplied in the input, without assuming a currency. `null` values are displayed as `N/A`.

Only `/demo` uses static mock data and is clearly labelled as such. Decision details and evidence may be sent to an external AI provider; the disclosure is available on the input page.

## Verification

```bash
pnpm run api:check
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

## API Contract and Generated Types

`contracts/openapi.json` is exported from the backend. After an intentional API-contract change, run:

```bash
# In the backend repository:
uv run python scripts/export_contract.py

# In the frontend repository:
node scripts/generate-api-types.mjs ../AI-Builders-Hackathon-2026-Backend/contracts/openapi.json
```

The client types in `src/api/types.generated.ts` are generated deterministically from OpenAPI, and CI checks for generated-type drift. UI tests use controlled responses for queued, processing, completed, failed, reconnection, nullable financials, and paginated history states. Test fixtures do not prove that external providers are available.

## Docker Deployment

For the full two-container setup, use `compose.yaml` in the backend repository. The frontend Nginx configuration includes an SPA fallback so deep links can be opened directly. The Dockerfile does not include `.env` files. Refer to the backend README for models, prepared data, migrations, and provider configuration.
