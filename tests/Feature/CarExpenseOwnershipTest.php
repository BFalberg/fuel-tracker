<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\CarExpense;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('editing an expense from a different car returns 404', function (): void {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::query()->create([
        'car_id' => $carB->id,
        'expense_type' => 'Værksted',
        'amount' => 500,
    ]);

    $this->actingAs($user)
        ->get(route('cars.expenses.edit', ['car' => $carA->id, 'expense' => $expense->id]))
        ->assertNotFound();
});

test('updating an expense from a different car returns 404', function (): void {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::query()->create([
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

test('deleting an expense from a different car returns 404', function (): void {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::query()->create([
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

test('editing an expense belonging to the correct car succeeds', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::query()->create([
        'car_id' => $car->id,
        'expense_type' => 'Værksted',
        'amount' => 500,
    ]);

    $this->actingAs($user)
        ->get(route('cars.expenses.edit', ['car' => $car->id, 'expense' => $expense->id]))
        ->assertOk();
});

/**
 * The edit page previously rendered without the app layout, leaving no header
 * and no navigation. Locks in that it renders as a normal Inertia page.
 */
test('the expense edit page renders inside the app', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $expense = CarExpense::query()->create([
        'car_id' => $car->id,
        'expense_type' => 'Værksted',
        'amount' => 500,
    ]);

    $this->actingAs($user)
        ->get(route('cars.expenses.edit', ['car' => $car->id, 'expense' => $expense->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('CarExpenses/Edit')
            ->where('car.id', $car->id)
            ->where('expense.id', $expense->id)
            ->has('expenseTypes')
        );
});
