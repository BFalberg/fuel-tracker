import AppLayout from '@/layouts/app-layout';
import GasStationForm from './GasStationForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Car',
        href: '/cars/edit',
    },
];

export default function GasStationCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <GasStationForm formType="create" />
        </AppLayout>
    );
}
