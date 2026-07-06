# Fuel Efficiency Dashboard Card

**Date:** 2026-07-06

---

## Overview

Add a fuel efficiency stat card to the dashboard. For gas cars it shows L/100km; for EVs it shows kWh/100km. The primary stat is current-month efficiency; the sub-stat is the all-time average.

---

## Data Source

The `refuels.liters_refueled` column stores liters for gas cars and kWh for EVs (the refuel form already labels it "kWh Charged" for electric cars). The efficiency formula is identical for both types:

```
efficiency = SUM(liters_refueled) / km_driven * 100
```

Returns `null` when `km_driven = 0` or `SUM(liters_refueled) = 0` (no data yet).

---

## Backend Changes

### `BuildDashboardStats`

Add an `efficiency` sub-array to the `stats` return value in **both** `buildGasStats` and `buildEvStats`:

```php
'efficiency' => [
    'currentMonth' => float|null,  // null when no data
    'allTime'      => float|null,  // null when no data
],
```

Add `isElectric: bool` to the top-level stats array (alongside `id` and `name`) so the frontend can pick the correct unit label without a separate API call.

**Current month efficiency:**

```php
$currentMonthLiters = Refuel::where('car_id', $car->id)
    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
    ->sum('liters_refueled');

$currentMonthEfficiency = ($currentMonthLiters > 0 && $currentMonthDistance > 0)
    ? round($currentMonthLiters / $currentMonthDistance * 100, 1)
    : null;
```

**All-time efficiency:**

```php
$totalLiters = Refuel::where('car_id', $car->id)->sum('liters_refueled');

$allTimeEfficiency = ($totalLiters > 0 && $totalDistance > 0)
    ? round($totalLiters / $totalDistance * 100, 1)
    : null;
```

Both `buildGasStats` and `buildEvStats` add the same `efficiency` block. The unit interpretation (L vs kWh) is purely a frontend concern driven by `isElectric`.

---

## Frontend Changes

### `dashboard.tsx`

**`CarStats` interface** — add to `stats`:

```ts
efficiency: {
    currentMonth: number | null;
    allTime: number | null;
};
isElectric: boolean;
```

**Grid** — change from `lg:grid-cols-4` to `lg:grid-cols-5`. Update the skeleton `Array.from({ length: 4 })` to `length: 5`.

**New 5th card** (after the existing "All time" card):

- Title: "Efficiency"
- Icon: `Gauge` from lucide-react
- Primary value: current-month efficiency formatted as `{value} L/100km` or `{value} kWh/100km`, or `—` when null
- Sub-stat: `Avg. {value} L/100km all-time` / `Avg. {value} kWh/100km all-time`, or `—` when null

The unit label is determined by `car.isElectric`:
- `true` → `kWh/100km`
- `false` → `L/100km`

---

## Testing

Add tests to `tests/Feature/EvDashboardTest.php` (existing file):

1. **Gas efficiency** — gas car with refuels returns correct `L/100km` in `stats.efficiency.currentMonth` and `stats.efficiency.allTime`.
2. **EV efficiency** — EV with refuels returns correct `kWh/100km` values (same numeric formula, different semantic label — verified by `isElectric: true` in the payload).
3. **No data** — car with no refuels returns `null` for both efficiency values.

---

## Out of Scope

- Per-refuel efficiency (tank-to-tank calculation).
- Efficiency trend charts.
- Efficiency targets or benchmarks.
