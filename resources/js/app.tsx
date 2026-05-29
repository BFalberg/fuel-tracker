import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';
import PwaUpdateToast from '@/components/pwa-update-toast';
import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        function Root() {
            const [updateAvailable, setUpdateAvailable] = useState(false);
            const [updateServiceWorker, setUpdateServiceWorker] = useState<(() => void) | null>(null);

            useEffect(() => {
                const updateSw = registerSW({
                    onNeedRefresh() {
                        setUpdateAvailable(true);
                    },
                });

                setUpdateServiceWorker(() => () => updateSw(true));
            }, []);

            const handleReload = () => {
                if (!updateServiceWorker) {
                    window.location.reload();
                    return;
                }

                updateServiceWorker();
            };

            return (
                <>
                    <App {...props} />
                    <PwaUpdateToast
                        open={updateAvailable}
                        onDismiss={() => setUpdateAvailable(false)}
                        onReload={handleReload}
                    />
                </>
            );
        }

        root.render(<Root />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
