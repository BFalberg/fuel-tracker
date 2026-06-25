import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import CarForm from './CarForm';

interface Car {
    id: number;
    name: string;
    registration_number: string;
    start_milage?: number;
    purchase_price?: number;
    sale_price?: number;
    is_electric?: boolean;
}

interface CarEditProps {
    car: Car;
}

export default function CarEdit({ car }: CarEditProps) {
    const breadcrumbs = [
        { title: 'Cars', href: '/cars' },
        { title: 'Edit Car', href: `/cars/${car.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title="Edit Car" />
            <CarForm formType="edit" car={car} />
        </AppLayout>
    );
}
