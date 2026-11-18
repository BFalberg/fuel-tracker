import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import RefuelForm, {
    type MileageBounds,
    type RefueledAtBounds,
} from '@/components/refuel-form';
import AppLayout from '@/layouts/app-layout';
import { edit as editRefuel, index as refuelsIndex } from '@/routes/refuels';

interface Refuel {
    id: number;
    car_id: number;
    gas_station_id?: number | null;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    refueled_at: string;
    charge_type?: 'home' | 'ac' | 'dc' | null;
}

interface RefuelEditProps {
    refuel: Refuel;
    cars: Array<{ id: number; name: string; is_electric?: boolean }>;
    gasStations: Array<{ id: number; name: string }>;
    mileageBounds: MileageBounds;
    refueledAtBounds: RefueledAtBounds;
}

export default function RefuelEdit({
    refuel,
    cars,
    gasStations,
    mileageBounds,
    refueledAtBounds,
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
                refueledAtBounds={refueledAtBounds}
                formType="edit"
            />
        </AppLayout>
    );
}
