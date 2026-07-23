# Project Brief — Google Pay AI Checkout (Antigravity + MCP)

## What this is

An internship training assignment (CanSpirit AI). The task is to implement Google's
official codelab — "Vibe-Code Google Pay Integrations with MCP Servers" —
https://codelabs.developers.google.com/codelabs/gpay-api-vibe-code-mcp-servers

The codelab teaches building a Google Pay checkout by prompting an AI coding agent
(Antigravity) that is connected to the Google Pay & Wallet Developer MCP server.
Instead of relying on training-data memory of the API, the agent calls the MCP
server's `search_documentation` tool to ground every implementation decision in
the current, live API spec.

## Your role in this project

You (Antigravity) are the implementer. For every feature below, look up the
relevant spec via the MCP server's `search_documentation` tool before writing
code, and briefly tell me what you looked up before generating it. Don't rely on
memory for Google Pay API details — the whole point of this exercise is
MCP-grounded, spec-driven development.

## Scope — build these, in this order

1. Core checkout button — `isReadyToPay()` gating, button placement/styling,
   allowed card networks and auth methods, TEST environment.
2. Dynamic pricing — surcharge/discount based on `cardFundingSource`.
3. Recurring payments (MIT) — `RecurringTransactionInfo`, idempotency keys.
4. Express guest checkout — email, shipping, billing collected via the Pay API
   response, no separate account creation.

Explicitly out of scope: no backend/database, no long-horizon monitoring agent
(codelab's optional step 7) — these need infrastructure this project doesn't have.

## Constraints

- Plain HTML/CSS/vanilla JavaScript. No framework, no build step.
- TEST environment only — no real transactions, no production merchant ID.
- Repo structure: flat `src/` with one file per concern
  (`config.js`, `googlePayClient.js`, `pricing.js`, `recurring.js`,
  `guestCheckout.js`, `main.js`) — see `README.md` for the full layout.
- No card data should ever be logged or persisted by our own code — Google Pay
  returns an already-tokenized credential; treat it as opaque.

## What I want from you on every feature

1. Look up the current spec via MCP before implementing.
2. Tell me briefly what you found / which docs you queried.
3. Generate the code.
4. Flag anything you're unsure about instead of guessing.

## Reference

- Codelab: https://codelabs.developers.google.com/codelabs/gpay-api-vibe-code-mcp-servers
- Google Pay Web API docs: https://developers.google.com/pay/api/web/overview
