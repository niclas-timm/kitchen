<?php

use App\Http\Controllers\KitchenController;
use App\Http\Controllers\KitchenInvitationController;
use App\Http\Controllers\RecipeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('kitchens', KitchenController::class);

    Route::post('kitchens/{kitchen}/invitations', [KitchenInvitationController::class, 'store'])
        ->name('kitchen-invitations.store');
    Route::delete('kitchens/{kitchen}/invitations/{invitation}', [KitchenInvitationController::class, 'destroy'])
        ->name('kitchen-invitations.destroy');

    Route::resource('kitchens.recipes', RecipeController::class)
        ->except(['index']);
});

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{token}/accept', [KitchenInvitationController::class, 'accept'])
        ->name('kitchen-invitations.accept');
});

require __DIR__.'/settings.php';
