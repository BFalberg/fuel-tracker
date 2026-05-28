<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Cars/Index', [
            'cars' => Car::latest()
                ->with('user:id,name')
                ->get(['id', 'name', 'registration_number', 'is_electric', 'user_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Cars/CarCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars',
            'is_electric' => 'required|boolean',
        ]);

        // Create the car and associate it with the authenticated user
        $car = auth()->user()->cars()->create($validated);

        return redirect()->route('cars.index')->with('success', 'Car created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Car $car): Response
    {
        $car->load('carExpenses', 'user:id,name', 'refuels');

        return Inertia::render('Cars/Show', [
            'car' => $car,
            'expenses' => $car->carExpenses->sortByDesc('invoice_date')->values(),
            'refuels' => $car->refuels,
            'start_milage' => $car->start_milage,
            'user' => $car->user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Car $car): Response
    {
        return Inertia::render('Cars/CarEdit', [
            'car' => $car,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Car $car)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars,registration_number,'.$car->id,
            'is_electric' => 'required|boolean',
        ]);

        $car->update($validated);

        return redirect()->route('cars.index')->with('success', 'Car updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Car $car)
    {
        $car->delete();

        return redirect()->back()->with('success', 'Car deleted successfully');
    }
}
