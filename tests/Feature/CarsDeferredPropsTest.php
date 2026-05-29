<?php

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('cars index defers cars list', function () {
    $user = User::factory()->create();
    Car::factory()->for($user)->count(2)->create();

    $response = $this->actingAs($user)->get('/cars');

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Cars/Index')
        ->missing('cars')
        ->loadDeferredProps(fn (AssertableInertia $reload) => $reload
            ->has('cars', 2)
        )
    );
});
