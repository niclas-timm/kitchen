import { Form, Head, router } from '@inertiajs/react';

import KitchenController from '@/actions/App/Http/Controllers/KitchenController';
import KitchenInvitationController from '@/actions/App/Http/Controllers/KitchenInvitationController';
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
import { type BreadcrumbItem, type Kitchen, type KitchenInvitation } from '@/types';

interface Props {
    kitchen: Kitchen;
    pendingInvitations: KitchenInvitation[];
}

export default function KitchenEdit({ kitchen, pendingInvitations }: Props) {
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
            title: 'Bearbeiten',
            href: `/kitchens/${kitchen.id}/edit`,
        },
    ];

    const handleDelete = () => {
        if (
            confirm(
                'Sind Sie sicher, dass Sie diese Küche löschen möchten? Alle Rezepte und Zutaten werden ebenfalls gelöscht.'
            )
        ) {
            router.delete(`/kitchens/${kitchen.id}`);
        }
    };

    const handleDeleteInvitation = (invitationId: number) => {
        router.delete(
            KitchenInvitationController.destroy.url({
                kitchen: kitchen.id,
                invitation: invitationId,
            })
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} kitchen={kitchen}>
            <Head title={`${kitchen.name} bearbeiten`} />

            <div className="max-w-2xl space-y-6">
                <h1 className="text-3xl font-bold">Küche bearbeiten</h1>

                <Form
                    {...KitchenController.update.form({ kitchen: kitchen.id })}
                    data={{ _method: 'patch' }}
                >
                    {({ processing, errors }) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>Küchen-Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Küchenname</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={kitchen.name}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <Button disabled={processing}>Änderungen speichern</Button>
                            </CardContent>
                        </Card>
                    )}
                </Form>

                <Form
                    {...KitchenInvitationController.store.form({
                        kitchen: kitchen.id,
                    })}
                >
                    {({ processing, errors, recentlySuccessful }) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>Mitglieder einladen</CardTitle>
                                <CardDescription>
                                    Senden Sie eine Einladung zur Zusammenarbeit in dieser Küche.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-Mail-Adresse</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="benutzer@example.com"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {recentlySuccessful && (
                                    <p className="text-sm text-green-600">
                                        Einladung erfolgreich gesendet!
                                    </p>
                                )}

                                <Button disabled={processing}>Einladung senden</Button>
                            </CardContent>
                        </Card>
                    )}
                </Form>

                {pendingInvitations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ausstehende Einladungen</CardTitle>
                            <CardDescription>
                                Diese Einladungen wurden noch nicht angenommen.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {pendingInvitations.map((invitation) => (
                                    <li
                                        key={invitation.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">{invitation.email}</p>
                                            <p className="text-muted-foreground text-sm">
                                                Läuft ab am{' '}
                                                {new Date(invitation.expires_at).toLocaleDateString(
                                                    'de-DE'
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteInvitation(invitation.id)}
                                        >
                                            Zurückziehen
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Küche löschen
                        </CardTitle>
                        <CardDescription>
                            Diese Aktion kann nicht rückgängig gemacht werden. Alle Rezepte und Zutaten
                            werden dauerhaft gelöscht.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" onClick={handleDelete}>
                            Küche löschen
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
