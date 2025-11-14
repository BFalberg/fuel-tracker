<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

use Inertia\Inertia;

class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Cars/Index', [
            'cars' => Car::latest()->with('user:id,name')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Cars/CarCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars',
        ]);

        // Create the car and associate it with the authenticated user
        $car = auth()->user()->cars()->create($validated);

        return redirect()->route('cars.index')->with('success', 'Car created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Car $car)
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
    public function edit(Car $car)
    {
        return Inertia::render('Cars/CarEdit', [
            'car' => $car
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Car $car)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars,registration_number,' . $car->id,
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
