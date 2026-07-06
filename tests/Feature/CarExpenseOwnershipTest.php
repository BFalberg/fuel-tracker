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
