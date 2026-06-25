import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import RefuelForm from './RefuelForm';

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
}

const breadcrumbs = [{ title: 'Edit Refuel', href: '/refuels/edit' }];

export default function RefuelEdit({ refuel, cars, gasStations }: RefuelEditProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={breadcrumbs[0].title} />
            <RefuelForm refuel={refuel} cars={cars} gasStations={gasStations} formType="edit" />
        </AppLayout>
    );
}
