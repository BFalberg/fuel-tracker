# Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the dashboard to a mobile-first single-car view with car switcher pills, hero stats, a 2×2 secondary grid, and a monthly trend bar chart.

**Architecture:** The controller reads a `?car` query param (defaults to newest car) and passes a lightweight car list eagerly plus deferred stats for the selected car. `BuildDashboardStats` is refactored to accept a single `Car` and gains `monthlyTrends` (6 months) and `refuelCount` fields. The frontend is rewritten with shadcn bar charts and local React state for the chart tab.

**Tech Stack:** PHP 8.4, Laravel 12, Inertia v2, React 19, Tailwind v4, Pest v3, shadcn/ui (recharts)

## Global Constraints

- Mobile-first layout only — no `md:` or `lg:` grid columns
- Currency formatted with `da-DK` locale, `DKK`
- Run `vendor/bin/pint --dirty --format agent` after every PHP change
- Run `php artisan test --compact` after every test cycle
- No new routes, models, migrations, or dependencies beyond recharts (via shadcn chart)
- All Pest tests in `tests/Feature/`

---

### Task 1: Refactor BuildDashboardStats — single Car, monthlyTrends, refuelCount

**Files:**
- Modify: `app/Actions/Dashboard/BuildDashboardStats.php`
- Modify: `tests/Feature/EvDashboardTest.php`

**Interfaces:**
- Produces: `handle(Car $car): Closure` returning `array` with shape:
  ```
  [
    'id' => int,
    'name' => string,
    'isElectric' => bool,
    'stats' => [
      'currentMonth' => ['amount' => float, 'kilometers' => int, 'refuelCount' => int],
      'averages'     => ['monthlyAmount' => float, 'monthlyKilometers' => float],
      'totals'       => ['amount' => float, 'kilometers' => float, 'pricePerKilometer' => float],
      'efficiency'   => ['currentMonth' => float|null, 'allTime' => float|null],
      'monthlyTrends'=> [['month' => string, 'cost' => float, 'efficiency' => float|null, 'distance' => int], ...],
    ],
  ]
  ```

- [ ] **Step 1: Update all existing tests to the new single-Car signature**

Replace the full contents of `tests/Feature/EvDashboardTest.php`:

```php
<?php

use App\Actions\Dashboard\BuildDashboardStats;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

test('ev dashboard uses subscription expenses for monthly cost', function () {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create(['start_milage' => 0]);

    Carbon::setTestNow('2026-07-06');

    CarExpense::create([
        'car_id' => $car->id,
        'expense_type' => 'Abonnement',
        'amount' => 299,
        'invoice_date' => '2026-07-01',
    ]);

    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 50, 'total_price' => 0, 'mileage' => 1000]);
    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 50, 'total_price' => 0, 'mileage' => 1500]);

    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['stats']['currentMonth']['amount'])->toBe(299.0)
        ->and($stats['stats']['totals']['amount'])->toBe(299.0)
        ->and($stats['stats']['currentMonth']['kilometers'])->toBe(500);

    Carbon::setTestNow();
});

test('gas car dashboard is unaffected by ev logic', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['start_milage' => 0, 'is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 40, 'total_price' => 600, 'mileage' => 1000]);
    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 40, 'total_price' => 550, 'mileage' => 1400]);

    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['stats']['currentMonth']['amount'])->toBe(1150.0);

    Carbon::setTestNow();
});

test('ev price per kilometer uses subscription cost divided by total distance', function () {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create(['start_milage' => 0]);

    Carbon::setTestNow('2026-07-06');

    CarExpense::create([
        'car_id' => $car->id,
        'expense_type' => 'Abonnement',
        'amount' => 1000,
        'invoice_date' => '2026-07-01',
    ]);

    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 0]);
    Refuel::create(['car_id' => $car->id, 'liters_refueled' => 0, 'total_price' => 0, 'mileage' => 2000]);

    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['stats']['totals']['pricePerKilometer'])->toBe(0.5);

    Carbon::setTestNow();
});

test('gas car efficiency stats are calculated correctly', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    // mileage 100→200 = 100 km; 40 liters total → 40/100*100 = 40.0 L/100km
    Refuel::create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['isElectric'])->toBeFalse()
        ->and($stats['stats']['efficiency']['currentMonth'])->toBe(40.0)
        ->and($stats['stats']['efficiency']['allTime'])->toBe(40.0);

    Carbon::setTestNow();
});

test('ev car efficiency stats are calculated correctly', function () {
    $user = User::factory()->create();
    $car = Car::factory()->electric()->ownedBy($user)->create();

    Carbon::setTestNow('2026-07-06');

    // mileage 0→500 = 500 km; 100 kWh total → 100/500*100 = 20.0 kWh/100km
    Refuel::create(['car_id' => $car->id, 'mileage' => 0, 'liters_refueled' => 50, 'total_price' => 0]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 500, 'liters_refueled' => 50, 'total_price' => 0]);

    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['isElectric'])->toBeTrue()
        ->and($stats['stats']['efficiency']['currentMonth'])->toBe(20.0)
        ->and($stats['stats']['efficiency']['allTime'])->toBe(20.0);

    Carbon::setTestNow();
});

test('efficiency stats are null when no refuels exist', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats['stats']['efficiency']['allTime'])->toBeNull();
});

test('currentMonth efficiency is null when no refuels exist in current month', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    Carbon::setTestNow('2026-06-15');
    Refuel::create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    Carbon::setTestNow('2026-07-06');
    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['stats']['efficiency']['currentMonth'])->toBeNull()
        ->and($stats['stats']['efficiency']['allTime'])->toBe(40.0);

    Carbon::setTestNow();
});

test('stats include refuel count for current month', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    Refuel::create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 20, 'total_price' => 300]);
    Refuel::create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 20, 'total_price' => 300]);

    $stats = app(BuildDashboardStats::class)->handle($car)();

    expect($stats['stats']['currentMonth']['refuelCount'])->toBe(2);

    Carbon::setTestNow();
});

test('monthly trends include last 6 months of cost for gas car', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    Carbon::setTestNow('2026-06-15');
    Refuel::create(['car_id' => $car->id, 'mileage' => 100, 'liters_refueled' => 30, 'total_price' => 450]);

    Carbon::setTestNow('2026-07-06');
    Refuel::create(['car_id' => $car->id, 'mileage' => 200, 'liters_refueled' => 40, 'total_price' => 600]);

    $stats = app(BuildDashboardStats::class)->handle($car)();

    $trends = $stats['stats']['monthlyTrends'];

    expect($trends)->toHaveCount(6);

    $june = collect($trends)->firstWhere('month', '2026-06');
    $july = collect($trends)->firstWhere('month', '2026-07');

    expect($june['cost'])->toBe(450.0)
        ->and($july['cost'])->toBe(600.0);

    Carbon::setTestNow();
});

test('monthly trends efficiency is null when data is insufficient', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    $stats = app(BuildDashboardStats::class)->handle($car)();

    $july = collect($stats['stats']['monthlyTrends'])->firstWhere('month', '2026-07');

    expect($july['efficiency'])->toBeNull();

    Carbon::setTestNow();
});
```

- [ ] **Step 2: Run tests — verify they fail due to wrong signature**

```
php artisan test --compact --filter=EvDashboardTest
```

Expected: All tests FAIL with `Argument #1 ($cars) must be of type Illuminate\Support\Collection`.

- [ ] **Step 3: Rewrite `app/Actions/Dashboard/BuildDashboardStats.php`**

```php
<?php

namespace App\Actions\Dashboard;

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use Carbon\Carbon;
use Closure;

class BuildDashboardStats
{
    public function handle(Car $car): Closure
    {
        return function () use ($car): array {
            $now = Carbon::now();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();

            $mileageStats = Refuel::where('car_id', $car->id)
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $totalDistance = ($mileageStats->latest_mileage ?? 0) - ($mileageStats->first_mileage ?? 0);

            $monthlyMileageStats = Refuel::where('car_id', $car->id)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage')
                ->first();

            $currentMonthDistance = ($monthlyMileageStats->latest_mileage ?? 0) - ($monthlyMileageStats->first_mileage ?? 0);

            if ($car->is_electric) {
                return $this->buildEvStats($car, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance);
            }

            return $this->buildGasStats($car, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance);
        };
    }

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

        $pricePerKilometer = $totalDistance > 0 ? round((float) $totalAmount / $totalDistance, 2) : 0;

        $efficiency = $this->calculateEfficiency($car->id, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance);

        $refuelsThisMonth = Refuel::where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        return [
            'id' => $car->id,
            'name' => $car->name,
            'isElectric' => $car->is_electric,
            'stats' => [
                'currentMonth' => [
                    'amount' => (float) $currentMonthAmount,
                    'kilometers' => $currentMonthDistance,
                    'refuelCount' => $refuelsThisMonth,
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
                'efficiency' => $efficiency,
                'monthlyTrends' => $this->buildMonthlyTrends($car),
            ],
        ];
    }

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

        $efficiency = $this->calculateEfficiency($car->id, $startOfMonth, $endOfMonth, $totalDistance, $currentMonthDistance);

        $refuelsThisMonth = Refuel::where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        return [
            'id' => $car->id,
            'name' => $car->name,
            'isElectric' => $car->is_electric,
            'stats' => [
                'currentMonth' => [
                    'amount' => (float) ($monthlyAmountStats->total_amount ?? 0),
                    'kilometers' => $currentMonthDistance,
                    'refuelCount' => $refuelsThisMonth,
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
                'efficiency' => $efficiency,
                'monthlyTrends' => $this->buildMonthlyTrends($car),
            ],
        ];
    }

    private function calculateEfficiency(int $carId, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, int $currentMonthDistance): array
    {
        $currentMonthLiters = Refuel::where('car_id', $carId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('liters_refueled');

        $totalLiters = Refuel::where('car_id', $carId)->sum('liters_refueled');

        return [
            'currentMonth' => ($currentMonthLiters > 0 && $currentMonthDistance > 0)
                ? round((float) $currentMonthLiters / $currentMonthDistance * 100, 1)
                : null,
            'allTime' => ($totalLiters > 0 && $totalDistance > 0)
                ? round((float) $totalLiters / $totalDistance * 100, 1)
                : null,
        ];
    }

    private function buildMonthlyTrends(Car $car): array
    {
        $trends = [];

        for ($i = 5; $i >= 0; $i--) {
            $start = Carbon::now()->subMonths($i)->startOfMonth();
            $end = $start->copy()->endOfMonth();

            if ($car->is_electric) {
                $cost = (float) CarExpense::where('car_id', $car->id)
                    ->where('expense_type', 'Abonnement')
                    ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
                    ->sum('amount');
            } else {
                $cost = (float) Refuel::where('car_id', $car->id)
                    ->whereBetween('created_at', [$start, $end])
                    ->sum('total_price');
            }

            $mileageStats = Refuel::where('car_id', $car->id)
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw('MIN(mileage) as first_mileage, MAX(mileage) as latest_mileage, SUM(liters_refueled) as total_liters')
                ->first();

            $distance = ($mileageStats->latest_mileage ?? 0) - ($mileageStats->first_mileage ?? 0);
            $liters = (float) ($mileageStats->total_liters ?? 0);

            $efficiency = ($liters > 0 && $distance > 0)
                ? round($liters / $distance * 100, 1)
                : null;

            $trends[] = [
                'month' => $start->format('Y-m'),
                'cost' => round($cost, 2),
                'efficiency' => $efficiency,
                'distance' => $distance,
            ];
        }

        return $trends;
    }
}
```

- [ ] **Step 4: Run Pint**

```
vendor/bin/pint app/Actions/Dashboard/BuildDashboardStats.php --format agent
```

- [ ] **Step 5: Run tests — verify all pass**

```
php artisan test --compact --filter=EvDashboardTest
```

Expected: All 10 tests PASS.

- [ ] **Step 6: Commit**

```
git add app/Actions/Dashboard/BuildDashboardStats.php tests/Feature/EvDashboardTest.php
git commit -m "refactor: BuildDashboardStats accepts single Car, adds monthlyTrends and refuelCount"
```

---

### Task 2: Update DashboardController for single-car selection

**Files:**
- Modify: `app/Http/Controllers/DashboardController.php`
- Modify: `tests/Feature/DashboardTest.php`

**Interfaces:**
- Consumes: `BuildDashboardStats::handle(Car $car): Closure` from Task 1
- Produces: Inertia props `cars: [{id, name}]`, `selectedCarId: int|null`, deferred `stats: array` (shape from Task 1)

- [ ] **Step 1: Replace `tests/Feature/DashboardTest.php`**

```php
<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/dashboard')->assertOk();
});

test('dashboard shows message when user has no cars', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/dashboard')->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('message', 'Please add a car to start tracking fuel consumption.')
    );
});

test('dashboard selects newest car by default', function () {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create(['created_at' => now()->subDays(10)]);
    $newCar = Car::factory()->ownedBy($user)->create(['created_at' => now()]);

    $this->actingAs($user);

    $this->get('/dashboard')->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $newCar->id)
    );
});

test('dashboard respects car query parameter', function () {
    $user = User::factory()->create();
    $car1 = Car::factory()->ownedBy($user)->create(['created_at' => now()->subDays(10)]);
    Car::factory()->ownedBy($user)->create(['created_at' => now()]);

    $this->actingAs($user);

    $this->get("/dashboard?car={$car1->id}")->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $car1->id)
    );
});

test('dashboard falls back to newest car for invalid car param', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user);

    $this->get('/dashboard?car=99999')->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $car->id)
    );
});

test('dashboard does not expose other users cars via query param', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $myCar = Car::factory()->ownedBy($user)->create();
    $theirCar = Car::factory()->ownedBy($otherUser)->create();

    $this->actingAs($user);

    $this->get("/dashboard?car={$theirCar->id}")->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('selectedCarId', $myCar->id)
    );
});
```

- [ ] **Step 2: Run tests — verify new tests fail**

```
php artisan test --compact --filter=DashboardTest
```

Expected: The 2 existing tests PASS; the 4 new tests FAIL (wrong prop shapes from old controller).

- [ ] **Step 3: Rewrite `app/Http/Controllers/DashboardController.php`**

```php
<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardStats;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, BuildDashboardStats $buildDashboardStats): Response
    {
        $user = auth()->user();
        $cars = $user->accessibleCars()->orderBy('cars.created_at', 'desc')->get();

        if ($cars->isEmpty()) {
            return Inertia::render('dashboard', [
                'cars' => [],
                'selectedCarId' => null,
                'message' => 'Please add a car to start tracking fuel consumption.',
            ]);
        }

        $selectedCar = $cars->firstWhere('id', (int) $request->query('car')) ?? $cars->first();

        return Inertia::render('dashboard', [
            'cars' => $cars->map(fn ($car) => ['id' => $car->id, 'name' => $car->name])->values(),
            'selectedCarId' => $selectedCar->id,
            'stats' => Inertia::defer($buildDashboardStats->handle($selectedCar))->once(),
        ]);
    }
}
```

- [ ] **Step 4: Run Pint**

```
vendor/bin/pint app/Http/Controllers/DashboardController.php --format agent
```

- [ ] **Step 5: Run all dashboard tests — verify all pass**

```
php artisan test --compact --filter=DashboardTest
```

Expected: All 7 tests PASS.

- [ ] **Step 6: Run full test suite to check for regressions**

```
php artisan test --compact
```

Expected: All tests PASS.

- [ ] **Step 7: Commit**

```
git add app/Http/Controllers/DashboardController.php tests/Feature/DashboardTest.php
git commit -m "feat: dashboard controller supports single-car selection via query param"
```

---

### Task 3: Install shadcn chart and rewrite dashboard.tsx

**Files:**
- Create: `resources/js/components/ui/chart.tsx` (via shadcn CLI)
- Modify: `resources/js/pages/dashboard.tsx`

**Interfaces:**
- Consumes: Inertia props `cars: [{id: number, name: string}]`, `selectedCarId: number|null`, deferred `stats` (shape from Task 1), optional `message: string`
- Produces: Mobile-first dashboard page with car switcher, hero stats, secondary grid, trend chart

- [ ] **Step 1: Install the shadcn chart component**

```
npx shadcn@latest add chart --overwrite
```

This adds `resources/js/components/ui/chart.tsx` and installs `recharts` into `package.json`.

- [ ] **Step 2: Replace `resources/js/pages/dashboard.tsx`**

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, XAxis } from 'recharts';

interface CarItem {
    id: number;
    name: string;
}

interface MonthlyTrend {
    month: string;
    cost: number;
    efficiency: number | null;
    distance: number;
}

interface CarStats {
    id: number;
    name: string;
    isElectric: boolean;
    stats: {
        currentMonth: { amount: number; kilometers: number; refuelCount: number };
        averages: { monthlyAmount: number; monthlyKilometers: number };
        totals: { amount: number; kilometers: number; pricePerKilometer: number };
        efficiency: { currentMonth: number | null; allTime: number | null };
        monthlyTrends: MonthlyTrend[];
    };
}

interface Props {
    cars: CarItem[];
    selectedCarId: number | null;
    stats?: CarStats;
    message?: string;
}

type ChartTab = 'cost' | 'efficiency' | 'distance';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const chartConfig = {
    value: { label: 'Value', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

export default function Dashboard({ cars, selectedCarId, stats, message }: Props) {
    const [activeTab, setActiveTab] = useState<ChartTab>('cost');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(amount);

    const formatNumber = (n: number) => new Intl.NumberFormat('da-DK').format(n);

    const formatMonthLabel = (month: string) => {
        const [year, m] = month.split('-');
        return new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('da-DK', { month: 'short' });
    };

    const currentMonth = new Date().toISOString().slice(0, 7);

    const efficiencyUnit = stats?.isElectric ? 'kWh' : 'L';

    const costDelta =
        stats && stats.stats.averages.monthlyAmount > 0
            ? stats.stats.currentMonth.amount > stats.stats.averages.monthlyAmount
                ? '↑'
                : '↓'
            : null;

    const effDelta =
        stats?.stats.efficiency.currentMonth !== null && stats?.stats.efficiency.allTime !== null
            ? (stats!.stats.efficiency.currentMonth ?? 0) > (stats!.stats.efficiency.allTime ?? 0)
                ? '↑'
                : '↓'
            : null;

    const chartData = (stats?.stats.monthlyTrends ?? []).map((t) => ({
        month: formatMonthLabel(t.month),
        value:
            activeTab === 'cost' ? t.cost : activeTab === 'efficiency' ? (t.efficiency ?? 0) : t.distance,
        rawMonth: t.month,
    }));

    if (message) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <p className="text-muted-foreground">{message}</p>
                    <Button asChild>
                        <Link href={route('cars.create')}>Add a car</Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4">
                {/* Car switcher + Log Refuel */}
                <div className="flex items-center gap-3">
                    {cars.length > 1 && (
                        <div className="flex flex-1 gap-2 overflow-x-auto pb-0.5">
                            {cars.map((car) => (
                                <button
                                    key={car.id}
                                    onClick={() => router.get('/dashboard', { car: car.id })}
                                    className={[
                                        'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                                        car.id === selectedCarId
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground',
                                    ].join(' ')}
                                >
                                    {car.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <Button asChild size="sm" className="ml-auto shrink-0">
                        <Link href={route('refuels.create')}>
                            <Plus className="mr-1 h-4 w-4" />
                            Log Refuel
                        </Link>
                    </Button>
                </div>

                <Deferred
                    data="stats"
                    fallback={
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[0, 1].map((i) => (
                                    <Card key={i}>
                                        <CardHeader className="pb-1 pt-4">
                                            <Skeleton className="h-3 w-20" />
                                        </CardHeader>
                                        <CardContent className="space-y-1 pb-4">
                                            <Skeleton className="h-7 w-28" />
                                            <Skeleton className="h-3 w-24" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[0, 1, 2, 3].map((i) => (
                                    <Card key={i}>
                                        <CardContent className="space-y-1 pb-4 pt-4">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-5 w-20" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Card>
                                <CardContent className="pb-4 pt-4">
                                    <Skeleton className="h-44 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    }
                >
                    {stats && (
                        <div className="flex flex-col gap-4">
                            {/* Hero cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card>
                                    <CardHeader className="pb-1 pt-4">
                                        <CardTitle className="text-muted-foreground text-xs font-medium">This Month</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="text-xl font-bold">
                                            {formatCurrency(stats.stats.currentMonth.amount)}
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            avg. {formatCurrency(stats.stats.averages.monthlyAmount)}/month
                                            {costDelta && ` ${costDelta}`}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-1 pt-4">
                                        <CardTitle className="text-muted-foreground text-xs font-medium">Efficiency</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="text-xl font-bold">
                                            {stats.stats.efficiency.currentMonth !== null
                                                ? `${stats.stats.efficiency.currentMonth} ${efficiencyUnit}/100km`
                                                : '—'}
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            {stats.stats.efficiency.allTime !== null
                                                ? `avg. ${stats.stats.efficiency.allTime} ${efficiencyUnit}/100km${effDelta ? ` ${effDelta}` : ''}`
                                                : '—'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Secondary 2×2 grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">Distance This Month</p>
                                        <p className="mt-0.5 font-semibold">
                                            {formatNumber(stats.stats.currentMonth.kilometers)} km
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            avg. {formatNumber(stats.stats.averages.monthlyKilometers)} km/month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">Price per km</p>
                                        <p className="mt-0.5 font-semibold">
                                            {formatCurrency(stats.stats.totals.pricePerKilometer)}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {formatNumber(stats.stats.totals.kilometers)} km total
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">All-Time Cost</p>
                                        <p className="mt-0.5 font-semibold">
                                            {formatCurrency(stats.stats.totals.amount)}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">Refuels This Month</p>
                                        <p className="mt-0.5 font-semibold">
                                            {stats.stats.currentMonth.refuelCount}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Monthly trend chart */}
                            <Card>
                                <CardHeader className="pb-2 pt-4">
                                    <div className="flex gap-1">
                                        {(['cost', 'efficiency', 'distance'] as ChartTab[]).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={[
                                                    'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                                                    activeTab === tab
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:text-foreground',
                                                ].join(' ')}
                                            >
                                                {tab === 'cost' ? 'Cost' : tab === 'efficiency' ? 'Efficiency' : 'Distance'}
                                            </button>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <ChartContainer config={chartConfig} className="h-44 w-full">
                                        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 11 }}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel
                                                        formatter={(value) =>
                                                            activeTab === 'cost'
                                                                ? formatCurrency(value as number)
                                                                : activeTab === 'efficiency'
                                                                  ? `${value} ${efficiencyUnit}/100km`
                                                                  : `${formatNumber(value as number)} km`
                                                        }
                                                    />
                                                }
                                            />
                                            <Bar
                                                dataKey="value"
                                                fill="var(--color-value)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                    <p className="text-muted-foreground mt-1 text-center text-xs">
                                        Current month is partial
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </Deferred>
            </div>
        </AppLayout>
    );
}
```

- [ ] **Step 3: Build assets and verify no TypeScript/build errors**

```
npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no errors. If there are TypeScript errors, fix them before proceeding.

- [ ] **Step 4: Run full test suite**

```
php artisan test --compact
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```
git add resources/js/pages/dashboard.tsx resources/js/components/ui/chart.tsx package.json package-lock.json
git commit -m "feat: redesign dashboard — single-car view with hero stats, grid, and trend chart"
```
