import { Button } from '@/components/ui/button';

interface PwaUpdateToastProps {
    open: boolean;
    onDismiss: () => void;
    onReload: () => void;
}

export default function PwaUpdateToast({
    open,
    onDismiss,
    onReload,
}: PwaUpdateToastProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed right-4 bottom-4 z-50 w-[min(24rem,calc(100%-2rem))]">
            <div className="space-y-3 rounded-xl border border-border/60 bg-background/95 p-4 text-foreground shadow-lg backdrop-blur animate-in slide-in-from-bottom-3">
                <div className="text-sm font-semibold">Update available</div>
                <p className="text-sm text-muted-foreground">
                    A new version of the app is ready. Reload to update.
                </p>
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={onDismiss}>
                        Later
                    </Button>
                    <Button size="sm" onClick={onReload}>
                        Reload
                    </Button>
                </div>
            </div>
        </div>
    );
}
