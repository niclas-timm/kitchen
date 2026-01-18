<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Models\Kitchen;
use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Kitchen $kitchen): Response
    {
        $this->authorize('view', $kitchen);

        return Inertia::render('recipes/create', [
            'kitchen' => $kitchen,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeRequest $request, Kitchen $kitchen): RedirectResponse
    {
        $this->authorize('view', $kitchen);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('recipes', 'public');
        }

        $recipe = $kitchen->recipes()->create([
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'image_path' => $imagePath,
            'created_by' => $request->user()->id,
        ]);

        if ($request->has('ingredients')) {
            foreach ($request->validated('ingredients') as $index => $ingredientData) {
                $recipe->ingredients()->create([
                    'amount' => $ingredientData['amount'],
                    'title' => $ingredientData['title'],
                    'description' => $ingredientData['description'] ?? null,
                    'sort_order' => $index,
                ]);
            }
        }

        return to_route('kitchens.show', $kitchen);
    }

    /**
     * Display the specified resource.
     */
    public function show(Kitchen $kitchen, Recipe $recipe): Response
    {
        $this->authorize('view', $recipe);

        if ($recipe->kitchen_id !== $kitchen->id) {
            abort(404);
        }

        $recipe->load(['creator', 'ingredients']);

        return Inertia::render('recipes/show', [
            'kitchen' => $kitchen,
            'recipe' => $recipe,
            'canEdit' => $kitchen->isMember(auth()->user()),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kitchen $kitchen, Recipe $recipe): Response
    {
        $this->authorize('update', $recipe);

        if ($recipe->kitchen_id !== $kitchen->id) {
            abort(404);
        }

        $recipe->load('ingredients');

        return Inertia::render('recipes/edit', [
            'kitchen' => $kitchen,
            'recipe' => $recipe,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecipeRequest $request, Kitchen $kitchen, Recipe $recipe): RedirectResponse
    {
        $this->authorize('update', $recipe);

        if ($recipe->kitchen_id !== $kitchen->id) {
            abort(404);
        }

        $updateData = [
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
        ];

        if ($request->boolean('remove_image') && $recipe->image_path) {
            Storage::disk('public')->delete($recipe->image_path);
            $updateData['image_path'] = null;
        } elseif ($request->hasFile('image')) {
            if ($recipe->image_path) {
                Storage::disk('public')->delete($recipe->image_path);
            }
            $updateData['image_path'] = $request->file('image')->store('recipes', 'public');
        }

        $recipe->update($updateData);

        $recipe->ingredients()->delete();

        if ($request->has('ingredients')) {
            foreach ($request->validated('ingredients') as $index => $ingredientData) {
                $recipe->ingredients()->create([
                    'amount' => $ingredientData['amount'],
                    'title' => $ingredientData['title'],
                    'description' => $ingredientData['description'] ?? null,
                    'sort_order' => $index,
                ]);
            }
        }

        return to_route('kitchens.recipes.show', [$kitchen, $recipe]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kitchen $kitchen, Recipe $recipe): RedirectResponse
    {
        $this->authorize('delete', $recipe);

        if ($recipe->kitchen_id !== $kitchen->id) {
            abort(404);
        }

        if ($recipe->image_path) {
            Storage::disk('public')->delete($recipe->image_path);
        }

        $recipe->delete();

        return to_route('kitchens.show', $kitchen);
    }
}
