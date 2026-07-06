<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Car>
 */
class CarFactory extends Factory
{
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

    public function ownedBy(User $user): static
    {
        return $this->afterCreating(function (Car $car) use ($user) {
            $car->users()->attach($user->id, ['role' => 'owner']);
        });
    }

    public function electric(): static
    {
        return $this->state(['is_electric' => true]);
    }
}
