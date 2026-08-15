<?php

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\User;

test('a stranger cannot create an expense on someone elses car', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($stranger)
        ->post(route('cars.expenses.store', $car), [
            'expense_type' => 'Værksted',
            'amount' => 500,
        ])
        ->assertForbidden();

    expect(CarExpense::where('car_id', $car->id)->count())->toBe(0);
});

test('a stranger cannot open the create form for someone elses car', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();

    $this->actingAs($stranger)
        ->get(route('cars.expenses.create', $car))
        ->assertForbidden();
});

test('a stranger cannot edit an expense on someone elses car', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $expense = CarExpense::factory()->forCar($car)->create();

    $this->actingAs($stranger)
        ->get(route('cars.expenses.edit', ['car' => $car, 'expense' => $expense]))
        ->assertForbidden();
});

test('a stranger cannot update an expense on someone elses car', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $expense = CarExpense::factory()->forCar($car)->create(['amount' => 500]);

    $this->actingAs($stranger)
        ->put(route('cars.expenses.update', ['car' => $car, 'expense' => $expense]), [
            'expense_type' => 'Forsikring',
            'amount' => 99999,
        ])
        ->assertForbidden();

    expect((float) $expense->fresh()->amount)->toBe(500.0);
});

test('a stranger cannot delete an expense on someone elses car', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $expense = CarExpense::factory()->forCar($car)->create();

    $this->actingAs($stranger)
        ->delete(route('cars.expenses.destroy', ['car' => $car, 'expense' => $expense]))
        ->assertForbidden();

    expect(CarExpense::find($expense->id))->not->toBeNull();
});

test('a co-driver can manage expenses on a shared car', function () {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->post(route('cars.expenses.store', $car), [
            'expense_type' => 'Værksted',
            'amount' => 500,
        ])
        ->assertRedirect(route('cars.show', $car));

    expect(CarExpense::where('car_id', $car->id)->count())->toBe(1);
});

test('an expense belonging to a different car still returns 404', function () {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();
    $expense = CarExpense::factory()->forCar($carB)->create();

    $this->actingAs($user)
        ->get(route('cars.expenses.edit', ['car' => $carA, 'expense' => $expense]))
        ->assertNotFound();
});
