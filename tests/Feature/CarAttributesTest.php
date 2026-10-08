<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\User;

test('creating a car stores every submitted attribute', function (): void {
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
        ->assertRedirect(route('cars.index'));

    $car = Car::query()->where('registration_number', 'AB12345')->sole();

    expect($car->name)->toBe('Family car')
        ->and($car->is_electric)->toBeTrue()
        ->and($car->start_milage)->toBe(1200)
        ->and($car->purchase_price)->toBe('250000.50')
        ->and($car->sale_price)->toBeNull()
        ->and($user->ownedCars()->whereKey($car->id)->exists())->toBeTrue();
});

test('updating a car leaves omitted optional attributes unchanged', function (): void {
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
        ->assertRedirect(route('cars.index'));

    $car->refresh();

    expect($car->name)->toBe('Renamed')
        ->and($car->start_milage)->toBe(5000)
        ->and($car->purchase_price)->toBe('100000.00')
        ->and($car->sale_price)->toBe('40000.00');
});

test('updating a car clears an optional attribute that is sent empty', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create(['sale_price' => 40000]);

    $this->actingAs($user)
        ->put(route('cars.update', $car), [
            'name' => $car->name,
            'registration_number' => $car->registration_number,
            'is_electric' => false,
            'sale_price' => '',
        ])
        ->assertRedirect(route('cars.index'));

    expect($car->refresh()->sale_price)->toBeNull();
});
