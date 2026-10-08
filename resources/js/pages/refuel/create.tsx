import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import RefuelForm from '@/components/refuel-form';
import AppLayout from '@/layouts/app-layout';
import { create as createRefuel } from '@/routes/refuels';

interface RefuelCreateProps {
    cars: Array<{ id: number; name: string; is_electric?: boolean }>;
    gasStations: Array<{ id: number; name: string }>;
}

const breadcrumbs = [{ title: 'Create Refuel', href: createRefuel.url() }];

export default function RefuelCreate({ cars, gasStations }: RefuelCreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <Heading level={1} title={breadcrumbs[0].title} />
            <RefuelForm
                cars={cars}
                gasStations={gasStations}
                formType="create"
            />
        </AppLayout>
    );
}
