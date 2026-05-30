<?php

namespace App\Http\Controllers;

use App\Actions\Cars\CreateCar;
use App\Actions\Cars\DeleteCar;
use App\Actions\Cars\ListCars;
use App\Actions\Cars\ShowCar;
use App\Actions\Cars\UpdateCar;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ListCars $listCars): Response
    {
        return Inertia::render('Cars/Index', [
            'cars' => Inertia::defer(fn () => $listCars->handle()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Cars/CarCreate');
    }

    public function store(Request $request, CreateCar $createCar)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars',
            'is_electric' => 'required|boolean',
            'start_milage' => 'nullable|integer|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
        ]);

        $createCar->handle(auth()->user(), $validated);

        return redirect()->route('cars.index')->with('success', 'Car created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Car $car, ShowCar $showCar): Response
    {
        $data = $showCar->handle($car);

        return Inertia::render('Cars/Show', [
            'car' => $data['car'],
            'expenses' => Inertia::defer($data['expenses']),
            'refuels' => Inertia::defer($data['refuels']),
            'start_milage' => $data['start_milage'],
            'user' => $data['user'],
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
    public function update(Request $request, Car $car, UpdateCar $updateCar)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:cars,registration_number,'.$car->id,
            'is_electric' => 'required|boolean',
            'start_milage' => 'nullable|integer|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
        ]);

        $updateCar->handle($car, $validated);

        return redirect()->route('cars.index')->with('success', 'Car updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Car $car, DeleteCar $deleteCar)
    {
        $deleteCar->handle($car);

        return redirect()->back()->with('success', 'Car deleted successfully');
    }
}
