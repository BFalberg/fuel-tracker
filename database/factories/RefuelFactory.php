<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\Refuel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Refuel>
 */
class RefuelFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'car_id' => Car::factory(),
            'gas_station_id' => GasStation::factory(),
            'liters_refueled' => fake()->randomFloat(2, 10, 60),
            'total_price' => fake()->randomFloat(2, 200, 900),
            'mileage' => fake()->numberBetween(1000, 250000),
            'type' => 'fossil',
        ];
    }

    public function forCar(Car $car): static
    {
        return $this->state([
            'car_id' => $car->id,
            'type' => $car->is_electric ? 'charge' : 'fossil',
        ]);
    }

    public function atStation(GasStation $station): static
    {
        return $this->state(['gas_station_id' => $station->id]);
    }

    public function withoutStation(): static
    {
        return $this->state(['gas_station_id' => null]);
    }
}
