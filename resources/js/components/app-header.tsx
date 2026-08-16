import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Car, ChartNoAxesColumnDecreasing, Fuel, MapPin, Plus } from 'lucide-react';
import AppLogo from './app-logo';

const getCreateUrl = (currentUrl: string) => {
    if (currentUrl.startsWith('/cars')) return '/cars/create';
    if (currentUrl.startsWith('/refuels')) return '/refuels/create';
    if (currentUrl.startsWith('/gas-stations')) return '/gas-stations/create';
    return '/refuels/create';
};

/**
 * Matches a nav item against the current location by path prefix, so detail,
 * create and edit routes keep their section highlighted. The query string is
 * dropped first — `/dashboard?car=2` is still the dashboard.
 */
const isNavItemActive = (currentUrl: string, itemUrl: string) => {
    const path = currentUrl.split('?')[0];

    return path === itemUrl || path.startsWith(`${itemUrl}/`);
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: ChartNoAxesColumnDecreasing,
    },
    {
        title: 'Cars',
        url: '/cars',
        icon: Car,
    },
    {
        title: 'Gas Stations',
        url: '/gas-stations',
        icon: MapPin,
    },
    {
        title: 'Refuels',
        url: '/refuels',
        icon: Fuel,
    },
];

const activeItemStyles = 'bg-accent-foreground text-accent';
const menuItemStyles =
    'flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[0.7rem] rounded-md text-center text-accent-foreground';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="w-full px-4">
                <div className="border-accent flex h-16 items-center border-b">
                    <Link href="/dashboard" prefetch className="text-primary-foreground flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    <div className="ml-auto flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full p-1">
                                    <Avatar className="size-9 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-accent text-accent-foreground rounded-lg">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="flex h-12 w-full items-center justify-start px-4 text-neutral-500">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}

            <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {/* Create Button */}
                <Button variant="default" size="icon-lg" className="self-end rounded-full shadow-lg" asChild>
                    <Link href={getCreateUrl(page.url)} aria-label="Create">
                        <Plus className="size-6" />
                    </Link>
                </Button>
                {/* Navigation */}
                <NavigationMenu
                    id="app-navbar"
                    className="bg-accent/95 flex w-full max-w-full items-center justify-center rounded-xl px-1 py-1 shadow-lg backdrop-blur-md"
                >
                    <NavigationMenuList className="grid w-full grid-cols-4 items-center justify-center">
                        {mainNavItems.map((item, index) => (
                            <NavigationMenuItem key={index}>
                                <Link href={item.url} className={cn(menuItemStyles, isNavItemActive(page.url, item.url) && activeItemStyles)}>
                                    {item.icon && <Icon iconNode={item.icon} className="size-5" />}
                                    {item.title}
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </>
    );
}
