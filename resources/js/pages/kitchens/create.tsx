import { Form, Head } from '@inertiajs/react';

import KitchenController from '@/actions/App/Http/Controllers/KitchenController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Küchen',
        href: '/kitchens',
    },
    {
        title: 'Erstellen',
        href: '/kitchens/create',
    },
];

export default function KitchenCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Küche erstellen" />

            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold">Küche erstellen</h1>

                <Form {...KitchenController.store.form()} className="mt-6">
                    {({ processing, errors }) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>Küchen-Details</CardTitle>
                                <CardDescription>
                                    Erstellen Sie einen neuen Arbeitsbereich für die Zusammenarbeit.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Küchenname</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Meine Küche"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <Button disabled={processing}>Küche erstellen</Button>
                            </CardContent>
                        </Card>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
