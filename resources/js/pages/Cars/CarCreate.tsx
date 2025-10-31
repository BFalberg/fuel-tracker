import AppLayout from '@/layouts/app-layout';
import CarForm from './CarForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Car',
        href: '/cars/create',
    },
];

export default function CarCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <CarForm formType="create" />
        </AppLayout>
    );
}
