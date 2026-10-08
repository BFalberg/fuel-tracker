import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavGroup = {
    title: string;
    items: NavItem[];
};

export type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
};
