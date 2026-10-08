<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Refuel;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('defers the cars list on the index page', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->count(2)->create();

    $this->actingAs($user)
        ->get(route('cars.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('car/index')
            ->missing('cars')
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('cars', 2)
                ->where('cars.0.pivot.role', 'owner')
                ->where('cars.0.can_delete', true)));
});

it('shows a shared car to a co-driver in the cars list', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('cars.index'))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('cars', 1)
                ->where('cars.0.pivot.role', 'co_driver')));
});

it('hides cars the user has no access to', function (): void {
    Car::factory()->ownedBy(User::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->get(route('cars.index'))
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('cars', 0)));
});

it('renders the create car page', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('cars.create'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page->component('car/create'));
});

it('may create a car with every submitted attribute', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('cars.store'), [
            'name' => 'Family car',
            'registration_number' => 'AB12345',
            'is_electric' => true,
            'start_milage' => 1200,
            'purchase_price' => '250000.50',
            'sale_price' => null,
        ])
        ->assertRedirectToRoute('cars.index')
        ->assertSessionHas('success', 'Car created successfully');

    $car = Car::query()->where('registration_number', 'AB12345')->sole();

    expect($car->name)->toBe('Family car')
        ->and($car->is_electric)->toBeTrue()
        ->and($car->start_milage)->toBe(1200)
        ->and($car->purchase_price)->toBe('250000.50')
        ->and($car->sale_price)->toBeNull()
        ->and($user->ownedCars()->whereKey($car->id)->exists())->toBeTrue();
});

it('requires a unique registration number', function (): void {
    $user = User::factory()->create();
    $existing = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->post(route('cars.store'), [
            'name' => 'Second car',
            'registration_number' => $existing->registration_number,
            'is_electric' => false,
        ])
        ->assertSessionHasErrors('registration_number');
});

it('shows a car to its owner', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['start_milage' => 100]);
    CarExpense::factory()->forCar($car)->create();
    Refuel::factory()->forCar($car)->create();

    $this->actingAs($user)
        ->get(route('cars.show', $car))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('car/show')
            ->where('car.id', $car->id)
            ->where('start_milage', 100)
            ->has('car.users', 1)
            ->missing('expenses')
            ->missing('refuels')
            ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
                ->has('expenses', 1)
                ->has('refuels', 1)));
});

it('shows a car to a co-driver', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('cars.show', $car))
        ->assertOk();
});

it('does not show a car to a stranger', function (): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->get(route('cars.show', $car))
        ->assertForbidden();
});

it('renders the edit car page for the owner', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($owner)
        ->get(route('cars.edit', $car))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('car/edit')
            ->where('car.id', $car->id)
            ->where('isOwner', true)
            ->has('carUsers', 2));
});

it('does not let a co-driver edit a car', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->get(route('cars.edit', $car))
        ->assertForbidden();
});

it('leaves omitted optional attributes unchanged on update', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create([
        'start_milage' => 5000,
        'purchase_price' => 100000,
        'sale_price' => 40000,
    ]);

    $this->actingAs($user)
        ->put(route('cars.update', $car), [
            'name' => 'Renamed',
            'registration_number' => $car->registration_number,
            'is_electric' => false,
        ])
        ->assertRedirectToRoute('cars.index')
        ->assertSessionHas('success', 'Car updated successfully');

    $car->refresh();

    expect($car->name)->toBe('Renamed')
        ->and($car->start_milage)->toBe(5000)
        ->and($car->purchase_price)->toBe('100000.00')
        ->and($car->sale_price)->toBe('40000.00');
});

it('clears an optional attribute that is sent empty on update', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['sale_price' => 40000]);

    $this->actingAs($user)
        ->put(route('cars.update', $car), [
            'name' => $car->name,
            'registration_number' => $car->registration_number,
            'is_electric' => false,
            'sale_price' => '',
        ])
        ->assertRedirectToRoute('cars.index');

    expect($car->refresh()->sale_price)->toBeNull();
});

it('may delete a car with no history', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->delete(route('cars.destroy', $car))
        ->assertRedirect()
        ->assertSessionHas('success', 'Car deleted successfully');

    expect(Car::query()->find($car->id))->toBeNull();
});

it('may not delete a car with refuels', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    Refuel::factory()->forCar($car)->create();

    $this->actingAs($user)
        ->delete(route('cars.destroy', $car))
        ->assertSessionHasErrors('car');

    expect(Car::query()->find($car->id))->not->toBeNull();
});

it('may not delete a car with expenses', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    CarExpense::factory()->forCar($car)->create();

    $this->actingAs($user)
        ->delete(route('cars.destroy', $car))
        ->assertSessionHasErrors('car');

    expect(Car::query()->find($car->id))->not->toBeNull();
});

it('does not let a co-driver delete a car', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->delete(route('cars.destroy', $car))
        ->assertForbidden();

    expect(Car::query()->find($car->id))->not->toBeNull();
});
