<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $quote = Inspiring::quotes()->random();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => $this->splitQuote(is_string($quote) ? $quote : ''),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
        ];
    }

    /**
     * Split an "Inspiring" quote into its message and author. The author is
     * the text after the last " - ", so a hyphenated name stays whole.
     *
     * @return array{message: string, author: string}
     */
    public function splitQuote(string $quote): array
    {
        if (! str_contains($quote, ' - ')) {
            return ['message' => mb_trim($quote), 'author' => ''];
        }

        return [
            'message' => mb_trim(Str::beforeLast($quote, ' - ')),
            'author' => mb_trim(Str::afterLast($quote, ' - ')),
        ];
    }
}
