# AI Study Assistant — Weeks 10–11

## Requirements
Node.js 22 or later. No npm dependencies required. The course data in `data/courses.json` is **fictional demonstration data**, not university information.

## Quick start
1. Open a terminal in this repository.
2. Run `npm test` for deterministic offline tests.
3. Run `npm run proposal`, `npm run report -- 10`, and `npm run report -- 11` to check documents.
4. To use a live model, set environment variables in your terminal: `LLM_API_KEY`, `LLM_MODEL`, optionally `LLM_BASE_URL`. Copying `.env.example` alone will **not** load variables automatically; Node reads the current process environment.
5. Run `npm run ask -- "What are the deadlines for AI101?"`.

### PowerShell example
```powershell
$env:LLM_API_KEY = "YOUR_KEY_HERE"
$env:LLM_MODEL = "YOUR_TOOL_CALLING_MODEL"
# Optional for OpenAI-compatible alternative providers:
# $env:LLM_BASE_URL = "https://provider.example/v1"
npm run ask -- "How many credits is AI101?"
```
Never commit the actual key. `LLM_BASE_URL` defaults to `https://api.openai.com/v1`. Choose a provider/model that supports Chat Completions function tools.

## Architecture and boundaries
`src/cli.mjs` -> `src/agent.mjs` -> `src/model-client.mjs` -> provider. If the model selects `get_course_info` or `get_course_deadlines`, `src/tools.mjs` validates arguments and reads `data/courses.json`, then returns a tool message to the model. Tool logs include names and results, not credentials. Max four model rounds, max five calls per round. This is a prototype; it does not access Moodle or any university account.

## Evidence and limitations
`npm test` tests mock model behavior and the real local tool executor. It does **not** make a real LLM call. A live smoke test requires user credentials and network access. This ZIP does not contain real student commits; fork the instructor repository, transfer the files, and commit/push your actual work. Do not backdate or claim historical contributions. Keep future weekly templates unchanged until that work is done.

## Useful commands
- `npm test` — tests
- `npm run proposal` — validate proposal
- `npm run report -- 10` / `npm run report -- 11` — validate weekly reports
- `npm run ask -- "What deadlines are recorded for ML201?"` — live query after environment setup
- `npm run validate` — validates all currently due reports (future weeks are intentionally blank)

## AI assistance disclosure
ChatGPT assisted with architecture, code, tests and draft reports. Student must review, run, understand, and disclose the assistance during submission.
