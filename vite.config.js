import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['/icons/favicon.ico', '/icons/app-icon.png'],
            manifest: {
                name: 'Fuel Tracker',
                short_name: 'Fuel Tracker',
                description: 'Track refuels, expenses, and costs for your cars.',
                theme_color: '#0F172A',
                background_color: '#0F172A',
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
    esbuild: {
        jsx: 'automatic',
    },
});
