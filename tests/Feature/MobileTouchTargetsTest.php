<?php

/**
 * Guards the mobile sizing decisions baked into the shadcn primitives.
 *
 * The app is used almost exclusively on a phone, so `Button`, `Input` and
 * `NativeSelect` were raised from the vendored 36px (`h-9`) defaults to the 44px
 * iOS/Android minimum touch target, and every text control kept at 16px so iOS
 * Safari does not zoom the viewport on focus. Re-running `npx shadcn add` would
 * silently restore the vendored values, which is invisible in a code review and
 * only shows up as a hard-to-tap UI on a device — hence these assertions.
 */
function uiComponent(string $name): string
{
    $path = resource_path("js/components/ui/{$name}.tsx");

    expect(file_exists($path))->toBeTrue("UI component [{$name}.tsx] is missing.");

    return file_get_contents($path);
}

test('button sizes meet the minimum touch target', function () {
    $button = uiComponent('button');

    expect($button)
        ->toContain('default: "h-11')
        ->toContain('lg: "h-12')
        ->toContain('icon: "size-11"')
        ->toContain('"icon-lg": "size-14"');
});

test('text inputs are touch sized and do not trigger ios zoom', function (string $component) {
    $source = uiComponent($component);

    expect($source)->toContain('h-11');
    expect($source)->toContain('text-base');
    expect($source)->not->toContain('md:text-sm');
})->with([
    'input',
    'native-select',
]);

test('the layout reserves space for the fixed bottom nav and the device safe area', function () {
    $shell = file_get_contents(resource_path('js/components/app-shell.tsx'));
    $header = file_get_contents(resource_path('js/components/app-header.tsx'));

    expect($shell)->toContain('env(safe-area-inset-bottom)');
    expect($header)->toContain('env(safe-area-inset-bottom)');
});

test('the viewport opts into the display cutout so safe area insets resolve', function () {
    $blade = file_get_contents(resource_path('views/app.blade.php'));

    expect($blade)->toContain('viewport-fit=cover');
});
