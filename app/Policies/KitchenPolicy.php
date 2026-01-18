<?php

namespace App\Policies;

use App\Models\Kitchen;
use App\Models\User;

class KitchenPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Kitchen $kitchen): bool
    {
        return $kitchen->isMember($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Kitchen $kitchen): bool
    {
        return $kitchen->isMember($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Kitchen $kitchen): bool
    {
        return $kitchen->isOwner($user);
    }

    /**
     * Determine whether the user can invite members to the kitchen.
     */
    public function invite(User $user, Kitchen $kitchen): bool
    {
        return $kitchen->isOwner($user);
    }

    /**
     * Determine whether the user can remove members from the kitchen.
     */
    public function removeMember(User $user, Kitchen $kitchen): bool
    {
        return $kitchen->isOwner($user);
    }
}
