import * as React from 'react';

export function AppContent({ children, ...props }: React.ComponentProps<'div'>) {
    return (
        <main className="flex h-full w-full flex-1 flex-col gap-4 px-4" {...props}>
            {children}
        </main>
    );
}
