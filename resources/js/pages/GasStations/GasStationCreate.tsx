import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import GasStationForm from './GasStationForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Gas Station',
        href: '/gas-stations/create',
    },
];

export default function GasStationCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={breadcrumbs[0].title} />
            <GasStationForm formType="create" />
        </AppLayout>
    );
}
