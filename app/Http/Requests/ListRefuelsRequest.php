<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class ListRefuelsRequest extends FormRequest
{
    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'car_id' => ['nullable', 'integer'],
        ];
    }

    public function selectedCarId(): ?int
    {
        return $this->filled('car_id') ? $this->integer('car_id') : null;
    }
}
