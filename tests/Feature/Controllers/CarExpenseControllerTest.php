<?php

declare(strict_types=1);

use App\Enums\ExpenseType;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('renders the create expense page', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->get(route('cars.expenses.create', $car))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('car-expense/create')
            ->where('car.id', $car->id)
            ->where('expenseTypes', ExpenseType::values()));
});

it('does not let a stranger open the create expense page', function (): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->get(route('cars.expenses.create', $car))
        ->assertForbidden();
});

it('lets a co-driver create an expense on a shared car', function (): void {
    $owner = User::factory()->create();
    $coDriver = User::factory()->create();
    $car = Car::factory()->ownedBy($owner)->create();
    $car->users()->attach($coDriver->id, ['role' => 'co_driver']);

    $this->actingAs($coDriver)
        ->post(route('cars.expenses.store', $car), [
            'expense_type' => 'Værksted',
            'amount' => 500,
        ])
        ->assertRedirectToRoute('cars.show', $car);

    expect(CarExpense::query()->where('car_id', $car->id)->count())->toBe(1);
});

it('validates the expense type', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();

    $this->actingAs($user)
        ->post(route('cars.expenses.store', $car), [
            'expense_type' => 'Unknown',
            'amount' => 500,
        ])
        ->assertSessionHasErrors('expense_type');
});

it('does not let a stranger create an expense', function (): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->post(route('cars.expenses.store', $car), [
            'expense_type' => 'Værksted',
            'amount' => 500,
        ])
        ->assertForbidden();

    expect(CarExpense::query()->where('car_id', $car->id)->count())->toBe(0);
});

it('renders the edit expense page inside the app', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $expense = CarExpense::factory()->forCar($car)->create();

    $this->actingAs($user)
        ->get(route('cars.expenses.edit', ['car' => $car, 'carExpense' => $expense]))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('car-expense/edit')
            ->where('car.id', $car->id)
            ->where('expense.id', $expense->id)
            ->has('expenseTypes'));
});

it('may update an expense', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $expense = CarExpense::factory()->forCar($car)->create(['amount' => 500]);

    $this->actingAs($user)
        ->put(route('cars.expenses.update', ['car' => $car, 'carExpense' => $expense]), [
            'expense_type' => 'Forsikring',
            'amount' => 300,
            'description' => 'Yearly',
        ])
        ->assertRedirectToRoute('cars.show', $car);

    $expense->refresh();

    expect($expense->expense_type)->toBe(ExpenseType::Insurance)
        ->and($expense->amount)->toBe('300.00')
        ->and($expense->description)->toBe('Yearly');
});

it('may delete an expense', function (): void {
    $user = User::factory()->create();
    $car = Car::factory()->ownedBy($user)->create();
    $expense = CarExpense::factory()->forCar($car)->create();

    $this->actingAs($user)
        ->delete(route('cars.expenses.destroy', ['car' => $car, 'carExpense' => $expense]))
        ->assertRedirectToRoute('cars.show', $car);

    expect(CarExpense::query()->find($expense->id))->toBeNull();
});

it('does not let a stranger edit, update or delete an expense', function (string $method, string $route): void {
    $car = Car::factory()->ownedBy(User::factory()->create())->create();
    $expense = CarExpense::factory()->forCar($car)->create(['amount' => 500]);

    $this->actingAs(User::factory()->create())
        ->{$method}(route($route, ['car' => $car, 'carExpense' => $expense]), [
            'expense_type' => 'Forsikring',
            'amount' => 99999,
        ])
        ->assertForbidden();

    expect($expense->fresh()?->amount)->toBe('500.00');
})->with([
    'edit' => ['get', 'cars.expenses.edit'],
    'update' => ['put', 'cars.expenses.update'],
    'delete' => ['delete', 'cars.expenses.destroy'],
]);

it('returns 404 for an expense that belongs to a different car', function (string $method, string $route): void {
    $user = User::factory()->create();
    $carA = Car::factory()->ownedBy($user)->create();
    $carB = Car::factory()->ownedBy($user)->create();
    $expense = CarExpense::factory()->forCar($carB)->create(['amount' => 500]);

    $this->actingAs($user)
        ->{$method}(route($route, ['car' => $carA, 'carExpense' => $expense]), [
            'expense_type' => 'Forsikring',
            'amount' => 300,
        ])
        ->assertNotFound();

    expect($expense->fresh()?->amount)->toBe('500.00');
})->with([
    'edit' => ['get', 'cars.expenses.edit'],
    'update' => ['put', 'cars.expenses.update'],
    'delete' => ['delete', 'cars.expenses.destroy'],
]);
