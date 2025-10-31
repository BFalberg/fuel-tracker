import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CarCard from './CarCard';
import DeleteConfirmation from './DeleteConfirmation';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cars',
        href: '/cars',
    },
];

interface Car {
    id: number;
    name: string;
    registration_number: string;
}

interface Props {
    cars: Car[];
}

export default function Cars({ cars }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    const handleEdit = (car: Car) => {
        setSelectedCar(car);
    };

    const handleDelete = (car: Car) => {
        setSelectedCar(car);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCar) {
            router.delete(`/cars/${selectedCar.id}`);
            setIsDeleteOpen(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cars" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cars.map((car) => (
                        <CarCard key={car.id} car={car} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>

                {selectedCar && (
                    <DeleteConfirmation
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onConfirm={confirmDelete}
                        title={`Delete ${selectedCar.name}`}
                        description={`Are you sure you want to delete ${selectedCar.name}? This action cannot be undone.`}
                    />
                )}
            </div>
        </AppLayout>
    );
}
