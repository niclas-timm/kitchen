<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
            'ingredients' => ['array'],
            'ingredients.*.amount' => ['required', 'string', 'max:255'],
            'ingredients.*.title' => ['required', 'string', 'max:255'],
            'ingredients.*.description' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom error messages for validation failures.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Bitte geben Sie einen Titel für das Rezept an.',
            'description.required' => 'Bitte geben Sie eine Anleitung für das Rezept an.',
            'image.image' => 'Die Datei muss ein Bild sein.',
            'image.max' => 'Das Bild darf maximal 5MB groß sein.',
            'ingredients.*.amount.required' => 'Bitte geben Sie eine Menge für jede Zutat an.',
            'ingredients.*.title.required' => 'Bitte geben Sie einen Namen für jede Zutat an.',
        ];
    }
}
