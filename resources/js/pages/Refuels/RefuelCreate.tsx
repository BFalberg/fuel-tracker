import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import RefuelForm from './RefuelForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Refuel',
        href: '/refuels/create',
    },
];

export default function RefuelCreate({ cars, gasStations }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={breadcrumbs[0].title} />
            <RefuelForm cars={cars} gasStations={gasStations} formType="create" />
        </AppLayout>
    );
}
