<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

it('redirects guests to the login page', function (): void {
    $this->get(route('dashboard'))->assertRedirectToRoute('login');
});

it('shows a message when the user has no cars', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('dashboard')
            ->where('cars', [])
            ->where('selectedCarId', null)
            ->where('message', 'Please add a car to start tracking fuel consumption.'));
});

it('selects the newest car by default', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create(['created_at' => now()->subDays(10)]);
    $newCar = Car::factory()->ownedBy($user)->create(['created_at' => now()]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('dashboard')
            ->where('selectedCarId', $newCar->id)
            ->has('cars', 2)
            ->missing('stats')
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->where('stats.id', $newCar->id)));
});

it('shows a shared car to a co-driver', function (): void {
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy(User::factory()->create())->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('dashboard'))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedCarId', $car->id));
});

it('respects the car query parameter', function (): void {
    $user = User::factory()->create();
    $olderCar = Car::factory()->ownedBy($user)->create(['created_at' => now()->subDays(10)]);
    Car::factory()->ownedBy($user)->create(['created_at' => now()]);

    $this->actingAs($user)
        ->get(route('dashboard', ['car' => $olderCar->id]))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedCarId', $olderCar->id));
});

it('falls back to the newest car for an unknown car', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['car' => 99999]))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedCarId', $car->id));
});

it('does not expose the cars of other users', function (): void {
    $user = User::factory()->create();
    $myCar = Car::factory()->ownedBy($user)->create();
    $theirCar = Car::factory()->ownedBy(User::factory()->create())->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['car' => $theirCar->id]))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedCarId', $myCar->id));
});

it('defaults the period to the last six months', function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-07-15'));

    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedFrom', '2026-02')
            ->where('selectedTo', '2026-07'));
});

it('honours the from and to parameters', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['from' => '2026-02', 'to' => '2026-04']))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedFrom', '2026-02')
            ->where('selectedTo', '2026-04'));
});

it('moves the end of a reversed period to the start month', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['from' => '2026-05', 'to' => '2026-02']))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedFrom', '2026-05')
            ->where('selectedTo', '2026-05'));
});

it('clamps an absurdly wide period instead of fanning out queries', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    DB::enableQueryLog();

    $this->actingAs($user)
        ->get(route('dashboard', ['from' => '1900-01', 'to' => '2026-08']))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('selectedFrom', '2021-09')
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('stats.stats.monthlyTrends', 60)));

    expect(count(DB::getQueryLog()))->toBeLessThan(50);

    DB::disableQueryLog();
});

it('rejects a malformed period parameter', function (array $query): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get(route('dashboard', $query))
        ->assertSessionHasErrors('from');
})->with([
    'not a date' => [['from' => 'not-a-date']],
    'an array' => [['from' => ['2026-01']]],
]);
