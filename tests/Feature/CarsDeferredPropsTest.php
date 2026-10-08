<?php

declare(strict_types=1);

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('cars index defers cars list', function (): void {
    $user = User::factory()->create();
    Car::factory()->ownedBy($user)->count(2)->create();

    $response = $this->actingAs($user)->get('/cars');

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
        ->component('Cars/Index')
        ->missing('cars')
        ->loadDeferredProps(fn (AssertableInertia $reload): AssertableInertia => $reload
            ->has('cars', 2)
        )
    );
});
