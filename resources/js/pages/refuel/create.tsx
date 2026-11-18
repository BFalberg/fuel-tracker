import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import RefuelForm, {
    type RefuelFormCar,
    type RefuelFormStation,
} from '@/components/refuel-form';
import AppLayout from '@/layouts/app-layout';
import { create as createRefuel } from '@/routes/refuels';

interface RefuelCreateProps {
    cars: RefuelFormCar[];
    gasStations: RefuelFormStation[];
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
