<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKitchenRequest;
use App\Http\Requests\UpdateKitchenRequest;
use App\Models\Kitchen;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KitchenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $kitchens = $request->user()
            ->kitchens()
            ->with('owner')
            ->withCount('members', 'recipes')
            ->latest()
            ->get();

        return Inertia::render('kitchens/index', [
            'kitchens' => $kitchens,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('kitchens/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKitchenRequest $request): RedirectResponse
    {
        $kitchen = Kitchen::create([
            'name' => $request->validated('name'),
            'owner_id' => $request->user()->id,
        ]);

        $kitchen->members()->attach($request->user()->id);

        return to_route('kitchens.show', $kitchen);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Kitchen $kitchen): Response
    {
        $this->authorize('view', $kitchen);

        $search = $request->query('search');

        $kitchen->load([
            'owner',
            'members',
            'recipes' => function ($query) use ($search) {
                $query->with('creator')->latest();
                if ($search) {
                    $query->where('title', 'like', '%'.$search.'%');
                }
            },
        ]);

        return Inertia::render('kitchens/show', [
            'kitchen' => $kitchen,
            'isOwner' => $kitchen->isOwner($request->user()),
            'search' => $search ?? '',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kitchen $kitchen): Response
    {
        $this->authorize('update', $kitchen);

        $pendingInvitations = $kitchen->invitations()
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->latest()
            ->get();

        return Inertia::render('kitchens/edit', [
            'kitchen' => $kitchen,
            'pendingInvitations' => $pendingInvitations,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKitchenRequest $request, Kitchen $kitchen): RedirectResponse
    {
        $this->authorize('update', $kitchen);

        $kitchen->update($request->validated());

        return to_route('kitchens.show', $kitchen);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Kitchen $kitchen): RedirectResponse
    {
        $this->authorize('delete', $kitchen);

        $kitchen->delete();

        return to_route('kitchens.index');
    }
}
