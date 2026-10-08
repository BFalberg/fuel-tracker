import type { Auth } from '@/types/auth';
import type { Flash, Quote } from '@/types/ui';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            quote: Quote;
            auth: Auth;
            flash: Flash;
            [key: string]: unknown;
        };
    }
}
