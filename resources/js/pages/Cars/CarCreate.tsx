import Heading from '@/components/heading';
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
            <Heading level={1} title={breadcrumbs[0].title} />
            <CarForm formType="create" />
        </AppLayout>
    );
}
