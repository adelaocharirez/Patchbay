# Patchbay

A hub for connecting Claude to your tools. Pick connectors, copy fill-in prompts, grab ready-made agents, and see which Claude repos people are starring.

Built with Next.js (App Router), TypeScript, and Zod. No database. All content lives in typed files under `src/data`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Checks

```bash
npm run typecheck
npm test
npm run build
npm run ci         # all three, in order
```

## Add a connector, prompt, or agent

Edit the matching file in `src/data`. Each file is validated with Zod when the app loads, so a missing URL or a bad risk level fails the build and the tests instead of reaching users.

## Automation

- `.github/workflows/ci.yml` runs type check, tests, and build on every push and pull request.
- `.github/workflows/refresh.yml` runs once a day (and on demand). It updates star counts in `src/data/repos.json`, checks each remote connector address, writes `src/data/linkstatus.json`, and commits any changes.

The refresh workflow needs repository setting **Actions > General > Workflow permissions** set to "Read and write". Commits it pushes do not trigger CI because they use the built-in token, so a green CI run on a refresh commit does not exist. Vercel still redeploys on that push.

## Deploy

Import the repo in Vercel. No environment variables are needed.
