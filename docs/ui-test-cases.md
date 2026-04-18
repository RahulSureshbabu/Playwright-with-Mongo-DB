# UI Test Cases

## Test Suite Overview
| Suite | File | What it tests |
|---|---|---|
| UI Tests | `tests/ui.spec.js` | DOM rendering and greeting output (no DB) |
| DB-backed Tests | `tests/ui.db.spec.js` | UI output **and** MySQL record persistence |
| BDD Scenarios | `features/greeting.feature` | Same flows driven through Cucumber/Gherkin |

## Preconditions (all suites)
- Dependencies installed via `npm install`.
- Browser installed via `npx playwright install chromium`.
- Tests run from repository root.
- Local app served at `http://127.0.0.1:4173` (auto-started by Playwright `webServer` config).

## Additional Preconditions (DB-backed tests)
- MySQL container running: `npm run db:up`.
- `.env` file present with DB credentials (copy from `.env.example`).
- Container must be healthy before running tests; `server.js` retries automatically.

---

## UI Test Cases (`tests/ui.spec.js`)

### TC-001: Home page loads with heading
- Requirement Mapping: FR-1
- Steps:
  1. Navigate to `/`.
  2. Locate heading role with name `Welcome to UI Test Sandbox`.
- Expected Result:
  - Heading is visible.

### TC-002: Guest greeting for empty input
- Requirement Mapping: FR-3, FR-4, FR-6, FR-7
- Steps:
  1. Navigate to `/`.
  2. Click `Generate greeting` without entering a name.
  3. Read text from `#greeting-output`.
- Expected Result:
  - Output equals `Hello, Guest!`.

### TC-003: Personalized greeting for entered name
- Requirement Mapping: FR-2, FR-3, FR-5, FR-6, FR-7
- Steps:
  1. Navigate to `/`.
  2. Enter `Rahul` in `#name-input`.
  3. Click `Generate greeting`.
  4. Read text from `#greeting-output`.
- Expected Result:
  - Output equals `Hello, Rahul!`.

---

## DB-backed Test Cases (`tests/ui.db.spec.js`)

> These tests verify FR-7, FR-8, and FR-9. Each test clears the `greetings` table before running and queries the database after the UI interaction to confirm the record was persisted correctly.

### TC-004: Personalized greeting saved to MySQL
- Requirement Mapping: FR-2, FR-5, FR-7, FR-8, FR-9
- Steps:
  1. Clear the `greetings` table.
  2. Navigate to `/`.
  3. Enter a unique name in `#name-input`.
  4. Click `Generate greeting`.
  5. Assert UI output equals `Hello, <name>!`.
  6. Query the latest row from `greetings`.
- Expected Result:
  - UI displays the correct personalized greeting.
  - `name_input` equals the entered name.
  - `resolved_name` equals the entered name.
  - `greeting_text` equals `Hello, <name>!`.

### TC-005: Guest greeting saved to MySQL
- Requirement Mapping: FR-4, FR-7, FR-8, FR-9
- Steps:
  1. Clear the `greetings` table.
  2. Navigate to `/`.
  3. Click `Generate greeting` without entering a name.
  4. Assert UI output equals `Hello, Guest!`.
  5. Query the latest row from `greetings`.
- Expected Result:
  - UI displays `Hello, Guest!`.
  - `name_input` equals `""` (empty string).
  - `resolved_name` equals `Guest`.
  - `greeting_text` equals `Hello, Guest!`.

---

## BDD Scenarios (`features/greeting.feature`)

The Cucumber feature file mirrors the test case numbering above:

| Scenario | Tags | Equivalent TC |
|---|---|---|
| Home page loads with heading | `@smoke @regression` | TC-001 |
| Guest greeting when input is empty | `@smoke @regression` | TC-002 |
| Personalized greeting when input has name | `@regression` | TC-003 |
| Personalized greeting is saved to the database | `@regression @db` | TC-004 |
| Guest greeting is saved to the database | `@regression @db` | TC-005 |
| Intentional failure for demo | `@negative` | TC-N01 |

Run only DB scenarios: `npm run test:bdd -- --tags "@db"`  
Exclude DB scenarios: `npm run test:bdd -- --tags "not @db"`

---

## Coverage Notes
- TC-001 through TC-005 cover the primary happy paths and DB persistence.
- Additional useful future coverage:
  - Whitespace-only input handling (`"   "` should resolve to guest).
  - Special characters in names.
  - Keyboard-only interaction flow and focus behavior.
  - API contract tests directly against `POST /api/greet`.
