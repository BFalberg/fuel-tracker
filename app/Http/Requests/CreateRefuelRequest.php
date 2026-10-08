<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Car;
use App\Models\GasStation;
use App\Models\User;
use App\Rules\MileageFitsCarSeries;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CreateRefuelRequest extends FormRequest
{
    /**
     * The car is only known from the payload, so the policy check runs here
     * and not in a route middleware.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        assert($user instanceof User);

        return $user->can('view', $this->car());
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'car_id' => ['required', Rule::exists(Car::class, 'id')],
            'gas_station_id' => ['nullable', Rule::exists(GasStation::class, 'id')],
            'new_gas_station_name' => ['nullable', 'string', 'max:255'],
            'new_gas_station_address' => ['nullable', 'string', 'max:255'],
            'liters_refueled' => ['required', 'numeric', 'gt:0'],
            'total_price' => ['required', 'numeric', 'min:0'],
            'mileage' => ['required', 'integer', 'min:0', MileageFitsCarSeries::whenCreating($this->car())],
        ];
    }

    public function car(): Car
    {
        return Car::query()->findOrFail($this->integer('car_id'));
    }
}
