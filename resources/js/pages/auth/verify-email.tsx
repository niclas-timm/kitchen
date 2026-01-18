// Components
import { Form, Head } from '@inertiajs/react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="E-Mail bestätigen"
            description="Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den Link klicken, den wir Ihnen gerade gesendet haben."
        >
            <Head title="E-Mail-Bestätigung" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Ein neuer Bestätigungslink wurde an Ihre E-Mail-Adresse
                    gesendet.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Bestätigungs-E-Mail erneut senden
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Abmelden
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
