import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CarCard from './CarCard';
import CarForm from './CarForm';
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
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    const handleEdit = (car: Car) => {
        setSelectedCar(car);
        setIsFormOpen(true);
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Cars</h1>
                    <Button
                        onClick={() => {
                            setSelectedCar(null);
                            setIsFormOpen(true);
                        }}
                    >
                        Create Car
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cars.map((car) => (
                        <CarCard key={car.id} car={car} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>

                <CarForm
                    car={selectedCar ?? undefined}
                    open={isFormOpen}
                    onOpenChange={(open) => {
                        setIsFormOpen(open);
                        if (!open) setSelectedCar(null);
                    }}
                />

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
