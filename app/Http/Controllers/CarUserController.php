<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateCarUser;
use App\Actions\DeleteCarUser;
use App\Http\Requests\CreateCarUserRequest;
use App\Models\Car;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;

final readonly class CarUserController
{
    public function store(CreateCarUserRequest $request, Car $car, CreateCarUser $action): RedirectResponse
    {
        $user = User::query()->where('email', $request->string('email')->value())->first();

        /** One message for both cases, so this cannot be used to probe which emails are registered. */
        if (! $user || $car->users()->where('users.id', $user->id)->exists()) {
            return back()->withErrors(['email' => 'That email address could not be added as a co-driver.']);
        }

        $action->handle($car, $user);

        return back()->with('success', 'Co-driver added successfully.');
    }

    public function destroy(Car $car, User $user, #[CurrentUser] User $currentUser, DeleteCarUser $action): RedirectResponse
    {
        if ($user->is($currentUser)) {
            return back()->withErrors(['user' => 'You cannot remove yourself from the car.']);
        }

        $action->handle($car, $user);

        return back()->with('success', 'Co-driver removed successfully.');
    }
}
