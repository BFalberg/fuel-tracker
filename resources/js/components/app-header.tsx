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
        title: 'Refuels',
        url: '/refuels',
        icon: Fuel,
    },
    {
        title: 'Gas Stations',
        url: '/gas-stations',
        icon: MapPin,
    },
];

const activeItemStyles = 'bg-accent-foreground text-accent';
const menuItemStyles = 'flex flex-col items-center justify-center gap-1 p-1 text-[.5rem] rounded-xl text-center text-accent-foreground';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="mx-auto w-full max-w-11/12">
                <div className="border-accent mx-auto flex h-16 items-center border-b">
                    <Link href="/dashboard" prefetch className="text-primary-foreground flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    <div className="ml-auto flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
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
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
            {/* Navigation */}
            <NavigationMenu
                id="app-navbar"
                className="bg-accent fixed bottom-0 left-1/2 z-50 flex w-full max-w-11/12 -translate-1/2 items-center justify-center rounded-full px-4 py-2"
            >
                <NavigationMenuList className="grid w-full grid-cols-5 items-center justify-center">
                    {mainNavItems.map((item, index) => (
                        <NavigationMenuItem key={index} className="">
                            <Link href={item.url} className={cn(menuItemStyles, page.url === item.url && activeItemStyles)}>
                                {item.icon && <Icon iconNode={item.icon} className="size-4" />}
                                {item.title}
                            </Link>
                        </NavigationMenuItem>
                    ))}
                    <NavigationMenuItem key="" className="">
                        <Link href="" className={menuItemStyles}>
                            <Icon iconNode={Plus} className="size-4" />
                            Create
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}
