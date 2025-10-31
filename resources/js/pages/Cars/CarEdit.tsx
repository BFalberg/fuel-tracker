import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import CarForm from './CarForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Car',
        href: '/cars/edit',
    },
];

export default function CarEdit({ car }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={breadcrumbs[0].title} />
            <CarForm formType="edit" car={car} />
        </AppLayout>
    );
}
