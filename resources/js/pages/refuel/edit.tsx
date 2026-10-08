import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import RefuelForm, { type MileageBounds } from '@/components/refuel-form';
import AppLayout from '@/layouts/app-layout';
import { edit as editRefuel, index as refuelsIndex } from '@/routes/refuels';

interface Refuel {
    id: number;
    car_id: number;
    gas_station_id?: number | null;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    type?: 'fossil' | 'charge';
}

interface RefuelEditProps {
    refuel: Refuel;
    cars: Array<{ id: number; name: string; is_electric?: boolean }>;
    gasStations: Array<{ id: number; name: string }>;
    mileageBounds: MileageBounds;
}

export default function RefuelEdit({
    refuel,
    cars,
    gasStations,
    mileageBounds,
}: RefuelEditProps) {
    const breadcrumbs = [
        { title: 'Refuels', href: refuelsIndex.url() },
        { title: 'Edit Refuel', href: editRefuel.url(refuel.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Refuel" />
            <Heading level={1} title="Edit Refuel" />
            <RefuelForm
                refuel={refuel}
                cars={cars}
                gasStations={gasStations}
                mileageBounds={mileageBounds}
                formType="edit"
            />
        </AppLayout>
    );
}
