<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\Refuel;

arch()->preset()->php();

/*
 * Car and Refuel have Laravel `#[Scope]` methods. Laravel resolves those scopes
 * through __call, so the methods must stay protected. The rules that the ignore
 * skips are checked again for both models in the next test.
 */
arch()->preset()->strict()->ignoring([Car::class, Refuel::class]);

arch('models with scopes follow the strict rules apart from their scopes')
    ->expect([Car::class, Refuel::class])
    ->toBeFinal()
    ->toUseStrictTypes()
    ->toUseStrictEquality()
    ->not->toBeAbstract();

arch()->preset()->laravel();
arch()->preset()->security()->ignoring([
    'assert',
]);

arch('controllers')
    ->expect('App\Http\Controllers')
    ->not->toBeUsed();

arch('actions')
    ->expect('App\Actions')
    ->toHaveMethod('handle');
