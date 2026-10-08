import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    lint: {
        options: {
            typeAware: true,
            typeCheck: true,
        },
        plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'react'],
        ignorePatterns: ['vite.config.ts', 'tmp/**'],
    },
    fmt: {
        printWidth: 80,
        tabWidth: 4,
        useTabs: false,
        semi: true,
        singleQuote: true,
        overrides: [
            {
                files: ['**/*.yml'],
                options: {
                    tabWidth: 2,
                },
            },
        ],
        sortTailwindcss: {
            functions: ['clsx', 'cn'],
            stylesheet: 'resources/css/app.css',
        },
        sortImports: {
            groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index',
            ],
            newlinesBetween: false,
        },
        ignorePatterns: [
            'resources/js/components/ui/*',
            'resources/views/mail/*',
            'resources/js/actions/*',
            'resources/js/routes/*',
            'resources/js/wayfinder/*',
            'tmp/**',
        ],
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['/icons/favicon.ico', '/icons/app-icon.png'],
            manifest: {
                name: 'Fuel Tracker',
                short_name: 'Fuel Tracker',
                description: 'Track refuels, expenses, and costs for your cars.',
                theme_color: '#01140F',
                background_color: '#01140F',
                display: 'standalone',
                start_url: '/dashboard',
                scope: '/',
                icons: [
                    {
                        src: '/icons/app-icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/app-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/app-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request, url }) => request.headers.get('X-Inertia') === 'true' || url.searchParams.has('_inertia'),
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'inertia-pages',
                            networkTimeoutSeconds: 2,
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 5,
                            },
                        },
                    },
                    {
                        urlPattern: ({ request }) => request.destination === 'document',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'pages',
                            networkTimeoutSeconds: 2,
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 5,
                            },
                        },
                    },
                    {
                        urlPattern: ({ request }) => ['script', 'style', 'font'].includes(request.destination),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'assets',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 7,
                            },
                        },
                    },
                    {
                        urlPattern: ({ request }) => request.destination === 'image',
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'images',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30,
                            },
                        },
                    },
                ],
            },
        }),
    ],
});
