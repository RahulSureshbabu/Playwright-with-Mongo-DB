# App Requirements

## 1. Purpose
The demo app provides a simple UI flow to validate end-to-end browser automation using Playwright.

## 2. Scope
The app is a static single-page interface that:
- accepts a user name,
- generates a greeting when a button is clicked,
- falls back to a guest greeting when no name is provided.

## 3. Functional Requirements

### FR-1: Page title and heading
- The page shall render the heading text: `Welcome to UI Test Sandbox`.

### FR-2: Name input field
- The page shall provide a text input with id `name-input`.
- The input shall allow the user to type any name value.

### FR-3: Greeting action
- The page shall provide a button with id `greet-btn` and label `Generate greeting`.
- Clicking this button shall trigger greeting generation.

### FR-4: Empty input behavior
- If the trimmed input value is empty at click time, the app shall display `Hello, Guest!`.

### FR-5: Non-empty input behavior
- If the trimmed input value is non-empty at click time, the app shall display `Hello, <name>!` where `<name>` is the trimmed input value.

### FR-6: Output region
- The app shall render greeting output in an element with id `greeting-output`.
- The output region shall be announced politely to assistive technology via `aria-live="polite"`.

### FR-7: REST API endpoint
- The app shall expose a `POST /api/greet` endpoint.
- The endpoint shall accept a JSON body with an optional `name` field.
- The endpoint shall return a JSON response containing `id`, `greeting`, and `resolvedName`.
- The frontend shall call this endpoint when the button is clicked; the UI shall display the greeting returned by the API.

### FR-8: Greeting persistence
- Every greeting generated through the API shall be persisted to the `greetings` table in the MySQL database.
- Persistence shall occur on every button click, regardless of whether a name was entered.

### FR-9: Database record structure
- Each persisted greeting record shall contain the following fields:
  - `name_input` — the raw value entered by the user (empty string if no name was provided).
  - `resolved_name` — the effective name used for the greeting (`Guest` when input is empty).
  - `greeting_text` — the full greeting string, e.g. `Hello, Rahul!`.
  - `created_at` — the UTC timestamp when the record was inserted.

## 4. Non-Functional Requirements
- The app shall be served by a Node.js/Express backend (`server.js`) rather than as plain static files.
- The backend shall wait for the MySQL database to become available before accepting requests (retry up to 20 times with a 1.5 s delay).
- The UI shall remain usable on desktop and mobile viewport sizes.
- The app shall be testable through Playwright using stable selectors and accessible roles.
- The database shall run in an isolated Docker container to ensure portability and environment parity.
