import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Deferred, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CarCard from './CarCard';
import DeleteConfirmation from './DeleteConfirmation';
import { Skeleton } from '@/components/ui/skeleton';

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
    is_electric?: boolean;
    user?: {
        id: number;
        name: string;
    };
}

interface Props {
    cars?: Car[];
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
            <Heading level={1} title={breadcrumbs[0].title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <Deferred
                    data="cars"
                    fallback={
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="rounded-xl border p-4">
                                    <div className="space-y-3">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                        <div className="flex gap-2 pt-2">
                                            <Skeleton className="h-8 w-20" />
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {(cars ?? []).map((car) => (
                            <CarCard key={car.id} car={car} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                </Deferred>

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
