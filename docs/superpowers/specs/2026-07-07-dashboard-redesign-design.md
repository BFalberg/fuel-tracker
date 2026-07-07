# Dashboard Redesign — Design Spec

**Date:** 2026-07-07  
**Branch:** dashboard-update  
**Status:** Approved

---

## Overview

Redesign the dashboard from a flat multi-car stat dump to a focused, mobile-first single-car view with trend charts. The newest car is shown by default; a tab pill row lets users switch cars. Key goals: surface the most actionable metrics (this month's cost and efficiency) prominently, add monthly trend charts for cost/efficiency/distance, and provide a one-tap shortcut to log a refuel.

---

## Page Structure

Single vertical scroll. No breadcrumbs (reduces chrome on mobile). Layout top-to-bottom:

1. Car switcher + Log Refuel button
2. Hero stats (2 cards)
3. Secondary stats (2×2 grid)
4. Monthly trend chart

---

## Section 1: Car Switcher & Log Refuel

A row at the top of the page containing:

- **Left**: Horizontally scrollable pill strip of car names. The active car pill is filled/solid; others are outline. Tapping a pill fires `router.get('/dashboard', { car: id }, { preserveScroll: true })` which triggers a deferred reload of just that car's stats.
- **Right**: "Log Refuel" button (primary or outline, icon + label) that navigates to `route('refuels.create')`.

The newest car (by `cars.created_at DESC`) is selected by default when no `?car` query param is present.

If the user has only one car, the pill strip is not rendered — just the "Log Refuel" button.

---

## Section 2: Hero Stats

Two side-by-side cards, each ~50% width, prominently sized.

**Card 1 — This Month**
- Large: formatted DKK amount spent this month
- Below (muted): `avg. X DKK/month`
- Delta indicator: if this month's spend > monthly average, show `↑` (muted, not alarming); if below, show `↓`. Omit if no average is available.

**Card 2 — Efficiency**
- Large: `X L/100km` (fossil) or `X kWh/100km` (EV). Shows `—` if no data.
- Below (muted): `avg. X all-time`
- Delta indicator: efficiency numbers are inverted — a higher value means *worse* efficiency, so if this month > all-time avg, show `↑` in a slightly negative tone; if below (better), show `↓` positively. Omit if either value is null.

---

## Section 3: Secondary Stats Grid

A 2×2 compact grid. Each cell has a label (small, muted) and a value (medium weight).

| Cell | Primary value | Secondary value |
|------|---------------|-----------------|
| Distance this month | `X km` | `avg. X km/month` |
| Price per km | `X kr./km` | `X km total (all-time)` |
| All-time cost | formatted DKK | — |
| Refuels this month | `X refuels` | — |

---

## Section 4: Monthly Trend Chart

A full-width card. Three tabs: **Cost** | **Efficiency** | **Distance** (default: Cost).

Each tab renders a shadcn `BarChart` (which uses recharts) showing the last 6 calendar months. The current (partial) month bar uses a muted/lighter color to signal incompleteness. Month labels (`Jan`, `Feb`, etc.) on x-axis; values on y-axis. A tap/hover tooltip shows the exact value for that month.

All three chart datasets are delivered in a single `monthlyTrends` array — no extra requests when switching tabs.

**`monthlyTrends` shape (6 items, oldest first):**
```ts
{
  month: string;        // "2026-01" format, used for label
  cost: number;         // sum of total_price for the month
  efficiency: number | null;  // L or kWh per 100km, null if insufficient data
  distance: number;     // km driven that month
}
```

---

## Backend Changes

### `DashboardController::index()`

- Read `request()->query('car')` to determine selected car ID.
- Fall back to the newest accessible car (`orderBy('cars.created_at', 'desc')->first()`).
- Pass to the view:
  - `cars` (eager, not deferred): lightweight array of `[id, name]` for the switcher pills.
  - `selectedCar` (eager): `id` of the currently selected car, so the frontend can highlight the correct pill.
  - `stats` (deferred): result of `BuildDashboardStats->handle($car)` for the single selected car.

### `BuildDashboardStats`

- Change signature: accepts a single `Car` (not a `Collection`).
- Existing stat computation stays as-is but returns a single array (not mapped collection).
- Add `monthlyTrends`: query the last 6 calendar months. For each month:
  - `cost`: `SUM(total_price)` from refuels (or subscription expenses for EV).
  - `distance`: `MAX(mileage) - MIN(mileage)` within that month's refuels.
  - `efficiency`: `SUM(liters_refueled) / distance * 100` if both > 0, else `null`.
- Add `refuelsThisMonth`: `COUNT(*)` of refuels in the current month.

### Inertia Prop Shape (deferred `stats`)

```ts
{
  id: number;
  name: string;
  isElectric: boolean;
  stats: {
    currentMonth: { amount: number; kilometers: number; refuelCount: number; };
    averages: { monthlyAmount: number; monthlyKilometers: number; };
    totals: { amount: number; kilometers: number; pricePerKilometer: number; };
    efficiency: { currentMonth: number | null; allTime: number | null; };
    monthlyTrends: Array<{ month: string; cost: number; efficiency: number | null; distance: number; }>;
  };
}
```

---

## Frontend Changes

### `dashboard.tsx`

- Accepts `cars: { id: number; name: string }[]`, `selectedCar: number`, and deferred `stats`.
- Car switcher pill strip uses `router.get` on click; single-car users skip the strip.
- Hero cards, secondary grid, and chart card are extracted as small inline components or separate files under `resources/js/pages/Dashboard/` if they grow large.
- Chart tab state is local React state (`useState`) — no server round-trip.
- Skeleton loading state mirrors the new layout (2 hero skeletons, 4 grid skeletons, 1 chart skeleton).

---

## What's Not Changing

- No new routes.
- No new models or migrations.
- The Cars, Refuels, and Gas Stations pages are untouched.
- No changes to auth or policies.

---

## Testing

- Update existing `BuildDashboardStats` tests to reflect single-car signature and new `monthlyTrends` / `refuelsThisMonth` fields.
- Update `DashboardController` feature test to cover: default car selection, `?car=` param selection, and deferred stats shape.
- No frontend tests needed beyond what Pest covers via the controller.
