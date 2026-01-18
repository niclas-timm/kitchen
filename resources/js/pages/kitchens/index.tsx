import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/actions/App/Http/Controllers/KitchenController';
import { type BreadcrumbItem, type Kitchen } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Küchen',
        href: '/kitchens',
    },
];

export default function KitchensIndex({ kitchens }: { kitchens: Kitchen[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Küchen" />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Meine Küchen</h1>
                <Link href={create().url}>
                    <Button>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Küche erstellen
                    </Button>
                </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kitchens.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground">
                                Sie haben noch keine Küchen erstellt oder sind keiner beigetreten.
                            </p>
                            <Link href={create().url} className="mt-4">
                                <Button>Erstellen Sie Ihre erste Küche</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    kitchens.map((kitchen) => (
                        <Link key={kitchen.id} href={`/kitchens/${kitchen.id}`}>
                            <Card className="transition-colors hover:border-primary">
                                <CardHeader>
                                    <CardTitle>{kitchen.name}</CardTitle>
                                    <CardDescription>
                                        Besitzer: {kitchen.owner.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span>{kitchen.members_count} Mitglieder</span>
                                        <span>{kitchen.recipes_count} Rezepte</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
