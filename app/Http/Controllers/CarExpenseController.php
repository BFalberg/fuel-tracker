<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateCarExpense;
use App\Actions\DeleteCarExpense;
use App\Actions\UpdateCarExpense;
use App\Enums\ExpenseType;
use App\Http\Requests\CreateCarExpenseRequest;
use App\Http\Requests\UpdateCarExpenseRequest;
use App\Models\Car;
use App\Models\CarExpense;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final readonly class CarExpenseController
{
    public function create(Car $car): Response
    {
        return Inertia::render('car-expense/create', [
            'car' => $car,
            'expenseTypes' => ExpenseType::values(),
        ]);
    }

    public function store(CreateCarExpenseRequest $request, Car $car, CreateCarExpense $action): RedirectResponse
    {
        $action->handle($car, $request->validated());

        return to_route('cars.show', $car);
    }

    public function edit(Car $car, CarExpense $carExpense): Response
    {
        return Inertia::render('car-expense/edit', [
            'car' => $car,
            'expense' => $carExpense,
            'expenseTypes' => ExpenseType::values(),
        ]);
    }

    public function update(UpdateCarExpenseRequest $request, Car $car, CarExpense $carExpense, UpdateCarExpense $action): RedirectResponse
    {
        $action->handle($carExpense, $request->validated());

        return to_route('cars.show', $car);
    }

    public function destroy(Car $car, CarExpense $carExpense, DeleteCarExpense $action): RedirectResponse
    {
        $action->handle($carExpense);

        return to_route('cars.show', $car);
    }
}
