import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmation from './DeleteConfirmation';
import RefuelCard from './RefuelCard';
import RefuelForm from './RefuelForm';

interface Refuel {
    id: number;
    car_id: number;
    gas_station_id: number;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    car: {
        name: string;
    };
    gasStation: {
        name: string;
    };
}

interface Props {
    refuels: {
        data: Refuel[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    cars: Array<{ id: number; name: string }>;
    gasStations: Array<{ id: number; name: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Refuels',
        href: '/refuels',
    },
];

export default function Refuels({ refuels, cars, gasStations }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRefuel, setSelectedRefuel] = useState<Refuel | null>(null);

    const handleEdit = (refuel: Refuel) => {
        setSelectedRefuel(refuel);
        setIsFormOpen(true);
    };

    const handleDelete = (refuel: Refuel) => {
        setSelectedRefuel(refuel);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedRefuel) {
            router.delete(`/refuels/${selectedRefuel.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedRefuel(null);
                },
            });
        }
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/refuels',
            { page },
            {
                preserveState: true,
                preserveScroll: false, // Change this to false
                onSuccess: () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Refuels" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Refuels</h1>
                    <Button
                        onClick={() => {
                            setSelectedRefuel(null);
                            setIsFormOpen(true);
                        }}
                    >
                        Create Refuel
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {refuels.data.map((refuel) => (
                        <RefuelCard key={refuel.id} refuel={refuel} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>

                {refuels.last_page > 1 && (
                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-gray-700">
                            Showing page {refuels.current_page} of {refuels.last_page}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(refuels.current_page - 1)}
                                disabled={refuels.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(refuels.current_page + 1)}
                                disabled={refuels.current_page === refuels.last_page}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <RefuelForm
                    refuel={selectedRefuel ?? undefined}
                    cars={cars}
                    gasStations={gasStations}
                    open={isFormOpen}
                    onOpenChange={(open) => {
                        setIsFormOpen(open);
                        if (!open) setSelectedRefuel(null);
                    }}
                />

                {selectedRefuel && (
                    <DeleteConfirmation
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onConfirm={confirmDelete}
                        title={`Delete Refuel`}
                        description={`Are you sure you want to delete this refuel record? This action cannot be undone.`}
                    />
                )}
            </div>
        </AppLayout>
    );
}
