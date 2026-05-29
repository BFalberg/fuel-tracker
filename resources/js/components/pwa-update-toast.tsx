import { Button } from '@/components/ui/button';

interface PwaUpdateToastProps {
    open: boolean;
    onDismiss: () => void;
    onReload: () => void;
}

export default function PwaUpdateToast({ open, onDismiss, onReload }: PwaUpdateToastProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100%-2rem))]">
            <div className="bg-background/95 text-foreground border-border/60 animate-in slide-in-from-bottom-3 space-y-3 rounded-xl border p-4 shadow-lg backdrop-blur">
                <div className="text-sm font-semibold">Update available</div>
                <p className="text-muted-foreground text-sm">A new version of the app is ready. Reload to update.</p>
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
