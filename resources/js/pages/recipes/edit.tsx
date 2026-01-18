import { Head, useForm } from '@inertiajs/react';
import { ImageIcon, PlusIcon, Trash2Icon, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

import RecipeController from '@/actions/App/Http/Controllers/RecipeController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Kitchen, type Recipe } from '@/types';

function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

interface IngredientInput {
    id: string;
    amount: string;
    title: string;
    description: string;
}

export default function RecipeEdit({
    kitchen,
    recipe,
}: {
    kitchen: Kitchen;
    recipe: Recipe;
}) {
    const initialIngredients = recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients.map((ing) => ({
              id: ing.id.toString(),
              amount: ing.amount,
              title: ing.title,
              description: ing.description || '',
          }))
        : [{ id: generateId(), amount: '', title: '', description: '' }];

    const [ingredients, setIngredients] = useState<IngredientInput[]>(initialIngredients);
    const [imagePreview, setImagePreview] = useState<string | null>(recipe.image_url);

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        title: string;
        description: string;
        image: File | null;
        remove_image: boolean;
        ingredients: { amount: string; title: string; description: string }[];
    }>({
        _method: 'patch',
        title: recipe.title,
        description: recipe.description,
        image: null,
        remove_image: false,
        ingredients: initialIngredients.map(({ amount, title, description }) => ({
            amount,
            title,
            description,
        })),
    });

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
        {
            title: 'Bearbeiten',
            href: `/kitchens/${kitchen.id}/recipes/${recipe.id}/edit`,
        },
    ];

    const addIngredient = () => {
        const newIngredient = { id: generateId(), amount: '', title: '', description: '' };
        setIngredients([...ingredients, newIngredient]);
        setData('ingredients', [...data.ingredients, { amount: '', title: '', description: '' }]);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
        setData('ingredients', data.ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index: number, field: keyof IngredientInput, value: string) => {
        if (field === 'id') return;
        const newIngredients = [...data.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setData('ingredients', newIngredients);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setData('remove_image', false);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setData('image', null);
        setData('remove_image', true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(RecipeController.update.url({ kitchen: kitchen.id, recipe: recipe.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} kitchen={kitchen}>
            <Head title={`${recipe.title} bearbeiten`} />

            <div className="max-w-3xl">
                <h1 className="text-3xl font-bold">Rezept bearbeiten</h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rezept-Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Titel</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="Rezeptname"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Anleitung</Label>
                                <RichTextEditor
                                    name="description"
                                    defaultValue={data.description}
                                    onChange={(html) => setData('description', html)}
                                    placeholder="Kochanleitung und Notizen..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Rezeptbild</Label>
                                {imagePreview ? (
                                    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute right-2 top-2 h-8 w-8"
                                            onClick={handleRemoveImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
                                        <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Klicken Sie, um ein Bild hochzuladen
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                                <InputError message={errors.image} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zutaten</CardTitle>
                            <CardDescription>
                                Zutaten für dieses Rezept hinzufügen
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ingredients.map((ingredient, index) => (
                                <div key={ingredient.id}>
                                    {index > 0 && <Separator className="mb-4" />}
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Menge</Label>
                                                <Input
                                                    value={data.ingredients[index]?.amount || ''}
                                                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                                                    placeholder="2 Tassen"
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Name</Label>
                                                <Input
                                                    value={data.ingredients[index]?.title || ''}
                                                    onChange={(e) => updateIngredient(index, 'title', e.target.value)}
                                                    placeholder="Mehl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Notizen (optional)</Label>
                                            <Input
                                                value={data.ingredients[index]?.description || ''}
                                                onChange={(e) => updateIngredient(index, 'description', e.target.value)}
                                                placeholder="Zusätzliche Notizen..."
                                            />
                                        </div>
                                        {ingredients.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeIngredient(index)}
                                            >
                                                <Trash2Icon className="mr-2 h-4 w-4" />
                                                Entfernen
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addIngredient}
                                className="w-full"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Zutat hinzufügen
                            </Button>
                        </CardContent>
                    </Card>

                    <Button disabled={processing}>Änderungen speichern</Button>
                </form>
            </div>
        </AppLayout>
    );
}
