<?php

declare(strict_types=1);

namespace App\Rules;

use App\Actions\Refuel\GetMileageBounds;
use App\Models\Car;
use App\Models\Refuel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final readonly class MileageFitsCarSeries implements ValidationRule
{
    private function __construct(
        private int $carId,
        private ?Refuel $refuel,
        private GetMileageBounds $getMileageBounds,
    ) {}

    /**
     * A new reading always appends to the end of the car's odometer series.
     */
    public static function whenCreating(Car $car): self
    {
        return new self($car->id, null, resolve(GetMileageBounds::class));
    }

    /**
     * An edited reading stays in the slot it already occupies, bounded by its
     * neighbours rather than by the car's highest mileage. Bounding by the
     * highest mileage is correct for creation but makes every refuel except
     * the newest one impossible to edit at all.
     */
    public static function whenUpdating(Refuel $refuel): self
    {
        return new self($refuel->car_id, $refuel, resolve(GetMileageBounds::class));
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $value = is_scalar($value) ? (int) $value : 0;

        if (! $this->refuel instanceof Refuel) {
            $this->validateNewReading($value, $fail);

            return;
        }

        $this->validateEditedReading($this->refuel, $value, $fail);
    }

    private function validateNewReading(int $value, Closure $fail): void
    {
        $highest = Refuel::query()->where('car_id', $this->carId)->max('mileage');

        if (! is_numeric($highest)) {
            return;
        }

        $highest = (int) $highest;

        if ($value <= $highest) {
            $fail("The mileage must be greater than the last refuel's mileage ({$highest}).");
        }
    }

    /**
     * An unchanged reading always passes, so the remaining fields of a refuel
     * stay editable even when the stored series is inconsistent — for example
     * rows written by seeders or an import that bypassed validation.
     *
     * Because creation demands a strictly increasing reading, a typo that
     * survives is always too high, and therefore correctable by editing the
     * affected rows oldest-first. A row whose true value sits below its lower
     * neighbour can only come from data that bypassed validation, and is fixed
     * by deleting the rows above it.
     */
    private function validateEditedReading(Refuel $refuel, int $value, Closure $fail): void
    {
        if ($value === $refuel->mileage) {
            return;
        }

        ['min' => $previous, 'max' => $next] = $this->getMileageBounds->handle($refuel);

        if ($previous !== null && $value <= $previous) {
            $fail("The mileage must be greater than the previous refuel's mileage ({$previous}).");

            return;
        }

        if ($next !== null && $value >= $next) {
            $fail("The mileage must be lower than the next refuel's mileage ({$next}).");
        }
    }
}
