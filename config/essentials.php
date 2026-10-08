<?php

declare(strict_types=1);

use NunoMaduro\Essentials\Configurables\ProhibitDestructiveCommands;
use NunoMaduro\Essentials\Configurables\Unguard;

return [
    Unguard::class => true,

    /**
     * Local development points at the production database, so AppServiceProvider
     * prohibits the destructive commands in every environment except testing.
     */
    ProhibitDestructiveCommands::class => false,
];
