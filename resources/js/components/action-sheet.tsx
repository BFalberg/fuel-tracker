import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { MoreVertical, type LucideIcon } from 'lucide-react';
import { useRef, useState } from 'react';

export interface ActionSheetItem {
    label: string;
    icon: LucideIcon;
    /** Navigates via Inertia. Mutually exclusive with `onSelect`. */
    href?: string;
    onSelect?: () => void;
    disabled?: boolean;
    destructive?: boolean;
    /** Shown under the label, e.g. why the action is unavailable. */
    hint?: string;
}

interface ActionSheetProps {
    /** Announced as the sheet's accessible name. */
    title: string;
    items: ActionSheetItem[];
    triggerLabel?: string;
}

const rowStyles = 'flex min-h-14 w-full items-center gap-3 rounded-lg px-4 text-left text-base transition-colors active:bg-accent/10';

/**
 * Replaces the dropdown menu on list cards with a bottom sheet. A dropdown
 * anchored to a small trigger puts ~32px rows near the screen edge, which is
 * the hardest thing in the app to hit with a thumb; a sheet gives every action
 * a full-width 56px row within reach.
 */
export default function ActionSheet({ title, items, triggerLabel = 'Actions' }: ActionSheetProps) {
    const [open, setOpen] = useState(false);
    // Deferred so the sheet finishes closing before an action opens a dialog —
    // otherwise the two overlays fight over focus and body scroll locking.
    const pendingAction = useRef<(() => void) | null>(null);

    const handleAnimationEnd = (isOpen: boolean) => {
        if (isOpen) {
            return;
        }

        const action = pendingAction.current;
        pendingAction.current = null;
        action?.();
    };

    return (
        <Drawer open={open} onOpenChange={setOpen} onAnimationEnd={handleAnimationEnd}>
            <Button variant="outline" size="icon" aria-label={triggerLabel} onClick={() => setOpen(true)}>
                <MoreVertical className="size-4" />
            </Button>
            <DrawerContent>
                <DrawerHeader className="pb-2">
                    <DrawerTitle className="text-muted-foreground text-sm font-normal">{title}</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-1 px-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const content = (
                            <>
                                <Icon className="size-5 shrink-0" />
                                <span className="flex flex-col">
                                    {item.label}
                                    {item.hint && <span className="text-muted-foreground text-xs">{item.hint}</span>}
                                </span>
                            </>
                        );

                        const className = cn(rowStyles, item.destructive && 'text-destructive-foreground', item.disabled && 'opacity-50');

                        if (item.href && !item.disabled) {
                            return (
                                <Link key={item.label} href={item.href} className={className} onClick={() => setOpen(false)}>
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <button
                                key={item.label}
                                type="button"
                                disabled={item.disabled}
                                className={cn(className, 'disabled:pointer-events-none')}
                                onClick={() => {
                                    pendingAction.current = item.onSelect ?? null;
                                    setOpen(false);
                                }}
                            >
                                {content}
                            </button>
                        );
                    })}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
