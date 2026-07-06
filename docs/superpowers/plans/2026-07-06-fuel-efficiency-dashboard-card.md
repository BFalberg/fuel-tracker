# Fuel Efficiency Dashboard Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 5th dashboard card showing fuel efficiency (L/100km for gas, kWh/100km for EV) with current-month as the primary stat and all-time average as the sub-stat.

**Architecture:** `BuildDashboardStats` computes two efficiency values (current-month and all-time) from `refuels.liters_refueled` — the same field stores kWh for EVs. The action also adds `isElectric` to the payload so the frontend can pick the right unit label. The dashboard gains a 5th card in a widened grid.

**Tech Stack:** PHP 8.4, Laravel 12, Inertia v2 + React 19, TailwindCSS v4, Pest v3

## Global Constraints

- PHP 8.4 — use constructor property promotion, explicit return types, typed parameters.
- Run `vendor/bin/pint --dirty --format agent` after any PHP file change before committing.
- Tests use Pest v3 (`php artisan make:test --pest`), run with `php artisan test --compact`.
- Do NOT add comments explaining what the code does — only add a comment when the WHY is non-obvious.
- Efficiency formula: `round(SUM(liters_refueled) / km_driven * 100, 1)`. Returns `null` when either operand is zero.
- Unit label is purely a frontend concern: `isElectric = true` → `kWh/100km`, `false` → `L/100km`.

---

### Task 1: Backend — efficiency stats in BuildDashboardStats

**Files:**
- Modify: `app/Actions/Dashboard/BuildDashboardStats.php`
- Test: `tests/Feature/EvDashboardTest.php`

**Interfaces:**
- Consumes: existing `buildGasStats` and `buildEvStats` private methods; `Refuel` model with `liters_refueled` column; `Car` model with `is_electric` attribute.
- Produces: both private methods now return `isElectric: bool` at the top level and `stats.efficiency.currentMonth: float|null` + `stats.efficiency.allTime: float|null`.

- [ ] **Step 1: Write the failing tests**

Add these three tests to `tests/Feature/EvDashboardTest.php` (append after the existing tests):

```php
test('gas car efficiency stats are calculated correctly', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    // mileage 100→200 = 100 km driven; 40 liters total → 40/100*100 = 40.0 L/100km
    Refuel::create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['isElectric'])->toBeFalse()
        ->and($stats->first()['stats']['efficiency']['currentMonth'])->toBe(40.0)
        ->and($stats->first()['stats']['efficiency']['allTime'])->toBe(40.0);

    Carbon::setTestNow();
});

test('ev car efficiency stats are calculated correctly', function () {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create();

    Carbon::setTestNow('2026-07-06');

    // mileage 0→500 = 500 km; 100 kWh total → 100/500*100 = 20.0 kWh/100km
    Refuel::create(['car_id' => $car->id, 'mileage' => 0, 'liters_refueled' => 50, 'total_price' => 0]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 500, 'liters_refueled' => 50, 'total_price' => 0]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['isElectric'])->toBeTrue()
        ->and($stats->first()['stats']['efficiency']['currentMonth'])->toBe(20.0)
        ->and($stats->first()['stats']['efficiency']['allTime'])->toBe(20.0);

    Carbon::setTestNow();
});

test('efficiency stats are null when no refuels exist', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats->first()['stats']['efficiency']['allTime'])->toBeNull();
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
php artisan test --compact --filter="efficiency"
```

Expected: 3 failures — `efficiency` key not found in stats array.

- [ ] **Step 3: Implement efficiency stats in BuildDashboardStats**

In `app/Actions/Dashboard/BuildDashboardStats.php`, replace the entire `buildGasStats` method with:

```php
private function buildGasStats(Car $car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance): array
{
    $monthlyAmountStats = Refuel::where('car_id', $car->id)
        ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
        ->selectRaw('SUM(total_price) as total_amount')
        ->first();

    $monthlyRefuels = Refuel::where('car_id', $car->id)
        ->get(['total_price', 'mileage', 'created_at'])
        ->groupBy(fn ($r) => $r->created_at->format('Y-m'));

    $avgMonthlyAmount = $monthlyRefuels
        ->map(fn ($group) => $group->sum('total_price'))
        ->avg() ?? 0;

    $avgMonthlyKm = $monthlyRefuels
        ->map(fn ($group) => $group->max('mileage') - $group->min('mileage'))
        ->avg() ?? 0;

    $totalStats = Refuel::where('car_id', $car->id)
        ->selectRaw('
            SUM(total_price) as total_amount_ever,
            CASE
                WHEN MAX(mileage) - MIN(mileage) > 0
                THEN SUM(total_price) / (MAX(mileage) - MIN(mileage))
                ELSE 0
            END as price_per_kilometer
        ')
        ->first();

    $currentMonthLiters = Refuel::where('car_id', $car->id)
        ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
        ->sum('liters_refueled');

    $totalLiters = Refuel::where('car_id', $car->id)->sum('liters_refueled');

    $currentMonthEfficiency = ($currentMonthLiters > 0 && $currentMonthDistance > 0)
        ? round((float) $currentMonthLiters / $currentMonthDistance * 100, 1)
        : null;

    $allTimeEfficiency = ($totalLiters > 0 && $totalDistance > 0)
        ? round((float) $totalLiters / $totalDistance * 100, 1)
        : null;

    return [
        'id' => $car->id,
        'name' => $car->name,
        'isElectric' => $car->is_electric,
        'stats' => [
            'currentMonth' => [
                'amount' => (float) ($monthlyAmountStats->total_amount ?? 0),
                'kilometers' => $currentMonthDistance,
            ],
            'averages' => [
                'monthlyAmount' => round($avgMonthlyAmount, 2),
                'monthlyKilometers' => round($avgMonthlyKm, 2),
            ],
            'totals' => [
                'amount' => round($totalStats->total_amount_ever ?? 0, 2),
                'kilometers' => round($totalDistance, 2),
                'pricePerKilometer' => round($totalStats->price_per_kilometer ?? 0, 2),
            ],
            'efficiency' => [
                'currentMonth' => $currentMonthEfficiency,
                'allTime' => $allTimeEfficiency,
            ],
        ],
    ];
}
```

Then replace the entire `buildEvStats` method with:

```php
private function buildEvStats(Car $car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance): array
{
    $currentMonthAmount = CarExpense::where('car_id', $car->id)
        ->where('expense_type', 'Abonnement')
        ->whereBetween('invoice_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
        ->sum('amount');

    $totalAmount = CarExpense::where('car_id', $car->id)
        ->where('expense_type', 'Abonnement')
        ->sum('amount');

    $avgMonthlyAmount = CarExpense::where('car_id', $car->id)
        ->where('expense_type', 'Abonnement')
        ->whereNotNull('invoice_date')
        ->get(['amount', 'invoice_date'])
        ->groupBy(fn ($e) => Carbon::parse($e->invoice_date)->format('Y-m'))
        ->map(fn ($group) => $group->sum('amount'))
        ->avg() ?? 0;

    $avgMonthlyKm = Refuel::where('car_id', $car->id)
        ->get(['mileage', 'created_at'])
        ->groupBy(fn ($r) => $r->created_at->format('Y-m'))
        ->map(fn ($group) => $group->max('mileage') - $group->min('mileage'))
        ->avg() ?? 0;

    $pricePerKilometer = $totalDistance > 0 ? round($totalAmount / $totalDistance, 2) : 0;

    $currentMonthLiters = Refuel::where('car_id', $car->id)
        ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
        ->sum('liters_refueled');

    $totalLiters = Refuel::where('car_id', $car->id)->sum('liters_refueled');

    $currentMonthEfficiency = ($currentMonthLiters > 0 && $currentMonthDistance > 0)
        ? round((float) $currentMonthLiters / $currentMonthDistance * 100, 1)
        : null;

    $allTimeEfficiency = ($totalLiters > 0 && $totalDistance > 0)
        ? round((float) $totalLiters / $totalDistance * 100, 1)
        : null;

    return [
        'id' => $car->id,
        'name' => $car->name,
        'isElectric' => $car->is_electric,
        'stats' => [
            'currentMonth' => [
                'amount' => (float) $currentMonthAmount,
                'kilometers' => $currentMonthDistance,
            ],
            'averages' => [
                'monthlyAmount' => round($avgMonthlyAmount, 2),
                'monthlyKilometers' => round($avgMonthlyKm, 2),
            ],
            'totals' => [
                'amount' => round((float) $totalAmount, 2),
                'kilometers' => round($totalDistance, 2),
                'pricePerKilometer' => $pricePerKilometer,
            ],
            'efficiency' => [
                'currentMonth' => $currentMonthEfficiency,
                'allTime' => $allTimeEfficiency,
            ],
        ],
    ];
}
```

- [ ] **Step 4: Run Pint**

```bash
vendor/bin/pint --dirty --format agent
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
php artisan test --compact --filter="efficiency"
```

Expected: 3 passed. Then run the full suite:

```bash
php artisan test --compact
```

Expected: all tests pass (was 55 before this task).

- [ ] **Step 6: Commit**

```bash
git add app/Actions/Dashboard/BuildDashboardStats.php tests/Feature/EvDashboardTest.php
git commit -m "feat: add efficiency stats to BuildDashboardStats"
```

---

### Task 2: Frontend — efficiency card on dashboard

**Files:**
- Modify: `resources/js/pages/dashboard.tsx`

**Interfaces:**
- Consumes: `car.isElectric: boolean` and `car.stats.efficiency.currentMonth: number | null` and `car.stats.efficiency.allTime: number | null` produced by Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update the CarStats TypeScript interface**

In `resources/js/pages/dashboard.tsx`, replace the `CarStats` interface with:

```ts
interface CarStats {
    id: number;
    name: string;
    isElectric: boolean;
    stats: {
        currentMonth: {
            amount: number;
            kilometers: number;
        };
        averages: {
            monthlyAmount: number;
            monthlyKilometers: number;
        };
        totals: {
            amount: number;
            kilometers: number;
            pricePerKilometer: number;
        };
        efficiency: {
            currentMonth: number | null;
            allTime: number | null;
        };
    };
}
```

- [ ] **Step 2: Add Gauge to lucide-react imports**

Replace the existing import line:

```ts
import { Car, ChartNoAxesCombined, Coins, Wallet } from 'lucide-react';
```

with:

```ts
import { Car, ChartNoAxesCombined, Coins, Gauge, Wallet } from 'lucide-react';
```

- [ ] **Step 3: Widen the grid and update the skeleton**

Replace:

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
```

with:

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
    {Array.from({ length: 5 }).map((_, index) => (
```

Also update the loaded cards grid (the one wrapping the 4 `<Card>` elements):

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
```

→

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
```

- [ ] **Step 4: Add the efficiency card**

After the closing `</Card>` of the "All time" card (line ~144 in the original file), add:

```tsx
<Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
        <Gauge className="text-muted-foreground h-4 w-4" />
    </CardHeader>
    <CardContent>
        <div className="text-2xl font-bold">
            {car.stats.efficiency.currentMonth !== null
                ? `${car.stats.efficiency.currentMonth} ${car.isElectric ? 'kWh' : 'L'}/100km`
                : '—'}
        </div>
        <p className="text-muted-foreground text-xs">
            {car.stats.efficiency.allTime !== null
                ? `Avg. ${car.stats.efficiency.allTime} ${car.isElectric ? 'kWh' : 'L'}/100km all-time`
                : '—'}
        </p>
    </CardContent>
</Card>
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add resources/js/pages/dashboard.tsx
git commit -m "feat: add efficiency card to dashboard"
```
