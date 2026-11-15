# Semester Week 11 Progress Report

## Completed Work
Prepared a Node.js 22+ CLI prototype, OpenAI-compatible Chat Completions adapter, two local read-only tools, model-directed tool-call loop, argument validation, bounded rounds, and deterministic automated tests. The API adapter is implemented but live provider success is **not verified**.

## Important Commits
- Commit hash: Not available — the supplied ZIP is not a Git checkout.
- Description: Prototype, tests and documentation prepared locally; meaningful commits must be made in the student's actual fork.
- Link: Not available until pushed.

## Current Functionality
The prototype can accept text, let a compatible LLM select tools, return local catalog results to the model, and print a final response. Mock-model tests cover these paths without credentials. Live operation requires the student's API key and a tool-calling model.

## Problems Encountered
No API credentials or real GitHub history were provided. Provider/network behavior cannot be confirmed through offline tests.

## Solutions
Use environment variables instead of hard-coded secrets, dependency injection for deterministic model tests, and explicit error messages for missing credentials, HTTP errors, invalid JSON and tool failures.

## What I Learned
A tool schema informs the LLM, but a separate validated executor performs the actual lookup. Tool responses must be appended to conversation history, and the model must produce a final grounded answer. Tests using fake API responses do not prove live connectivity.

## Next Week
Add more user-friendly deadline summaries, stricter structured-output checks, more varied test cases and a documented live-provider smoke test when credentials are available.
