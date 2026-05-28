<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company,
            'registration_number' => strtoupper(fake()->bothify('??###')),
            'start_milage' => fake()->numberBetween(0, 250000),
            'purchase_price' => fake()->numberBetween(50000, 600000),
            'sale_price' => null,
            'is_electric' => false,
        ];
    }
}
