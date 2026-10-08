import { Link, usePage } from '@inertiajs/react';
import {
    Car,
    ChartNoAxesColumnDecreasing,
    Fuel,
    MapPin,
    Plus,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as carsIndex, create as createCar } from '@/routes/cars';
import {
    create as createGasStation,
    index as gasStationsIndex,
} from '@/routes/gas-stations';
import {
    create as createRefuel,
    index as refuelsIndex,
} from '@/routes/refuels';
import { type BreadcrumbItem, type NavItem } from '@/types';
import AppLogo from './app-logo';

const getCreateUrl = (currentUrl: string) => {
    if (isNavItemActive(currentUrl, carsIndex.url())) return createCar.url();
    if (isNavItemActive(currentUrl, refuelsIndex.url()))
        return createRefuel.url();
    if (isNavItemActive(currentUrl, gasStationsIndex.url()))
        return createGasStation.url();
    return createRefuel.url();
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
        url: dashboard.url(),
        icon: ChartNoAxesColumnDecreasing,
    },
    {
        title: 'Cars',
        url: carsIndex.url(),
        icon: Car,
    },
    {
        title: 'Gas Stations',
        url: gasStationsIndex.url(),
        icon: MapPin,
    },
    {
        title: 'Refuels',
        url: refuelsIndex.url(),
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
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="w-full px-4">
                <div className="flex h-16 items-center border-b border-accent">
                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center space-x-2 text-primary-foreground"
                    >
                        <AppLogo />
                    </Link>

                    <div className="ml-auto flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full p-1"
                                >
                                    <Avatar className="size-9 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-accent text-accent-foreground">
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
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="flex h-12 w-full items-center justify-start px-4 text-neutral-500">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}

            <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {/* Create Button */}
                <Button
                    variant="default"
                    size="icon-lg"
                    className="self-end rounded-full shadow-lg"
                    asChild
                >
                    <Link href={getCreateUrl(page.url)} aria-label="Create">
                        <Plus className="size-6" />
                    </Link>
                </Button>
                {/* Navigation */}
                <NavigationMenu
                    id="app-navbar"
                    className="flex w-full max-w-full items-center justify-center rounded-xl bg-accent/95 px-1 py-1 shadow-lg backdrop-blur-md"
                >
                    <NavigationMenuList className="grid w-full grid-cols-4 items-center justify-center">
                        {mainNavItems.map((item, index) => (
                            <NavigationMenuItem key={index}>
                                <Link
                                    href={item.url}
                                    className={cn(
                                        menuItemStyles,
                                        isNavItemActive(page.url, item.url) &&
                                            activeItemStyles,
                                    )}
                                >
                                    {item.icon && (
                                        <Icon
                                            iconNode={item.icon}
                                            className="size-5"
                                        />
                                    )}
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
