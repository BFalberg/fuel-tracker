<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\GasStation;
use App\Models\Refuel;
use App\Rules\MileageFitsCarSeries;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateRefuelRequest extends FormRequest
{
    /**
     * `car_id` is deliberately absent: a refuel cannot be moved between cars,
     * because mileage is a per-car monotonic series and re-parenting would
     * retroactively corrupt the consumption history of both cars.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $refuel = $this->route('refuel');
        assert($refuel instanceof Refuel);

        return [
            'gas_station_id' => ['nullable', Rule::exists(GasStation::class, 'id')],
            'new_gas_station_name' => ['nullable', 'string', 'max:255'],
            'new_gas_station_address' => ['nullable', 'string', 'max:255'],
            'liters_refueled' => ['required', 'numeric', 'gt:0'],
            'total_price' => ['required', 'numeric', 'min:0'],
            'mileage' => ['required', 'integer', 'min:0', MileageFitsCarSeries::whenUpdating($refuel)],
        ];
    }
}
