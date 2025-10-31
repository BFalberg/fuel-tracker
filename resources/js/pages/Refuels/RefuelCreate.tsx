import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import RefuelForm from './RefuelForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Refuel',
        href: '/refuels/create',
    },
];

export default function RefuelCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={breadcrumbs[0].title} />
            <RefuelForm formType="create" />
        </AppLayout>
    );
}
