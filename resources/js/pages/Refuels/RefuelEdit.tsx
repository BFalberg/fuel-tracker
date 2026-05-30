import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import RefuelForm from './RefuelForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Refuel',
        href: '/refuels/edit',
    },
];

export default function RefuelEdit({ refuel, cars, gasStations }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={breadcrumbs[0].title} />
            <RefuelForm refuel={refuel} cars={cars} gasStations={gasStations} formType="edit" />
        </AppLayout>
    );
}
