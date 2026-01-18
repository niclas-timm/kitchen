import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function InvitationExpired() {
    return (
        <AppLayout>
            <Head title="Invitation Expired" />

            <div className="flex min-h-[60vh] items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Invitation Expired</CardTitle>
                        <CardDescription>
                            This invitation link has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Kitchen invitations are valid for 7 days. Please contact
                            the kitchen owner to request a new invitation.
                        </p>
                        <Link href="/kitchens">
                            <Button>View My Kitchens</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
