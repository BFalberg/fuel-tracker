<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserPasswordConfirmationRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final readonly class UserPasswordConfirmationController
{
    public function create(): Response
    {
        return Inertia::render('user-password-confirmation/create');
    }

    public function store(CreateUserPasswordConfirmationRequest $request, #[CurrentUser] User $user): RedirectResponse
    {
        throw_unless(Auth::guard('web')->validate([
            'email' => $user->email,
            'password' => $request->string('password')->value(),
        ]), ValidationException::withMessages([
            'password' => __('auth.password'),
        ]));

        $request->session()->passwordConfirmed();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
