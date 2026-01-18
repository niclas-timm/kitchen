<?php

namespace App\Http\Controllers;

use App\Http\Requests\InviteToKitchenRequest;
use App\Mail\KitchenInvitationMail;
use App\Models\Kitchen;
use App\Models\KitchenInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class KitchenInvitationController extends Controller
{
    /**
     * Store a newly created invitation.
     */
    public function store(InviteToKitchenRequest $request, Kitchen $kitchen): RedirectResponse
    {
        $this->authorize('invite', $kitchen);

        $email = $request->validated('email');

        if ($kitchen->members()->whereEmail($email)->exists()) {
            return back()->withErrors([
                'email' => 'This user is already a member of this kitchen.',
            ]);
        }

        $kitchen->invitations()
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->delete();

        $invitation = KitchenInvitation::create([
            'kitchen_id' => $kitchen->id,
            'email' => $email,
            'token' => KitchenInvitation::generateToken(),
            'expires_at' => now()->addDays(7),
        ]);

        Mail::to($email)->send(new KitchenInvitationMail($invitation, $kitchen));

        return back()->with('status', 'Invitation sent successfully!');
    }

    /**
     * Accept an invitation.
     */
    public function accept(Request $request, string $token): RedirectResponse|Response
    {
        $invitation = KitchenInvitation::with('kitchen')
            ->where('token', $token)
            ->firstOrFail();

        if ($invitation->isExpired()) {
            return Inertia::render('kitchen-invitations/expired');
        }

        if ($invitation->isAccepted()) {
            return to_route('kitchens.show', $invitation->kitchen);
        }

        if (! $request->user()) {
            return redirect()->route('login')
                ->with('intended', route('kitchen-invitations.accept', ['token' => $token]));
        }

        $user = $request->user();

        if ($invitation->kitchen->isMember($user)) {
            return to_route('kitchens.show', $invitation->kitchen);
        }

        $invitation->kitchen->members()->attach($user->id);

        $invitation->update(['accepted_at' => now()]);

        return to_route('kitchens.show', $invitation->kitchen)
            ->with('status', "You've successfully joined {$invitation->kitchen->name}!");
    }

    /**
     * Delete an invitation.
     */
    public function destroy(Kitchen $kitchen, KitchenInvitation $invitation): RedirectResponse
    {
        $this->authorize('invite', $kitchen);

        if ($invitation->kitchen_id !== $kitchen->id) {
            abort(404);
        }

        $invitation->delete();

        return back()->with('status', 'Invitation deleted successfully.');
    }
}
