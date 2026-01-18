<?php

use App\Models\Kitchen;
use App\Models\Recipe;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->kitchen = Kitchen::create([
        'name' => 'Test Kitchen',
        'owner_id' => $this->user->id,
    ]);
    $this->kitchen->members()->attach($this->user->id);
});

test('kitchen show page displays search input', function () {
    $this->actingAs($this->user)
        ->get(route('kitchens.show', $this->kitchen))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kitchens/show')
            ->has('search')
        );
});

test('searching recipes filters by title', function () {
    Recipe::create([
        'kitchen_id' => $this->kitchen->id,
        'created_by' => $this->user->id,
        'title' => 'Spaghetti Carbonara',
        'description' => 'A classic Italian pasta dish.',
    ]);
    Recipe::create([
        'kitchen_id' => $this->kitchen->id,
        'created_by' => $this->user->id,
        'title' => 'Pizza Margherita',
        'description' => 'Classic pizza.',
    ]);

    $this->actingAs($this->user)
        ->get(route('kitchens.show', ['kitchen' => $this->kitchen, 'search' => 'Spaghetti']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kitchens/show')
            ->where('search', 'Spaghetti')
            ->has('kitchen.recipes', 1)
            ->where('kitchen.recipes.0.title', 'Spaghetti Carbonara')
        );
});

test('empty search returns all recipes', function () {
    Recipe::create([
        'kitchen_id' => $this->kitchen->id,
        'created_by' => $this->user->id,
        'title' => 'Spaghetti Carbonara',
        'description' => 'A classic Italian pasta dish.',
    ]);
    Recipe::create([
        'kitchen_id' => $this->kitchen->id,
        'created_by' => $this->user->id,
        'title' => 'Pizza Margherita',
        'description' => 'Classic pizza.',
    ]);

    $this->actingAs($this->user)
        ->get(route('kitchens.show', $this->kitchen))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kitchens/show')
            ->where('search', '')
            ->has('kitchen.recipes', 2)
        );
});

test('search with no results returns empty recipes', function () {
    Recipe::create([
        'kitchen_id' => $this->kitchen->id,
        'created_by' => $this->user->id,
        'title' => 'Spaghetti Carbonara',
        'description' => 'A classic Italian pasta dish.',
    ]);

    $this->actingAs($this->user)
        ->get(route('kitchens.show', ['kitchen' => $this->kitchen, 'search' => 'Nonexistent']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kitchens/show')
            ->where('search', 'Nonexistent')
            ->has('kitchen.recipes', 0)
        );
});

test('search is case insensitive', function () {
    Recipe::create([
        'kitchen_id' => $this->kitchen->id,
        'created_by' => $this->user->id,
        'title' => 'Spaghetti Carbonara',
        'description' => 'A classic Italian pasta dish.',
    ]);

    $this->actingAs($this->user)
        ->get(route('kitchens.show', ['kitchen' => $this->kitchen, 'search' => 'spaghetti']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('kitchen.recipes', 1)
        );
});
