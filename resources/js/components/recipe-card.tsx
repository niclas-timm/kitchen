import { Link, router } from '@inertiajs/react';
import { Edit, MoreVertical, Trash2, UtensilsCrossed } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Kitchen, type Recipe } from '@/types';

interface RecipeCardProps {
    recipe: Recipe;
    kitchen: Kitchen;
    canEdit?: boolean;
}

export function RecipeCard({ recipe, kitchen, canEdit = false }: RecipeCardProps) {
    const handleDelete = () => {
        if (confirm('Sind Sie sicher, dass Sie dieses Rezept löschen möchten?')) {
            router.delete(`/kitchens/${kitchen.id}/recipes/${recipe.id}`);
        }
    };

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-md">
            <Link href={`/kitchens/${kitchen.id}/recipes/${recipe.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {recipe.image_url ? (
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                    )}
                </div>
            </Link>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={`/kitchens/${kitchen.id}/recipes/${recipe.id}`}
                        className="flex-1"
                    >
                        <h3 className="line-clamp-2 font-semibold leading-tight hover:underline">
                            {recipe.title}
                        </h3>
                    </Link>
                    {canEdit && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Aktionen</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/kitchens/${kitchen.id}/recipes/${recipe.id}/edit`}
                                        className="cursor-pointer"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Bearbeiten
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Löschen
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
                <p className="text-sm text-muted-foreground">
                    von {recipe.creator?.name}
                </p>
            </CardContent>
        </Card>
    );
}
