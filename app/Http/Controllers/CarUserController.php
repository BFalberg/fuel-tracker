<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class CarUserController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Car $car): RedirectResponse
    {
        $this->authorize('manageUsers', $car);

        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::query()->where('email', $request->string('email')->value())->first();

        /** One message for both cases, so this cannot be used to probe which emails are registered. */
        if (! $user || $car->users()->where('users.id', $user->id)->exists()) {
            return back()->withErrors(['email' => 'That email address could not be added as a co-driver.']);
        }

        $car->users()->attach($user->id, ['role' => 'co_driver']);

        return back()->with('success', 'Co-driver added successfully.');
    }

    public function destroy(Car $car, User $user, #[CurrentUser] User $currentUser): RedirectResponse
    {
        $this->authorize('manageUsers', $car);

        if ($user->is($currentUser)) {
            return back()->withErrors(['user' => 'You cannot remove yourself from the car.']);
        }

        $car->users()->detach($user->id);

        return back()->with('success', 'Co-driver removed successfully.');
    }
}
