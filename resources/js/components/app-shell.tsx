interface AppShellProps {
    children: React.ReactNode;
}

/**
 * The bottom padding clears the fixed nav bar and FAB rendered by `AppHeader`,
 * plus the device home indicator. Keep it in sync with that component's height:
 * 8px top pad + 56px FAB + 12px gap + 64px nav bar + 16px bottom pad.
 */
export function AppShell({ children }: AppShellProps) {
    return <div className="flex min-h-screen w-full flex-col gap-4 pb-[calc(10.5rem+env(safe-area-inset-bottom))]">{children}</div>;
}
