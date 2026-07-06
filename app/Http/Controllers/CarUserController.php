<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CarUserController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Car $car): RedirectResponse
    {
        $this->authorize('manageUsers', $car);

        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return back()->withErrors(['email' => 'No user found with this email address.']);
        }

        if ($car->users()->where('users.id', $user->id)->exists()) {
            return back()->withErrors(['email' => 'This user already has access to this car.']);
        }

        $car->users()->attach($user->id, ['role' => 'co_driver']);

        return back()->with('success', 'Co-driver added successfully.');
    }

    public function destroy(Car $car, User $user): RedirectResponse
    {
        $this->authorize('manageUsers', $car);

        if ($user->id === auth()->id()) {
            return back()->withErrors(['user' => 'You cannot remove yourself from the car.']);
        }

        $car->users()->detach($user->id);

        return back()->with('success', 'Co-driver removed successfully.');
    }
}
