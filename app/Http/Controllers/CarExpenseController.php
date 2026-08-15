<?php

namespace App\Http\Controllers;

use App\Actions\CarExpenses\CreateCarExpense;
use App\Actions\CarExpenses\DeleteCarExpense;
use App\Actions\CarExpenses\UpdateCarExpense;
use App\Enums\ExpenseType;
use App\Models\Car;
use App\Models\CarExpense;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CarExpenseController extends Controller
{
    use AuthorizesRequests;

    public function create(Car $car): Response
    {
        $this->authorize('view', $car);

        return Inertia::render('CarExpenses/Create', [
            'car' => $car,
            'expenseTypes' => ExpenseType::values(),
        ]);
    }

    public function store(Request $request, Car $car, CreateCarExpense $createCarExpense): RedirectResponse
    {
        $this->authorize('view', $car);

        $data = $request->validate([
            'expense_type' => ['required', Rule::enum(ExpenseType::class)],
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'vendor' => 'nullable|string',
            'invoice_date' => 'nullable|date',
        ]);
        $createCarExpense->handle($car, $data);

        return redirect()->route('cars.show', $car);
    }

    public function edit(Car $car, CarExpense $expense): Response
    {
        abort_if($expense->car_id !== $car->id, 404);
        $this->authorize('update', $expense);

        return Inertia::render('CarExpenses/Edit', [
            'car' => $car,
            'expense' => $expense,
            'expenseTypes' => ExpenseType::values(),
        ]);
    }

    public function update(Request $request, Car $car, CarExpense $expense, UpdateCarExpense $updateCarExpense): RedirectResponse
    {
        abort_if($expense->car_id !== $car->id, 404);
        $this->authorize('update', $expense);

        $data = $request->validate([
            'expense_type' => ['required', Rule::enum(ExpenseType::class)],
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'vendor' => 'nullable|string',
            'invoice_date' => 'nullable|date',
        ]);
        $updateCarExpense->handle($expense, $data);

        return redirect()->route('cars.show', $car);
    }

    public function destroy(Car $car, CarExpense $expense, DeleteCarExpense $deleteCarExpense): RedirectResponse
    {
        abort_if($expense->car_id !== $car->id, 404);
        $this->authorize('delete', $expense);

        $deleteCarExpense->handle($expense);

        return redirect()->route('cars.show', $car);
    }
}
