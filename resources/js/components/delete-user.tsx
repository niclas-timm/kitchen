import { Form } from '@inertiajs/react';
import { useRef } from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Konto löschen"
                description="Löschen Sie Ihr Konto und alle dazugehörigen Daten"
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4">
                <div className="relative space-y-0.5 text-red-600">
                    <p className="font-medium">Warnung</p>
                    <p className="text-sm">
                        Bitte gehen Sie vorsichtig vor, dies kann nicht rückgängig gemacht werden.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Konto löschen
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Sind Sie sicher, dass Sie Ihr Konto löschen möchten?
                        </DialogTitle>
                        <DialogDescription>
                            Sobald Ihr Konto gelöscht ist, werden alle Daten
                            dauerhaft gelöscht. Bitte geben Sie Ihr Passwort ein,
                            um zu bestätigen, dass Sie Ihr Konto dauerhaft
                            löschen möchten.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Passwort
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Passwort"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Abbrechen
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Konto löschen
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
