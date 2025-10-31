import Heading from '@/components/heading';
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
            <Heading level={1} title={breadcrumbs[0].title} />
            <GasStationForm formType="edit" gasStation={gasStation} />
        </AppLayout>
    );
}
