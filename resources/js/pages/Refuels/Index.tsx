import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmation from './DeleteConfirmation';
import RefuelCard from './RefuelCard';

interface Refuel {
    id: number;
    car_id: number;
    gas_station_id?: number | null;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    type?: 'fossil' | 'charge';
    car: {
        name: string;
        is_electric?: boolean;
    };
    gasStation?: {
        name: string;
    } | null;
}

interface Props {
    refuels?: {
        data: Refuel[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    cars?: Array<{ id: number; name: string; is_electric?: boolean }>;
    selectedCarId?: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Refuels',
        href: '/refuels',
    },
];

export default function Refuels({ refuels, cars, selectedCarId }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRefuel, setSelectedRefuel] = useState<Refuel | null>(null);

    const handleCarFilterChange = (value: string) => {
        router.get(
            '/refuels',
            { car_id: value || undefined },
            {
                preserveState: true,
                preserveScroll: false,
                onSuccess: () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
            },
        );
    };

    const handleEdit = (refuel: Refuel) => {
        setSelectedRefuel(refuel);
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
            { page, car_id: selectedCarId || undefined },
            {
                preserveState: true,
                preserveScroll: false,
                onSuccess: () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Refuels" />
            <Heading level={1} title={breadcrumbs[0].title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <Deferred
                    data={['refuels', 'cars']}
                    fallback={
                        <>
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div className="text-muted-foreground text-sm">Filter by car</div>
                                <div className="w-full md:w-64">
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="rounded-xl border p-4">
                                        <div className="space-y-3">
                                            <Skeleton className="h-5 w-28" />
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-16" />
                                            <div className="flex gap-2 pt-2">
                                                <Skeleton className="h-8 w-20" />
                                                <Skeleton className="h-8 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="text-muted-foreground text-sm">Filter by car</div>
                        <div className="w-full md:w-64">
                            <NativeSelect value={selectedCarId ?? ''} onChange={(e) => handleCarFilterChange(e.target.value)}>
                                <NativeSelectOption value="">All cars</NativeSelectOption>
                                {(cars ?? []).map((car) => (
                                    <NativeSelectOption key={car.id} value={car.id.toString()}>
                                        {car.name}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {(refuels?.data ?? []).map((refuel) => (
                            <RefuelCard key={refuel.id} refuel={refuel} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>

                    {(refuels?.last_page ?? 0) > 1 && (
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="text-muted-foreground text-sm">
                                Showing page {refuels?.current_page} of {refuels?.last_page}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange((refuels?.current_page ?? 1) - 1)}
                                    disabled={refuels?.current_page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange((refuels?.current_page ?? 1) + 1)}
                                    disabled={refuels?.current_page === refuels?.last_page}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Deferred>

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
