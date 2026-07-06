# Multi-user Car Access & EV-aware Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace single-owner `user_id` on cars with a many-to-many `car_user` pivot table supporting owner/co-driver roles, and fix the dashboard to source EV cost data from subscription expenses instead of zero-priced refuels.

**Architecture:** A `car_user` pivot table replaces `cars.user_id`. `User::accessibleCars()` scopes all car queries to the authenticated user's permitted cars. EV cost stats in `BuildDashboardStats` branch on `car->is_electric` to query `car_expenses` where `expense_type = 'Abonnement'` instead of `refuels.total_price`.

**Tech Stack:** Laravel 12, PHP 8.4, Inertia v2 + React 19, Pest v3, TailwindCSS v4.

## Global Constraints

- PHP 8.4 — use constructor property promotion, explicit return types, typed parameters.
- All PHP changes must pass `vendor/bin/pint --dirty --format agent` before committing.
- All behaviour changes must be covered by Pest feature tests. Run with `php artisan test --compact`.
- Do not modify dependencies (`composer.json`, `package.json`).
- Follow existing file naming, action class pattern, and Inertia deferred-props conventions.
- Danish-language strings already in UI (e.g. "Abonnement") must not be changed.
- Run `php artisan test --compact` after every task; all tests must pass before committing.

---

## File Map

| File | Change |
|---|---|
| `database/migrations/2026_07_06_100000_create_car_user_table.php` | **Create** — pivot table |
| `database/migrations/2026_07_06_100001_migrate_car_ownership_to_car_user_table.php` | **Create** — data migration |
| `database/migrations/2026_07_06_100002_drop_user_id_from_cars_table.php` | **Create** — drop column |
| `app/Models/Car.php` | **Modify** — swap `user()` for `users()` BelongsToMany, remove `user_id` from `$fillable` |
| `app/Models/User.php` | **Modify** — swap `cars()` hasMany for BelongsToMany, add `ownedCars()` + `accessibleCars()` |
| `app/Policies/CarPolicy.php` | **Modify** — implement real pivot-based checks |
| `database/factories/CarFactory.php` | **Modify** — add `ownedBy(User)` state |
| `app/Actions/Cars/CreateCar.php` | **Modify** — attach owner pivot row after create |
| `app/Actions/Cars/ListCars.php` | **Modify** — scope to `accessibleCars()` |
| `app/Actions/Cars/ShowCar.php` | **Modify** — load `users` instead of `user` |
| `app/Http/Controllers/CarController.php` | **Modify** — add policy gates, pass `carUsers`+`isOwner` to edit |
| `app/Http/Controllers/DashboardController.php` | **Modify** — use `accessibleCars()` |
| `app/Http/Controllers/RefuelController.php` | **Modify** — authorize car access on store |
| `app/Actions/Refuel/GetRefuelFormData.php` | **Modify** — scope cars to `accessibleCars()` |
| `app/Actions/Refuel/GetRefuelIndexData.php` | **Modify** — scope cars to `accessibleCars()` |
| `app/Actions/Dashboard/BuildDashboardStats.php` | **Modify** — EV branch for cost stats |
| `app/Http/Controllers/CarUserController.php` | **Create** — add/remove co-drivers |
| `routes/web.php` | **Modify** — add CarUserController routes |
| `resources/js/pages/Cars/CarEdit.tsx` | **Modify** — add users management section |
| `resources/js/pages/Cars/CarCard.tsx` | **Modify** — use `users[0]` for owner, gate edit/delete on role |
| `resources/js/pages/Cars/Index.tsx` | **Modify** — update Car interface |
| `resources/js/pages/Cars/Show.tsx` | **Modify** — use `users[0]` for owner display |
| `tests/Feature/CarUserAccessTest.php` | **Create** — access scoping tests |
| `tests/Feature/CarUserManagementTest.php` | **Create** — add/remove co-driver tests |
| `tests/Feature/EvDashboardTest.php` | **Create** — EV dashboard stats tests |
| `tests/Feature/CarsDeferredPropsTest.php` | **Modify** — use new `ownedBy()` factory state |
| `tests/Feature/CarExpenseOwnershipTest.php` | **Modify** — use new `ownedBy()` factory state |
| `tests/Feature/DashboardTest.php` | **Modify** — use new `ownedBy()` factory state |

---

## Task 1: Database Migrations

**Files:**
- Create: `database/migrations/2026_07_06_100000_create_car_user_table.php`
- Create: `database/migrations/2026_07_06_100001_migrate_car_ownership_to_car_user_table.php`
- Create: `database/migrations/2026_07_06_100002_drop_user_id_from_cars_table.php`

**Interfaces:**
- Produces: `car_user` table with columns `id`, `car_id`, `user_id`, `role` (enum owner/co_driver), `timestamps`, unique constraint on `(car_id, user_id)`. `cars.user_id` column removed.

- [ ] **Step 1: Create the car_user pivot table migration**

```bash
php artisan make:migration create_car_user_table --no-interaction
```

Open the generated file and replace its contents with:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['owner', 'co_driver']);
            $table->timestamps();
            $table->unique(['car_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_user');
    }
};
```

Rename the file to `2026_07_06_100000_create_car_user_table.php`.

- [ ] **Step 2: Create the data migration**

```bash
php artisan make:migration migrate_car_ownership_to_car_user_table --no-interaction
```

Rename to `2026_07_06_100001_migrate_car_ownership_to_car_user_table.php` and replace contents:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('cars')->whereNotNull('user_id')->each(function ($car) {
            DB::table('car_user')->insertOrIgnore([
                'car_id' => $car->id,
                'user_id' => $car->user_id,
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }

    public function down(): void
    {
        DB::table('car_user')->delete();
    }
};
```

- [ ] **Step 3: Create the drop-column migration**

```bash
php artisan make:migration drop_user_id_from_cars_table --no-interaction
```

Rename to `2026_07_06_100002_drop_user_id_from_cars_table.php` and replace contents:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        });
    }
};
```

- [ ] **Step 4: Run migrations**

```bash
php artisan migrate --no-interaction
```

Expected: 3 new migrations applied, no errors.

- [ ] **Step 5: Verify schema**

```bash
php artisan db:show --database=mysql 2>/dev/null || php artisan tinker --execute 'echo Schema::hasTable("car_user") ? "car_user exists" : "MISSING"; echo Schema::hasColumn("cars", "user_id") ? "user_id STILL EXISTS" : "user_id removed correctly";'
```

Expected: `car_user exists` and `user_id removed correctly`.

- [ ] **Step 6: Commit**

```bash
git add database/migrations/2026_07_06_100000_create_car_user_table.php database/migrations/2026_07_06_100001_migrate_car_ownership_to_car_user_table.php database/migrations/2026_07_06_100002_drop_user_id_from_cars_table.php
git commit -m "$(cat <<'EOF'
add car_user pivot table and migrate ownership data
EOF
)"
```

---

## Task 2: Models, Policy, Factory, and Update Existing Tests

**Files:**
- Modify: `app/Models/Car.php`
- Modify: `app/Models/User.php`
- Modify: `app/Policies/CarPolicy.php`
- Modify: `database/factories/CarFactory.php`
- Modify: `tests/Feature/CarsDeferredPropsTest.php`
- Modify: `tests/Feature/CarExpenseOwnershipTest.php`
- Modify: `tests/Feature/DashboardTest.php`

**Interfaces:**
- Produces:
  - `Car::users()` — `BelongsToMany<User>` with pivot `role`
  - `User::cars()` — `BelongsToMany<Car>` with pivot `role`
  - `User::ownedCars()` — `BelongsToMany<Car>` scoped to `role = 'owner'`
  - `User::accessibleCars()` — `BelongsToMany<Car>` (all roles)
  - `CarPolicy::view(User, Car): bool` — true if user has any row in `car_user`
  - `CarPolicy::update(User, Car): bool` — true if user has `role = 'owner'`
  - `CarPolicy::delete(User, Car): bool` — true if user has `role = 'owner'`
  - `CarPolicy::manageUsers(User, Car): bool` — true if user has `role = 'owner'`
  - `CarFactory::ownedBy(User): static` — afterCreating hook that attaches user as owner

- [ ] **Step 1: Update Car model**

Replace `app/Models/Car.php` with:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'registration_number',
        'start_milage',
        'purchase_price',
        'sale_price',
        'is_electric',
    ];

    protected function casts(): array
    {
        return [
            'is_electric' => 'boolean',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function refuels(): HasMany
    {
        return $this->hasMany(Refuel::class);
    }

    public function carExpenses(): HasMany
    {
        return $this->hasMany(CarExpense::class);
    }
}
```

- [ ] **Step 2: Update User model**

Replace the `cars()` method in `app/Models/User.php` and add new methods. The full updated file:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->withPivot('role')->withTimestamps();
    }

    public function ownedCars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->withPivot('role')->withTimestamps()->wherePivot('role', 'owner');
    }

    public function accessibleCars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->withPivot('role')->withTimestamps();
    }
}
```

- [ ] **Step 3: Update CarPolicy**

Replace `app/Policies/CarPolicy.php` with:

```php
<?php

namespace App\Policies;

use App\Models\Car;
use App\Models\User;

class CarPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Car $car): bool
    {
        return $user->cars()->where('cars.id', $car->id)->exists();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Car $car): bool
    {
        return $user->ownedCars()->where('cars.id', $car->id)->exists();
    }

    public function delete(User $user, Car $car): bool
    {
        return $user->ownedCars()->where('cars.id', $car->id)->exists();
    }

    public function manageUsers(User $user, Car $car): bool
    {
        return $user->ownedCars()->where('cars.id', $car->id)->exists();
    }

    public function restore(User $user, Car $car): bool
    {
        return false;
    }

    public function forceDelete(User $user, Car $car): bool
    {
        return false;
    }
}
```

- [ ] **Step 4: Update CarFactory**

Replace `database/factories/CarFactory.php` with:

```php
<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Car>
 */
class CarFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company,
            'registration_number' => strtoupper(fake()->bothify('??###')),
            'start_milage' => fake()->numberBetween(0, 250000),
            'purchase_price' => fake()->numberBetween(50000, 600000),
            'sale_price' => null,
            'is_electric' => false,
        ];
    }

    public function ownedBy(User $user): static
    {
        return $this->afterCreating(function (Car $car) use ($user) {
            $car->users()->attach($user->id, ['role' => 'owner']);
        });
    }

    public function electric(): static
    {
        return $this->state(['is_electric' => true]);
    }
}
```

- [ ] **Step 5: Update existing tests to use new factory state**

Update `tests/Feature/CarsDeferredPropsTest.php`:

```php
<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('cars index defers cars list', function () {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->count(2)->create();

    $response = $this->actingAs($user)->get('/cars');

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Cars/Index')
        ->missing('cars')
        ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
            ->has('cars', 2)
        )
    );
});
```

Update `tests/Feature/CarExpenseOwnershipTest.php` — replace all four occurrences of `Car::factory()->for($user)->create()` with `Car::factory()->ownedBy($user)->create()`:

```php
<?php

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('editing an expense from a different car returns 404', function () {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::create([
        'car_id' => $carB->id,
        'expense_type' => 'Værksted',
        'amount' => 500,
    ]);

    $this->actingAs($user)
        ->get(route('cars.expenses.edit', ['car' => $carA->id, 'expense' => $expense->id]))
        ->assertNotFound();
});

test('updating an expense from a different car returns 404', function () {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::create([
        'car_id' => $carB->id,
        'expense_type' => 'Værksted',
        'amount' => 500,
    ]);

    $this->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->put(route('cars.expenses.update', ['car' => $carA->id, 'expense' => $expense->id]), [
            '_token' => 'test',
            'expense_type' => 'Forsikring',
            'amount' => 300,
        ])
        ->assertNotFound();
});

test('deleting an expense from a different car returns 404', function () {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::create([
        'car_id' => $carB->id,
        'expense_type' => 'Afgift',
        'amount' => 1000,
    ]);

    $this->actingAs($user)
        ->withSession(['_token' => 'test'])
        ->delete(route('cars.expenses.destroy', ['car' => $carA->id, 'expense' => $expense->id]), [
            '_token' => 'test',
        ])
        ->assertNotFound();
});

test('editing an expense belonging to the correct car succeeds', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::create([
        'car_id' => $car->id,
        'expense_type' => 'Værksted',
        'amount' => 500,
    ]);

    $this->actingAs($user)
        ->get(route('cars.expenses.edit', ['car' => $car->id, 'expense' => $expense->id]))
        ->assertOk();
});
```

Update `tests/Feature/DashboardTest.php` — no factory change needed here since neither test creates a car, but verify it still passes.

- [ ] **Step 6: Run tests**

```bash
php artisan test --compact
```

Expected: all tests pass (the three updated test files will pass now that the factory is correct).

- [ ] **Step 7: Run Pint**

```bash
vendor/bin/pint --dirty --format agent
```

- [ ] **Step 8: Commit**

```bash
git add app/Models/Car.php app/Models/User.php app/Policies/CarPolicy.php database/factories/CarFactory.php tests/Feature/CarsDeferredPropsTest.php tests/Feature/CarExpenseOwnershipTest.php tests/Feature/DashboardTest.php
git commit -m "$(cat <<'EOF'
update models, policy, and factory for car_user pivot
EOF
)"
```

---

## Task 3: CreateCar and Backend Scoping

**Files:**
- Modify: `app/Actions/Cars/CreateCar.php`
- Modify: `app/Actions/Cars/ListCars.php`
- Modify: `app/Actions/Cars/ShowCar.php`
- Modify: `app/Http/Controllers/DashboardController.php`
- Modify: `app/Actions/Refuel/GetRefuelFormData.php`
- Modify: `app/Actions/Refuel/GetRefuelIndexData.php`
- Create: `tests/Feature/CarUserAccessTest.php`

**Interfaces:**
- Consumes: `User::accessibleCars()` (Task 2), `User::ownedCars()` (Task 2)
- Produces:
  - `CreateCar::handle(User, array): Car` — creates car and attaches owner pivot
  - `ListCars::handle(): Collection` — cars accessible to authenticated user, with owner loaded in `users` key and `pivot.role` for current user
  - `ShowCar::handle(Car): array` — car with `users` (owner only) loaded
  - Dashboard renders cars from `accessibleCars()`
  - Refuel form/index shows only accessible cars

- [ ] **Step 1: Write failing tests**

Create `tests/Feature/CarUserAccessTest.php`:

```php
<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('owner can see their car on the dashboard', function () {
    $owner = User::factory()->create();
    Car::factory()->ownedBy($owner)->create(['name' => 'Owners Car']);

    $this->actingAs($owner)->get('/dashboard')->assertOk();
});

test('co-driver sees shared car on dashboard', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create(['name' => 'Shared Car']);
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)->get('/dashboard')->assertOk();
});

test('user cannot see a car they have no access to', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    Car::factory()->ownedBy($owner)->create();

    $this->actingAs($stranger)
        ->get('/cars')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
                ->has('cars', 0)
            )
        );
});

test('co-driver sees shared car in car list', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get('/cars')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
                ->has('cars', 1)
            )
        );
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --compact --filter=CarUserAccessTest
```

Expected: FAIL — scoping not yet implemented.

- [ ] **Step 3: Update CreateCar**

Replace `app/Actions/Cars/CreateCar.php`:

```php
<?php

namespace App\Actions\Cars;

use App\Models\Car;
use App\Models\User;

class CreateCar
{
    /**
     * @param  array{name: string, registration_number: string, is_electric: bool, start_milage?: int|null, purchase_price?: float|int|null, sale_price?: float|int|null}  $data
     */
    public function handle(User $user, array $data): Car
    {
        $car = Car::create($data);
        $car->users()->attach($user->id, ['role' => 'owner']);

        return $car;
    }
}
```

- [ ] **Step 4: Update ListCars**

Replace `app/Actions/Cars/ListCars.php`:

```php
<?php

namespace App\Actions\Cars;

use Illuminate\Database\Eloquent\Collection;

class ListCars
{
    public function handle(): Collection
    {
        return auth()->user()->accessibleCars()
            ->with(['users' => fn ($q) => $q->wherePivot('role', 'owner')->select('users.id', 'users.name')])
            ->latest('cars.created_at')
            ->get(['cars.id', 'cars.name', 'cars.registration_number', 'cars.is_electric']);
    }
}
```

- [ ] **Step 5: Update ShowCar**

Replace `app/Actions/Cars/ShowCar.php`:

```php
<?php

namespace App\Actions\Cars;

use App\Models\Car;
use Closure;
use Illuminate\Database\Eloquent\Collection;

class ShowCar
{
    /**
     * @return array{car: Car, expenses: Closure, refuels: Closure, start_milage: mixed}
     */
    public function handle(Car $car): array
    {
        $car->load(['users' => fn ($q) => $q->wherePivot('role', 'owner')->select('users.id', 'users.name')]);

        return [
            'car' => $car,
            'expenses' => fn (): Collection => $car->carExpenses->sortByDesc('invoice_date')->values(),
            'refuels' => fn (): Collection => $car->refuels,
            'start_milage' => $car->start_milage,
        ];
    }
}
```

- [ ] **Step 6: Update DashboardController**

Replace `app/Http/Controllers/DashboardController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardStats;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(BuildDashboardStats $buildDashboardStats): Response
    {
        $user = auth()->user();
        $cars = $user->accessibleCars()->orderBy('cars.created_at', 'desc')->get();

        if ($cars->isEmpty()) {
            return Inertia::render('dashboard', [
                'stats' => null,
                'message' => 'Please add a car to start tracking fuel consumption.',
            ]);
        }

        return Inertia::render('dashboard', [
            'cars' => Inertia::defer($buildDashboardStats->handle($cars))->once(),
        ]);
    }
}
```

- [ ] **Step 7: Update GetRefuelFormData**

Replace `app/Actions/Refuel/GetRefuelFormData.php`:

```php
<?php

namespace App\Actions\Refuel;

use App\Models\GasStation;
use Illuminate\Support\Collection;

class GetRefuelFormData
{
    /**
     * @return array{cars: Collection, gasStations: Collection}
     */
    public function handle(bool $orderByLatestRefuel): array
    {
        $cars = auth()->user()->accessibleCars()->select(['cars.id', 'cars.name', 'cars.is_electric'])->get();

        if (! $orderByLatestRefuel) {
            return [
                'cars' => $cars,
                'gasStations' => GasStation::select(['id', 'name'])->get(),
            ];
        }

        return [
            'cars' => $cars,
            'gasStations' => GasStation::select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->orderByRaw('MAX(refuels.created_at) DESC')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->get(),
        ];
    }
}
```

- [ ] **Step 8: Update GetRefuelIndexData**

Replace `app/Actions/Refuel/GetRefuelIndexData.php`:

```php
<?php

namespace App\Actions\Refuel;

use App\Models\GasStation;
use Illuminate\Support\Collection;

class GetRefuelIndexData
{
    /**
     * @return array{cars: Collection, gasStations: Collection}
     */
    public function handle(): array
    {
        return [
            'cars' => auth()->user()->accessibleCars()->select(['cars.id', 'cars.name', 'cars.is_electric'])->get(),
            'gasStations' => GasStation::select(['gas_stations.id', 'gas_stations.name'])
                ->leftJoin('refuels', 'gas_stations.id', '=', 'refuels.gas_station_id')
                ->groupBy('gas_stations.id', 'gas_stations.name')
                ->orderByRaw('COUNT(refuels.id) DESC')
                ->get(),
        ];
    }
}
```

- [ ] **Step 9: Run tests**

```bash
php artisan test --compact --filter=CarUserAccessTest
```

Expected: all 4 tests pass.

- [ ] **Step 10: Run full suite**

```bash
php artisan test --compact
```

Expected: all tests pass.

- [ ] **Step 11: Run Pint**

```bash
vendor/bin/pint --dirty --format agent
```

- [ ] **Step 12: Commit**

```bash
git add app/Actions/Cars/CreateCar.php app/Actions/Cars/ListCars.php app/Actions/Cars/ShowCar.php app/Http/Controllers/DashboardController.php app/Actions/Refuel/GetRefuelFormData.php app/Actions/Refuel/GetRefuelIndexData.php tests/Feature/CarUserAccessTest.php
git commit -m "$(cat <<'EOF'
scope car queries to accessible cars for dashboard and lists
EOF
)"
```

---

## Task 4: CarUserController

**Files:**
- Create: `app/Http/Controllers/CarUserController.php`
- Modify: `routes/web.php`
- Create: `tests/Feature/CarUserManagementTest.php`

**Interfaces:**
- Consumes: `CarPolicy::manageUsers` (Task 2), `Car::users()` (Task 2)
- Produces:
  - `POST /cars/{car}/users` — name: `cars.users.store` — attaches a user as co_driver by email
  - `DELETE /cars/{car}/users/{user}` — name: `cars.users.destroy` — detaches a co-driver

- [ ] **Step 1: Write failing tests**

Create `tests/Feature/CarUserManagementTest.php`:

```php
<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('owner can add a co-driver by email', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create(['email' => 'codriver@example.com']);
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->post(route('cars.users.store', $car), ['email' => 'codriver@example.com'])
        ->assertRedirect();

    expect($car->users()->where('users.id', $coDriver->id)->wherePivot('role', 'co_driver')->exists())->toBeTrue();
});

test('adding co-driver with unknown email returns validation error', function () {
    $owner = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->post(route('cars.users.store', $car), ['email' => 'nobody@example.com'])
        ->assertSessionHasErrors('email');
});

test('co-driver cannot add other users', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $stranger = User::factory()->create(['email' => 'stranger@example.com']);
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->post(route('cars.users.store', $car), ['email' => 'stranger@example.com'])
        ->assertForbidden();
});

test('owner can remove a co-driver', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($owner)
        ->delete(route('cars.users.destroy', [$car, $coDriver]))
        ->assertRedirect();

    expect($car->users()->where('users.id', $coDriver->id)->exists())->toBeFalse();
});

test('owner cannot remove themselves', function () {
    $owner = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($owner)
        ->delete(route('cars.users.destroy', [$car, $owner]))
        ->assertSessionHasErrors('user');
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --compact --filter=CarUserManagementTest
```

Expected: FAIL — controller and routes don't exist yet.

- [ ] **Step 3: Create CarUserController**

Create `app/Http/Controllers/CarUserController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CarUserController extends Controller
{
    public function store(Request $request, Car $car): RedirectResponse
    {
        $this->authorize('manageUsers', $car);

        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return back()->withErrors(['email' => 'No user found with this email address.']);
        }

        if ($car->users()->where('users.id', $user->id)->exists()) {
            return back()->withErrors(['email' => 'This user already has access to this car.']);
        }

        $car->users()->attach($user->id, ['role' => 'co_driver']);

        return back()->with('success', 'Co-driver added successfully.');
    }

    public function destroy(Car $car, User $user): RedirectResponse
    {
        $this->authorize('manageUsers', $car);

        if ($user->id === auth()->id()) {
            return back()->withErrors(['user' => 'You cannot remove yourself from the car.']);
        }

        $car->users()->detach($user->id);

        return back()->with('success', 'Co-driver removed successfully.');
    }
}
```

- [ ] **Step 4: Add routes**

In `routes/web.php`, add inside the `auth` middleware group after the existing car expense routes:

```php
// Car user management
Route::post('cars/{car}/users', [\App\Http\Controllers\CarUserController::class, 'store'])->name('cars.users.store');
Route::delete('cars/{car}/users/{user}', [\App\Http\Controllers\CarUserController::class, 'destroy'])->name('cars.users.destroy');
```

- [ ] **Step 5: Run tests**

```bash
php artisan test --compact --filter=CarUserManagementTest
```

Expected: all 5 tests pass.

- [ ] **Step 6: Run full suite**

```bash
php artisan test --compact
```

Expected: all tests pass.

- [ ] **Step 7: Run Pint**

```bash
vendor/bin/pint --dirty --format agent
```

- [ ] **Step 8: Commit**

```bash
git add app/Http/Controllers/CarUserController.php routes/web.php tests/Feature/CarUserManagementTest.php
git commit -m "$(cat <<'EOF'
add CarUserController for adding and removing co-drivers
EOF
)"
```

---

## Task 5: CarController Policy Gates + RefuelController

**Files:**
- Modify: `app/Http/Controllers/CarController.php`
- Modify: `app/Http/Controllers/RefuelController.php`

**Interfaces:**
- Consumes: `CarPolicy::view`, `CarPolicy::update`, `CarPolicy::delete`, `CarPolicy::manageUsers` (Task 2)
- Produces: HTTP 403 for unauthorized access to car show/edit/update/destroy; co-drivers can add refuels

- [ ] **Step 1: Write failing tests**

Add to `tests/Feature/CarUserAccessTest.php` (append these tests):

```php
test('co-driver cannot edit a car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('cars.edit', $car))
        ->assertForbidden();
});

test('stranger cannot view a car', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($stranger)
        ->get(route('cars.show', $car))
        ->assertForbidden();
});

test('co-driver can view a car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('cars.show', $car))
        ->assertOk();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --compact --filter="co-driver cannot edit|stranger cannot view|co-driver can view"
```

Expected: FAIL — no gates yet.

- [ ] **Step 3: Update CarController**

Replace `app/Http/Controllers/CarController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Actions\Cars\CreateCar;
use App\Actions\Cars\DeleteCar;
use App\Actions\Cars\ListCars;
use App\Actions\Cars\ShowCar;
use App\Actions\Cars\UpdateCar;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function index(ListCars $listCars): Response
    {
        return Inertia::render('Cars/Index', [
            'cars' => Inertia::defer(fn () => $listCars->handle()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Cars/CarCreate');
    }

    public function store(Request $request, CreateCar $createCar)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars',
            'is_electric' => 'required|boolean',
            'start_milage' => 'nullable|integer|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
        ]);

        $createCar->handle(auth()->user(), $validated);

        return redirect()->route('cars.index')->with('success', 'Car created successfully');
    }

    public function show(Car $car, ShowCar $showCar): Response
    {
        $this->authorize('view', $car);

        $data = $showCar->handle($car);

        return Inertia::render('Cars/Show', [
            'car' => $data['car'],
            'expenses' => Inertia::defer($data['expenses']),
            'refuels' => Inertia::defer($data['refuels']),
            'start_milage' => $data['start_milage'],
        ]);
    }

    public function edit(Car $car): Response
    {
        $this->authorize('update', $car);

        $carUsers = $car->users()->get(['users.id', 'users.name', 'users.email'])->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->pivot->role,
        ]);

        return Inertia::render('Cars/CarEdit', [
            'car' => $car,
            'carUsers' => $carUsers,
            'isOwner' => true,
        ]);
    }

    public function update(Request $request, Car $car, UpdateCar $updateCar)
    {
        $this->authorize('update', $car);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars,registration_number,'.$car->id,
            'is_electric' => 'required|boolean',
            'start_milage' => 'nullable|integer|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
        ]);

        $updateCar->handle($car, $validated);

        return redirect()->route('cars.index')->with('success', 'Car updated successfully');
    }

    public function destroy(Car $car, DeleteCar $deleteCar)
    {
        $this->authorize('delete', $car);

        $deleteCar->handle($car);

        return redirect()->back()->with('success', 'Car deleted successfully');
    }
}
```

- [ ] **Step 4: Update RefuelController@store to check car access**

In `app/Http/Controllers/RefuelController.php`, update the `store` method to add an authorization check after validation. Find the `store` method and add `$this->authorize('view', Car::findOrFail($validated['car_id']));` after `$validated = $request->validate([...]);`:

```php
public function store(Request $request, CreateRefuel $createRefuel)
{
    $validated = $request->validate([
        'car_id' => 'required|exists:cars,id',
        'gas_station_id' => 'nullable|exists:gas_stations,id',
        'new_gas_station_name' => 'nullable|string|max:255',
        'new_gas_station_address' => 'nullable|string|max:255',
        'liters_refueled' => 'required|numeric|min:0',
        'total_price' => 'required|numeric|min:0',
        'mileage' => [
            'required',
            'integer',
            'min:0',
            function ($attribute, $value, $fail) use ($request) {
                $lastRefuel = Refuel::where('car_id', $request->car_id)
                    ->orderByDesc('mileage')
                    ->first();

                if ($lastRefuel && $value <= $lastRefuel->mileage) {
                    $fail("The mileage must be greater than the last refuel's mileage ({$lastRefuel->mileage}).");
                }
            },
        ],
    ]);

    $this->authorize('view', Car::findOrFail($validated['car_id']));

    $createRefuel->handle($validated);

    return redirect()->route('refuels.index')->with('success', 'Refuel created successfully');
}
```

Also add the `Car` import at the top of `RefuelController.php`:

```php
use App\Models\Car;
```

- [ ] **Step 5: Run tests**

```bash
php artisan test --compact --filter=CarUserAccessTest
```

Expected: all tests pass.

- [ ] **Step 6: Run full suite**

```bash
php artisan test --compact
```

Expected: all tests pass.

- [ ] **Step 7: Run Pint**

```bash
vendor/bin/pint --dirty --format agent
```

- [ ] **Step 8: Commit**

```bash
git add app/Http/Controllers/CarController.php app/Http/Controllers/RefuelController.php tests/Feature/CarUserAccessTest.php
git commit -m "$(cat <<'EOF'
apply policy gates to car and refuel controllers
EOF
)"
```

---

## Task 6: Frontend — CarEdit Users Section, CarCard, Index, Show

**Files:**
- Modify: `resources/js/pages/Cars/CarEdit.tsx`
- Modify: `resources/js/pages/Cars/CarCard.tsx`
- Modify: `resources/js/pages/Cars/Index.tsx`
- Modify: `resources/js/pages/Cars/Show.tsx`

**Interfaces:**
- Consumes: `carUsers: {id, name, email, role}[]` and `isOwner: boolean` from `CarController@edit` (Task 5)
- Consumes: `car.users[0]?.name` for owner display (from Task 3 `ListCars` / `ShowCar`)
- Consumes: `car.pivot?.role` for current user's role on car list
- Produces: CarEdit page with users management section; CarCard shows/hides edit/delete based on role

- [ ] **Step 1: Update CarEdit.tsx**

Replace `resources/js/pages/Cars/CarEdit.tsx`:

```tsx
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { router, useForm } from '@inertiajs/react';
import { Trash2, UserPlus, Users } from 'lucide-react';
import CarForm from './CarForm';

interface Car {
    id: number;
    name: string;
    registration_number: string;
    start_milage?: number;
    purchase_price?: number;
    sale_price?: number;
    is_electric?: boolean;
}

interface CarUser {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'co_driver';
}

interface CarEditProps {
    car: Car;
    carUsers: CarUser[];
    isOwner: boolean;
}

function AddCoDriverForm({ carId }: { carId: number }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('cars.users.store', { car: carId }), {
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1">
                <Input
                    type="email"
                    placeholder="Email address"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <Button type="submit" disabled={processing} size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add
            </Button>
        </form>
    );
}

export default function CarEdit({ car, carUsers, isOwner }: CarEditProps) {
    const breadcrumbs = [
        { title: 'Cars', href: '/cars' },
        { title: 'Edit Car', href: `/cars/${car.id}/edit` },
    ];

    function handleRemoveUser(userId: number) {
        router.delete(route('cars.users.destroy', { car: car.id, user: userId }));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title="Edit Car" />
            <CarForm formType="edit" car={car} />

            {isOwner && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="h-4 w-4" />
                            Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="divide-y">
                            {carUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-muted-foreground text-xs">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                                            {user.role === 'owner' ? 'Owner' : 'Co-driver'}
                                        </Badge>
                                        {user.role === 'co_driver' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveUser(user.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <AddCoDriverForm carId={car.id} />
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
}
```

- [ ] **Step 2: Update CarCard.tsx**

Replace `resources/js/pages/Cars/CarCard.tsx`:

```tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Car, MoreVertical, Pencil, Trash2, User } from 'lucide-react';

interface CarCardProps {
    car: {
        id: number;
        name: string;
        registration_number: string;
        is_electric?: boolean;
        users?: { id: number; name: string }[];
        pivot?: { role: 'owner' | 'co_driver' };
    };
    onDelete?: (car: CarCardProps['car']) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
    const isOwner = car.pivot?.role === 'owner';
    const ownerName = car.users?.[0]?.name ?? '-';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <CardTitle>
                        <Link href={route('cars.show', { car: car.id })} className="hover:underline">
                            {car.name}
                        </Link>
                    </CardTitle>
                    <Badge variant={car.is_electric ? 'secondary' : 'outline'}>{car.is_electric ? 'EV' : 'Fossil'}</Badge>
                </div>
                {isOwner && (
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={route('cars.edit', { car: car.id })} className="flex items-center">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete?.(car)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 gap-4">
                    <p className="text-muted-foreground col-span-2 flex items-center gap-2 text-sm">
                        <Car className="size-5" />
                        {car.registration_number}
                    </p>
                    <p className="text-muted-foreground col-span-3 flex items-center gap-2 text-sm">
                        <User className="size-5" />
                        {ownerName}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
```

- [ ] **Step 3: Update Index.tsx Car interface**

In `resources/js/pages/Cars/Index.tsx`, update the `Car` interface and fix the missing `BreadcrumbItem` import:

```tsx
import Heading from '@/components/heading';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CarCard from './CarCard';
import DeleteConfirmation from './DeleteConfirmation';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cars',
        href: '/cars',
    },
];

interface Car {
    id: number;
    name: string;
    registration_number: string;
    is_electric?: boolean;
    users?: { id: number; name: string }[];
    pivot?: { role: 'owner' | 'co_driver' };
}

interface Props {
    cars?: Car[];
}

export default function Cars({ cars }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    const handleDelete = (car: Car) => {
        setSelectedCar(car);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCar) {
            router.delete(`/cars/${selectedCar.id}`);
            setIsDeleteOpen(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cars" />
            <Heading level={1} title={breadcrumbs[0].title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <Deferred
                    data="cars"
                    fallback={
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="rounded-xl border p-4">
                                    <div className="space-y-3">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                        <div className="flex gap-2 pt-2">
                                            <Skeleton className="h-8 w-20" />
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {(cars ?? []).map((car) => (
                            <CarCard key={car.id} car={car} onDelete={handleDelete} />
                        ))}
                    </div>
                </Deferred>

                {selectedCar && (
                    <DeleteConfirmation
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onConfirm={confirmDelete}
                        title={`Delete ${selectedCar.name}`}
                        description={`Are you sure you want to delete ${selectedCar.name}? This action cannot be undone.`}
                    />
                )}
            </div>
        </AppLayout>
    );
}
```

- [ ] **Step 4: Update Show.tsx — replace car.user with car.users[0]**

In `resources/js/pages/Cars/Show.tsx`, update the `CarType` interface and the owner display:

Change the `CarType` definition from:
```tsx
type CarType = {
    id: number;
    name: string;
    registration_number: string;
    user?: { name?: string };
    ...
};
```
to:
```tsx
type CarType = {
    id: number;
    name: string;
    registration_number: string;
    users?: { name?: string }[];
    purchase_price?: number | null;
    sale_price?: number | null;
    start_milage?: number | null;
    is_electric?: boolean;
};
```

And change the owner display on line 82 from:
```tsx
{car.user?.name ?? '-'}
```
to:
```tsx
{car.users?.[0]?.name ?? '-'}
```

- [ ] **Step 5: Build assets**

```bash
npm run build
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 6: Run full test suite**

```bash
php artisan test --compact
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add resources/js/pages/Cars/CarEdit.tsx resources/js/pages/Cars/CarCard.tsx resources/js/pages/Cars/Index.tsx resources/js/pages/Cars/Show.tsx
git commit -m "$(cat <<'EOF'
update car UI for multi-user access: users section on edit, role-gated controls
EOF
)"
```

---

## Task 7: EV-aware Dashboard

**Files:**
- Modify: `app/Actions/Dashboard/BuildDashboardStats.php`
- Create: `tests/Feature/EvDashboardTest.php`

**Interfaces:**
- Consumes: `Car::$is_electric` (boolean), `CarExpense` model with `expense_type` and `amount` fields
- Produces: For `is_electric = true` cars, cost stats sourced from `car_expenses` where `expense_type = 'Abonnement'`; distance stats unchanged for all car types.

- [ ] **Step 1: Write failing tests**

Create `tests/Feature/EvDashboardTest.php`:

```php
<?php

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use App\Models\User;
use App\Actions\Dashboard\BuildDashboardStats;
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

    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 50,
        'total_price' => 0,
        'mileage' => 1000,
    ]);
    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 50,
        'total_price' => 0,
        'mileage' => 1500,
    ]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['currentMonth']['amount'])->toBe(299.0)
        ->and($stats->first()['stats']['totals']['amount'])->toBe(299.0)
        ->and($stats->first()['stats']['currentMonth']['kilometers'])->toBe(500);

    Carbon::setTestNow();
});

test('gas car dashboard is unaffected by ev logic', function () {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['start_milage' => 0, 'is_electric' => false]);

    Carbon::setTestNow('2026-07-06');

    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 40,
        'total_price' => 600,
        'mileage' => 1000,
    ]);
    Refuel::create([
        'car_id' => $car->id,
        'liters_refueled' => 40,
        'total_price' => 550,
        'mileage' => 1400,
    ]);

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['currentMonth']['amount'])->toBe(1150.0);

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

    $stats = app(BuildDashboardStats::class)->handle(collect([$car]))();

    expect($stats->first()['stats']['totals']['pricePerKilometer'])->toBe(0.5);

    Carbon::setTestNow();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --compact --filter=EvDashboardTest
```

Expected: FAIL — EV branching not yet implemented.

- [ ] **Step 3: Update BuildDashboardStats**

Replace `app/Actions/Dashboard/BuildDashboardStats.php`:

```php
<?php

namespace App\Actions\Dashboard;

use App\Models\CarExpense;
use App\Models\Refuel;
use Carbon\Carbon;
use Closure;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BuildDashboardStats
{
    public function handle(Collection $cars): Closure
    {
        return function () use ($cars): Collection {
            $now = Carbon::now();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();

            return $cars->map(function ($car) use ($startOfMonth, $endOfMonth): array {
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
            });
        };
    }

    private function buildEvStats($car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, float $currentMonthDistance): array
    {
        $currentMonthAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', 'Abonnement')
            ->whereBetween('invoice_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->sum('amount');

        $totalAmount = CarExpense::where('car_id', $car->id)
            ->where('expense_type', 'Abonnement')
            ->sum('amount');

        $avgMonthlyAmount = DB::table(function ($query) use ($car): void {
            $query->from('car_expenses')
                ->where('car_id', $car->id)
                ->where('expense_type', 'Abonnement')
                ->whereNotNull('invoice_date')
                ->selectRaw('YEAR(invoice_date) as year, MONTH(invoice_date) as month, SUM(amount) as monthly_amount')
                ->groupBy('year', 'month');
        }, 'monthly_costs')
            ->avg('monthly_amount') ?? 0;

        $avgMonthlyKm = DB::table(function ($query) use ($car): void {
            $query->from('refuels')
                ->where('car_id', $car->id)
                ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, MAX(mileage) - MIN(mileage) as monthly_km')
                ->groupBy('year', 'month');
        }, 'monthly_km')
            ->avg('monthly_km') ?? 0;

        $pricePerKilometer = $totalDistance > 0 ? round($totalAmount / $totalDistance, 2) : 0;

        return [
            'id' => $car->id,
            'name' => $car->name,
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
            ],
        ];
    }

    private function buildGasStats($car, Carbon $startOfMonth, Carbon $endOfMonth, float $totalDistance, float $currentMonthDistance): array
    {
        $monthlyAmountStats = Refuel::where('car_id', $car->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw('SUM(total_price) as total_amount')
            ->first();

        $averageStats = DB::table(function ($query) use ($car): void {
            $query->from('refuels')
                ->where('car_id', $car->id)
                ->selectRaw('
                    YEAR(created_at) as year,
                    MONTH(created_at) as month,
                    SUM(total_price) as monthly_amount,
                    MAX(mileage) - MIN(mileage) as monthly_kilometers
                ')
                ->groupBy('year', 'month');
        }, 'monthly_stats')
            ->selectRaw('AVG(monthly_amount) as avg_monthly_amount, AVG(monthly_kilometers) as avg_monthly_kilometers')
            ->first();

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

        return [
            'id' => $car->id,
            'name' => $car->name,
            'stats' => [
                'currentMonth' => [
                    'amount' => $monthlyAmountStats->total_amount ?? 0,
                    'kilometers' => $currentMonthDistance,
                ],
                'averages' => [
                    'monthlyAmount' => round($averageStats->avg_monthly_amount ?? 0, 2),
                    'monthlyKilometers' => round($averageStats->avg_monthly_kilometers ?? 0, 2),
                ],
                'totals' => [
                    'amount' => round($totalStats->total_amount_ever ?? 0, 2),
                    'kilometers' => round($totalDistance, 2),
                    'pricePerKilometer' => round($totalStats->price_per_kilometer ?? 0, 2),
                ],
            ],
        ];
    }
}
```

- [ ] **Step 4: Run EV tests**

```bash
php artisan test --compact --filter=EvDashboardTest
```

Expected: all 3 tests pass.

- [ ] **Step 5: Run full suite**

```bash
php artisan test --compact
```

Expected: all tests pass.

- [ ] **Step 6: Run Pint**

```bash
vendor/bin/pint --dirty --format agent
```

- [ ] **Step 7: Commit**

```bash
git add app/Actions/Dashboard/BuildDashboardStats.php tests/Feature/EvDashboardTest.php
git commit -m "$(cat <<'EOF'
source EV dashboard cost stats from subscription expenses
EOF
)"
```
