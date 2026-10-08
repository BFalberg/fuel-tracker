<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        <link rel="icon" href="{{ asset('icons/favicon.ico') }}" />
        <link rel="icon" href="{{ asset('icons/app-icon.png') }}" sizes="1024x1024" />

        <link rel="manifest" href="/build/manifest.webmanifest" />
        <meta name="theme-color" content="#01140F" />

        @fonts

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
