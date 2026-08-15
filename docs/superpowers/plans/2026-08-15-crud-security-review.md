# Fuel Tracker — CRUD Security Remediation

## Context

A review of the app's CRUD surface found four critical cross-user vulnerabilities, all reachable by
anyone who registers (registration is open). The **Car** domain is well built — pivot ownership via
`car_user`, a real `CarPolicy`, good tests in `CarUserAccessTest`. That rigor never reached
**Refuel**, **CarExpense**, or **GasStation**: `RefuelPolicy` and `GasStationPolicy` exist and are
auto-registered but every method returns `false` and **neither is ever invoked**, so the code looks
protected while providing nothing.

The most severe finding (C4) is that deleting a gas station **cascade-deletes every user's refuel
records**. Refuel history is the app's irreplaceable data; nothing may destroy it as a side effect.

A design session settled the intended model. Those decisions are recorded below and drive the work.

## Decisions (settled — do not re-derive)

| # | Decision |
|---|---|
| D1 | A refuel belongs to the **car**, as a single shared ledger. No per-user attribution. Any car member (owner *or* co-driver) may view, edit, and delete any refuel on that car. |
| D2 | A `GasStation` is a **physical place** (name + address), global and shared. Any user may edit or delete one — accepted trade-off. |
| D3 | A car with **any** refuels or expenses **cannot be deleted at all**. No soft delete, no archive, no `deleted_at`. Delete is a real delete, permitted only on an empty car. |
| D4 | `refuels.car_id` is **immutable** after creation. Wrong car → delete and re-log. |
| D5 | Station deletion **nulls** the refuel's `gas_station_id` (DB-level). No app-level block. The confirmation dialog states the blast radius. |
| D6 | Station duplicates are **tolerated**. No dedupe on inline creation. |
| D7 | Per-model authorization lives in **policies**. |
| D8 | List scoping is a **named query scope**, since a policy cannot filter a collection. |
| D9 | Cascade FKs on `car_id` become `restrictOnDelete()` — the database enforces D3. |
| D10 | **No `refueled_at` column.** `created_at` remains the refuel date and the mileage rule stays append-only. Logging at the pump is the intended flow; back-filling is not a requirement. |
| D11 | `expense_type` becomes a **backed PHP enum**. |
| D12 | The inert `verified` middleware and the unused email-verification flow are **removed**. |
| D13 | The broken `cars.expenses.index` route is **removed** (expenses already render on `Cars/Show`). |

## Explicitly out of scope (accepted risk)

- Any authenticated user can rename or delete a shared gas station (D2, D5). Data survives; station references become null.
- Duplicate station rows will accumulate and skew "most used station" ordering in `GetRefuelIndexData` (D6).
- No back-filling of forgotten refuels (D10).
- `registration_number` is globally unique across all users — leaks whether a plate is registered and blocks re-registration after a sale. Not addressed this pass.

---

## Phase 1 — Critical: cross-user access and data loss

**1.1 Scope the refuel list** (C1)
`app/Models/Refuel.php` — add `scopeAccessibleBy(Builder $query, User $user)` joining through
`car_user`. Call it in `app/Actions/Refuel/ListRefuels.php:12`. Validate the `car_id` query param in
`RefuelController::index:27` instead of casting it blind.

**1.2 Real `RefuelPolicy`** (C2)
Replace the all-`false` stubs in `app/Policies/RefuelPolicy.php`. `view`/`update`/`delete` all
delegate to car membership — mirror `CarPolicy::view`, which uses
`$user->cars()->where('cars.id', ...)->exists()` (D1: co-drivers included). Wire it into
`RefuelController` at `edit:100`, `update:115`, `destroy:149`.

**1.3 Make `car_id` immutable on update** (D4)
`RefuelController::update` — drop `car_id` from the validated payload and from
`app/Actions/Refuel/UpdateRefuel.php`, or reject a changed value outright. This removes the
re-parenting vector independently of the policy fix.

**1.4 New `CarExpensePolicy`** (C3)
Same car-membership delegation. `app/Http/Controllers/CarExpenseController.php` needs
`use AuthorizesRequests` and an authorization check on **every** action including `index`, `create`,
and `store` (authorize against the `Car`). Keep the existing
`abort_if($expense->car_id !== $car->id, 404)` consistency guards — they're correct, just
insufficient on their own.

**1.5 Stop station deletes from destroying refuels** (C4 — the critical one)
New migration changing `refuels.gas_station_id` from `onDelete('cascade')` to `nullOnDelete()`.
No other work required: the column is already nullable, both validation rules already say
`nullable`, and `RefuelCard.tsx:65` already renders `'Unknown Station'` for a null station.

**1.6 Blast-radius confirmation** (D5)
`GasStations/Index.tsx` — pass a refuel count per station and surface it in the dialog:
*"47 refuels will lose their station. This cannot be undone."*

## Phase 2 — Deletion semantics

**2.1 Block car deletion when history exists** (D3)
Guard in `CarController::destroy` / `Actions/Cars/DeleteCar` — refuse with a clear message when the
car has any refuels or expenses. Prefer a redirect-with-error over a 403; this is a business rule,
not a permission failure.

**2.2 Database enforcement** (D9)
Migration changing `refuels.car_id` and `car_expenses.car_id` to `restrictOnDelete()`. This is the
C4 lesson applied to the remaining cascades — the DB must enforce what the app claims.

**2.3 Hide the delete action** (D3)
Expose a `canDelete` flag (or refuel/expense counts) from `Actions/Cars/ListCars` and
`Actions/Cars/ShowCar`; disable the action in `Cars/CarCard.tsx` with a short reason. Server check
stays authoritative.

**2.4 Confirmation on expense delete**
`CarExpenses/CarExpensesList.tsx:68` fires `router.delete` straight from a dropdown item — the only
destructive action in the app without a dialog. Reuse the shared component from 4.6.

## Phase 3 — High

- **3.1** Validate `from`/`to` in `DashboardController:18-24` with `date_format:Y-m` — `?from=abc`
  currently 500s, `?from[]=1` throws a `TypeError`.
- **3.2** Collapse `BuildDashboardStats::buildMonthlyTrends:189-235` from 2 queries/month into one
  grouped aggregate, and clamp the range. `?from=1900-01` is ~3,000 queries today.
- **3.3** Remove `verified` from the `routes/web.php:16` group plus the unused verification routes,
  pages, and tests (D12).
- **3.4** Delete the 0-byte `resources/js/pages/CarExpenses/Index.tsx`, the `index` action, and the
  `cars.expenses.index` route (D13).
- **3.5** Add `"typecheck": "tsc --noEmit"` to `package.json`, fix the ~20 existing errors (missing
  `BreadcrumbItem` imports in four pages, undefined `Props` in `GasStationEdit.tsx`, untyped props
  in `CarExpenses/Edit.tsx`, duplicate `Refuel` types between `Refuels/Index.tsx` and
  `RefuelCard.tsx`), and add it to CI.

## Phase 4 — Medium / cleanup

- **4.1** `ExpenseType` backed enum (`Værksted`, `Forsikring`, `Afgift`, `Tilkøb`, `Abonnement`),
  validated with `Rule::enum`, shared to the frontend, and referenced by
  `BuildDashboardStats:43,48,52,202` instead of the bare `'Abonnement'` literal (D11). **This is the
  only silent-wrong-answer bug in the set** — rename that option today and EV cost tracking reports
  zero with no error.
- **4.2** Add `decimal:2` casts to `Refuel`, `CarExpense`, and `Car`'s price columns — they
  currently reach React as strings while the TS types claim `number`.
- **4.3** Fix `Inertia::defer` being defeated in `RefuelController::index:29-30` (value computed
  eagerly, then wrapped). Follow `CarController::index` / `Actions/Cars/ShowCar`, which return a
  `Closure` correctly.
- **4.4** Indexes on `refuels(car_id, created_at)`, `refuels(car_id, mileage)`,
  `car_expenses(car_id, invoice_date)`.
- **4.5** Restore `total_price` to `decimal(10,2)` — `2025_02_28_213239` silently reset it to `(8,2)`
  via a bare `->decimal()->change()`, capping values at 999,999.99.
- **4.6** `liters_refueled` → `gt:0`, and guard `RefuelCard.tsx:106` which renders `∞ kr.` / `NaN kr.`
  on a zero-litre refuel. Consolidate the three byte-identical `DeleteConfirmation.tsx` files into
  `resources/js/components/`.
- **4.7** Share `flash` in `HandleInertiaRequests::share()` and render it — every controller sets
  `->with('success', ...)` and nothing displays it.
- **4.8** Wrap `Actions/Cars/CreateCar:15-16` in a transaction (a failure between insert and attach
  orphans a car and burns its registration number); add `min:0` to `expense.amount`; make
  `CarUserController:26` return a generic message instead of confirming whether an email is
  registered.
- **4.9** Dead code: empty `show()` stubs in `RefuelController:92` and `GasStationController:51`;
  unused `resetPeriod`/`isDefaultPeriod` in `dashboard.tsx:85-90`; `User::cars()` and
  `User::accessibleCars()` are byte-identical duplicates.
- **4.10** Make CI capable of failing: `pint --test` instead of `pint`, and run `typecheck`.
  `.env.example` ships `APP_DEBUG=true` and CI copies it.

## Not code — flagged for you

`.env` has an active `# Prod DB` block, so local dev talks to production. The artisan-command
prohibitions in `AppServiceProvider::boot()` show this is known, but they're a mitigation, not a
fix — `tinker` or a stray mass `update()` still reaches prod. A local sqlite/Docker DB plus a real
staging environment would remove the whole category. Related: CI runs sqlite while production runs
MySQL, and the two return different PHP types for decimal columns, so the suite can pass while
production breaks.

## Verification

Write the failing test **first** for each Phase 1 item; `CarUserAccessTest` is the pattern to copy.

- Cross-user: account B gets 403/404 on account A's `/refuels/{id}/edit`, `PUT /refuels/{id}`,
  `DELETE /refuels/{id}`, and `/cars/{car}/expenses`; `/refuels` shows only B's data.
- Co-driver: **can** edit and delete refuels on a shared car (D1) — assert this explicitly, it's the
  case the policy must not over-restrict.
- Immutability: `PUT /refuels/{id}` with a different `car_id` does not move the refuel (D4).
- **C4 regression test**: create refuels against a station, delete the station, assert the refuels
  still exist with `gas_station_id === null`.
- Deletion: a car with refuels or expenses cannot be deleted; an empty car can (D3).
- Dashboard: `?from=abc` returns 422, not 500.
- Then: `php artisan test --compact`, `npx tsc --noEmit`, `vendor/bin/pint --dirty --format agent`.

---

## Status: implemented

All four phases are done. 89 tests pass; `tsc --noEmit`, `eslint`, `prettier --check` and
`pint --test` are all clean, and `npm run build` succeeds.

Deviations from the plan, all deliberate:

- **`ListCarExpenses` action deleted** alongside the `cars.expenses.index` route (D13) — it had no
  other caller.
- **`GasStationPolicy` deleted.** It was auto-discovered, returned `false` from every method, and
  was referenced nowhere. With gas stations intentionally open (D2/D5), leaving it in place was the
  same trap that hid C2/C3.
- **`User::accessibleCars()` removed** rather than kept as an alias; it was byte-identical to
  `cars()`, which the policies already used.
- **Pint run across the whole project.** Switching CI to `pint --test` exposed 17 pre-existing
  unformatted files — CI had been running `pint` without `--test`, so it could never fail and the
  debt accumulated invisibly.
- **`buildMonthlyTrends` buckets in PHP** rather than using a grouped SQL aggregate. Month
  extraction is not portable between SQLite (tests) and MySQL (production); loading the period once
  and grouping in memory is driver-agnostic and still takes the dashboard from ~3,000 queries to
  under 50 on the widest range.
- **`.env.example` left at `APP_DEBUG=true`.** It is paired with `APP_ENV=local` and is the stock
  Laravel local-dev template; making it `false` degrades local debugging without removing the real
  risk. The genuine problem is the SQLite-in-CI / MySQL-in-production divergence, which needs an
  infrastructure change rather than a file edit.
- **Two extra fixes** taken while in the same code: the refuel form's car dropdown is now disabled
  when editing (it would otherwise silently discard the change under D4), and `isOwner` is derived
  from the policy instead of hardcoded `true`.

Not addressed, as agreed: gas-station rename/delete stays open to any user, station duplicates are
tolerated, there is no `refueled_at` column, and `registration_number` remains globally unique.
