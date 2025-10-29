import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Car',
        href: '/cars/edit',
    },
];

export default function CarCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <h1>Edit car</h1>
        </AppLayout>
    );
}
