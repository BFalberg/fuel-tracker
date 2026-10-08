<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;

final class ShowDashboardRequest extends FormRequest
{
    /**
     * The widest chart period we will render. Without a bound, a crafted
     * `?from=` drives an unbounded month-by-month loop.
     */
    private const int MAX_CHART_MONTHS = 60;

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'car' => ['nullable', 'integer'],
            'from' => ['nullable', 'date_format:Y-m'],
            'to' => ['nullable', 'date_format:Y-m'],
        ];
    }

    /**
     * The chart period from the `from` and `to` months. It defaults to the last
     * six months and never spans more than MAX_CHART_MONTHS.
     *
     * @return array{CarbonImmutable, CarbonImmutable}
     */
    public function chartPeriod(): array
    {
        /** The leading `!` resets the day to the 1st; without it Carbon fills in today's day-of-month and can roll into the next month. */
        $requestedFrom = $this->filled('from') ? CarbonImmutable::createFromFormat('!Y-m', $this->string('from')->value()) : null;
        $requestedTo = $this->filled('to') ? CarbonImmutable::createFromFormat('!Y-m', $this->string('to')->value()) : null;

        $chartStart = $requestedFrom?->startOfMonth() ?? CarbonImmutable::now()->subMonths(5)->startOfMonth();
        $chartEnd = $requestedTo?->endOfMonth() ?? CarbonImmutable::now()->endOfMonth();

        if ($chartStart->gt($chartEnd)) {
            $chartEnd = $chartStart->endOfMonth();
        }

        /** startOfMonth before subMonths: subtracting from a 31st rolls into the next month for shorter months. */
        $earliestAllowedStart = $chartEnd->startOfMonth()->subMonths(self::MAX_CHART_MONTHS - 1);

        if ($chartStart->lt($earliestAllowedStart)) {
            $chartStart = $earliestAllowedStart;
        }

        return [$chartStart, $chartEnd];
    }
}
