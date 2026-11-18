import { cn } from '@/lib/utils';

export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img
            src="/icons/app-icon-192x192.png"
            alt=""
            className={cn('rounded-[22%]', className)}
        />
    );
}
