import { Head } from '@inertiajs/react';
import GasStationForm from '@/components/gas-station-form';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { create as createGasStation } from '@/routes/gas-stations';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Gas Station',
        href: createGasStation.url(),
    },
];

export default function GasStationCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <Heading level={1} title={breadcrumbs[0].title} />
            <GasStationForm formType="create" />
        </AppLayout>
    );
}
