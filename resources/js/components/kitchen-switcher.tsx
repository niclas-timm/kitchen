import { Link, usePage } from '@inertiajs/react';
import { Check, ChefHat, ChevronsUpDown, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { create as createKitchen } from '@/actions/App/Http/Controllers/KitchenController';
import { type Kitchen, type SharedData } from '@/types';

interface KitchenSwitcherProps {
    currentKitchen?: Kitchen;
}

export function KitchenSwitcher({ currentKitchen }: KitchenSwitcherProps) {
    const { kitchens } = usePage<SharedData>().props;

    if (kitchens.length === 0 && !currentKitchen) {
        return (
            <Button variant="outline" size="sm" asChild>
                <Link href={createKitchen().url}>
                    <Plus className="mr-2 h-4 w-4" />
                    Küche erstellen
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    role="combobox"
                >
                    <ChefHat className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">
                        {currentKitchen?.name ?? 'Küche auswählen'}
                    </span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
                {kitchens.map((kitchen) => (
                    <DropdownMenuItem key={kitchen.id} asChild>
                        <Link
                            href={`/kitchens/${kitchen.id}`}
                            className="flex w-full cursor-pointer items-center justify-between"
                        >
                            <span className="truncate">{kitchen.name}</span>
                            {currentKitchen?.id === kitchen.id && (
                                <Check className="h-4 w-4" />
                            )}
                        </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href={createKitchen().url}
                        className="flex w-full cursor-pointer items-center"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Küche erstellen
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
