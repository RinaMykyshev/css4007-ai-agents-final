# Project Proposal — Semester Week 10

## Project Title
AI Study Assistant — Course Information and Deadline Agent

## Problem Description
Students often need to find course credits, assignment deadlines, and basic study guidance across separate sources. Searching manually wastes time and can lead to missed tasks. This prototype uses an LLM to interpret a question and select a relevant read-only tool. It uses a **small, fictional local course catalog**; it does not claim access to actual university records.

## Target Users
University students who want simple natural-language access to sample course metadata and deadline information; instructors demonstrating safe LLM tool calling.

## Selected Difficulty
C — Intermediate (LLM tool-using agent). Week 11 delivers a first integration prototype; the complete C-level workflow is targeted for Week 13.

## Expected Functionality
- Accept natural-language questions through a command-line interface.
- Provide general study advice without tool calls.
- Select between course information and deadline tools using the model, not keyword routing.
- Return answers grounded in the local course catalog.
- Report missing courses and invalid tool arguments clearly.
- Log observable tool execution without secrets.
- Limit tool rounds to prevent uncontrolled execution.

## Proposed Functions
- `complete(messages, tools, options)` — Purpose: request a model completion; input: chat messages, tool schemas, optional injected fetch/environment; output: assistant message; dependencies: configured OpenAI-compatible Chat Completions API, Node.js fetch.
- `executeTool(name, args)` — Purpose: perform approved read-only catalog lookup; input: tool name and validated `{course_id}`; output: course metadata, deadlines, or a missing-course error; dependencies: `data/courses.json`.
- `runAgent(input, options)` — Purpose: coordinate model-selected tools and final response; input: user text and optional model/logger; output: `{answer, trace}`; dependencies: model adapter and tool executor.
- CLI entry `src/cli.mjs` — Purpose: run the assistant from terminal; input: quoted question; output: response and tool trace; dependencies: `runAgent`.

## Proposed Agent Tools
1. `get_course_info(course_id: string)` — Exposes title and credits for an existing course; needed when the user asks about course metadata.
2. `get_course_deadlines(course_id: string)` — Exposes recorded deadlines for a course; needed for scheduling and due-date questions.
Both tools are read-only, have JSON schemas, and validate arguments at execution time. The model chooses the tool using native tool calling; it cannot access arbitrary files.

## Model Selection
OpenAI-compatible Chat Completions interface, configured with `LLM_MODEL`, `LLM_API_KEY`, and optionally `LLM_BASE_URL`. A suitable tool-calling model must be chosen by the student according to available provider access. No live API request has been verified during preparation; tests inject mock responses.

## Architecture
```text
Student -> CLI -> runAgent -> LLM Chat Completions API
                           |         |
                           |    model-selected tool call
                           v         v
                       validate -> read-only course tools -> local JSON catalog
                           |                           |
                           +---- tool result -> LLM ---+
                                         |
                                    final answer
```
Execution is bounded to four model rounds, with a maximum of five tool calls per round. No external writes are allowed.

## Example Requests
1. "How many credits is AI101?" (course information tool)
2. "What deadlines are recorded for ML201?" (deadline tool)
3. "How can I prepare for an exam?" (direct answer without tools)
4. "When is CS999 due?" (missing-course handling)

## Evaluation Plan
Use Node's built-in test runner for unit and integration tests with deterministic fake model responses. Verify both tool outputs, unknown courses, argument validation, no-tool answers, LLM-selected tool execution, malformed calls, round limits, invalid input, and API failures. Run `npm test`, `npm run proposal`, `npm run report -- 10`, and `npm run report -- 11`. Test a live provider separately once credentials are configured; do not represent mock tests as a live integration.

## Weekly Milestones
- Week 10 (Nov 2–8): scope, C-level choice, architecture, tool specifications, proposal.
- Week 11 (Nov 9–15): Node environment, API adapter, CLI, first model-selected tool loop, mocked tests, setup documentation.
- Week 12 (Nov 16–22): input/output schemas, richer study workflows, usability and tests.
- Week 13 (Nov 23–29): live verification of two model-selected tools, logs, error recovery.
- Week 14 (Nov 30–Dec 6): complete tool-calling workflow and demonstrations.
- Week 15 (Dec 7–13): resilience, validation, more tests and failure scenarios.
- Week 16 (Dec 14–20): evaluation on realistic questions, improvements, report.
- Week 17 (Dec 21–22): final README, final report, demo, repository link and commit hash.
