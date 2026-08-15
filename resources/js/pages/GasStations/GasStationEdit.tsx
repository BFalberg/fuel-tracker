import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import GasStationForm from './GasStationForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Gas Station',
        href: '/gas-stations/edit',
    },
];

interface Props {
    gasStation: {
        id: number;
        name: string;
        address: string;
    };
}

export default function GasStationEdit({ gasStation }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={breadcrumbs[0].title} />
            <GasStationForm formType="edit" gasStation={gasStation} />
        </AppLayout>
    );
}
