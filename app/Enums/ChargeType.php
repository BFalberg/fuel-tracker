<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How an EV charge was delivered. Fossil refuels have no charge type.
 */
enum ChargeType: string
{
    case Home = 'home';
    case Ac = 'ac';
    case Dc = 'dc';
}
