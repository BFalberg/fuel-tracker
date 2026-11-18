<?php

declare(strict_types=1);

use App\Actions\UpdateCar;
use App\Models\Car;

it('may update a car', function (): void {
    $car = Car::factory()->create(['name' => 'Old', 'sale_price' => 100]);

    $updated = resolve(UpdateCar::class)->handle($car, ['name' => 'New']);

    expect($updated->refresh()->name)->toBe('New')
        ->and($updated->sale_price)->toBe('100.00');
});

it('archives a car and keeps the original archive date on later saves', function (): void {
    $car = Car::factory()->create();

    $this->travelTo(now()->subWeek());
    resolve(UpdateCar::class)->handle($car, ['is_archived' => true]);
    $archivedAt = $car->refresh()->archived_at;
    $this->travelBack();

    resolve(UpdateCar::class)->handle($car, ['name' => 'Renamed', 'is_archived' => true]);

    expect($archivedAt)->not->toBeNull()
        ->and($car->refresh()->archived_at?->equalTo($archivedAt))->toBeTrue();
});

it('restores an archived car', function (): void {
    $car = Car::factory()->archived()->create();

    resolve(UpdateCar::class)->handle($car, ['is_archived' => false]);

    expect($car->refresh()->isArchived())->toBeFalse();
});
