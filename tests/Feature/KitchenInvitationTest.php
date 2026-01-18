<?php

use App\Models\Kitchen;
use App\Models\KitchenInvitation;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    $this->user = User::factory()->create();
    $this->kitchen = Kitchen::create([
        'name' => 'Test Kitchen',
        'owner_id' => $this->user->id,
    ]);
    $this->kitchen->members()->attach($this->user->id);
});

test('owner can send invitation to new email', function () {
    $this->actingAs($this->user)
        ->post(route('kitchen-invitations.store', $this->kitchen), [
            'email' => 'invitee@example.com',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('kitchen_invitations', [
        'kitchen_id' => $this->kitchen->id,
        'email' => 'invitee@example.com',
    ]);
});

test('resending invitation replaces existing pending invitation', function () {
    $oldInvitation = KitchenInvitation::create([
        'kitchen_id' => $this->kitchen->id,
        'email' => 'invitee@example.com',
        'token' => KitchenInvitation::generateToken(),
        'expires_at' => now()->addDays(7),
    ]);

    $this->actingAs($this->user)
        ->post(route('kitchen-invitations.store', $this->kitchen), [
            'email' => 'invitee@example.com',
        ])
        ->assertRedirect();

    $this->assertDatabaseMissing('kitchen_invitations', [
        'id' => $oldInvitation->id,
    ]);

    $this->assertDatabaseCount('kitchen_invitations', 1);
    $this->assertDatabaseHas('kitchen_invitations', [
        'kitchen_id' => $this->kitchen->id,
        'email' => 'invitee@example.com',
    ]);
});

test('cannot invite existing member', function () {
    $member = User::factory()->create(['email' => 'member@example.com']);
    $this->kitchen->members()->attach($member->id);

    $this->actingAs($this->user)
        ->post(route('kitchen-invitations.store', $this->kitchen), [
            'email' => 'member@example.com',
        ])
        ->assertSessionHasErrors('email');

    $this->assertDatabaseMissing('kitchen_invitations', [
        'kitchen_id' => $this->kitchen->id,
        'email' => 'member@example.com',
    ]);
});

test('edit page shows pending invitations', function () {
    $pendingInvitation = KitchenInvitation::create([
        'kitchen_id' => $this->kitchen->id,
        'email' => 'pending@example.com',
        'token' => KitchenInvitation::generateToken(),
        'expires_at' => now()->addDays(7),
    ]);

    $this->actingAs($this->user)
        ->get(route('kitchens.edit', $this->kitchen))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kitchens/edit')
            ->has('pendingInvitations', 1)
            ->where('pendingInvitations.0.email', 'pending@example.com')
        );
});

test('edit page does not show expired invitations', function () {
    KitchenInvitation::create([
        'kitchen_id' => $this->kitchen->id,
        'email' => 'expired@example.com',
        'token' => KitchenInvitation::generateToken(),
        'expires_at' => now()->subDay(),
    ]);

    $this->actingAs($this->user)
        ->get(route('kitchens.edit', $this->kitchen))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kitchens/edit')
            ->has('pendingInvitations', 0)
        );
});

test('edit page does not show accepted invitations', function () {
    KitchenInvitation::create([
        'kitchen_id' => $this->kitchen->id,
        'email' => 'accepted@example.com',
        'token' => KitchenInvitation::generateToken(),
        'expires_at' => now()->addDays(7),
        'accepted_at' => now(),
    ]);

    $this->actingAs($this->user)
        ->get(route('kitchens.edit', $this->kitchen))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kitchens/edit')
            ->has('pendingInvitations', 0)
        );
});

test('owner can delete pending invitation', function () {
    $invitation = KitchenInvitation::create([
        'kitchen_id' => $this->kitchen->id,
        'email' => 'pending@example.com',
        'token' => KitchenInvitation::generateToken(),
        'expires_at' => now()->addDays(7),
    ]);

    $this->actingAs($this->user)
        ->delete(route('kitchen-invitations.destroy', [$this->kitchen, $invitation]))
        ->assertRedirect();

    $this->assertDatabaseMissing('kitchen_invitations', [
        'id' => $invitation->id,
    ]);
});

test('non-owner cannot delete invitation', function () {
    $nonOwner = User::factory()->create();
    $this->kitchen->members()->attach($nonOwner->id);

    $invitation = KitchenInvitation::create([
        'kitchen_id' => $this->kitchen->id,
        'email' => 'pending@example.com',
        'token' => KitchenInvitation::generateToken(),
        'expires_at' => now()->addDays(7),
    ]);

    $this->actingAs($nonOwner)
        ->delete(route('kitchen-invitations.destroy', [$this->kitchen, $invitation]))
        ->assertForbidden();

    $this->assertDatabaseHas('kitchen_invitations', [
        'id' => $invitation->id,
    ]);
});
