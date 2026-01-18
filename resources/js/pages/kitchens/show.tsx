import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/recipe-card';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Kitchen } from '@/types';

export default function KitchenShow({
    kitchen,
    isOwner,
    search,
}: {
    kitchen: Kitchen;
    isOwner: boolean;
    search: string;
}) {
    const [searchValue, setSearchValue] = useState(search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchValue !== search) {
                router.get(
                    `/kitchens/${kitchen.id}`,
                    { search: searchValue || undefined },
                    { preserveState: true, preserveScroll: true },
                );
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchValue, search, kitchen.id]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Küchen',
            href: '/kitchens',
        },
        {
            title: kitchen.name,
            href: `/kitchens/${kitchen.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} kitchen={kitchen}>
            <Head title={kitchen.name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Rezepte</h1>
                        <p className="text-muted-foreground">
                            {kitchen.recipes?.length || 0} Rezepte in {kitchen.name}
                        </p>
                    </div>
                    <Link href={`/kitchens/${kitchen.id}/recipes/create`}>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Rezept hinzufügen
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <div className="relative">
                    <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Rezepte durchsuchen..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={() => setSearchValue('')}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Recipes Grid */}
                {kitchen.recipes?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground">
                                {search
                                    ? `Keine Rezepte gefunden für "${search}"`
                                    : 'Noch keine Rezepte. Erstellen Sie eines!'}
                            </p>
                            {!search && (
                                <Link
                                    href={`/kitchens/${kitchen.id}/recipes/create`}
                                    className="mt-4"
                                >
                                    <Button>
                                        Erstellen Sie Ihr erstes Rezept
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                        {kitchen.recipes?.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                kitchen={kitchen}
                                canEdit={true}
                            />
                        ))}
                    </div>
                )}

                {/* Members Section (collapsed) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Mitglieder</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {kitchen.members?.map((member) => (
                                <span
                                    key={member.id}
                                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                                >
                                    {member.name}
                                    {member.id === kitchen.owner_id && (
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (Besitzer)
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
