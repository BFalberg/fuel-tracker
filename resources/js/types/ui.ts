import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type Quote = {
    message: string;
    author: string;
};

export type Flash = {
    success?: string | null;
};
