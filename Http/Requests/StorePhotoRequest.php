<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy checks in controller
    }

    public function rules(): array
    {
        return [
            'storage_path' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'caption' => 'nullable|string|max:2000',
            'location' => 'nullable|string|max:255',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:50',
        ];
    }
}