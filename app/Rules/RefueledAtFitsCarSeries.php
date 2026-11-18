<?php

declare(strict_types=1);

namespace App\Rules;

use App\Actions\GetRefueledAtBounds;
use App\Models\Car;
use App\Models\Refuel;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final readonly class RefueledAtFitsCarSeries implements ValidationRule
{
    private function __construct(
        private int $carId,
        private ?Refuel $refuel,
        private GetRefueledAtBounds $getRefueledAtBounds,
    ) {}

    /**
     * A new refuel always appends to the end of the car's odometer series, so
     * it cannot be dated before the refuel with the highest mileage.
     */
    public static function whenCreating(Car $car): self
    {
        return new self($car->id, null, resolve(GetRefueledAtBounds::class));
    }

    /**
     * An edited refuel keeps its slot in the odometer series, so its date
     * stays between the dates of its neighbours by mileage.
     */
    public static function whenUpdating(Refuel $refuel): self
    {
        return new self($refuel->car_id, $refuel, resolve(GetRefueledAtBounds::class));
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || strtotime($value) === false) {
            return;
        }

        $date = CarbonImmutable::parse($value);

        if (! $this->refuel instanceof Refuel) {
            $this->validateNewDate($date, $fail);

            return;
        }

        $this->validateEditedDate($this->refuel, $date, $fail);
    }

    private function validateNewDate(CarbonImmutable $date, Closure $fail): void
    {
        $latest = Refuel::query()->where('car_id', $this->carId)
            ->orderByDesc('mileage')
            ->first(['refueled_at'])
            ?->refueled_at;

        if ($latest !== null && $date->lt($latest)) {
            $fail("The refuel date must not be before the last refuel's date ({$this->format($latest)}).");
        }
    }

    /**
     * An unchanged date always passes, so the remaining fields stay editable
     * even when the stored series is out of order.
     */
    private function validateEditedDate(Refuel $refuel, CarbonImmutable $date, Closure $fail): void
    {
        if ($date->equalTo($refuel->refueled_at)) {
            return;
        }

        ['min' => $previous, 'max' => $next] = $this->getRefueledAtBounds->handle($refuel);

        if ($previous !== null && $date->lt($previous)) {
            $fail("The refuel date must not be before the previous refuel's date ({$this->format($previous)}).");

            return;
        }

        if ($next !== null && $date->gt($next)) {
            $fail("The refuel date must not be after the next refuel's date ({$this->format($next)}).");
        }
    }

    private function format(CarbonInterface $date): string
    {
        return $date->format('Y-m-d H:i T');
    }
}
