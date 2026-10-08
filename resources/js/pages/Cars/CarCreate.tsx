import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { create as createCar } from '@/routes/cars';
import { type BreadcrumbItem } from '@/types';
import CarForm from './CarForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Car',
        href: createCar.url(),
    },
];

export default function CarCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <Heading level={1} title={breadcrumbs[0].title} />
            <CarForm formType="create" />
        </AppLayout>
    );
}
