import AppLayout from '@/layouts/app-layout';
import GasStationForm from './GasStationForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Gas Station',
        href: '/gas-stations/edit',
    },
];

export default function GasStationEdit({ gasStation }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <GasStationForm formType="edit" gasStation={gasStation} />
        </AppLayout>
    );
}
