<?php

namespace App\Enums;

/**
 * The stored values are the Danish labels shown in the UI. They are the values
 * already persisted in the database, so the cases are named in English while the
 * backing strings stay exactly as they were.
 */
enum ExpenseType: string
{
    case Workshop = 'Værksted';
    case Insurance = 'Forsikring';
    case Tax = 'Afgift';
    case AddOn = 'Tilkøb';
    case Subscription = 'Abonnement';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
