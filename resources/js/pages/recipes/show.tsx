import { Head, Link } from '@inertiajs/react';
import { EditIcon, UtensilsCrossed } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Kitchen, type Recipe } from '@/types';

export default function RecipeShow({
    kitchen,
    recipe,
    canEdit,
}: {
    kitchen: Kitchen;
    recipe: Recipe;
    canEdit: boolean;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Küchen',
            href: '/kitchens',
        },
        {
            title: kitchen.name,
            href: `/kitchens/${kitchen.id}`,
        },
        {
            title: recipe.title,
            href: `/kitchens/${kitchen.id}/recipes/${recipe.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} kitchen={kitchen}>
            <Head title={recipe.title} />

            <div className="max-w-4xl space-y-6">
                {/* Hero Image */}
                {recipe.image_url ? (
                    <div className="aspect-video w-full overflow-hidden rounded-xl">
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50">
                        <UtensilsCrossed className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{recipe.title}</h1>
                        <p className="text-muted-foreground">
                            Erstellt von {recipe.creator?.name}
                        </p>
                    </div>
                    {canEdit && (
                        <Link
                            href={`/kitchens/${kitchen.id}/recipes/${recipe.id}/edit`}
                        >
                            <Button variant="outline">
                                <EditIcon className="mr-2 h-4 w-4" />
                                Bearbeiten
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Zutaten</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {recipe.ingredients?.map((ingredient) => (
                                    <li key={ingredient.id}>
                                        <div className="font-medium">
                                            {ingredient.amount} {ingredient.title}
                                        </div>
                                        {ingredient.description && (
                                            <div className="text-sm text-muted-foreground">
                                                {ingredient.description}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Anleitung</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: recipe.description }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
