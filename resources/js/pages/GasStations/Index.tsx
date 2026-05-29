import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Deferred, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DeleteConfirmation from './DeleteConfirmation';
import GasStationCard from './GasStationCard';
import { Skeleton } from '@/components/ui/skeleton';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gas Stations',
        href: '/gas-stations',
    },
];

interface GasStation {
    id: number;
    name: string;
    address: string;
}

interface Props {
    gasStations?: GasStation[];
}

export default function GasStations({ gasStations }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);

    const handleDelete = (station: GasStation) => {
        setSelectedStation(station);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedStation) {
            router.delete(`/gas-stations/${selectedStation.id}`);
            setIsDeleteOpen(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gas Stations" />
            <Heading level={1} title={breadcrumbs[0].title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <Deferred
                    data="gasStations"
                    fallback={
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="rounded-xl border p-4">
                                    <div className="space-y-3">
                                        <Skeleton className="h-5 w-36" />
                                        <Skeleton className="h-4 w-48" />
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
                        {(gasStations ?? []).map((station) => (
                            <GasStationCard key={station.id} gasStation={station} onDelete={handleDelete} />
                        ))}
                    </div>
                </Deferred>

                {selectedStation && (
                    <DeleteConfirmation
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onConfirm={confirmDelete}
                        title={`Delete ${selectedStation.name}`}
                        description={`Are you sure you want to delete ${selectedStation.name}? This action cannot be undone.`}
                    />
                )}
            </div>
        </AppLayout>
    );
}
