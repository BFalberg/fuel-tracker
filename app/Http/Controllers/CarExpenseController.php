<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\CarExpense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarExpenseController extends Controller
{
    public function index(Car $car): Response
    {
        $expenses = $car->carExpenses()->latest()->get();

        return Inertia::render('CarExpenses/Index', [
            'car' => $car,
            'expenses' => Inertia::defer(fn () => $expenses),
        ]);
    }

    public function create(Car $car): Response
    {
        return Inertia::render('CarExpenses/Create', [
            'car' => $car,
        ]);
    }

    public function store(Request $request, Car $car): RedirectResponse
    {
        $data = $request->validate([
            'expense_type' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'vendor' => 'nullable|string',
            'invoice_date' => 'nullable|date',
        ]);
        $car->carExpenses()->create($data);

        return redirect()->route('cars.show', $car);
    }

    public function edit(Car $car, CarExpense $expense): Response
    {
        return Inertia::render('CarExpenses/Edit', [
            'car' => $car,
            'expense' => $expense,
        ]);
    }

    public function update(Request $request, Car $car, CarExpense $expense): RedirectResponse
    {
        $data = $request->validate([
            'expense_type' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'vendor' => 'nullable|string',
            'invoice_date' => 'nullable|date',
        ]);
        $expense->update($data);

        return redirect()->route('cars.show', $car);
    }

    public function destroy(Car $car, CarExpense $expense): RedirectResponse
    {
        $expense->delete();

        return redirect()->route('cars.show', $car);
    }
}
