import { Link, usePage } from '@inertiajs/react';
import { ChefHat, Menu, Settings, Users } from 'lucide-react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { KitchenSwitcher } from '@/components/kitchen-switcher';
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
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useActiveUrl } from '@/hooks/use-active-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { index as kitchensIndex } from '@/actions/App/Http/Controllers/KitchenController';
import { type BreadcrumbItem, type Kitchen, type NavItem, type SharedData } from '@/types';

import AppLogoIcon from './app-logo-icon';

const activeItemStyles = 'text-neutral-900';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    kitchen?: Kitchen;
}

export function AppHeader({ breadcrumbs = [], kitchen }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { urlIsActive } = useActiveUrl();

    // Build navigation items based on whether we're in a kitchen context
    const navItems: NavItem[] = kitchen
        ? [
              {
                  title: 'Rezepte',
                  href: `/kitchens/${kitchen.id}`,
                  icon: ChefHat,
              },
              {
                  title: 'Mitglieder',
                  href: `/kitchens/${kitchen.id}/edit`,
                  icon: Users,
              },
              ...(kitchen.owner_id === auth.user?.id
                  ? [
                        {
                            title: 'Einstellungen',
                            href: `/kitchens/${kitchen.id}/edit`,
                            icon: Settings,
                        },
                    ]
                  : []),
          ]
        : [];

    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center gap-4 px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    {kitchen && (
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-[34px] w-[34px]"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                                >
                                    <SheetTitle className="sr-only">
                                        Navigationsmenü
                                    </SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-black" />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {navItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="flex items-center space-x-2 font-medium"
                                                    >
                                                        {item.icon && (
                                                            <Icon
                                                                iconNode={
                                                                    item.icon
                                                                }
                                                                className="h-5 w-5"
                                                            />
                                                        )}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}

                    {/* Logo */}
                    <Link
                        href={kitchensIndex().url}
                        prefetch
                        className="flex items-center gap-2"
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                        <span className="hidden font-semibold sm:inline-block">
                            Küche
                        </span>
                    </Link>

                    {/* Kitchen Switcher */}
                    <KitchenSwitcher currentKitchen={kitchen} />

                    {/* Desktop Navigation */}
                    {kitchen && (
                        <div className="hidden h-full items-center lg:flex">
                            <NavigationMenu className="flex h-full items-stretch">
                                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                    {navItems.map((item, index) => (
                                        <NavigationMenuItem
                                            key={index}
                                            className="relative flex h-full items-center"
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    urlIsActive(item.href) &&
                                                        activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && (
                                                    <Icon
                                                        iconNode={item.icon}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                )}
                                                {item.title}
                                            </Link>
                                            {urlIsActive(item.href) && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="size-10 rounded-full p-1"
                            >
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={auth.user?.avatar}
                                        alt={auth.user?.name}
                                    />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
                                        {getInitials(auth.user?.name ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            {auth.user && <UserMenuContent user={auth.user} />}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
