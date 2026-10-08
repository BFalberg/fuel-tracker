import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { edit as editGasStation, index as gasStationsIndex } from '@/routes/gas-stations';
import { type BreadcrumbItem } from '@/types';
import GasStationForm from './GasStationForm';

interface Props {
    gasStation: {
        id: number;
        name: string;
        address: string;
    };
}

export default function GasStationEdit({ gasStation }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Gas Stations', href: gasStationsIndex.url() },
        { title: 'Edit Gas Station', href: editGasStation.url(gasStation.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Gas Station" />
            <Heading level={1} title="Edit Gas Station" />
            <GasStationForm formType="edit" gasStation={gasStation} />
        </AppLayout>
    );
}
