<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\CarExpense;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarExpense>
 */
class CarExpenseFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'car_id' => Car::factory(),
            'expense_type' => 'Værksted',
            'amount' => fake()->randomFloat(2, 100, 5000),
            'description' => fake()->sentence(),
            'vendor' => fake()->company(),
            'invoice_date' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
        ];
    }

    public function forCar(Car $car): static
    {
        return $this->state(['car_id' => $car->id]);
    }

    public function subscription(): static
    {
        return $this->state(['expense_type' => 'Abonnement']);
    }
}
