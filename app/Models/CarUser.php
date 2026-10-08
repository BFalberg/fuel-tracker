<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use LogicException;

/**
 * The membership of a user on a car, as either owner or co-driver.
 *
 * @property-read int $id
 * @property-read int $car_id
 * @property-read int $user_id
 * @property-read 'owner'|'co_driver' $role
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class CarUser extends Pivot
{
    /**
     * The car_user table has an auto-incrementing primary key.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The membership that a car/user many-to-many query put on the given model.
     */
    public static function of(Model $model): self
    {
        $membership = $model->relationLoaded('pivot') ? $model->getRelation('pivot') : null;

        throw_unless($membership instanceof self, LogicException::class, 'The model was not loaded through the car_user relation.');

        return $membership;
    }
}
