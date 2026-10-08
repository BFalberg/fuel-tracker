<?php

declare(strict_types=1);

use App\Models\Refuel;

arch()->preset()->php();

/*
 * Refuel::accessibleBy() is a Laravel `#[Scope]` method. Laravel resolves those
 * scopes through __call, so the method must stay protected. The rules that the
 * ignore skips are checked again for Refuel in the next test.
 */
arch()->preset()->strict()->ignoring(Refuel::class);

arch('refuel model follows the strict rules apart from its scope')
    ->expect(Refuel::class)
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
